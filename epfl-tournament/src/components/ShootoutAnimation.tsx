import { motion } from 'motion/react';
import { useEffect } from 'react';
import { getClub } from '../types';

export function ShootoutAnimation({ clubId, onClose }: { clubId: string; onClose: () => void }) {
  const club = getClub(clubId);

  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 3000);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-[#111] overflow-hidden p-4 text-center"
    >
      <motion.div
        initial={{ scale: 0.8, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        transition={{ delay: 0.2, type: "spring", stiffness: 200, damping: 20 }}
        className="flex flex-col items-center relative z-10"
      >
        <div className="w-32 h-32 rounded-full border-4 border-dashed mb-6 relative animate-[spin_10s_linear_infinite]" style={{ borderColor: club.color }}>
           <div className="absolute inset-0 flex items-center justify-center animate-[spin_10s_linear_infinite_reverse]">
               <div className="w-4 h-4 rounded-full bg-white" />
           </div>
        </div>

        <span className="text-white text-xl font-sans font-bold uppercase tracking-widest mb-4">⚽ WON ON PENALTIES!</span>
        <h2 className="font-playfair text-5xl md:text-7xl text-brand-accent italic tracking-tight" style={{ color: club.color }}>
          {club.name}
        </h2>
      </motion.div>
    </motion.div>
  );
}
