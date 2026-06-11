import { CLUBS } from '../types';
import { ClubBadge } from './ClubBadge';
import { OwnerAvatar } from './OwnerAvatar';
import { useAvatar } from '../hooks/useAvatar';
import React, { useRef, useState } from 'react';

function AvatarRow({ club }: { key?: React.Key, club: any }) {
  const { avatar: badgeAvatar, updateAvatar: updateBadge } = useAvatar(club.id, 'badge');
  const { avatar: ownerAvatar, updateAvatar: updateOwner } = useAvatar(club.id, 'owner');
  
  const [isUploading, setIsUploading] = useState(false);
  const badgeInputRef = useRef<HTMLInputElement>(null);
  const ownerInputRef = useRef<HTMLInputElement>(null);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>, type: 'badge' | 'owner') => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      alert("Image too large. Max 2MB.");
      return;
    }

    setIsUploading(true);
    try {
      if (type === 'badge') await updateBadge(file);
      else await updateOwner(file);
    } catch (e) {
      alert("Upload failed. Please try again.");
    }
    setIsUploading(false);
  };

  return (
    <div className="bg-brand-surface border border-brand-border box-shadow-editorial p-6 rounded-sm mb-6 flex flex-col md:flex-row items-center gap-6 md:justify-between text-left">
      <div className="flex flex-col gap-4">
        {/* Badge preview */}
        <div className="flex items-center gap-4">
          <ClubBadge clubId={club.id} size={60} />
          <span className="font-sans font-bold text-lg text-brand-dark">{club.name}</span>
        </div>
        {/* Owner preview */}
        <div className="flex items-center gap-4">
          <OwnerAvatar clubId={club.id} size={60} />
          <span className="font-sans text-brand-gray text-sm">Owner: <span className="font-bold text-brand-dark">{club.owner}</span></span>
        </div>
      </div>
      
      <div className="flex flex-col gap-3 w-full md:w-auto">
        <div className="flex flex-col items-center">
          <input 
            type="file" 
            accept="image/png, image/jpeg, image/webp, image/gif" 
            ref={badgeInputRef} 
            className="hidden" 
            onChange={(e) => handleUpload(e, 'badge')} 
          />
          <button 
            disabled={isUploading}
            onClick={() => badgeInputRef.current?.click()}
            className="w-full md:w-48 whitespace-nowrap border border-brand-accent text-brand-accent font-sans font-bold text-[10px] uppercase tracking-[0.2em] py-2 px-4 rounded-sm hover:bg-brand-accent hover:text-white transition-colors disabled:opacity-50"
          >
            {isUploading ? 'Syncing...' : '↑ Upload Badge'}
          </button>
          {badgeAvatar && (
            <button onClick={() => updateBadge(null)} className="text-[9px] text-brand-gray mt-1 underline hover:text-brand-dark uppercase tracking-widest">
              Reset to default
            </button>
          )}
        </div>
        
        <div className="flex flex-col items-center">
          <input 
            type="file" 
            accept="image/png, image/jpeg, image/webp, image/gif" 
            ref={ownerInputRef} 
            className="hidden" 
            onChange={(e) => handleUpload(e, 'owner')} 
          />
          <button 
            disabled={isUploading}
            onClick={() => ownerInputRef.current?.click()}
            className="w-full md:w-48 whitespace-nowrap border border-brand-accent text-brand-accent font-sans font-bold text-[10px] uppercase tracking-[0.2em] py-2 px-4 rounded-sm hover:bg-brand-accent hover:text-white transition-colors disabled:opacity-50"
          >
            {isUploading ? 'Syncing...' : '↑ Upload Photo'}
          </button>
          {ownerAvatar && (
            <button onClick={() => updateOwner(null)} className="text-[9px] text-brand-gray mt-1 underline hover:text-brand-dark uppercase tracking-widest">
              Reset to default
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export function AvatarManagement() {
  return (
    <div className="w-full pt-8 pb-10 border-t border-brand-border mt-8">
      <div className="mb-8">
        <h2 className="font-playfair text-3xl italic text-brand-dark tracking-tight mb-1">
          Avatar Management
        </h2>
        <span className="text-[10px] text-brand-accent font-sans font-bold tracking-[0.25em] uppercase">
          Club Badges & Owner Photos
        </span>
      </div>

      <div className="flex flex-col">
        {CLUBS.map(club => (
          <AvatarRow key={club.id} club={club} />
        ))}
      </div>
    </div>
  );
}
