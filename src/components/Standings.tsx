import { motion } from 'motion/react';
import { useState } from 'react';
import { ClubStats, Match, CLUBS } from '../types';
import { ClubBadge } from './ClubBadge';
import { OwnerAvatar } from './OwnerAvatar';
import { StandingsShareCard } from './StandingsShareCard';

export default function Standings({ data }: { data: any }) {
  const standings: ClubStats[] = data.standings;
  const matches: Match[] = data.matches;
  const [showShare, setShowShare] = useState(false);

  const getClub = (id: string) => CLUBS.find(c => c.id === id)!;
  const groupMatches = matches.filter(m => m.stage === 'group');
  const isGroupDone = groupMatches.length > 0 && groupMatches.every(m => m.isCompleted);
  const semiMatch = matches.find(m => m.stage === 'semi');
  const finalMatch = matches.find(m => m.stage === 'final');

  const latestCompletedMatch = [...matches].filter(m => m.isCompleted && m.completedAt).sort((a,b) => new Date(b.completedAt!).getTime() - new Date(a.completedAt!).getTime())[0];
  const updatedDate = latestCompletedMatch ? new Date(latestCompletedMatch.completedAt!) : new Date();
  const updatedTimeStr = updatedDate.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });

  const getRankColorAndLabel = (index: number) => {
    if (index === 0) return { label: 'LEADER', color: 'var(--color-cyber-purple)', leftBorderClass: '', style: { borderImage: "linear-gradient(135deg, #7C3AED, #EC4899) 1", borderLeftWidth: '4px', borderLeftStyle: 'solid' }, isFirst: true };
    if (index === 1) return { label: 'FINAL', color: 'var(--color-cyber-cyan)', leftBorderClass: 'border-l-[4px] border-l-cyber-cyan', style: {}, isFirst: false };
    if (index === 2 || index === 3) return { label: 'SEMI', color: 'var(--color-cyber-gold)', leftBorderClass: 'border-l-[4px] border-l-cyber-gold', style: {}, isFirst: false };
    return { label: 'OUT', color: 'var(--color-brand-danger)', leftBorderClass: 'border-l-[4px] border-l-[#EF4444]', style: {}, isFirst: false };
  };

  return (
    <div className="pt-12 px-4 pb-12 w-full max-w-4xl mx-auto">
      <div className="mb-6 flex flex-col sm:flex-row items-center sm:items-end justify-between border-b border-brand-border pb-4 gap-4">
        <div className="text-center sm:text-left">
          <span className="text-[10px] text-cyber-pink font-sans font-bold tracking-[0.25em] uppercase mb-1 block">TABLE</span>
          <h2 className="font-playfair text-5xl italic text-brand-dark tracking-tight">
            Standings
          </h2>
          <span className="text-[9px] text-[#A0A0A0] font-sans italic mt-2 block tracking-wider">
            Last updated: {updatedTimeStr}
          </span>
        </div>
        <button 
          onClick={() => setShowShare(true)}
          className="border border-brand-muted text-brand-text px-4 py-2 font-sans font-bold text-[10px] tracking-[0.2em] uppercase hover:border-cyber-pink hover:text-cyber-pink transition-colors"
        >
          Share Table
        </button>
      </div>

      <div className="bg-brand-surface rounded-sm border border-brand-border box-shadow-editorial overflow-hidden w-full mb-12">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b-[1px] border-brand-border bg-brand-standings-alt">
                <th className="py-3 px-4 pl-4 text-center font-sans text-[9px] text-brand-muted font-bold uppercase tracking-wider w-10">Rnk</th>
                <th className="py-3 px-4 font-sans text-[9px] text-brand-muted font-bold uppercase tracking-wider">Club</th>
                <th className="py-3 px-3 text-center font-sans text-[9px] text-brand-muted font-bold uppercase tracking-wider w-6">P</th>
                <th className="py-3 px-3 text-center font-sans text-[9px] text-brand-muted font-bold uppercase tracking-wider w-6">W</th>
                <th className="py-3 px-3 text-center font-sans text-[9px] text-brand-muted font-bold uppercase tracking-wider w-6">D</th>
                <th className="py-3 px-3 text-center font-sans text-[9px] text-brand-muted font-bold uppercase tracking-wider w-6">L</th>
                <th className="py-3 px-3 text-center font-sans text-[9px] text-brand-muted font-bold uppercase tracking-wider w-8">GF</th>
                <th className="py-3 px-3 text-center font-sans text-[9px] text-brand-muted font-bold uppercase tracking-wider w-8">GA</th>
                <th className="py-3 px-3 text-center font-sans text-[9px] text-brand-muted font-bold uppercase tracking-wider w-8">GD</th>
                <th className="py-3 px-4 pr-6 text-right font-sans text-[9px] text-brand-dark font-bold uppercase tracking-wider w-12">Pts</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-brand-border">
              {standings.map((stat, index) => {
                const club = getClub(stat.clubId);
                const rankData = getRankColorAndLabel(index);
                
                return (
                  <motion.tr 
                    key={stat.clubId}
                    layout // Enables smooth row swapping when rank changes
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: index * 0.1, duration: 0.25, layout: { duration: 0.3 } }}
                    className={`hover:bg-brand-standings-alt even:bg-brand-standings-alt transition-colors ${rankData.leftBorderClass}`}
                    style={rankData.style}
                  >
                    <td className="py-4 px-4 text-center font-mono text-xs text-brand-gray">{index + 1}</td>
                    <td className="py-4 px-4 whitespace-nowrap min-w-[200px]">
                      <div className="flex items-center gap-3">
                        <ClubBadge clubId={club.id} size={32} />
                        <div className="flex flex-col">
                          <span className="font-sans font-bold text-sm text-brand-text">{club.name}</span>
                          <div className="flex items-center gap-2 mt-0.5">
                            <OwnerAvatar clubId={club.id} size={24} />
                            <span className="text-[10px] font-sans font-light italic text-brand-muted">{club.owner}</span>
                            {stat.played > 0 && (
                              <span className={`text-[8px] font-sans font-bold uppercase tracking-widest ${rankData.isFirst ? 'text-gradient-primary' : ''}`} style={rankData.isFirst ? {} : { color: rankData.color }}>
                                {rankData.label}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-3 text-center font-mono text-xs text-brand-gray">{stat.played}</td>
                    <td className="py-4 px-3 text-center font-mono text-xs text-brand-muted">{stat.won}</td>
                    <td className="py-4 px-3 text-center font-mono text-xs text-brand-muted">{stat.drawn}</td>
                    <td className="py-4 px-3 text-center font-mono text-xs text-brand-muted">{stat.lost}</td>
                    <td className="py-4 px-3 text-center font-mono text-xs text-brand-gray">{stat.goalsFor}</td>
                    <td className="py-4 px-3 text-center font-mono text-xs text-brand-gray">{stat.goalsAgainst}</td>
                    <td className="py-4 px-3 text-center font-mono text-xs text-brand-text font-medium">{stat.goalDifference > 0 ? `+${stat.goalDifference}` : stat.goalDifference}</td>
                    <td className="py-4 px-4 pr-6 text-right">
                      <span className={`font-mono text-base font-bold ${rankData.isFirst ? 'text-gradient-primary' : 'text-brand-text'}`}>{stat.points}</span>
                    </td>
                  </motion.tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {isGroupDone && (
         <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} className="mb-12">
           <div className="mb-6 text-center">
             <span className="text-[10px] text-brand-accent font-sans font-bold tracking-[0.25em] uppercase mb-1 block">BRACKET</span>
             <h2 className="font-playfair text-4xl italic text-brand-dark tracking-tight">
               Knockout Stage
             </h2>
           </div>

          <div className="flex flex-col md:flex-row items-center justify-center gap-8 md:gap-16 w-full max-w-2xl mx-auto font-sans">

            {/* Left Column (Semifinal) */}
            {semiMatch && (
              <div className="flex flex-col relative">
                <div className="text-[10px] text-brand-muted uppercase tracking-widest font-bold mb-2">Semifinal</div>
                <div className="border border-brand-border bg-brand-surface rounded-sm w-48 box-shadow-editorial">
                  <div className="flex items-center justify-between p-3 border-b border-brand-border">
                    <div className="flex items-center gap-2">
                       {semiMatch.teamA !== 'tbd' && <ClubBadge clubId={semiMatch.teamA} size={24} />}
                       <span className={`text-sm text-brand-dark ${semiMatch.isCompleted && semiMatch.scoreA! > semiMatch.scoreB! ? 'font-bold' : ''}`} style={{ color: semiMatch.teamA === 'tbd' ? 'var(--text-muted)' : getClub(semiMatch.teamA).color }}>
                         {semiMatch.teamA === 'tbd' ? 'TBD' : getClub(semiMatch.teamA).name}
                       </span>
                    </div>
                    <span className="font-mono font-bold text-sm text-brand-dark">{semiMatch.isCompleted ? semiMatch.scoreA : '-'}</span>
                  </div>
                  <div className="flex items-center justify-between p-3">
                    <div className="flex items-center gap-2">
                       {semiMatch.teamB !== 'tbd' && <ClubBadge clubId={semiMatch.teamB} size={24} />}
                       <span className={`text-sm text-brand-dark ${semiMatch.isCompleted && semiMatch.scoreB! > semiMatch.scoreA! ? 'font-bold' : ''}`} style={{ color: semiMatch.teamB === 'tbd' ? 'var(--text-muted)' : getClub(semiMatch.teamB).color }}>
                         {semiMatch.teamB === 'tbd' ? 'TBD' : getClub(semiMatch.teamB).name}
                       </span>
                    </div>
                    <span className="font-mono font-bold text-sm text-brand-dark">{semiMatch.isCompleted ? semiMatch.scoreB : '-'}</span>
                  </div>
                </div>
                
                {/* Connecting lines for desktop */}
                <div className="hidden md:block absolute top-[50%] -right-8 w-8 h-[1px] bg-brand-dark" />
              </div>
            )}

            {/* Right Column (Final) */}
            {finalMatch && (
              <div className="flex flex-col relative mt-8 md:mt-0">
                <div className="text-[10px] text-brand-accent uppercase tracking-[0.25em] font-bold mb-2">Final Match</div>
                <div className="border border-brand-border bg-brand-surface rounded-sm w-48 box-shadow-editorial relative z-10">
                  <div className="flex items-center justify-between p-3 border-b border-brand-border">
                    <div className="flex items-center gap-2">
                       {finalMatch.teamA !== 'tbd' && <ClubBadge clubId={finalMatch.teamA} size={24} />}
                       <span className={`text-sm text-brand-dark ${finalMatch.isCompleted && finalMatch.scoreA! > finalMatch.scoreB! ? 'font-bold' : ''}`} style={{ color: finalMatch.teamA === 'tbd' ? 'var(--text-muted)' : getClub(finalMatch.teamA).color }}>
                         {finalMatch.teamA === 'tbd' ? 'TBD' : getClub(finalMatch.teamA).name}
                       </span>
                    </div>
                    <span className="font-mono font-bold text-sm text-brand-dark">{finalMatch.isCompleted ? finalMatch.scoreA : '-'}</span>
                  </div>
                  <div className="flex items-center justify-between p-3">
                    <div className="flex items-center gap-2">
                       {finalMatch.teamB !== 'tbd' && <ClubBadge clubId={finalMatch.teamB} size={24} />}
                       <span className={`text-sm text-brand-dark ${finalMatch.isCompleted && finalMatch.scoreB! > finalMatch.scoreA! ? 'font-bold' : ''}`} style={{ color: finalMatch.teamB === 'tbd' ? 'var(--text-muted)' : getClub(finalMatch.teamB).color }}>
                         {finalMatch.teamB === 'tbd' ? 'TBD' : getClub(finalMatch.teamB).name}
                       </span>
                    </div>
                    <span className="font-mono font-bold text-sm text-brand-dark">{finalMatch.isCompleted ? finalMatch.scoreB : '-'}</span>
                  </div>
                </div>
              </div>
            )}

          </div>
        </motion.div>
      )}

      {showShare && (
        <StandingsShareCard standings={standings} onDismiss={() => setShowShare(false)} />
      )}
    </div>
  );
}
