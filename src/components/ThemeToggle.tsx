import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Sun, Moon } from 'lucide-react';

export function ThemeToggle() {
  const [isDark, setIsDark] = useState(() => {
    if (typeof localStorage !== 'undefined' && localStorage.getItem('theme')) {
      return localStorage.getItem('theme') === 'dark';
    }
    if (typeof window !== 'undefined' && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      return true;
    }
    return false;
  });

  const toggleTheme = () => {
    const html = document.documentElement;
    html.classList.add('theme-transitioning');
    
    const newDark = !isDark;
    setIsDark(newDark);
    
    if (newDark) {
      html.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      html.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
    
    setTimeout(() => {
      html.classList.remove('theme-transitioning');
    }, 400); // Wait for transition finish
  };

  return (
    <button
      onClick={toggleTheme}
      className={`relative flex items-center justify-between w-14 h-[26px] py-1 px-[3px] rounded-full border border-brand-accent transition-colors duration-400 focus:outline-none ${
        isDark ? 'bg-brand-surface' : 'bg-brand-primary'
      }`}
      aria-label="Toggle Dark Mode"
    >
      <motion.div
        className={`absolute left-[3px] w-[20px] h-[20px] rounded-full shadow-sm border ${isDark ? 'border-[#444] bg-[#333]' : 'border-brand-border bg-white'}`}
        animate={{ x: isDark ? 28 : 0 }}
        transition={{ type: 'tween', duration: 0.3, ease: 'easeOut' }}
      />
      <div className="flex justify-between w-full z-10 px-0.5">
        <Sun size={12} className={`transition-colors duration-300 ${isDark ? 'text-brand-gray' : 'text-brand-accent'}`} />
        <Moon size={12} className={`transition-colors duration-300 ${isDark ? 'text-brand-accent' : 'text-brand-gray'}`} />
      </div>
    </button>
  );
}
