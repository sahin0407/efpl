"use client";
import { useAvatar } from '../hooks/useAvatar';
import { getClub } from '../types';

export function OwnerAvatar({ clubId, size = 24, className = '' }: { clubId: string, size?: number, className?: string }) {
  const { avatar } = useAvatar(clubId, 'owner');
  const club = getClub(clubId);
  
  if (!club) return null;

  const initials = club.owner.substring(0, 2).toUpperCase();
  const fontSize = Math.max(8, Math.floor(size * 0.4));
  
  const sizeClasses = `flex items-center justify-center shrink-0 rounded-full overflow-hidden hover:scale-105 hover:shadow-lg transition-transform duration-200 border-2`

  if (avatar) {
    return (
      <img 
        src={avatar} 
        alt={`${club.owner} Avatar`} 
        referrerPolicy="no-referrer"
        className={`${sizeClasses} ${className} object-cover`}
        style={{ width: size, height: size, borderColor: '#C8A84B' }}
      />
    );
  }

  return (
    <div 
      className={`${sizeClasses} ${className}`}
      style={{ 
        width: size, 
        height: size, 
        backgroundColor: '#1A1A1A', 
        borderColor: '#C8A84B'
      }}
    >
      <span className="font-sans font-bold text-[#C8A84B] leading-none" style={{ fontSize }}>
        {initials}
      </span>
    </div>
  );
}
