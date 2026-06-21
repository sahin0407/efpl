import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Lock, Unlock, CheckCircle2, ChevronDown, ChevronUp } from 'lucide-react';
import { Match, CLUBS } from '../types';
import { MatchShareCard } from './MatchShareCard';
import { AvatarManagement } from './AvatarManagement';
import { BannerManagement } from './BannerManagement';
import { MatchSchedule } from './MatchSchedule';

import { LiveMatchControl } from './LiveMatchControl';
import { RulesAdmin } from './RulesAdmin';
import { TickerAdmin } from './TickerAdmin';
import { HeroLogoAdmin } from './HeroLogoAdmin';

function CollapsibleSection({ title, children, defaultOpen = false, danger = false }: { title: string, children: React.ReactNode, defaultOpen?: boolean, danger?: boolean }) {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  return (
    <div className={`bg-brand-surface mb-6 overflow-hidden rounded-sm box-shadow-editorial ${danger ? 'border-l-[3px] border-l-brand-danger border-t border-r border-b border-brand-border' : 'border border-brand-border'}`}>
      <button 
        type="button" 
        onClick={() => setIsOpen(!isOpen)} 
        className="w-full flex items-center justify-between p-6 focus:outline-none"
      >
        <h3 className={`font-sans font-bold text-[10px] tracking-[0.2em] uppercase ${danger ? 'text-brand-danger' : 'text-[#A0A0A0]'}`}>{title}</h3>
        {isOpen ? <ChevronUp size={16} className={danger ? 'text-brand-danger' : 'text-brand-muted'} /> : <ChevronDown size={16} className={danger ? 'text-brand-danger' : 'text-brand-muted'} />}
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ height: 0, opacity: 0 }} 
            animate={{ height: 'auto', opacity: 1 }} 
            exit={{ height: 0, opacity: 0 }} 
            className="border-t border-brand-border"
          >
            <div className="p-6 pt-2">
              {children}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function AdminPanel({ data, rulesData, onShootoutComplete }: { data: any, rulesData: any, onShootoutComplete?: (id: string) => void }) {
  const { matches, updateMatchResult, setMatchLive, updateLiveScore, resetTournament, nextMatchDate, setNextMatchDate } = data;
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  
  // Input states
  const [selectedMatchId, setSelectedMatchId] = useState('');
  const [scoreA, setScoreA] = useState('');
  const [scoreB, setScoreB] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);
  const [syncing, setSyncing] = useState(false);
  
  const [sharedMatch, setSharedMatch] = useState<Match | null>(null);

  // Next match date state
  const [dateInput, setDateInput] = useState(() => nextMatchDate ? new Date(nextMatchDate).toISOString().slice(0, 16) : '');
  const [dateSuccess, setDateSuccess] = useState(false);

  const upcomingMatches = matches.filter((m: Match) => !m.isCompleted && m.teamB !== 'tbd' && m.teamA !== 'tbd');

  const getClub = (id: string) => CLUBS.find(c => c.id === id)!;

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === '@EFPL2026') {
      setIsAuthenticated(true);
      setError('');
    } else {
      setError('Incorrect password');
      setPassword('');
    }
  };

  const [shootoutMode, setShootoutMode] = useState(false);
  const [penaltyA, setPenaltyA] = useState('');
  const [penaltyB, setPenaltyB] = useState('');

  const handleSubmitResult = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedMatchId || scoreA === '' || scoreB === '') return;

    setSyncing(true);
    const match = matches.find((m: Match) => m.id === selectedMatchId);
    if (!match) return;

    const sA = parseInt(scoreA, 10);
    const sB = parseInt(scoreB, 10);

    if ((match.stage === 'semi' || match.stage === 'final') && sA === sB && !shootoutMode) {
      setShootoutMode(true);
      setSyncing(false);
      return;
    }

    if (shootoutMode) {
      const pA = parseInt(penaltyA, 10);
      const pB = parseInt(penaltyB, 10);
      if (isNaN(pA) || isNaN(pB)) return;
      await updateMatchResult(selectedMatchId, sA, sB, pA, pB);
      if (pA > pB) {
        onShootoutComplete?.(match.teamA);
      } else {
        onShootoutComplete?.(match.teamB);
      }
      import('canvas-confetti').then((confetti) => {
        confetti.default({ particleCount: 100, spread: 70, origin: { y: 0.6 }, colors: ['#C8A84B', '#ffffff'] });
      });
      setSharedMatch({ ...match, scoreA: sA, scoreB: sB, penaltyScoreA: pA, penaltyScoreB: pB } as Match);
    } else {
      await updateMatchResult(selectedMatchId, sA, sB);
      setSharedMatch({ ...match, scoreA: sA, scoreB: sB } as Match);
    }

    // Reset form & show success
    setSelectedMatchId('');
    setScoreA('');
    setScoreB('');
    setPenaltyA('');
    setPenaltyB('');
    setShootoutMode(false);
    setSyncing(false);
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 2000);
  };

  const handleMatchSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedMatchId(e.target.value);
    setShootoutMode(false);
    setScoreA('');
    setScoreB('');
    setPenaltyA('');
    setPenaltyB('');
  };

  const handleSaveDate = (e: React.FormEvent) => {
    e.preventDefault();
    setNextMatchDate(dateInput ? new Date(dateInput).toISOString() : null);
    setDateSuccess(true);
    setTimeout(() => setDateSuccess(false), 2000);
  };

  if (!isAuthenticated) {
    return (
      <div className="pt-20 px-6 flex flex-col items-center justify-center min-h-[70vh]">
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.25 }}
          className="bg-brand-surface p-8 w-full max-w-sm text-center border border-brand-border box-shadow-editorial rounded-sm"
        >
          <div className="mx-auto text-brand-dark mb-6 flex justify-center">
            <Lock size={20} strokeWidth={1.5} />
          </div>
          <h2 className="font-playfair italic text-3xl mb-1 text-brand-dark">Admin Access</h2>
          <p className="text-[9px] text-[#A0A0A0] uppercase tracking-[0.25em] font-sans font-bold mb-8">Secure Terminal</p>
          
          <form onSubmit={handleLogin} className="space-y-4">
            <input 
              type="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              className="w-full bg-transparent border-b border-brand-border pb-2 text-center text-brand-dark font-sans text-sm focus:outline-none focus:border-brand-accent focus:bg-brand-input-focus transition-colors"
            />
            {error && <p className="text-brand-danger text-[10px] font-sans uppercase tracking-widest pt-2">{error}</p>}
            <p className="text-[#999999] text-[10px] italic font-playfair font-medium pt-1">Authorized personnel only</p>
            <button 
              type="submit"
              className="w-full bg-[#111111] dark:bg-brand-accent border border-brand-accent text-white dark:text-[#0a0a0a] font-sans text-[10px] font-bold uppercase tracking-[0.2em] rounded-sm py-4 mt-4 transition-opacity hover:opacity-80"
            >
              Unlock
            </button>
          </form>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="pt-12 px-4 pb-12 w-full max-w-2xl mx-auto">
      <div className="mb-8 flex justify-between items-end border-b border-brand-border pb-4">
        <div>
          <span className="text-[10px] text-brand-accent font-sans font-bold tracking-[0.25em] uppercase mb-1 block flex items-center gap-2">
            <Unlock size={10} strokeWidth={2} /> Authenticated
          </span>
          <h2 className="font-playfair text-5xl italic text-brand-dark tracking-tight">
             Terminal
          </h2>
        </div>
        <button 
          onClick={() => setIsAuthenticated(false)}
          className="text-[9px] uppercase font-sans font-bold tracking-[0.2em] text-[#A0A0A0] hover:text-brand-dark transition-colors pb-1"
        >
          Logout
        </button>
      </div>

      <CollapsibleSection title="Match Control (Live)" defaultOpen={true}>
        <LiveMatchControl 
          matches={matches} 
          setMatchLive={setMatchLive} 
          updateLiveScore={updateLiveScore} 
          updateMatchResult={updateMatchResult} 
          onShootoutComplete={onShootoutComplete}
        />
      </CollapsibleSection>

      <CollapsibleSection title="Match Results" defaultOpen={true}>
        {upcomingMatches.length === 0 ? (
          <div className="text-center py-6">
            <span className="text-brand-gray font-sans font-bold text-xs uppercase tracking-widest">STAGES COMPLETE</span>
          </div>
        ) : (
          <form onSubmit={handleSubmitResult} className="space-y-8">
            <div>
              <select 
                value={selectedMatchId}
                onChange={(e) => setSelectedMatchId(e.target.value)}
                className="w-full bg-transparent border-b border-brand-border pb-3 text-brand-dark focus:outline-none focus:border-brand-accent focus:bg-brand-input-focus appearance-none font-sans text-sm rounded-none"
                required
              >
                <option value="" disabled>Select Fixture</option>
                {upcomingMatches.map((m: Match) => (
                  <option key={m.id} value={m.id}>
                    {m.stage === 'group' ? `Match ${m.matchNumber}` : m.stage.toUpperCase()} — {getClub(m.teamA).name} vs {getClub(m.teamB).name}
                  </option>
                ))}
              </select>
            </div>

            {selectedMatchId && (
              <motion.div initial={{opacity:0}} animate={{opacity:1}} transition={{duration: 0.2}} className="flex items-center justify-between gap-6 pt-2">
                <div className="flex-1">
                  <span className="block text-[9px] font-sans font-bold uppercase tracking-[0.2em] text-[#A0A0A0] mb-2 truncate">
                    {getClub(upcomingMatches.find((m:Match) => m.id === selectedMatchId)!.teamA).name}
                  </span>
                  <input 
                    type="number" 
                    min="0"
                    value={scoreA}
                    onChange={(e) => setScoreA(e.target.value)}
                    className="w-full bg-transparent border-b border-brand-border py-2 text-3xl font-mono focus:outline-none focus:border-brand-accent focus:bg-brand-input-focus rounded-none"
                    required
                  />
                </div>
                <div className="font-sans text-[#A0A0A0] self-center text-xs pt-6">VS</div>
                <div className="flex-1 text-right">
                  <span className="block text-[9px] font-sans font-bold uppercase tracking-[0.2em] text-[#A0A0A0] mb-2 truncate">
                    {getClub(upcomingMatches.find((m:Match) => m.id === selectedMatchId)!.teamB).name}
                  </span>
                  <input 
                    type="number" 
                    min="0"
                    value={scoreB}
                    onChange={(e) => setScoreB(e.target.value)}
                    disabled={shootoutMode}
                    className="w-full bg-transparent border-b border-brand-border py-2 text-right text-3xl font-mono focus:outline-none focus:border-brand-accent focus:bg-brand-input-focus rounded-none disabled:opacity-50"
                    required
                  />
                </div>
              </motion.div>
            )}

            {shootoutMode && (
              <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="pt-6 border border-brand-accent bg-brand-standings-alt p-4 mt-6">
                <p className="text-[11px] font-sans text-brand-dark uppercase tracking-widest mb-4 font-bold text-center">Match ended in a draw.<br/>Enter penalty shootout result:</p>
                <div className="flex items-center justify-center gap-6">
                  <div className="flex flex-col items-center">
                    <span className="text-[9px] uppercase tracking-widest mb-1 text-brand-gray">{getClub(upcomingMatches.find((m:Match) => m.id === selectedMatchId)!.teamA).shortName} Pens</span>
                    <input type="number" required value={penaltyA} onChange={e => setPenaltyA(e.target.value)} className="w-16 bg-transparent border-b border-brand-accent py-1 text-2xl text-center font-mono focus:outline-none" />
                  </div>
                  <div className="flex flex-col items-center">
                    <span className="text-[9px] uppercase tracking-widest mb-1 text-brand-gray">{getClub(upcomingMatches.find((m:Match) => m.id === selectedMatchId)!.teamB).shortName} Pens</span>
                    <input type="number" required value={penaltyB} onChange={e => setPenaltyB(e.target.value)} className="w-16 bg-transparent border-b border-brand-accent py-1 text-2xl text-center font-mono focus:outline-none" />
                  </div>
                </div>
              </motion.div>
            )}

            <button 
              type="submit"
              disabled={syncing}
              className="w-full bg-brand-dark text-white font-sans font-bold uppercase tracking-[0.2em] text-[10px] rounded-sm py-4 transition-opacity hover:opacity-80 mt-6 flex justify-center items-center gap-2 disabled:opacity-50"
            >
              {showSuccess ? <CheckCircle2 size={14} strokeWidth={2} /> : null}
              {syncing ? 'SYNCING...' : (showSuccess ? '✓ SYNCED' : (shootoutMode ? 'CONFIRM SHOOTOUT WINNER' : 'ENTER RESULT'))}
            </button>
            {showSuccess && <p className="text-brand-accent text-center font-sans tracking-widest text-[9px] uppercase mt-4">Result recorded successfully</p>}
          </form>
        )}
      </CollapsibleSection>

      <CollapsibleSection title="Match Schedule">
        <MatchSchedule matches={matches} updateMatchDate={data.updateMatchDate} />
      </CollapsibleSection>

      <CollapsibleSection title="Avatar Management">
        <AvatarManagement />
      </CollapsibleSection>

      <CollapsibleSection title="Club Banners">
        <BannerManagement />
      </CollapsibleSection>

      <CollapsibleSection title="Rules Editor">
        <RulesAdmin rules={rulesData.rules} setRules={rulesData.setRules} />
      </CollapsibleSection>
      
      <CollapsibleSection title="Ticker Editor">
        <TickerAdmin />
      </CollapsibleSection>

      <CollapsibleSection title="Hero Logo">
        <HeroLogoAdmin />
      </CollapsibleSection>

      <CollapsibleSection title="Danger Zone" danger={true}>
         <p className="text-[11px] text-brand-gray font-sans mb-5">This action cannot be undone. All match history, results, and settings will be permanently erased.</p>
         <button
           onClick={() => {
             if (window.confirm("Are you sure? This will wipe all tournament data!")) {
               if (window.confirm("ARE YOU ABSOLUTELY SURE? Everything will be lost.")) {
                 resetTournament();
               }
             }
           }}
           className="w-full border border-brand-danger-border text-brand-danger bg-brand-danger-surface font-sans font-bold uppercase tracking-[0.2em] text-[9px] rounded-sm py-3 transition-colors hover:bg-brand-danger hover:text-white"
         >
           Reset Tournament
         </button>
      </CollapsibleSection>

      {sharedMatch && (
        <MatchShareCard match={sharedMatch} standings={data.standings} onDismiss={() => setSharedMatch(null)} />
      )}
    </div>
  );
}
