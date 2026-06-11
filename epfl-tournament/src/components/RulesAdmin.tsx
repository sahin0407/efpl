import React, { useState } from 'react';
import { motion } from 'motion/react';
import { RulesData } from '../useRules';

export function RulesAdmin({ rules, setRules }: { rules: RulesData, setRules: (r: RulesData) => Promise<void> | void }) {
  const [formData, setFormData] = useState<RulesData>(rules);
  const [showSuccess, setShowSuccess] = useState(false);
  const [syncing, setSyncing] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSyncing(true);
    await setRules(formData);
    setSyncing(false);
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 2000);
  };

  const handleChange = (field: keyof RulesData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="bg-white dark:bg-[#111111] p-6 md:p-8 relative overflow-hidden mb-10 border border-brand-border rounded-sm box-shadow-editorial"
    >
      <h3 className="font-sans font-bold text-[10px] tracking-[0.2em] uppercase text-[#A0A0A0] mb-8">Rules Content Editor</h3>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-[9px] font-sans font-bold uppercase tracking-widest text-[#A0A0A0] mb-2">Format</label>
          <textarea 
            value={formData.format}
            onChange={(e) => handleChange('format', e.target.value)}
            className="w-full bg-transparent border border-brand-border p-3 text-brand-dark font-sans text-sm focus:outline-none focus:border-brand-accent min-h-[#100px]"
            rows={5}
          />
        </div>

        <div className="grid grid-cols-3 gap-4">
          <div>
             <label className="block text-[9px] font-sans font-bold uppercase tracking-widest text-[#A0A0A0] mb-2">Points Win</label>
             <input type="text" value={formData.pointsWin} onChange={(e) => handleChange('pointsWin', e.target.value)} className="w-full bg-transparent border-b border-brand-border py-2 text-brand-dark focus:outline-none focus:border-brand-accent h-[40px]" />
          </div>
          <div>
             <label className="block text-[9px] font-sans font-bold uppercase tracking-widest text-[#A0A0A0] mb-2">Points Draw</label>
             <input type="text" value={formData.pointsDraw} onChange={(e) => handleChange('pointsDraw', e.target.value)} className="w-full bg-transparent border-b border-brand-border py-2 text-brand-dark focus:outline-none focus:border-brand-accent h-[40px]" />
          </div>
          <div>
             <label className="block text-[9px] font-sans font-bold uppercase tracking-widest text-[#A0A0A0] mb-2">Points Loss</label>
             <input type="text" value={formData.pointsLoss} onChange={(e) => handleChange('pointsLoss', e.target.value)} className="w-full bg-transparent border-b border-brand-border py-2 text-brand-dark focus:outline-none focus:border-brand-accent h-[40px]" />
          </div>
        </div>

        <div>
          <label className="block text-[9px] font-sans font-bold uppercase tracking-widest text-[#A0A0A0] mb-2">Tiebreakers</label>
          <textarea 
            value={formData.tiebreakers}
            onChange={(e) => handleChange('tiebreakers', e.target.value)}
            className="w-full bg-transparent border border-brand-border p-3 text-brand-dark font-sans text-sm focus:outline-none focus:border-brand-accent min-h-[#100px]"
            rows={4}
          />
        </div>

        <div>
          <label className="block text-[9px] font-sans font-bold uppercase tracking-widest text-[#A0A0A0] mb-2">Match Rules</label>
          <textarea 
            value={formData.matchRules}
            onChange={(e) => handleChange('matchRules', e.target.value)}
            className="w-full bg-transparent border border-brand-border p-3 text-brand-dark font-sans text-sm focus:outline-none focus:border-brand-accent min-h-[#100px]"
            rows={5}
          />
        </div>

        <div>
          <label className="block text-[9px] font-sans font-bold uppercase tracking-widest text-[#A0A0A0] mb-2">About EFPL</label>
          <textarea 
            value={formData.about}
            onChange={(e) => handleChange('about', e.target.value)}
            className="w-full bg-transparent border border-brand-border p-3 text-brand-dark font-sans text-sm focus:outline-none focus:border-brand-accent min-h-[#100px]"
            rows={5}
          />
        </div>

        <button 
          type="submit"
          disabled={syncing}
          className="w-full bg-brand-dark text-white font-sans font-bold uppercase tracking-[0.2em] text-[10px] rounded-sm py-4 transition-opacity hover:opacity-80 mt-6 flex justify-center items-center gap-2 disabled:opacity-50"
        >
          {syncing ? 'SYNCING...' : showSuccess ? '✓ SYNCED' : 'SAVE RULES'}
        </button>
      </form>
    </motion.div>
  );
}
