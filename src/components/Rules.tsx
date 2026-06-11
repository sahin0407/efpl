import { motion } from 'motion/react';
import { RulesData } from '../useRules';
import { CLUBS } from '../types';

export function Rules({ rules }: { rules: RulesData }) {
  // We can render each of the defined sections
  return (
    <div className="pt-12 px-4 pb-12 w-full max-w-2xl mx-auto space-y-12">
      <div className="mb-10 border-b border-brand-border pb-4 text-center sm:text-left">
        <span className="text-[10px] text-[#C8A84B] font-sans font-bold tracking-[0.25em] uppercase mb-1 block">OFFICIAL</span>
        <h2 className="font-playfair text-5xl italic text-brand-dark tracking-tight">Rules</h2>
      </div>

      <section>
        <h3 className="text-[12px] text-[#C8A84B] font-sans font-bold tracking-[0.2em] uppercase mb-4">Format</h3>
        <div className="bg-brand-surface border border-brand-border p-6 rounded-sm box-shadow-editorial whitespace-pre-wrap font-sans text-brand-gray text-sm leading-relaxed">
          {rules.format}
        </div>
      </section>

      <section>
        <h3 className="text-[12px] text-[#C8A84B] font-sans font-bold tracking-[0.2em] uppercase mb-4">Points</h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
           <div className="bg-brand-surface border border-brand-border p-6 rounded-sm box-shadow-editorial text-center">
             <span className="block text-[10px] uppercase font-sans font-bold tracking-[0.2em] text-brand-gray mb-2">WIN</span>
             <span className="block text-4xl font-mono font-bold text-[#C8A84B]">{rules.pointsWin}</span>
           </div>
           <div className="bg-brand-surface border border-brand-border p-6 rounded-sm box-shadow-editorial text-center">
             <span className="block text-[10px] uppercase font-sans font-bold tracking-[0.2em] text-brand-gray mb-2">DRAW</span>
             <span className="block text-4xl font-mono font-bold text-[#ffaa00]">{rules.pointsDraw}</span>
           </div>
           <div className="bg-brand-surface border border-brand-border p-6 rounded-sm box-shadow-editorial text-center">
             <span className="block text-[10px] uppercase font-sans font-bold tracking-[0.2em] text-brand-gray mb-2">LOSS</span>
             <span className="block text-4xl font-mono font-bold text-[#A0A0A0]">{rules.pointsLoss}</span>
           </div>
        </div>
      </section>

      <section>
        <h3 className="text-[12px] text-[#C8A84B] font-sans font-bold tracking-[0.2em] uppercase mb-4">Tiebreakers</h3>
        <div className="bg-brand-surface border border-brand-border p-6 rounded-sm box-shadow-editorial whitespace-pre-wrap font-sans text-brand-gray text-sm leading-relaxed">
          {rules.tiebreakers}
        </div>
      </section>

      <section>
        <h3 className="text-[12px] text-[#C8A84B] font-sans font-bold tracking-[0.2em] uppercase mb-4">Match Rules</h3>
        <div className="bg-[#1A1A1A] p-6 border-l-2 border-l-[#C8A84B] font-sans text-[#EAEAEA] text-sm leading-relaxed whitespace-pre-wrap box-shadow-editorial">
          {rules.matchRules}
        </div>
      </section>

      <section>
         <h3 className="text-[12px] text-[#C8A84B] font-sans font-bold tracking-[0.2em] uppercase mb-4">Participating Clubs</h3>
         <div className="bg-brand-surface border border-brand-border rounded-sm box-shadow-editorial divide-y divide-brand-border">
            {CLUBS.map(club => (
              <div key={club.id} className="p-4 flex items-center justify-between">
                 <div className="flex items-center gap-4">
                   <div className="w-10 h-10 rounded-full border-2 flex items-center justify-center font-bold text-xs" style={{ borderColor: club.color, color: club.color }}>
                     {club.shortName}
                   </div>
                   <div>
                     <span className="font-sans font-bold text-brand-dark block">{club.name}</span>
                     <span className="font-sans text-[#C8A84B] text-[10px] uppercase tracking-widest">{club.owner}</span>
                   </div>
                 </div>
              </div>
            ))}
         </div>
      </section>

      <section>
        <h3 className="text-[12px] text-[#C8A84B] font-sans font-bold tracking-[0.2em] uppercase mb-4">About</h3>
        <div className="bg-brand-surface border border-brand-border p-8 rounded-sm box-shadow-editorial text-center">
           <h4 className="font-playfair text-[#C8A84B] italic text-2xl mb-6 tracking-tight">More Than A Match.</h4>
           <div className="whitespace-pre-wrap font-sans text-brand-gray text-sm leading-relaxed max-w-sm mx-auto">
             {rules.about}
           </div>
        </div>
      </section>
    </div>
  );
}
