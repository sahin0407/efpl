import { useState, useEffect } from 'react';
import { ref, onValue, update } from 'firebase/database';
import { database } from '../firebase';
import { uploadToCloudinary } from '../cloudinary';

export function useAvatar(clubId: string, type: 'badge' | 'owner') {
  const [avatar, setAvatar] = useState<string | null>(null);
  const key = type === 'badge' ? 'badgeUrl' : 'ownerAvatarUrl';

  useEffect(() => {
    const avatarRef = ref(database, `clubs/${clubId}/${key}`);
    const unsubscribe = onValue(avatarRef, (snapshot) => {
      if (snapshot.exists()) {
        const val = snapshot.val();
        console.log(`[Firebase READ] clubs/${clubId}/${key}:`, val);
        setAvatar(val);
      } else {
        console.log(`[Firebase READ] clubs/${clubId}/${key}: No data`);
        setAvatar(null);
      }
    });

    return () => unsubscribe();
  }, [clubId, key]);

  const updateAvatar = async (file: File | null) => {
    if (file) {
      console.log(`[Cloudinary UPLOAD] Start for ${clubId} ${key}`);
      const url = await uploadToCloudinary(file);
      console.log(`[Cloudinary UPLOAD] Success for ${clubId} ${key}:`, url);
      console.log(`[Firebase WRITE] clubs/${clubId}/${key}:`, url);
      await update(ref(database, `clubs/${clubId}`), { [key]: url });
    } else {
      console.log(`[Firebase WRITE] clubs/${clubId}/${key}: (empty)`);
      await update(ref(database, `clubs/${clubId}`), { [key]: "" });
    }
  };

  return { avatar, updateAvatar };
}
