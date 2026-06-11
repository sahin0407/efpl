import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Match, getClub, CLUBS } from '../types';

export function LiveMatchControl({
  matches,
  setMatchLive,
  updateLiveScore,
  updateMatchResult,
  onShootoutComplete
}: {
  matches: Match[];
  setMatchLive: (matchId: string, isLive: boolean) => void;
  updateLiveScore: (matchId: string, scoreA: number, scoreB: number) => void;
  updateMatchResult: (matchId: string, scoreA: number, scoreB: number, pA?: number, pB?: number) => void;
  onShootoutComplete?: (id: string) => void;
}) {
  const [selectedMatchId, setSelectedMatchId] = useState('');
  
  const liveMatch = matches.find(m => m.isLive);
  const upcomingMatches = matches.filter(m => !m.isCompleted && !m.isLive && m.teamA !== 'tbd' && m.teamB !== 'tbd');

  const [scoreA, setScoreA] = useState('');
  const [scoreB, setScoreB] = useState('');

  const [shootoutMode, setShootoutMode] = useState(false);
  const [penaltyA, setPenaltyA] = useState('');
  const [penaltyB, setPenaltyB] = useState('');

  // Sync inputs with live match
  useEffect(() => {
    if (liveMatch) {
      setScoreA(liveMatch.scoreA !== null ? String(liveMatch.scoreA) : '0');
      setScoreB(liveMatch.scoreB !== null ? String(liveMatch.scoreB) : '0');
    }
  }, [liveMatch?.id]);

  const handleGoLive = () => {
    if (selectedMatchId) {
      setMatchLive(selectedMatchId, true);
      setSelectedMatchId('');
    }
  };

  const handleUpdate = () => {
    if (liveMatch && scoreA !== '' && scoreB !== '') {
      updateLiveScore(liveMatch.id, parseInt(scoreA, 10), parseInt(scoreB, 10));
    }
  };

  const handleEndMatch = () => {
    if (!liveMatch) return;
    const sA = parseInt(scoreA, 10);
    const sB = parseInt(scoreB, 10);

    // If knockout and draw, enter shootout mode
    if ((liveMatch.stage === 'semi' || liveMatch.stage === 'final') && sA === sB && !shootoutMode) {
      setShootoutMode(true);
      return;
    }

    if (shootoutMode) {
      const pA = parseInt(penaltyA, 10);
      const pB = parseInt(penaltyB, 10);
      if (isNaN(pA) || isNaN(pB)) return;
      updateMatchResult(liveMatch.id, sA, sB, pA, pB);
      if (pA > pB) {
        onShootoutComplete?.(liveMatch.teamA);
      } else {
        onShootoutComplete?.(liveMatch.teamB);
      }
      setShootoutMode(false);
      setPenaltyA('');
      setPenaltyB('');
      triggerConfetti();
    } else {
      updateMatchResult(liveMatch.id, sA, sB);
    }
  };

  const handleCancelLive = () => {
    if (liveMatch) {
      setMatchLive(liveMatch.id, false);
      setShootoutMode(false);
    }
  };

  const triggerConfetti = () => {
     import('canvas-confetti').then((confetti) => {
       confetti.default({
         particleCount: 100,
         spread: 70,
         origin: { y: 0.6 },
         colors: ['#C8A84B', '#ffffff']
       });
     });
  };

  if (liveMatch) {
    const clubA = getClub(liveMatch.teamA);
    const clubB = getClub(liveMatch.teamB);

    return (
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="bg-brand-surface p-6 md:p-8 relative overflow-hidden mb-10 border border-[#C8A84B] rounded-sm box-shadow-editorial shadow-[0_0_20px_rgba(200,168,75,0.2)]"
      >
        <div className="flex justify-between items-center mb-8">
          <h3 className="font-playfair italic text-2xl text-brand-dark tracking-tight">Live Match Control</h3>
          <span className="flex items-center gap-2 text-brand-danger font-sans font-bold text-[10px] tracking-widest uppercase animate-pulse">
            <span className="w-2 h-2 rounded-full bg-brand-danger"></span> Live
          </span>
        </div>

        <div className="flex items-center justify-between gap-6 pt-2">
          <div className="flex-1">
            <span className="block text-[9px] font-sans font-bold uppercase tracking-[0.2em] text-[#A0A0A0] mb-2 truncate">
              {clubA.name}
            </span>
            <input 
              type="number" 
              value={scoreA}
              onChange={(e) => setScoreA(e.target.value)}
              className="w-full bg-transparent border-b border-brand-border py-2 text-4xl text-center font-mono focus:outline-none focus:border-brand-accent focus:bg-brand-input-focus rounded-none"
            />
          </div>
          <div className="font-sans text-[#A0A0A0] self-center text-xs pt-6">—</div>
          <div className="flex-1 text-right">
            <span className="block text-[9px] font-sans font-bold uppercase tracking-[0.2em] text-[#A0A0A0] mb-2 truncate text-right">
              {clubB.name}
            </span>
            <input 
              type="number" 
              value={scoreB}
              onChange={(e) => setScoreB(e.target.value)}
              className="w-full bg-transparent border-b border-brand-border py-2 text-4xl text-center font-mono focus:outline-none focus:border-brand-accent focus:bg-brand-input-focus rounded-none"
            />
          </div>
        </div>

        {shootoutMode && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="mt-8 p-4 border border-brand-accent bg-brand-standings-alt">
            <p className="text-[11px] font-sans text-brand-dark uppercase tracking-widest mb-4 font-bold text-center">Match ended in a draw.<br/>Enter penalty shootout result:</p>
            <div className="flex items-center justify-center gap-6">
               <div className="flex flex-col items-center">
                 <span className="text-[9px] uppercase tracking-widest mb-1 text-brand-gray">{clubA.shortName} Pens</span>
                 <input type="number" value={penaltyA} onChange={e => setPenaltyA(e.target.value)} className="w-16 bg-transparent border-b border-brand-accent py-1 text-2xl text-center font-mono focus:outline-none" />
               </div>
               <div className="flex flex-col items-center">
                 <span className="text-[9px] uppercase tracking-widest mb-1 text-brand-gray">{clubB.shortName} Pens</span>
                 <input type="number" value={penaltyB} onChange={e => setPenaltyB(e.target.value)} className="w-16 bg-transparent border-b border-brand-accent py-1 text-2xl text-center font-mono focus:outline-none" />
               </div>
            </div>
            <button onClick={handleEndMatch} className="w-full mt-6 bg-[#C8A84B] text-white font-sans font-bold uppercase tracking-[0.2em] text-[10px] rounded-sm py-4 transition-opacity hover:opacity-80">
              CONFIRM SHOOTOUT WINNER
            </button>
          </motion.div>
        )}

        <div className="mt-8 flex flex-col gap-3">
          {!shootoutMode && (
            <>
              <button onClick={handleUpdate} className="w-full border border-[#C8A84B] text-[#C8A84B] font-sans font-bold uppercase tracking-[0.2em] text-[10px] rounded-sm py-3 transition-colors hover:bg-[#C8A84B] hover:text-white">
                Update Score
              </button>
              <button onClick={handleEndMatch} className="w-full border border-brand-danger-border text-brand-danger bg-brand-danger-surface font-sans font-bold uppercase tracking-[0.2em] text-[10px] rounded-sm py-3 transition-colors hover:bg-brand-danger hover:text-white">
                End Match
              </button>
            </>
          )}
          <button onClick={handleCancelLive} className="w-full border border-brand-border text-brand-gray font-sans font-bold uppercase tracking-[0.2em] text-[10px] rounded-sm py-3 transition-colors hover:text-brand-dark">
            Cancel Live
          </button>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="bg-brand-surface p-6 md:p-8 relative overflow-hidden mb-10 border border-brand-border rounded-sm box-shadow-editorial"
    >
      <h3 className="font-playfair italic text-2xl text-brand-dark tracking-tight mb-6">Live Match</h3>
      
      {upcomingMatches.length === 0 ? (
        <div className="text-center py-4">
          <span className="text-brand-gray font-sans font-bold text-xs uppercase tracking-widest">NO UPCOMING MATCHES</span>
        </div>
      ) : (
        <div className="space-y-6">
          <select 
            value={selectedMatchId}
            onChange={(e) => setSelectedMatchId(e.target.value)}
            className="w-full bg-transparent border-b border-brand-border pb-3 text-brand-dark focus:outline-none focus:border-brand-accent focus:bg-brand-input-focus appearance-none font-sans text-sm rounded-none"
          >
            <option value="" disabled>Select Fixture to Go Live</option>
            {upcomingMatches.map((m: Match) => (
              <option key={m.id} value={m.id}>
                {m.stage === 'group' ? `Match ${m.matchNumber}` : m.stage.toUpperCase()} — {getClub(m.teamA).name} vs {getClub(m.teamB).name}
              </option>
            ))}
          </select>
          
          <button 
            onClick={handleGoLive}
            disabled={!selectedMatchId}
            className={`w-full font-sans font-bold uppercase tracking-[0.2em] text-[10px] rounded-sm py-4 transition-colors flex justify-center items-center gap-2 ${
              selectedMatchId ? 'bg-[#C8A84B] text-white hover:bg-opacity-90 animate-pulse' : 'bg-brand-surface border border-brand-muted text-[#A0A0A0] cursor-not-allowed'
            }`}
          >
            GO LIVE
          </button>
        </div>
      )}
    </motion.div>
  );
}
