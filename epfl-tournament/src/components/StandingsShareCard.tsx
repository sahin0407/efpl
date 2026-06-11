import { toPng } from 'html-to-image';
import { useRef, useState } from 'react';
import { ClubStats, getClub } from '../types';

export function StandingsShareCard({ standings, onDismiss }: { standings: ClubStats[], onDismiss: () => void }) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [isGenerating, setIsGenerating] = useState(false);

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
    let message = `⚽ EFPL SEASON 2026\n\n📊 Latest Standings:\n`;
    standings.forEach((s, i) => {
      message += `${i + 1}. ${getClub(s.clubId).shortName} — ${s.points} pts\n`;
    });
    message += `\n🏆 More Than A Match\n#EFPL2026 #eFootball`;
    const url = `https://wa.me/?text=${encodeURIComponent(message)}`;
    window.open(url, '_blank');
  };

  const handleInstagram = async () => {
    const dataUrl = await generateImage(3);
    if (!dataUrl) return;
    try {
      const blob = await (await fetch(dataUrl)).blob();
      const file = new File([blob], `efpl-standings.png`, { type: 'image/png' });
      if (navigator.share && navigator.canShare({ files: [file] })) {
        await navigator.share({ files: [file], title: 'EFPL Standings' });
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
    link.download = `efpl-standings.png`;
    link.href = dataUrl;
    link.click();
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    alert('Link copied to clipboard!');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm flex-col">
      <div className="w-full h-full fixed inset-0" onClick={onDismiss} />
      <div className="flex flex-col items-center relative z-10 w-full max-w-sm mx-auto">
        
        <div className="fixed -top-[2000px] left-0 pointer-events-none">
          <div 
            ref={cardRef} 
            className="bg-[#111111] border border-[#222] p-12 flex flex-col items-center relative overflow-hidden"
            style={{ width: "1080px", height: "1080px" }}
          >
            <div className="absolute top-0 left-0 w-full h-[4px] bg-[#C8A84B]" />
            <div className="absolute bottom-0 left-0 w-full h-[4px] bg-[#C8A84B]" />

            <h2 className="font-playfair text-white text-[60px] italic tracking-tighter mb-2">EFPL</h2>
            <span className="text-[#C8A84B] font-sans font-bold text-[14px] tracking-[0.6em] uppercase mb-12">LATEST STANDINGS</span>

            <div className="w-full flex-1">
               {standings.map((stat, i) => {
                 const club = getClub(stat.clubId);
                 return (
                   <div key={club.id} className="flex items-center justify-between py-6 border-b border-[#333]">
                     <div className="flex items-center gap-8">
                       <span className="font-mono text-white text-4xl w-12 text-center opacity-50">{i + 1}</span>
                       <div className="w-20 h-20 rounded-full border-2 flex justify-center items-center font-bold text-xl" style={{ borderColor: club.color, color: club.color }}>{club.shortName}</div>
                       <span className="font-sans font-bold text-white text-4xl">{club.name}</span>
                     </div>
                     <div className="flex items-center gap-12">
                       <div className="flex flex-col items-center">
                         <span className="text-[#888] font-sans text-lg uppercase tracking-widest mb-1">PL</span>
                         <span className="text-white font-mono text-4xl">{stat.played}</span>
                       </div>
                       <div className="flex flex-col items-center">
                         <span className="text-[#888] font-sans text-lg uppercase tracking-widest mb-1">GD</span>
                         <span className="text-white font-mono text-4xl">{stat.goalDifference > 0 ? `+${stat.goalDifference}` : stat.goalDifference}</span>
                       </div>
                       <div className="flex flex-col items-center">
                         <span className="text-[#C8A84B] font-sans text-lg uppercase tracking-widest mb-1 font-bold">PTS</span>
                         <span className="text-[#C8A84B] font-mono text-5xl font-bold">{stat.points}</span>
                       </div>
                     </div>
                   </div>
                 )
               })}
            </div>

            <div className="absolute bottom-12 w-full flex flex-col items-center">
              <span className="text-[#C8A84B] font-playfair italic text-[24px] uppercase tracking-[0.2em]">More Than A Match</span>
            </div>
          </div>
        </div>

        <div className="w-full bg-white dark:bg-[#1A1A1A] rounded-md overflow-hidden box-shadow-editorial mt-auto mb-4 border border-brand-border">
          <div className="flex justify-between items-center p-4 border-b border-brand-border">
            <h3 className="font-sans font-bold text-brand-dark text-xs uppercase tracking-widest text-[#C8A84B]">Share Standings</h3>
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
