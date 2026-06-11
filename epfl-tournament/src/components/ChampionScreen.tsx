import { motion } from 'motion/react';
import { Club } from '../types';
import { useEffect } from 'react';
import confetti from 'canvas-confetti';

export default function ChampionScreen({ club, onClose }: { club: Club, onClose: () => void }) {
  
  useEffect(() => {
    const duration = 5 * 1000;
    const end = Date.now() + duration;

    const frame = () => {
      confetti({
        particleCount: 5,
        angle: 60,
        spread: 55,
        origin: { x: 0 },
        colors: ['#C8A84B', '#FFFFFF']
      });
      confetti({
        particleCount: 5,
        angle: 120,
        spread: 55,
        origin: { x: 1 },
        colors: ['#C8A84B', '#FFFFFF']
      });

      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    };
    frame();
  }, []);

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-[#000000] px-4"
    >
      <motion.div
         initial={{ scale: 0.9, opacity: 0, y: 20 }}
         animate={{ scale: 1, opacity: 1, y: 0 }}
         transition={{ type: "spring", stiffness: 200, damping: 20, delay: 0.2 }}
         className="relative z-10 text-center flex flex-col items-center"
      >
        <span className="text-8xl mb-8">🏆</span>
        
        <h2 className="text-[#C8A84B] font-playfair italic text-4xl mb-4">
          EFPL CHAMPION
        </h2>

        <span className="text-[#A0A0A0] font-sans font-bold text-[10px] tracking-[0.3em] uppercase mb-12">
          SEASON 2026
        </span>
        
        <h1 className="font-playfair italic font-medium text-7xl md:text-9xl text-white mb-6 text-center leading-none" style={{ color: club.color }}>
          {club.name}
        </h1>
        
        <p className="text-[#888888] text-sm font-sans uppercase tracking-widest mb-16">
          Owner <span className="text-white italic">{club.owner}</span>
        </p>

        <span className="text-[#C8A84B] font-sans font-bold text-[9px] tracking-[0.4em] uppercase mb-12">
          More Than A Match
        </span>

        <button 
          onClick={onClose}
          className="border border-[#333] text-[#A0A0A0] font-sans font-bold text-[10px] uppercase tracking-[0.2em] py-3 px-8 hover:bg-white hover:text-black hover:border-white transition-colors uppercase"
        >
          Dismiss
        </button>
      </motion.div>
    </motion.div>
  );
}
