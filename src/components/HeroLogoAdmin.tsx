import React, { useRef, useState, useEffect } from 'react';
import { ref, onValue, update } from 'firebase/database';
import { database } from '../firebase';
import { uploadToCloudinary } from '../cloudinary';

export function useHeroLogo() {
  const [logoUrl, setLogoUrl] = useState<string | null>(null);

  useEffect(() => {
    const logoRef = ref(database, 'tournament/settings/heroLogoUrl');
    const unsubscribe = onValue(logoRef, (snapshot) => {
      if (snapshot.exists()) {
        const val = snapshot.val();
        setLogoUrl(val);
      } else {
        setLogoUrl(null);
      }
    });

    return () => unsubscribe();
  }, []);

  const updateLogoUrl = async (file: File | null) => {
    if (file) {
      const url = await uploadToCloudinary(file);
      await update(ref(database, 'tournament/settings'), { heroLogoUrl: url });
    } else {
      await update(ref(database, 'tournament/settings'), { heroLogoUrl: "" });
    }
  };

  return { logoUrl, updateLogoUrl };
}

export function HeroLogoAdmin() {
  const { logoUrl, updateLogoUrl } = useHeroLogo();
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
      await updateLogoUrl(file);
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 2000);
    } catch (err) {
      alert("Upload failed. Please try again.");
    }
    setIsUploading(false);
  };

  return (
    <div className="w-full pt-8 pb-10 border-t border-brand-border mt-8">
      <div className="mb-8">
        <h2 className="font-playfair text-3xl italic text-brand-dark tracking-tight mb-1">
          Hero Logo
        </h2>
        <span className="text-[10px] text-[#C8A84B] font-sans font-bold tracking-[0.25em] uppercase">
          MANAGE MAIN HERO LOGO
        </span>
      </div>

      <div className="bg-white border border-[#C8A84B] box-shadow-editorial p-6 rounded-sm mb-6 flex flex-col md:flex-row items-center gap-6 md:justify-between text-left">
        <div className="flex flex-col gap-4 flex-1 w-full md:w-auto">
          {logoUrl ? (
             <img 
               src={logoUrl} 
               referrerPolicy="no-referrer"
               className="w-full max-w-[200px] object-cover border border-[#C8A84B] rounded-[4px] bg-brand-dark p-2" 
               alt="Hero Logo" 
             />
          ) : (
             <div className="w-full max-w-[200px] h-[100px] bg-brand-nav/20 flex flex-col items-center justify-center rounded-[4px] border border-brand-border/30">
               <span className="text-[10px] text-brand-gray uppercase tracking-widest text-center">No Logo Uploaded</span>
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
            {isUploading ? 'UPLOADING...' : showSuccess ? '✓ UPLOADED' : '↑ Upload Logo'}
          </button>
          {logoUrl && (
            <button 
              disabled={isUploading}
              onClick={() => updateLogoUrl(null)} 
              className="text-[9px] text-brand-danger hover:text-[#C8A84B] font-sans font-bold uppercase tracking-[0.15em] transition-colors mt-1"
            >
              ✕ Remove
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
