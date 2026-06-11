/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { useTournament } from './useTournament';
import Hero from './components/Hero';
import Standings from './components/Standings';
import Fixtures from './components/Fixtures';
import Results from './components/Results';
import ClubStatsView from './components/ClubStatsView';
import Profiles from './components/Profiles';
import AdminPanel from './components/AdminPanel';
import ChampionScreen from './components/ChampionScreen';
import { Ticker } from './components/Ticker';
import { ThemeToggle } from './components/ThemeToggle';
import { motion, AnimatePresence } from 'motion/react';
import { CLUBS } from './types';

import Analytics from './components/Analytics';

import { InstallPrompt } from './components/InstallPrompt';
import { useRules } from './useRules';
import { Rules } from './components/Rules';
import { FloatingNav } from './components/FloatingNav';

type Tab = 'home' | 'standings' | 'fixtures' | 'results' | 'stats' | 'graph' | 'clubs' | 'rules' | 'admin';

export default function App() {
  const [activeTab, setActiveTabState] = useState<Tab>(() => {
    const hash = window.location.hash.replace('#', '');
    return (['home', 'standings', 'fixtures', 'results', 'stats', 'graph', 'clubs', 'rules', 'admin'].includes(hash) ? hash : 'home') as Tab;
  });

  const setActiveTab = (tab: Tab) => {
     setActiveTabState(tab);
     window.history.pushState(null, '', `#${tab}`);
  };

  useEffect(() => {
    const handlePopState = () => {
      const hash = window.location.hash.replace('#', '');
      if (['home', 'standings', 'fixtures', 'results', 'stats', 'graph', 'clubs', 'rules', 'admin'].includes(hash)) {
        setActiveTabState(hash as Tab);
      } else {
        setActiveTabState('home');
      }
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);
  const [showChampion, setShowChampion] = useState(false);
  const tournamentData = useTournament();
  const { loading, isOffline, isSlow } = tournamentData;
  const rulesData = useRules();

  const finalMatch = tournamentData.matches.find((m: any) => m.stage === 'final');
  const championClubId = finalMatch?.isCompleted
    ? (finalMatch.scoreA! > finalMatch.scoreB! ? finalMatch.teamA : finalMatch.teamB)
    : null;
    
  const championClub = championClubId ? CLUBS.find(c => c.id === championClubId) : null;
  
  const hasLiveMatch = tournamentData.matches.some((m: any) => m.isLive);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [activeTab]);

  useEffect(() => {
    if (finalMatch?.isCompleted && !localStorage.getItem('efpl_champion_shown_2026')) {
      setShowChampion(true);
    }
  }, [finalMatch?.isCompleted]);

  // Integrated native browser notification trigger when highly-anticipated or favorite matches go LIVE
  useEffect(() => {
    if (tournamentData.loading || !tournamentData.matches) return;

    try {
      const liveMatches = tournamentData.matches.filter((m: any) => m.isLive);
      if (liveMatches.length === 0) return;

      const savedSubs = localStorage.getItem('efpl_notified_matches');
      const subscribedIds: string[] = savedSubs ? JSON.parse(savedSubs) : [];
      if (subscribedIds.length === 0) return;

      const subscribedLiveMatches = liveMatches.filter((m: any) => subscribedIds.includes(m.id));
      if (subscribedLiveMatches.length === 0) return;

      const savedTriggered = localStorage.getItem('efpl_triggered_live_notifs');
      const triggeredIds: string[] = savedTriggered ? JSON.parse(savedTriggered) : [];

      let updatedTriggered = [...triggeredIds];
      let triggeredAny = false;

      subscribedLiveMatches.forEach((m: any) => {
        if (!triggeredIds.includes(m.id)) {
          const teamA = CLUBS.find(c => c.id === m.teamA)?.name || m.teamA;
          const teamB = CLUBS.find(c => c.id === m.teamB)?.name || m.teamB;
          const stageName = m.stage === 'group' ? `Match ${m.matchNumber}` : (m.stage === 'semi' ? 'Semifinal' : 'Final');

          if ('Notification' in window && Notification.permission === 'granted') {
            try {
              new Notification('🔥 EFPL Match is LIVE!', {
                body: `${stageName}: ${teamA} vs ${teamB} has started! Check live scores now!`,
                icon: '/icon-192.png',
                tag: `live-match-${m.id}`,
                requireInteraction: true
              });
              triggeredAny = true;
            } catch (err) {
              console.error('Failed to trigger native notification', err);
            }
          }
          updatedTriggered.push(m.id);
        }
      });

      if (triggeredAny || updatedTriggered.length !== triggeredIds.length) {
        localStorage.setItem('efpl_triggered_live_notifs', JSON.stringify(updatedTriggered));
      }
    } catch (e) {
      console.warn('Notification watcher check failed', e);
    }
  }, [tournamentData.matches, tournamentData.loading]);

  const handleCloseChampion = () => {
    setShowChampion(false);
    localStorage.setItem('efpl_champion_shown_2026', 'true');
  };



  return (
    <div className="min-h-screen bg-brand-primary pb-[calc(112px+env(safe-area-inset-bottom,16px))] pl-[env(safe-area-inset-left)] pr-[env(safe-area-inset-right)] overflow-x-hidden selection:bg-brand-accent selection:text-white relative font-sans">
      
      {/* Sticky Top Navigation */}
      <div className="sticky top-0 w-full z-50 bg-brand-nav border-b border-brand-border px-4 py-3 pt-[calc(0.75rem+env(safe-area-inset-top))] shadow-sm">
        <div className="max-w-4xl mx-auto flex justify-between items-center">
          <div className="font-playfair font-black italic text-xl text-brand-dark tracking-tighter flex items-center gap-3">
            EFPL
            {hasLiveMatch && (
              <span className="flex items-center gap-1.5 text-brand-danger font-sans font-bold text-[9px] tracking-widest uppercase bg-brand-danger-surface px-2 py-0.5 rounded-sm border border-brand-danger-border animate-pulse">
                <span className="w-1.5 h-1.5 rounded-full bg-brand-danger"></span> Live
              </span>
            )}
            {loading && isSlow && (
              <span className="flex items-center gap-1.5 text-brand-accent font-sans font-medium text-[9px] tracking-widest uppercase animate-pulse ml-2">
                 Syncing...
              </span>
            )}
          </div>
          <div className="flex items-center">
            <ThemeToggle />
          </div>
        </div>
      </div>

      {isOffline && (
        <div className="w-full bg-[#111] text-[#A0A0A0] text-center font-sans tracking-widest text-[9px] uppercase py-1 border-b border-[#222]">
          Offline Mode
        </div>
      )}

      {loading ? (
        <div className="w-full max-w-4xl mx-auto pt-16 px-4">
           {/* Skeleton layout */}
           <div className="animate-pulse space-y-8">
             <div className="w-32 h-4 bg-brand-border mx-auto rounded" />
             <div className="w-64 h-12 bg-brand-border mx-auto rounded" />
             <div className="w-full max-w-2xl mx-auto h-40 bg-brand-surface border border-brand-border rounded-sm" />
             <div className="w-full max-w-2xl mx-auto grid grid-cols-2 gap-4">
                <div className="h-24 bg-brand-surface border border-brand-border rounded-sm" />
                <div className="h-24 bg-brand-surface border border-brand-border rounded-sm" />
             </div>
           </div>
        </div>
      ) : (
        <>
          <Ticker matches={tournamentData.matches} standings={tournamentData.standings} />

          {/* Dynamic Content Rendering */}
          <AnimatePresence mode="wait">
            <motion.main
              key={activeTab}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3, ease: 'easeOut' }}
              className={`w-full ${activeTab === 'home' || activeTab === 'standings' ? 'max-w-4xl' : 'max-w-2xl'} mx-auto relative z-10`}
            >
              {activeTab === 'home' && <Hero onNavigate={(t) => setActiveTab(t as Tab)} data={tournamentData} />}
              {activeTab === 'standings' && <Standings data={tournamentData} />}
              {activeTab === 'fixtures' && <Fixtures data={tournamentData} />}
              {activeTab === 'results' && <Results data={tournamentData} />}
              {activeTab === 'graph' && <Analytics data={tournamentData} />}
              {activeTab === 'stats' && <ClubStatsView data={tournamentData} />}
              {activeTab === 'clubs' && <Profiles data={tournamentData} />}
              {activeTab === 'rules' && <Rules rules={rulesData.rules} />}
              {activeTab === 'admin' && <AdminPanel data={tournamentData} rulesData={rulesData} />}
            </motion.main>
          </AnimatePresence>
        </>
      )}

      <AnimatePresence>
         {showChampion && championClub && (
           <ChampionScreen club={championClub} onClose={handleCloseChampion} />
         )}
      </AnimatePresence>

      <FloatingNav activeTab={activeTab} setActiveTab={setActiveTab} hasLiveMatch={hasLiveMatch} />
      <InstallPrompt />
    </div>
  );
}

