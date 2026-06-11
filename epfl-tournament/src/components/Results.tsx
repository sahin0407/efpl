import React from 'react';
import { motion } from 'motion/react';
import { Match, CLUBS } from '../types';
import { ClubBadge } from './ClubBadge';
import { MatchShareButton } from './MatchShareButton';

const getClub = (id: string) => CLUBS.find(c => c.id === id)!;

const formatMatchDate = (dateStr?: string) => {
  if (!dateStr) return null;
  const d = new Date(dateStr);
  const formatter = new Intl.DateTimeFormat('en-GB', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' });
  return formatter.format(d);
};

const ResultCard = ({ match, index }: { key?: React.Key, match: Match, index: number }) => {
  const teamA = getClub(match.teamA);
  const teamB = getClub(match.teamB);
  
  const stageNumber = match.stage === 'group' ? `Match ${match.matchNumber}` : (match.stage === 'semi' ? 'SEMIFINAL' : 'FINAL');
  const hasPenalties = match.penaltyScoreA !== null && match.penaltyScoreB !== null;
  const aWon = hasPenalties ? match.penaltyScoreA! > match.penaltyScoreB! : match.scoreA! > match.scoreB!;
  const bWon = hasPenalties ? match.penaltyScoreB! > match.penaltyScoreA! : match.scoreB! > match.scoreA!;
  const draw = match.scoreA === match.scoreB && !hasPenalties;
  
  const playedDate = formatMatchDate(match.date);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ delay: index * 0.05, duration: 0.25 }}
      className="border-b border-brand-border py-4 px-2 hover:bg-brand-standings-alt transition-colors"
    >
      <div className="flex flex-col gap-3">
        <div className="flex items-center justify-between">
          {/* Match label & Date left column */}
          <div className="w-24 flex flex-col text-left">
            <span className="text-[10px] font-sans font-bold text-[#999999] uppercase tracking-wider">{stageNumber}</span>
            {playedDate && <span className="text-[9px] font-sans text-brand-gray mt-1 block h-[13px]">{playedDate}</span>}
          </div>

          {/* Center Teams & Score */}
          <div className="flex-1 flex items-center justify-center gap-2 sm:gap-4">
            <div className="flex-1 flex items-center justify-end gap-3">
              <span className={`font-sans text-sm hidden sm:inline ${aWon ? 'font-bold text-brand-dark' : 'font-medium text-[#999999]'}`}>{teamA.name}</span>
              <span className={`font-sans text-sm sm:hidden ${aWon ? 'font-bold text-brand-dark' : 'font-medium text-[#999999]'}`}>{teamA.shortName}</span>
              <ClubBadge clubId={match.teamA} size={32} />
              <div className="flex items-center gap-1">
                <span className={`font-mono text-lg font-bold w-6 text-center ${aWon ? 'text-brand-dark' : 'text-[#999999]'}`}>{match.scoreA}</span>
                {hasPenalties && (
                  <span className={`text-[10px] sm:text-xs font-mono font-bold ${aWon ? 'text-brand-accent' : 'text-brand-gray'}`}>({match.penaltyScoreA})</span>
                )}
              </div>
            </div>
            
            <span className="font-mono text-xs text-[#C0C0C0]">-</span>
            
            <div className="flex-1 flex items-center justify-start gap-3">
              <div className="flex items-center gap-1">
                {hasPenalties && (
                  <span className={`text-[10px] sm:text-xs font-mono font-bold ${bWon ? 'text-brand-accent' : 'text-brand-gray'}`}>({match.penaltyScoreB})</span>
                )}
                <span className={`font-mono text-lg font-bold w-6 text-center ${bWon ? 'text-brand-dark' : 'text-[#999999]'}`}>{match.scoreB}</span>
              </div>
              <ClubBadge clubId={match.teamB} size={32} />
              <span className={`font-sans text-sm hidden sm:inline ${bWon ? 'font-bold text-brand-dark' : 'font-medium text-[#999999]'}`}>{teamB.name}</span>
              <span className={`font-sans text-sm sm:hidden ${bWon ? 'font-bold text-brand-dark' : 'font-medium text-[#999999]'}`}>{teamB.shortName}</span>
            </div>
          </div>

          {/* Status chip & Share */}
          <div className="w-24 text-right flex items-center justify-end gap-1.5 shrink-0 font-sans">
            <MatchShareButton match={match} iconSize={14} />
            <span className="inline-block bg-brand-hero rounded-sm text-[9px] font-bold text-brand-surface px-2 py-0.5 uppercase">FT</span>
          </div>
        </div>
        
        {hasPenalties && (
          <div className="flex justify-center text-center -mt-1 mb-1 items-center gap-2">
            <span className="text-[10px] text-brand-accent font-sans font-bold italic">Won on penalties by {aWon ? teamA.shortName : teamB.shortName}</span>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default function Results({ data }: { data: any }) {
  const matches: Match[] = data.matches;
  const completed = matches.filter(m => m.isCompleted).sort((a, b) => {
    // Sort by recently completed first. If not available, fallback to matchNumber desc.
    if (a.completedAt && b.completedAt) {
       return new Date(b.completedAt).getTime() - new Date(a.completedAt).getTime();
    }
    if (a.completedAt) return -1;
    if (b.completedAt) return 1;
    return (b.matchNumber || 0) - (a.matchNumber || 0);
  });

  return (
    <div className="pt-12 px-4 pb-12 w-full max-w-2xl mx-auto">
      <div className="mb-6 text-center sm:text-left border-b border-brand-border pb-4">
        <span className="text-[10px] text-brand-accent font-sans font-bold tracking-[0.25em] uppercase mb-1 block">HISTORY</span>
        <h2 className="font-playfair text-5xl italic text-brand-dark tracking-tight">
          Results
        </h2>
      </div>

      {completed.length > 0 ? (
        <div className="flex flex-col bg-brand-surface border border-brand-border box-shadow-editorial rounded-sm p-2 mb-10">
          {completed.map((m, i) => <ResultCard key={m.id} match={m} index={i} />)}
        </div>
      ) : (
        <div className="text-center py-16 bg-brand-surface rounded-sm border border-brand-border flex flex-col items-center">
          <div className="w-12 h-12 mb-4 rounded-full bg-brand-primary flex items-center justify-center text-brand-gray border border-brand-border">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6"/><path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18"/><path d="M4 22h16"/><path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22"/><path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22"/><path d="M18 2H6v7a6 6 0 0 0 12 0V2Z"/></svg>
          </div>
          <p className="text-brand-gray font-playfair italic text-lg tracking-widest uppercase mb-2">No results yet.</p>
          <p className="text-[#999999] font-sans text-xs">Results will appear after matches are entered by admin</p>
        </div>
      )}
    </div>
  );
}
