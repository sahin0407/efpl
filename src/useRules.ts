import { useState, useEffect } from 'react';
import { ref, onValue, update } from 'firebase/database';
import { database } from './firebase';

export interface RulesData {
  format: string;
  pointsWin: string;
  pointsDraw: string;
  pointsLoss: string;
  tiebreakers: string;
  matchRules: string;
  about: string;
}

const defaultRules: RulesData = {
  format: `- Round Robin group stage\n  (each club plays every other\n  club 4 times = 40 matches)\n- Top 2 → directly to Final\n- 3rd vs 4th → Semifinal\n- SF Winner → Final\n- 5th place → Eliminated`,
  pointsWin: `3 PTS`,
  pointsDraw: `1 PT`,
  pointsLoss: `0 PTS`,
  tiebreakers: `1. Goal Difference (GD)\n2. Goals Scored (GF)\n3. Head-to-Head Result\n4. Coin toss (if still tied)`,
  matchRules: `- eFootball™ standard settings\n- 2 halves of play\n- Extra time if needed in knockouts\n- Penalty shootout if still level\n  after extra time in knockouts\n- Admin enters final result only\n- No appeals after result entered`,
  about: `EFPL — eFootball™ Premier League\nis a private tournament between\n5 friends competing for glory.\n\nSeason 2026 marks the beginning\nof a new era.\n\nMore Than A Match.`
};

export function useRules() {
  const [rules, setRulesData] = useState<RulesData>(defaultRules);

  useEffect(() => {
    const rulesRef = ref(database, 'tournament/rules');
    const unsubscribe = onValue(rulesRef, (snapshot) => {
      if (snapshot.exists()) {
        setRulesData(snapshot.val());
      } else {
        update(ref(database, 'tournament/rules'), defaultRules);
      }
    });

    return () => unsubscribe();
  }, []);

  const setRules = async (newRules: RulesData) => {
    await update(ref(database, 'tournament/rules'), newRules);
  };

  return { rules, setRules };
}
