import { motion } from 'motion/react';
import { Match, getClub } from '../types';
import { ClubBadge } from './ClubBadge';
import { useEffect, useState } from 'react';
import { MatchShareButton } from './MatchShareButton';

export function LiveMatchCard({ match }: { match: Match }) {
  const teamA = getClub(match.teamA);
  const teamB = getClub(match.teamB);

  // Auto refreshes every 30 seconds OR instantly on admin update.
  // The React state will re-render instantly on admin update anyway.
  // We can just add a subtle effect or just rely on React.

  return (
    <div className="w-full max-w-2xl mx-auto px-4 mt-8">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-brand-surface border-t-2 border-t-brand-danger border-x border-b border-brand-border p-6 box-shadow-editorial relative"
      >
        <div className="absolute top-4 right-4 flex items-center gap-1.5">
          <MatchShareButton match={match} iconSize={14} className="hover:bg-brand-gray/10" />
          <div className="flex items-center gap-1.5 bg-brand-danger-surface border border-brand-danger-border/30 rounded-full py-0.5 px-2">
            <span className="w-1.5 h-1.5 rounded-full bg-brand-danger animate-pulse" />
            <span className="text-[9px] text-brand-danger font-bold uppercase tracking-widest leading-none">Live</span>
          </div>
        </div>
        
        <div className="text-center mb-6 mt-2">
           <span className="text-[10px] text-brand-gray uppercase tracking-widest font-bold">
             {match.stage === 'group' ? `Match ${match.matchNumber}` : match.stage.toUpperCase()}
           </span>
        </div>

        <div className="flex justify-center items-center gap-4 sm:gap-8 mb-6">
           <div className="flex flex-col items-center flex-1">
             <ClubBadge clubId={teamA.id} size={48} />
             <span className="font-sans font-bold text-brand-text mt-3 text-center text-sm md:text-base leading-tight">{teamA.name}</span>
           </div>
           
           <div className="flex items-center gap-4">
             <span className="font-mono text-5xl font-black text-brand-text leading-none">{match.scoreA ?? 0}</span>
             <span className="font-sans text-brand-gray text-xl">-</span>
             <span className="font-mono text-5xl font-black text-brand-text leading-none">{match.scoreB ?? 0}</span>
           </div>
           
           <div className="flex flex-col items-center flex-1">
             <ClubBadge clubId={teamB.id} size={48} />
             <span className="font-sans font-bold text-brand-text mt-3 text-center text-sm md:text-base leading-tight">{teamB.name}</span>
           </div>
        </div>

        <div className="text-center">
           <span className="text-xs text-[#999] italic font-sans block">Live updates by admin</span>
        </div>
      </motion.div>
    </div>
  );
}
