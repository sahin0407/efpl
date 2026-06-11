import React from 'react';
import { motion } from 'motion/react';

import { ClubStats, CLUBS, Match } from '../types';

export default function ClubStatsView({ data }: { data: any }) {
  const standings: ClubStats[] = data.standings;
  const matches: Match[] = data.matches;
  
  const completedMatches = matches.filter(m => m.isCompleted).length;
  const totalGoals = standings.reduce((sum, s) => sum + s.goalsFor, 0);
  const avgGoals = completedMatches > 0 ? (totalGoals / completedMatches).toFixed(2) : "0.00";
  
  let biggestWinScore = 0;
  let biggestWinStr = "---";
  
  matches.filter(m => m.isCompleted).forEach(m => {
    const diff = Math.abs(m.scoreA! - m.scoreB!);
    if (diff > biggestWinScore) {
       biggestWinScore = diff;
       const winner = m.scoreA! > m.scoreB! ? CLUBS.find(c => c.id === m.teamA) : CLUBS.find(c => c.id === m.teamB);
       const loser = m.scoreA! < m.scoreB! ? CLUBS.find(c => c.id === m.teamA) : CLUBS.find(c => c.id === m.teamB);
       const maxSc = Math.max(m.scoreA!, m.scoreB!);
       const minSc = Math.min(m.scoreA!, m.scoreB!);
       biggestWinStr = `${winner?.shortName} ${maxSc}-${minSc} ${loser?.shortName}`;
    }
  });

  const StatCard = ({ title, value, sub }: { title: string, value: string | number, sub?: string }) => (
    <div className="card-editorial p-6 flex flex-col">
        <span className="text-[10px] text-brand-secondary uppercase tracking-widest mb-2 font-sans">{title}</span>
        <span className="font-mono text-4xl text-brand-primary">{value}</span>
        {sub && <span className="text-xs text-brand-secondary mt-1 font-sans">{sub}</span>}
    </div>
  );

  return (
    <div className="pt-8 px-4 pb-12 w-full max-w-4xl mx-auto">
      <div className="mb-6 border-b border-brand-border pb-4">
        <div className="text-[10px] tracking-widest text-brand-accent uppercase mb-1 font-sans">OVERVIEW</div>
        <h2 className="font-display font-medium italic text-3xl text-brand-primary">
          Tournament Stats
        </h2>
      </div>

      <div className="grid grid-cols-2 gap-px bg-brand-border border border-brand-border">
         <div className="bg-brand-surface"><StatCard title="Matches" value={completedMatches} sub="/ 40 Group matches" /></div>
         <div className="bg-brand-surface"><StatCard title="Total Goals" value={totalGoals} /></div>
         <div className="bg-brand-surface"><StatCard title="Avg Goals" value={avgGoals} sub="Per Match" /></div>
         <div className="bg-brand-surface"><StatCard title="Biggest Win" value={biggestWinScore > 0 ? biggestWinStr : "---"} sub={biggestWinScore > 0 ? `Margin: +${biggestWinScore}` : undefined} /></div>
      </div>

    </div>
  );
}
