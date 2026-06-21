import { Match, getClub } from '../types';

export function BiggestWinCard({ matches }: { matches: Match[] }) {
  let biggestWinScore = 0;
  let biggestWinMatch: Match | null = null;
  
  matches.filter(m => m.isCompleted).forEach(m => {
    const diff = Math.abs(m.scoreA! - m.scoreB!);
    if (diff > biggestWinScore) {
      biggestWinScore = diff;
      biggestWinMatch = m;
    }
  });

  if (!biggestWinMatch || biggestWinScore === 0) return null;

  return (
    <div className="w-full max-w-2xl mx-auto px-4 mt-6 mb-6">
      <div className="bg-brand-surface relative py-6 px-4 text-center shadow-[0_4px_20px_rgba(124,58,237,0.05)]">
        <div className="absolute top-0 left-0 w-full h-[2px] bg-accent-gradient" />
        <h3 className="text-cyber-pink text-[10px] font-sans font-bold tracking-[0.25em] uppercase mb-4">BIGGEST WIN OF THE SEASON</h3>
        
        <div className="flex items-center justify-center gap-4">
          <span className="font-sans font-bold text-sm text-brand-text flex-1 text-right">{getClub(biggestWinMatch.teamA).name}</span>
          <div className="flex items-center gap-3">
             <span className="font-mono text-2xl font-bold text-cyber-cyan">{biggestWinMatch.scoreA}</span>
             <span className="font-mono text-md text-brand-muted">-</span>
             <span className="font-mono text-2xl font-bold text-cyber-cyan">{biggestWinMatch.scoreB}</span>
          </div>
          <span className="font-sans font-bold text-sm text-brand-text flex-1 text-left">{getClub(biggestWinMatch.teamB).name}</span>
        </div>
      </div>
    </div>
  );
}
