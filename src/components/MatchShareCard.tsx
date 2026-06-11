import { toPng, toBlob } from 'html-to-image';
import { useRef, useState } from 'react';
import { Match, getClub, ClubStats } from '../types';

export function MatchShareCard({ match, standings, onDismiss }: { match: Match, standings?: ClubStats[], onDismiss: () => void }) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  const teamA = getClub(match.teamA);
  const teamB = getClub(match.teamB);

  const generateImage = async (pixelRatio = 2) => {
    if (!cardRef.current) return null;
    setIsGenerating(true);
    try {
      const dataUrl = await toPng(cardRef.current, { quality: 1, pixelRatio });
      setIsGenerating(false);
      return dataUrl;
    } catch (e) {
      setIsGenerating(false);
      console.error(e);
      return null;
    }
  };

  const handleWhatsApp = () => {
    const hasPenalties = match.penaltyScoreA !== null && match.penaltyScoreB !== null;
    let message = `⚽ EFPL SEASON 2026\n\n${teamA.name} ${match.scoreA} — ${match.scoreB} ${teamB.name}\n`;
    if (hasPenalties) {
      const aWon = match.penaltyScoreA! > match.penaltyScoreB!;
      message += `🏆 Won on penalties by ${aWon ? teamA.name : teamB.name} (${match.penaltyScoreA} - ${match.penaltyScoreB})\n`;
    }
    if (standings && standings.length > 0) {
      message += `\n📊 Latest Standings:\n`;
      standings.slice(0, 5).forEach((s, i) => {
        message += `${i + 1}. ${getClub(s.clubId).shortName} — ${s.points} pts\n`;
      });
    }
    message += `\n🏆 More Than A Match\n#EFPL2026 #eFootball`;
    const url = `https://wa.me/?text=${encodeURIComponent(message)}`;
    window.open(url, '_blank');
  };

  const handleInstagram = async () => {
    const dataUrl = await generateImage(3); // Higher res for story
    if (!dataUrl) return;
    
    try {
      const blob = await (await fetch(dataUrl)).blob();
      const file = new File([blob], `efpl-story-${match.id}.png`, { type: 'image/png' });
      
      if (navigator.share && navigator.canShare({ files: [file] })) {
        await navigator.share({
          files: [file],
          title: 'EFPL Result',
        });
      } else {
        handleDownload(dataUrl);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleDownload = async (existingDataUrl?: string) => {
    const dataUrl = existingDataUrl || await generateImage(2);
    if (!dataUrl) return;
    const link = document.createElement('a');
    link.download = `efpl-result-${match.id}.png`;
    link.href = dataUrl;
    link.click();
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    alert('Link copied to clipboard!');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm flex-col">
      <div 
        className="w-full h-full fixed inset-0"
        onClick={onDismiss}
      />
      <div className="flex flex-col items-center relative z-10 w-full max-w-sm mx-auto">
        
        {/* Hidden Rendered Card (Used for capturing) */}
        {/* We place it off-screen to generate 1080x1080 precisely */}
        <div className="fixed -top-[2000px] left-0 pointer-events-none">
          <div 
            ref={cardRef} 
            className="bg-[#111111] border border-[#222] p-8 flex flex-col items-center justify-center text-center relative overflow-hidden"
            style={{ width: "1080px", height: "1080px" }}
          >
            <div className="absolute top-0 left-0 w-full h-[4px] bg-[#C8A84B]" />
            <div className="absolute bottom-0 left-0 w-full h-[4px] bg-[#C8A84B]" />

            <h2 className="font-playfair text-white text-[80px] italic tracking-tighter mb-4">EFPL</h2>
            <span className="text-[#C8A84B] font-sans font-bold text-[16px] tracking-[0.6em] uppercase mb-20">SEASON 2026</span>

            <div className="flex justify-between items-center w-full px-20 mb-20">
              <div className="flex flex-col items-center gap-6">
                <div className="w-[200px] h-[200px] rounded-full border-4 flex justify-center items-center font-bold text-6xl" style={{ borderColor: teamA.color, color: teamA.color }}>{teamA.shortName}</div>
                <div className="flex flex-col items-center">
                  <span className="font-sans font-bold text-white text-3xl mb-2">{teamA.name}</span>
                  <span className="font-sans text-[#888] text-xl">{teamA.owner}</span>
                </div>
              </div>
              
              <div className="flex space-x-8 px-10 items-center relative">
                <div className="flex flex-col items-center">
                   <span className="font-mono text-[160px] font-bold text-white leading-none">{match.scoreA}</span>
                   {match.penaltyScoreA !== null && (
                     <span className="text-[#C8A84B] font-mono text-[40px] font-bold mt-2">({match.penaltyScoreA})</span>
                   )}
                </div>
                <span className="font-sans text-[#444] text-[80px] leading-none -mt-4">-</span>
                <div className="flex flex-col items-center">
                   <span className="font-mono text-[160px] font-bold text-white leading-none">{match.scoreB}</span>
                   {match.penaltyScoreB !== null && (
                     <span className="text-[#C8A84B] font-mono text-[40px] font-bold mt-2">({match.penaltyScoreB})</span>
                   )}
                </div>
              </div>
              
              <div className="flex flex-col items-center gap-6">
                <div className="w-[200px] h-[200px] rounded-full border-4 flex justify-center items-center font-bold text-6xl" style={{ borderColor: teamB.color, color: teamB.color }}>{teamB.shortName}</div>
                <div className="flex flex-col items-center">
                  <span className="font-sans font-bold text-white text-3xl mb-2">{teamB.name}</span>
                  <span className="font-sans text-[#888] text-xl">{teamB.owner}</span>
                </div>
              </div>
            </div>

            <div className="absolute bottom-16 w-full flex flex-col items-center">
              <span className="text-[#666] font-sans font-bold text-[18px] tracking-[0.3em] uppercase mb-2">MATCH {match.matchNumber}</span>
              <span className="text-[#C8A84B] font-playfair italic text-[24px] uppercase mb-4 tracking-[0.2em]">More Than A Match</span>
            </div>
          </div>
        </div>

        {/* Bottom Sheet UI */}
        <div className="w-full bg-white dark:bg-[#1A1A1A] rounded-md overflow-hidden box-shadow-editorial mt-auto mb-4 border border-brand-border">
          <div className="flex justify-between items-center p-4 border-b border-brand-border">
            <h3 className="font-sans font-bold text-brand-dark text-xs uppercase tracking-widest text-[#C8A84B]">Share Result</h3>
            <button onClick={onDismiss} className="text-brand-gray hover:text-brand-dark p-1">✕</button>
          </div>
          
          <div className="p-4 flex flex-col gap-3">
            <button onClick={handleWhatsApp} className="w-full flex items-center justify-center gap-3 bg-[#25D366] text-white font-sans font-bold py-3 px-4 rounded-sm hover:opacity-90 transition-opacity">
              <span>WhatsApp</span>
            </button>
            <button onClick={handleInstagram} disabled={isGenerating} className="w-full flex items-center justify-center gap-3 bg-gradient-to-r from-[#833AB4] via-[#FD1D1D] to-[#F56040] text-white font-sans font-bold py-3 px-4 rounded-sm hover:opacity-90 transition-opacity">
              <span>{isGenerating ? 'Generating...' : 'Instagram Story'}</span>
            </button>
            <button onClick={() => handleDownload()} disabled={isGenerating} className="w-full flex items-center justify-center gap-3 border border-[#C8A84B] text-[#C8A84B] font-sans font-bold py-3 px-4 rounded-sm hover:bg-[#C8A84B] hover:text-white transition-colors">
              <span>{isGenerating ? 'Wait...' : 'Download PNG'}</span>
            </button>
            <button onClick={handleCopyLink} className="w-full flex items-center justify-center gap-3 border border-brand-border text-brand-gray font-sans font-bold py-3 px-4 rounded-sm hover:text-brand-dark hover:border-brand-gray transition-colors">
              <span>Copy Link</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
