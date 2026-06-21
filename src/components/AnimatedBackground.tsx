import { motion } from 'motion/react';

export default function AnimatedBackground() {
  return (
    <div 
      className="fixed inset-0 z-0 pointer-events-none overflow-hidden"
      style={{ background: 'linear-gradient(135deg, #0a0a0a 0%, #0d1f0d 30%, #0a1628 60%, #0a0a0a 100%)' }}
    >
      <div className="absolute inset-0 bg-transparent z-10" />

      {/* Diagonal Light Streaks */}
      {Array.from({ length: 4 }).map((_, i) => (
        <motion.div
          key={`streak-${i}`}
          initial={{ x: "-50vw", y: "-50vh", opacity: 0, rotate: 45 }}
          animate={{ x: "150vw", y: "150vh", opacity: [0, 0.4, 0] }}
          transition={{
            duration: 6 + Math.random() * 4,
            repeat: Infinity,
            delay: i * 2.5,
            ease: "linear"
          }}
          className="absolute w-[200vw] h-20 bg-white/5 blur-3xl transform -translate-x-1/2 -translate-y-1/2"
        />
      ))}

      {/* Floating Particles */}
      {Array.from({ length: 30 }).map((_, i) => (
        <motion.div
          key={`p-${i}`}
          initial={{
            opacity: Math.random() * 0.8 + 0.2,
            x: `${Math.random() * 100}vw`,
            y: "110vh",
            scale: Math.random() * 0.4 + 0.1
          }}
          animate={{
            y: "-10vh",
            x: `${Math.random() * 100}vw`
          }}
          transition={{
            duration: Math.random() * 20 + 20,
            repeat: Infinity,
            ease: "linear",
            delay: Math.random() * 5 * -1
          }}
          className="absolute w-1.5 h-1.5 rounded-full bg-white z-20 shadow-[0_0_8px_rgba(255,255,255,1)]"
        />
      ))}
    </div>
  );
}
