import { useState, useEffect } from 'react';
import { Match, getClub } from '../types';

export function CountdownCard({ matches }: { matches: Match[] }) {
  const nextMatch = matches.find(m => !m.isCompleted && m.teamA !== 'tbd' && m.teamB !== 'tbd');
  const actualNextMatchDate = nextMatch?.date || null;
  
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  });

  useEffect(() => {
    if (!actualNextMatchDate) return;

    const timer = setInterval(() => {
      const target = new Date(actualNextMatchDate).getTime();
      const now = new Date().getTime();
      const difference = target - now;

      if (difference <= 0) {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
        clearInterval(timer);
      } else {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
          minutes: Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60)),
          seconds: Math.floor((difference % (1000 * 60)) / 1000)
        });
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [actualNextMatchDate]);

  if (!nextMatch) {
    return (
      <div className="w-full max-w-2xl mx-auto px-4 mt-8 mb-4">
        <div className="bg-brand-surface border-t border-brand-accent shadow-[0_4px_20px_rgba(0,0,0,0.06)] py-6 px-4 text-center">
          <h3 className="text-brand-accent text-[10px] font-sans font-bold tracking-[0.25em] uppercase mb-2">NEXT MATCH</h3>
          <p className="font-playfair italic text-xl text-brand-dark">All Matches Complete</p>
        </div>
      </div>
    );
  }

  const teamA = getClub(nextMatch.teamA);
  const teamB = getClub(nextMatch.teamB);

  return (
    <div className="w-full max-w-2xl mx-auto px-4 mt-8 mb-6">
      <div className="bg-brand-surface border-t border-brand-accent shadow-[0_4px_20px_rgba(0,0,0,0.06)] py-6 px-4 text-center">
        <h3 className="text-brand-accent text-[10px] font-sans font-bold tracking-[0.25em] uppercase mb-4">NEXT MATCH</h3>
        
        <div className="flex items-center justify-center gap-4 mb-6">
          <span className="font-sans font-bold text-sm text-brand-dark flex-1 text-right">{teamA.name}</span>
          <span className="font-playfair italic text-sm text-brand-accent">vs</span>
          <span className="font-sans font-bold text-sm text-brand-dark flex-1 text-left">{teamB.name}</span>
        </div>

        {actualNextMatchDate ? (
          <div className="flex justify-center items-center gap-4 md:gap-8">
            <div className="flex flex-col items-center">
              <span className="font-mono text-3xl font-black text-brand-dark leading-none">{String(timeLeft.days).padStart(2, '0')}</span>
              <span className="text-[9px] text-brand-muted uppercase tracking-widest mt-2">Days</span>
            </div>
            <span className="font-playfair text-2xl text-brand-accent opacity-50 -mt-4">:</span>
            <div className="flex flex-col items-center">
              <span className="font-mono text-3xl font-black text-brand-dark leading-none">{String(timeLeft.hours).padStart(2, '0')}</span>
              <span className="text-[9px] text-brand-muted uppercase tracking-widest mt-2">Hours</span>
            </div>
            <span className="font-playfair text-2xl text-brand-accent opacity-50 -mt-4">:</span>
            <div className="flex flex-col items-center">
              <span className="font-mono text-3xl font-black text-brand-dark leading-none">{String(timeLeft.minutes).padStart(2, '0')}</span>
              <span className="text-[9px] text-brand-muted uppercase tracking-widest mt-2">Mins</span>
            </div>
            <span className="font-playfair text-2xl text-brand-accent opacity-50 -mt-4">:</span>
            <div className="flex flex-col items-center">
              <span className="font-mono text-3xl font-black text-brand-dark leading-none">{String(timeLeft.seconds).padStart(2, '0')}</span>
              <span className="text-[9px] text-brand-muted uppercase tracking-widest mt-2">Secs</span>
            </div>
          </div>
        ) : (
          <p className="text-[10px] text-brand-muted font-sans italic my-2">Schedule not set yet</p>
        )}
      </div>
    </div>
  );
}
