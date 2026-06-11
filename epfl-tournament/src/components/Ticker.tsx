import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { ref, onValue } from 'firebase/database';
import { database } from '../firebase';
import { Match, CLUBS, ClubStats } from '../types';

export function Ticker({ matches, standings }: { matches?: Match[], standings?: ClubStats[] }) {
  const [tickerSetting, setTickerSetting] = useState<string | null>(null);

  useEffect(() => {
    const textRef = ref(database, 'tournament/settings/tickerText');
    const unsubscribe = onValue(textRef, (snapshot) => {
      if (snapshot.exists()) {
        setTickerSetting(snapshot.val());
      } else {
        setTickerSetting(null);
      }
    });
    return () => unsubscribe();
  }, []);

  const completedMatches = matches ? matches.filter(m => m.isCompleted).length : 0;
  const remainingMatches = Math.max(0, 42 - completedMatches);
  const totalGoals = standings ? standings.reduce((acc, club) => acc + club.goalsFor, 0) : 0;
  const clubsCount = CLUBS.length;

  const autoDynamicText = `⚽ EFPL SEASON 2026 HAS BEGUN · MORE THAN A MATCH · ${completedMatches} MATCHES PLAYED · ${remainingMatches} MATCHES REMAINING · ${totalGoals} GOALS SCORED · ${clubsCount} CLUBS · 1 CHAMPION AWAITS · STAY TUNED`;

  const finalText = (tickerSetting && tickerSetting.trim() !== '') 
    ? tickerSetting.trim() + ' · '
    : autoDynamicText + ' · ';

  return (
    <div className="w-full bg-[#C8A84B] border-b border-brand-border overflow-hidden whitespace-nowrap py-1.5 flex items-center">
      <div className="ticker-wrap flex">
        <div className="ticker-track flex">
          <span className="text-black font-sans text-[10px] font-bold tracking-[0.2em] uppercase pr-8 whitespace-nowrap">
            {finalText}
          </span>
          <span className="text-black font-sans text-[10px] font-bold tracking-[0.2em] uppercase pr-8 whitespace-nowrap">
            {finalText}
          </span>
          <span className="text-black font-sans text-[10px] font-bold tracking-[0.2em] uppercase pr-8 whitespace-nowrap">
            {finalText}
          </span>
          <span className="text-black font-sans text-[10px] font-bold tracking-[0.2em] uppercase pr-8 whitespace-nowrap">
            {finalText}
          </span>
        </div>
      </div>
    </div>
  );
}
