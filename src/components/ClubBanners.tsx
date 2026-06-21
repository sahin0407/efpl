import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { useBanner } from './BannerManagement';

function SingleBanner({ id, caption }: { id: string, caption: string, key?: React.Key }) {
  const { banner } = useBanner(id);
  
  if (!banner) return null;
  
  return (
    <div className="relative w-full border-b border-cyber-purple">
      <img 
        src={banner} 
        alt={caption} 
        referrerPolicy="no-referrer"
        className="w-full h-auto object-contain block min-h-[100px] bg-brand-surface" 
      />
      <div className="absolute bottom-0 left-0 w-full bg-brand-primary/80 py-1.5 px-3">
        <span className="text-white font-sans text-[9px] tracking-[0.1em] uppercase block text-center">
          {caption}
        </span>
      </div>
    </div>
  );
}

export function ClubBanners() {
  const banners = [
    {
      id: 'mumbai',
      caption: 'MUMBAI CITY FC · SAHIN'
    },
    {
      id: 'chennai',
      caption: 'CHENNAI SUPER FC · MAHSHIN'
    },
    {
      id: 'bengaluru',
      caption: 'BENGALURU UNITED FC · KHOKAN'
    },
    {
      id: 'rajasthan',
      caption: 'RAJASTHAN ROYALS FC · NASIM'
    },
    {
      id: 'hyderabad',
      caption: 'HYDERABAD KINGS FC · RAYHAN'
    }
  ];

  return (
    <div className="w-full max-w-2xl mx-auto mt-6 mb-8">
      <div className="px-4 mb-4 text-center sm:text-left">
        <span className="text-cyber-pink font-sans text-[10px] font-bold tracking-[0.2em] uppercase pl-1">
          OUR CLUBS
        </span>
        <div className="w-full h-[1px] bg-cyber-purple opacity-20 mt-2" />
      </div>
      
      <div className="flex flex-col w-full bg-brand-surface">
        {banners.map((banner) => (
          <SingleBanner key={banner.id} id={banner.id} caption={banner.caption} />
        ))}
      </div>
    </div>
  );
}

