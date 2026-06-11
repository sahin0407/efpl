import { useState, useEffect, useMemo } from 'react';
import { Match, ClubStats, CLUBS, INITIAL_MATCHES } from './types';
import { ref, onValue, set, get, child, update } from 'firebase/database';
import { database } from './firebase';

export function useTournament() {
  const [matchesMap, setMatchesMap] = useState<Record<string, Match>>({});
  const [nextMatchDate, setNextMatchDate] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [isOffline, setIsOffline] = useState(false);
  const [isSlow, setIsSlow] = useState(false);

  // Initialize and Sync Matches from Firebase
  useEffect(() => {
    const matchesRef = ref(database, 'tournament/matches');
    const settingsRef = ref(database, 'tournament/settings');
    
    let isMounted = true;
    const slowTimer = setTimeout(() => {
      if (isMounted) setIsSlow(true);
    }, 3000);

    const offlineTimer = setTimeout(() => {
      if (isMounted) setIsOffline(true);
    }, 10000);

    const unsubscribeMatches = onValue(matchesRef, (snapshot) => {
      if (!isMounted) return;
      if (snapshot.exists()) {
        setMatchesMap(snapshot.val());
      } else {
        // Initialize if empty
        const initialMatches = INITIAL_MATCHES.reduce((acc: any, m) => {
           acc[m.id] = m;
           return acc;
        }, {});
        set(matchesRef, initialMatches);
        setMatchesMap(initialMatches);
      }
      setLoading(false);
      setIsSlow(false);
      setIsOffline(false);
      clearTimeout(slowTimer);
      clearTimeout(offlineTimer);
    }, (error) => {
      console.error(error);
      if (isMounted) {
        setIsOffline(true);
        setLoading(false);
      }
    });

    const unsubscribeSettings = onValue(settingsRef, (snapshot) => {
      if (snapshot.exists() && snapshot.val().nextMatchDate) {
        setNextMatchDate(snapshot.val().nextMatchDate);
      } else {
        setNextMatchDate(null);
      }
    });

    return () => {
       isMounted = false;
       clearTimeout(slowTimer);
       clearTimeout(offlineTimer);
       unsubscribeMatches();
       unsubscribeSettings();
    };
  }, []);

  const matches = useMemo(() => {
    const stageOrder: Record<string, number> = { group: 1, semi: 2, final: 3 };
    return Object.values(matchesMap).sort((a: Match, b: Match) => {
       if (stageOrder[a.stage] !== stageOrder[b.stage]) return stageOrder[a.stage] - stageOrder[b.stage];
       if (a.stage === 'group' && b.stage === 'group') return (a.matchNumber || 0) - (b.matchNumber || 0);
       return 0;
    });
  }, [matchesMap]);

  const updateMatchDate = (matchId: string, date: string) => {
    update(ref(database, `tournament/matches/${matchId}`), { date });
  };

  const setMatchLive = (matchId: string, isLive: boolean) => {
    const m = matchesMap[matchId];
    if (!m) return;
    update(ref(database, `tournament/matches/${matchId}`), { 
      isLive, 
      scoreA: isLive ? (m.scoreA ?? 0) : m.scoreA, 
      scoreB: isLive ? (m.scoreB ?? 0) : m.scoreB
    });
  };

  const updateLiveScore = (matchId: string, scoreA: number, scoreB: number) => {
    update(ref(database, `tournament/matches/${matchId}`), { scoreA, scoreB });
  };

  const updateMatchResult = (matchId: string, scoreA: number, scoreB: number, penaltyA?: number, penaltyB?: number) => {
    update(ref(database, `tournament/matches/${matchId}`), {
      scoreA,
      scoreB,
      isCompleted: true,
      isLive: false,
      penaltyScoreA: penaltyA ?? null,
      penaltyScoreB: penaltyB ?? null,
      completedAt: new Date().toISOString()
    });
  };

  const resetTournament = () => {
    const initialMatches = INITIAL_MATCHES.reduce((acc: any, m) => {
        acc[m.id] = m;
        return acc;
    }, {});
    set(ref(database, 'tournament/matches'), initialMatches);
    set(ref(database, 'tournament/settings/nextMatchDate'), null);
  };

  const updateNextMatchDate = (date: string | null) => {
    set(ref(database, 'tournament/settings/nextMatchDate'), date);
  };

  const standings = useMemo(() => {
    const stats: Record<string, ClubStats> = {};
    
    // Initialize stats
    CLUBS.forEach(club => {
      stats[club.id] = {
        clubId: club.id,
        played: 0,
        won: 0,
        drawn: 0,
        lost: 0,
        goalsFor: 0,
        goalsAgainst: 0,
        goalDifference: 0,
        points: 0,
        form: [],
        cleanSheets: 0,
        penaltyWins: 0,
        penaltyLosses: 0,
      };
    });

    // Calculate stats
    matches.filter(m => m.isCompleted).forEach(m => {
      const statA = stats[m.teamA];
      const statB = stats[m.teamB];

      statA.played++;
      statB.played++;

      statA.goalsFor += m.scoreA!;
      statA.goalsAgainst += m.scoreB!;
      statA.goalDifference = statA.goalsFor - statA.goalsAgainst;

      statB.goalsFor += m.scoreB!;
      statB.goalsAgainst += m.scoreA!;
      statB.goalDifference = statB.goalsFor - statB.goalsAgainst;

      if (m.scoreB === 0 && m.scoreA !== 0) statA.cleanSheets++;
      if (m.scoreA === 0 && m.scoreB !== 0) statB.cleanSheets++;
      if (m.scoreA === 0 && m.scoreB === 0) {
         statA.cleanSheets++;
         statB.cleanSheets++;
      }

      const hasPenalties = m.penaltyScoreA !== null && m.penaltyScoreB !== null;

      if (hasPenalties) {
        if (m.penaltyScoreA! > m.penaltyScoreB!) {
          statA.penaltyWins++;
          statB.penaltyLosses++;
        } else {
          statB.penaltyWins++;
          statA.penaltyLosses++;
        }
      }

      if (m.scoreA! > m.scoreB!) {
        // Team A won
        statA.won++;
        statA.points += 3;
        statA.form.push('W');
        
        statB.lost++;
        statB.form.push('L');
      } else if (m.scoreA! < m.scoreB!) {
        // Team B won
        statB.won++;
        statB.points += 3;
        statB.form.push('W');
        
        statA.lost++;
        statA.form.push('L');
      } else {
        // Draw
        statA.drawn++;
        statB.drawn++;
        statA.points += 1;
        statB.points += 1;
        statA.form.push('D');
        statB.form.push('D');
      }
    });

    // Keep only last 5 form matches
    Object.values(stats).forEach(stat => {
      if (stat.form.length > 5) {
        stat.form = stat.form.slice(-5);
      }
    });

    // Sort standings
    return Object.values(stats).sort((a, b) => {
      if (b.points !== a.points) return b.points - a.points;
      if (b.goalDifference !== a.goalDifference) return b.goalDifference - a.goalDifference;
      return b.goalsFor - a.goalsFor;
    });

  }, [matches]);

  // Auto-generate Knockout matches once group stage is complete
  useEffect(() => {
    if (loading) return;
    const groupMatches = matches.filter(m => m.stage === 'group');
    const isGroupDone = groupMatches.length === 40 && groupMatches.every(m => m.isCompleted);
    
    if (isGroupDone) {
      const semi = matches.find(m => m.id === 'semi');
      const final = matches.find(m => m.id === 'final');

      if (semi && semi.teamA === 'tbd' && standings.length >= 4) {
        // Generate Semi 3rd vs 4th
        const third = standings[2];
        const fourth = standings[3];

        update(ref(database, `tournament/matches/semi`), { teamA: third.clubId, teamB: fourth.clubId });
      } 
      
      // Final auto-fills AFTER semifinal
      if (semi && final && semi.isCompleted && final.teamA === 'tbd' && standings.length >= 2) {
        const first = standings[0];
        const second = standings[1];
        update(ref(database, `tournament/matches/final`), { teamA: first.clubId, teamB: second.clubId });
      }
    }
  }, [matches, standings, loading]);

  return {
    matches,
    standings,
    updateMatchResult,
    updateMatchDate,
    setMatchLive,
    updateLiveScore,
    resetTournament,
    nextMatchDate,
    setNextMatchDate: updateNextMatchDate,
    loading,
    isOffline,
    isSlow
  };
}
