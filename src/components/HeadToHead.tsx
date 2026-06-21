import { useState } from 'react';
import { CLUBS, Match, getClub } from '../types';
import { motion } from 'motion/react';

export function HeadToHead({ matches }: { matches: Match[] }) {
  const [clubAId, setClubAId] = useState<string>('');
  const [clubBId, setClubBId] = useState<string>('');

  const h2hMatches = matches.filter(m => m.isCompleted && (
    (m.teamA === clubAId && m.teamB === clubBId) ||
    (m.teamA === clubBId && m.teamB === clubAId)
  ));

  let aWins = 0;
  let bWins = 0;
  let draws = 0;
  let aGoals = 0;
  let bGoals = 0;

  let aPenWins = 0;
  let bPenWins = 0;

  h2hMatches.forEach(m => {
    const hasPenalties = m.penaltyScoreA !== null && m.penaltyScoreB !== null;
    if (m.teamA === clubAId) {
      aGoals += m.scoreA!;
      bGoals += m.scoreB!;
      if (hasPenalties) {
        if (m.penaltyScoreA! > m.penaltyScoreB!) aPenWins++;
        else bPenWins++;
      } else {
        if (m.scoreA! > m.scoreB!) aWins++;
        else if (m.scoreA! < m.scoreB!) bWins++;
        else draws++;
      }
    } else {
      aGoals += m.scoreB!;
      bGoals += m.scoreA!;
      if (hasPenalties) {
        if (m.penaltyScoreB! > m.penaltyScoreA!) aPenWins++;
        else bPenWins++;
      } else {
        if (m.scoreB! > m.scoreA!) aWins++;
        else if (m.scoreB! < m.scoreA!) bWins++;
        else draws++;
      }
    }
  });

  const lastMatch = h2hMatches[h2hMatches.length - 1];
  const lastMatchHasPen = lastMatch?.penaltyScoreA !== null && lastMatch?.penaltyScoreB !== null;

  return (
    <div className="w-full max-w-2xl mx-auto mt-12 mb-12">
      <div className="mb-6 text-center sm:text-left border-b border-brand-border pb-4">
        <h2 className="font-playfair text-3xl italic text-brand-dark tracking-tight">
          Head to Head
        </h2>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <select 
          value={clubAId} 
          onChange={e => setClubAId(e.target.value)}
          className="flex-1 bg-brand-surface border border-brand-border p-3 font-sans text-sm focus:outline-none focus:border-brand-accent rounded-sm shadow-sm text-brand-dark"
        >
          <option value="">Select Club A</option>
          {CLUBS.filter(c => c.id !== clubBId).map(c => (
            <option key={c.id} value={c.id}>{c.name}</option>
          ))}
        </select>
        <div className="flex items-center justify-center font-playfair italic text-brand-gray px-2">vs</div>
        <select 
          value={clubBId} 
          onChange={e => setClubBId(e.target.value)}
          className="flex-1 bg-brand-surface border border-brand-border p-3 font-sans text-sm focus:outline-none focus:border-brand-accent rounded-sm shadow-sm text-brand-dark"
        >
          <option value="">Select Club B</option>
          {CLUBS.filter(c => c.id !== clubAId).map(c => (
            <option key={c.id} value={c.id}>{c.name}</option>
          ))}
        </select>
      </div>

      {clubAId && clubBId && (
        <motion.div initial={{opacity: 0, y: 10}} animate={{opacity: 1, y: 0}} className="bg-brand-surface border border-brand-border box-shadow-editorial p-6 rounded-sm">
          <div className="flex justify-between items-center mb-8 border-b border-brand-border pb-6">
             <div className="flex-1 text-center">
               <div className="font-mono text-4xl font-bold" style={{ color: aWins > bWins ? '#C8A84B' : 'var(--text-primary)' }}>{aWins}</div>
               <div className="text-[9px] font-sans font-bold uppercase tracking-[0.2em] text-brand-muted mt-1">Wins</div>
             </div>
             <div className="flex-1 text-center border-x border-brand-border">
               <div className="font-mono text-2xl font-medium text-brand-gray mt-2">{draws}</div>
               <div className="text-[9px] font-sans font-bold uppercase tracking-[0.2em] text-brand-muted mt-1">Draws</div>
             </div>
             <div className="flex-1 text-center">
               <div className="font-mono text-4xl font-bold" style={{ color: bWins > aWins ? '#C8A84B' : 'var(--text-primary)' }}>{bWins}</div>
               <div className="text-[9px] font-sans font-bold uppercase tracking-[0.2em] text-brand-muted mt-1">Wins</div>
             </div>
          </div>

          <div className="space-y-4">
            <div className="flex justify-between items-center font-sans text-sm border-b border-brand-border pb-4">
              <span className="font-bold text-brand-dark flex-1 text-right">{aPenWins}</span>
              <span className="text-[9px] font-bold uppercase tracking-[0.2em] text-brand-gray w-24 text-center">Pen Wins</span>
              <span className="font-bold text-brand-dark flex-1 text-left">{bPenWins}</span>
            </div>
            
            <div className="flex justify-between items-center font-sans text-sm">
              <span className="font-bold text-brand-dark flex-1 text-right">{aGoals}</span>
              <span className="text-[9px] font-bold uppercase tracking-[0.2em] text-brand-gray w-24 text-center">Goals</span>
              <span className="font-bold text-brand-dark flex-1 text-left">{bGoals}</span>
            </div>
            
            {h2hMatches.length > 0 && (
              <div className="flex justify-between items-center font-sans text-sm pt-4 border-t border-brand-border">
                <span className="font-mono font-medium text-brand-dark flex-1 text-right flex items-center justify-end gap-1">
                   {lastMatch.teamA === clubAId ? lastMatch.scoreA : lastMatch.scoreB}
                   {lastMatchHasPen && (
                     <span className="text-[10px] text-brand-accent">({lastMatch.teamA === clubAId ? lastMatch.penaltyScoreA : lastMatch.penaltyScoreB})</span>
                   )}
                </span>
                <span className="text-[9px] font-bold uppercase tracking-[0.2em] text-brand-accent w-24 text-center">Last Match</span>
                <span className="font-mono font-medium text-brand-dark flex-1 text-left flex items-center gap-1">
                   {lastMatchHasPen && (
                     <span className="text-[10px] text-brand-accent">({lastMatch.teamA === clubAId ? lastMatch.penaltyScoreB : lastMatch.penaltyScoreA})</span>
                   )}
                   {lastMatch.teamA === clubAId ? lastMatch.scoreB : lastMatch.scoreA}
                </span>
              </div>
            )}
          </div>
        </motion.div>
      )}
    </div>
  );
}
