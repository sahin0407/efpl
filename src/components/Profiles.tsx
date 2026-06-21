import { motion } from 'motion/react';
import { CLUBS, ClubStats } from '../types';
import { HeadToHead } from './HeadToHead';
import { ClubBadge } from './ClubBadge';
import { OwnerAvatar } from './OwnerAvatar';

export default function Profiles({ data }: { data: any }) {
  const standings: ClubStats[] = data.standings;

  return (
    <div className="pt-12 px-4 pb-12 w-full max-w-2xl mx-auto">
      <div className="mb-6 text-center sm:text-left border-b border-brand-border pb-4">
        <span className="text-[10px] text-cyber-cyan font-sans font-bold tracking-[0.25em] uppercase mb-1 block">TEAMS</span>
        <h2 className="font-playfair text-5xl italic text-brand-text tracking-tight">
          Clubs
        </h2>
      </div>

      <div className="space-y-6">
        {standings.map((stats, index) => {
          const club = CLUBS.find(c => c.id === stats.clubId)!;
          const pos = index + 1;

          return (
            <motion.div
              key={club.id}
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1, duration: 0.25 }}
              className="bg-brand-surface rounded-sm border-y border-r border-l-[3px] border-l-transparent hover:border-l-cyber-pink border-y-brand-border border-r-brand-border box-shadow-editorial relative overflow-hidden group transition-colors"
            >
              {/* Massive Watermark */}
              <div className="absolute -right-4 -bottom-10 pointer-events-none select-none z-0">
                <span className="font-mono font-bold text-[200px] text-brand-text opacity-[0.06] leading-none">{club.shortName}</span>
              </div>
              
              <div className="p-6 relative z-10 w-full h-full">
                <div className="flex justify-between items-start mb-8">
                  <div className="flex gap-4 items-start">
                    <ClubBadge clubId={club.id} size={64} className="group-hover:shadow-[0_0_15px_rgba(236,72,153,0.3)]" />
                    <div>
                      <h3 className="font-playfair font-bold text-4xl text-brand-text tracking-tight mb-3">{club.name}</h3>
                      <div className="flex items-center gap-3">
                        <OwnerAvatar clubId={club.id} size={32} />
                        <p className="text-[11px] text-brand-gray font-sans font-medium uppercase tracking-[0.1em]">Owner / <span className="font-light italic">{club.owner}</span></p>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <span 
                      className="block font-mono text-5xl font-light text-brand-border leading-none"
                    >
                      {pos}
                    </span>
                  </div>
                </div>

                {/* Clean inline stats row */}
                <div className="flex divide-x divide-brand-border border-t border-brand-border pt-4 mb-2">
                  <div className="flex-1 px-2 first:pl-0">
                    <span className="text-[9px] text-brand-muted font-sans font-bold uppercase tracking-widest block mb-1">PTS</span>
                    <span className="font-mono text-2xl text-brand-text font-bold">{stats.points}</span>
                  </div>
                  <div className="flex-1 px-4">
                    <span className="text-[9px] text-brand-muted font-sans font-bold uppercase tracking-widest block mb-1">GF</span>
                    <span className="font-mono text-2xl text-brand-text font-medium">{stats.goalsFor}</span>
                  </div>
                  <div className="flex-1 px-4">
                    <span className="text-[9px] text-brand-muted font-sans font-bold uppercase tracking-widest block mb-1">GA</span>
                    <span className="font-mono text-2xl text-brand-text font-medium">{stats.goalsAgainst}</span>
                  </div>
                  <div className="flex-1 px-4">
                    <span className="text-[9px] text-brand-muted font-sans font-bold uppercase tracking-widest block mb-1">CS</span>
                    <span className="font-mono text-2xl text-brand-text font-medium">{stats.cleanSheets}</span>
                  </div>
                  <div className="flex-1 px-4">
                    <span className="text-[9px] text-brand-muted font-sans font-bold uppercase tracking-widest block mb-1">PENS</span>
                    <span className="font-mono text-2xl text-brand-text font-medium whitespace-nowrap">{stats.penaltyWins}/{stats.penaltyLosses}</span>
                  </div>
                </div>

                <div className="flex items-center gap-3 mt-4">
                  <span className="text-[9px] text-brand-muted font-sans font-bold uppercase tracking-widest">FORM</span>
                  <div className="flex gap-1.5">
                    {Array.from({ length: 5 }).map((_, i) => {
                      const result = stats.form[stats.form.length - 5 + i];
                      const isEmpty = stats.form.length - 5 + i < 0;
                      return (
                        <div 
                          key={i} 
                          className={`w-2 h-2 rounded-full ${
                            result === 'W' ? 'bg-[#22C55E]' :
                            result === 'D' ? 'bg-[#F59E0B]' :
                            result === 'L' ? 'bg-[#EF4444]' :
                            'border border-brand-border bg-transparent'
                          }`}
                        />
                      );
                    })}
                  </div>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      <HeadToHead matches={data.matches} />
    </div>
  );
}
