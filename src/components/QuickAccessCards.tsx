import { motion } from 'motion/react';
import { Trophy, CalendarDays, BarChart2, Shield } from 'lucide-react';
import { ClubStats, Match, getClub } from '../types';

export function QuickAccessCards({ 
  standings, 
  matches, 
  onNavigate 
}: { 
  standings: ClubStats[], 
  matches: Match[], 
  onNavigate: (tab: string) => void 
}) {
  const leaderId = standings.length > 0 ? standings[0].clubId : null;
  const leader = leaderId ? getClub(leaderId).name : 'TBD';
  
  const remainingMatches = matches.filter(m => !m.isCompleted).length;
  const fixturesData = remainingMatches === 0 ? "All Matches Complete" : `${remainingMatches} Matches Remaining`;
  
  const totalGoals = standings.reduce((sum, s) => sum + s.goalsFor, 0);

  const cards = [
    {
      id: 'standings',
      label: 'TABLE',
      subLabel: 'Live Standings',
      data: `Leader: ${leader}`,
      icon: Trophy,
      color: '#C8A84B',
      delay: 0.1
    },
    {
      id: 'fixtures',
      label: 'FIXTURES',
      subLabel: 'Match Schedule',
      data: fixturesData,
      icon: CalendarDays,
      color: '#0066cc',
      delay: 0.2
    },
    {
      id: 'graph',
      label: 'ANALYTICS',
      subLabel: 'Stats & Progress',
      data: `${totalGoals} Goals This Season`,
      icon: BarChart2,
      color: '#00aa44',
      delay: 0.3
    },
    {
      id: 'clubs',
      label: 'CLUBS',
      subLabel: '5 Competing Teams',
      data: 'Season 2026',
      icon: Shield,
      color: '#cc0000',
      delay: 0.4
    }
  ];

  return (
    <div className="w-full max-w-2xl mx-auto px-3 mt-4 mb-4" style={{ position: 'relative', zIndex: 30 }}>
      <div className="mb-4 text-center sm:text-left">
        <span className="text-[#C8A84B] font-sans text-[10px] font-bold tracking-[0.2em] uppercase pl-1">
          QUICK ACCESS
        </span>
      </div>
      <div className="grid grid-cols-2 gap-2">
        {cards.map((card) => (
          <motion.div
            key={card.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: card.delay, ease: "easeOut" }}
            onClick={() => onNavigate(card.id)}
            className="group cursor-pointer bg-brand-surface border border-brand-border shadow-[0_2px_12px_rgba(0,0,0,0.06)] dark:shadow-[0_2px_12px_rgba(0,0,0,0.3)] hover:shadow-[0_6px_16px_rgba(0,0,0,0.1)] dark:hover:shadow-[0_6px_16px_rgba(0,0,0,0.4)] rounded-[4px] p-3 flex flex-col justify-between transition-all duration-200 hover:-translate-y-[2px] relative overflow-hidden"
            style={{
              minHeight: '90px',
              borderTopWidth: '2px',
              borderTopStyle: 'solid',
              borderTopColor: card.color
            }}
          >
            {/* Top border glow effect on hover */}
            <div 
              className="absolute top-0 left-0 w-full h-4 opacity-0 group-hover:opacity-10 transition-opacity duration-300 pointer-events-none"
              style={{ background: `linear-gradient(to bottom, ${card.color}, transparent)` }}
            />

            <div className="flex justify-between items-start mb-2 relative z-10">
              <card.icon size={16} className="text-[#C8A84B]" strokeWidth={1.5} />
            </div>
            
            <div className="flex-1 mt-1 relative z-10">
              <h3 className="font-sans font-bold text-[10px] tracking-[0.15em] uppercase text-brand-dark leading-tight">
                {card.label}
              </h3>
              <p className="font-sans text-[8px] text-brand-gray mt-0.5" style={{ letterSpacing: '0.02em' }}>
                {card.subLabel}
              </p>
              
              {card.id === 'standings' ? (
                <p className="font-sans text-[8px] text-[#C8A84B] font-bold tracking-wide mt-1.5 line-clamp-1">{card.data}</p>
              ) : (
                <p className="font-sans text-[8px] text-brand-muted mt-1.5 font-medium">{card.data}</p>
              )}
            </div>

            <div className="absolute bottom-3 right-3 text-[#C8A84B] text-[14px] font-sans transition-transform duration-200 group-hover:translate-x-1 font-medium z-10">
               →
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
