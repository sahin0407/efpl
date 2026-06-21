import React, { useRef, useState, useEffect } from 'react';
import { ref, onValue, update } from 'firebase/database';
import { database } from '../firebase';
import { uploadToCloudinary } from '../cloudinary';

export function useBanner(clubId: string) {
  const [banner, setBanner] = useState<string | null>(null);

  useEffect(() => {
    const bannerRef = ref(database, `clubs/${clubId}/bannerUrl`);
    const unsubscribe = onValue(bannerRef, (snapshot) => {
      if (snapshot.exists()) {
        const val = snapshot.val();
        setBanner(val);
      } else {
        setBanner(null);
      }
    });

    return () => unsubscribe();
  }, [clubId]);

  const updateBanner = async (file: File | null) => {
    if (file) {
      const url = await uploadToCloudinary(file);
      await update(ref(database, `clubs/${clubId}`), { bannerUrl: url });
    } else {
      await update(ref(database, `clubs/${clubId}`), { bannerUrl: "" });
    }
  };

  return { banner, updateBanner };
}

function BannerRow({ clubId, clubName, ownerName }: { clubId: string, clubName: string, ownerName: string }) {
  const { banner, updateBanner } = useBanner(clubId);
  const inputRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      alert("Image too large. Max 2MB.");
      return;
    }

    setIsUploading(true);
    try {
      await updateBanner(file);
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 2000);
    } catch (err) {
      alert("Upload failed. Please try again.");
    }
    setIsUploading(false);
  };

  return (
    <div className="bg-white border border-[#C8A84B] box-shadow-editorial p-6 rounded-sm mb-6 flex flex-col md:flex-row items-center gap-6 md:justify-between text-left">
      <div className="flex flex-col gap-4 flex-1 w-full md:w-auto">
        <span className="font-sans font-bold text-lg text-brand-dark uppercase tracking-widest">
          {clubName} <span className="font-normal text-brand-gray">— {ownerName}</span>
        </span>
        {banner ? (
           <img 
             src={banner} 
             referrerPolicy="no-referrer"
             className="w-full max-w-[350px] h-[80px] object-cover border border-[#C8A84B] rounded-[4px]" 
             alt="banner" 
           />
        ) : (
           <div className="w-full max-w-[350px] h-[80px] bg-brand-nav/20 flex flex-col items-center justify-center rounded-[4px] border border-brand-border/30">
             <span className="text-[10px] text-brand-gray uppercase tracking-widest text-center">No Custom Banner</span>
           </div>
        )}
      </div>
      
      <div className="flex flex-col gap-3 w-full md:w-auto items-center md:items-end">
        <input 
          type="file" 
          accept="image/png, image/jpeg, image/webp, image/gif" 
          ref={inputRef} 
          className="hidden" 
          onChange={handleUpload} 
        />
        <button 
          disabled={isUploading}
          onClick={() => inputRef.current?.click()}
          className="w-full md:w-48 whitespace-nowrap border border-[#C8A84B] text-[#C8A84B] font-sans font-bold text-[10px] uppercase tracking-[0.2em] py-3 px-4 rounded-sm hover:bg-[#C8A84B] hover:text-white transition-colors disabled:opacity-50 text-center"
        >
          {isUploading ? 'UPLOADING...' : showSuccess ? '✓ UPLOADED' : '↑ Upload Banner'}
        </button>
        {banner && (
          <button 
            disabled={isUploading}
            onClick={() => updateBanner(null)} 
            className="text-[9px] text-brand-danger hover:text-[#C8A84B] font-sans font-bold uppercase tracking-[0.15em] transition-colors mt-1"
          >
            ✕ Remove
          </button>
        )}
      </div>
    </div>
  );
}

export function BannerManagement() {
  return (
    <div className="w-full pt-8 pb-10 border-t border-brand-border mt-8">
      <div className="mb-8">
        <h2 className="font-playfair text-3xl italic text-brand-dark tracking-tight mb-1">
          Club Banners
        </h2>
        <span className="text-[10px] text-[#C8A84B] font-sans font-bold tracking-[0.25em] uppercase">
          MANAGE HOME PAGE BANNERS
        </span>
      </div>

      <div className="flex flex-col">
        <BannerRow clubId="mumbai" clubName="Mumbai City FC" ownerName="Sahin" />
        <BannerRow clubId="chennai" clubName="Chennai Super FC" ownerName="Mahshin" />
        <BannerRow clubId="bengaluru" clubName="Bengaluru United FC" ownerName="Khokan" />
        <BannerRow clubId="rajasthan" clubName="Rajasthan Royals FC" ownerName="Nasim" />
        <BannerRow clubId="hyderabad" clubName="Hyderabad Kings FC" ownerName="Rayhan" />
      </div>
    </div>
  );
}
