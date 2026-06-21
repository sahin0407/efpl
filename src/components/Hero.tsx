import { CountdownCard } from './CountdownCard';
import { BiggestWinCard } from './BiggestWinCard';
import { motion } from 'motion/react';
import { Match, ClubStats } from '../types';
import { HomeExtraCards } from './HomeExtraCards';
import { LiveMatchCard } from './LiveMatchCard';
import { QuickAccessCards } from './QuickAccessCards';
import { ClubBanners } from './ClubBanners';
import { useHeroLogo } from './HeroLogoAdmin';

export default function Hero({ onNavigate, data }: { onNavigate: (tab: string) => void, data: any }) {
  const standings: ClubStats[] = data.standings;
  const matches: Match[] = data.matches;
  const { logoUrl } = useHeroLogo();
  
  const completedMatches = matches.filter(m => m.isCompleted).length;
  const totalGoals = standings.reduce((sum, s) => sum + s.goalsFor, 0);
  const avgGoals = completedMatches > 0 ? (totalGoals / completedMatches).toFixed(1) : "0.0";
  
  const liveMatch = matches.find(m => m.isLive);

  return (
    <div className="pb-12">
      {/* Dark Minimal Hero Block */}
      <div className="bg-hero-gradient w-full relative overflow-hidden -mt-[1px]">
        {/* Subtle scanline texture and noise */}
        <div className="absolute inset-0 opacity-[0.03] pointer-events-none mix-blend-overlay bg-[url('data:image/svg+xml;utf8,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noiseFilter%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.65%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noiseFilter)%22/%3E%3C/svg%3E')]" />
        
        {/* Top Gradient Line */}
        <div className="h-[2px] w-full bg-accent-gradient top-0 left-0 absolute" />

        <div className="max-w-2xl mx-auto px-6 pt-16 pb-20 text-center relative z-10 flex flex-col items-center">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
            className="flex flex-col items-center"
          >
            <span className="text-cyber-pink text-[9px] font-sans font-bold tracking-[0.3em] uppercase mb-10 block">Season 2026</span>
            
            {logoUrl ? (
              <img 
                src={logoUrl} 
                alt="EFPL Logo" 
                className="w-[280px] md:w-[360px] h-auto mb-6 object-contain"
                referrerPolicy="no-referrer"
              />
            ) : (
              <h1 className="font-playfair italic text-white text-8xl md:text-[10rem] mb-6 tracking-tighter leading-none">
                EFPL
              </h1>
            )}
            
            {/* Divider line: gradient purple→pink */}
            <div className="w-16 h-[1px] bg-accent-gradient mx-auto mb-6" />
            
            <p className="text-brand-muted font-sans text-xs tracking-[0.2em] font-medium uppercase mb-12">
              eFootball™ Premier League
            </p>
            
            <p className="text-cyber-pink font-sans font-light text-xs tracking-[0.4em] uppercase mb-12">
              More Than A Match
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-6 mt-4">
              <button 
                onClick={() => onNavigate('standings')}
                className="relative border border-cyber-purple text-white font-sans text-xs tracking-[0.2em] uppercase py-3 px-8 hover:border-cyber-pink hover:bg-white/5 transition-colors"
              >
                View Table
              </button>
              <button 
                onClick={() => onNavigate('fixtures')}
                className="text-cyber-cyan font-sans text-xs tracking-[0.2em] uppercase hover:opacity-70 transition-opacity flex items-center gap-2"
              >
                Fixtures <span>→</span>
              </button>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Live Stats Bar - Sharp Edges */}
      <div className="w-full max-w-2xl mx-auto px-4 -mt-10 relative z-20">
        <div className="bg-brand-surface relative shadow-[0_4px_20px_rgba(0,0,0,0.06)] py-6 px-4 flex justify-between items-center text-center divide-x divide-brand-border">
          <div className="absolute top-0 left-0 w-full h-[2px] bg-accent-gradient" />
          <div className="flex-1 px-2">
            <span className="block font-mono text-4xl font-black text-brand-text">{completedMatches}</span>
            <span className="text-[10px] text-brand-muted uppercase tracking-[0.1em] mt-2 block">Matches</span>
          </div>
          <div className="flex-1 px-2">
            <span className="block font-mono text-4xl font-black text-brand-text">{totalGoals}</span>
            <span className="text-[10px] text-brand-muted uppercase tracking-[0.1em] mt-2 block">Goals</span>
          </div>
          <div className="flex-1 px-2">
            <span className="block font-mono text-4xl font-black text-brand-text">{avgGoals}</span>
            <span className="text-[10px] text-brand-muted uppercase tracking-[0.1em] mt-2 block">Avg / Match</span>
          </div>
        </div>
      </div>

      <QuickAccessCards standings={standings} matches={matches} onNavigate={onNavigate} />

      <CountdownCard matches={matches} />
      {liveMatch && <LiveMatchCard match={liveMatch} />}

      <ClubBanners />

      <BiggestWinCard matches={matches} />
      <HomeExtraCards standings={standings} />
      
    </div>
  );
}
