import React, { useState, useEffect } from 'react';
import { ref, onValue, update } from 'firebase/database';
import { database } from '../firebase';
import { CheckCircle2 } from 'lucide-react';

export function TickerAdmin() {
  const [text, setText] = useState("");
  const [showSuccess, setShowSuccess] = useState(false);

  useEffect(() => {
    const textRef = ref(database, 'tournament/settings/tickerText');
    const unsubscribe = onValue(textRef, (snapshot) => {
      if (snapshot.exists()) {
        setText(snapshot.val());
      }
    });

    return () => unsubscribe();
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    update(ref(database, 'tournament/settings'), { tickerText: text });
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 2000);
  };

  return (
    <div className="w-full pt-8 pb-10 border-t border-brand-border mt-8">
      <div className="mb-6">
        <h2 className="font-playfair text-3xl italic text-brand-text tracking-tight mb-1">
          News Ticker
        </h2>
        <span className="text-[10px] text-cyber-pink font-sans font-bold tracking-[0.25em] uppercase">
          Live Header Announcement
        </span>
      </div>

      <form onSubmit={handleSubmit} className="bg-brand-surface p-6 border border-brand-border rounded-sm box-shadow-editorial">
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          className="w-full bg-transparent border-b border-brand-border pb-3 text-brand-text focus:outline-none focus:border-cyber-purple focus:bg-brand-input-focus font-sans text-sm resize-none"
          rows={3}
          placeholder="Leave blank for auto dynamic text, or enter custom text..."
        />
        <button
          type="submit"
          className="w-full bg-cyber-purple text-white font-sans font-bold uppercase tracking-[0.2em] text-[10px] rounded-sm py-4 mt-6 transition-opacity hover:opacity-80 flex items-center justify-center gap-2"
        >
          {showSuccess ? <CheckCircle2 size={14} strokeWidth={2} /> : null}
          {showSuccess ? "SYNCED TO TICKER" : "UPDATE TICKER"}
        </button>
      </form>
    </div>
  );
}
