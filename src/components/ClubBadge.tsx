import { motion } from 'motion/react';
import { getClub } from '../types';
import { useAvatar } from '../hooks/useAvatar';

export function ClubBadge({ clubId, size = 32, className = '' }: { clubId: string, size?: number, className?: string }) {
  const { avatar } = useAvatar(clubId, 'badge');
  const club = getClub(clubId);
  
  if (!club) return null;
  
  const sizeClasses = `flex items-center justify-center shrink-0 rounded-full bg-brand-surface overflow-hidden hover:scale-105 hover:shadow-lg transition-transform duration-200 border-2`

  const fontSize = Math.max(8, Math.floor(size * 0.35));

  if (avatar) {
    return (
      <img 
        src={avatar} 
        alt={`${club.name} Badge`} 
        referrerPolicy="no-referrer"
        className={`${sizeClasses} ${className} object-cover`}
        style={{ width: size, height: size, borderColor: club.color }}
      />
    );
  }

  return (
    <div 
      className={`${sizeClasses} ${className}`}
      style={{ 
        width: size, 
        height: size, 
        backgroundColor: club.color, 
        borderColor: club.color,
        boxShadow: 'inset 0 0 0 1px rgba(255,255,255,0.2)'
      }}
    >
      <span className="font-mono font-bold text-white leading-none" style={{ fontSize }}>
        {club.shortName}
      </span>
    </div>
  );
}
