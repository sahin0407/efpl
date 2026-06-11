import React, { useState } from 'react';
import { Match, getClub } from '../types';

export function MatchSchedule({ 
  matches, 
  updateMatchDate 
}: { 
  matches: Match[], 
  updateMatchDate: (matchId: string, dateStr: string) => void 
}) {
  const [bulkStartDate, setBulkStartDate] = useState('');
  const [bulkInterval, setBulkInterval] = useState('1');

  const handleBulkSet = () => {
    if (!bulkStartDate) return;
    const startDate = new Date(bulkStartDate);
    const intervalDays = parseInt(bulkInterval, 10) || 1;
    
    let currentDays = 0;
    matches.filter(m => !m.isCompleted).forEach(match => {
      const d = new Date(startDate);
      d.setDate(d.getDate() + currentDays);
      // Create local formatted string YYYY-MM-DDTHH:MM
      const str = d.toISOString().slice(0, 16);
      updateMatchDate(match.id, str);
      currentDays += intervalDays;
    });
  };

  return (
    <div className="w-full pt-8 pb-10 border-t border-brand-border mt-8">
      <div className="mb-8">
        <h2 className="font-playfair text-3xl italic text-brand-dark tracking-tight mb-1">
          Match Schedule
        </h2>
        <span className="text-[10px] text-brand-accent font-sans font-bold tracking-[0.25em] uppercase">
          Set Dates & Times
        </span>
      </div>

      <div className="bg-brand-surface border border-brand-border box-shadow-editorial p-6 rounded-sm mb-8 flex flex-col md:flex-row items-end gap-4">
        <div className="flex-1 w-full flex flex-col gap-2">
          <label className="text-[10px] text-brand-gray font-sans uppercase tracking-widest font-bold">Start Date</label>
          <input 
            type="datetime-local" 
            value={bulkStartDate}
            onChange={e => setBulkStartDate(e.target.value)}
            className="p-3 border border-brand-border bg-brand-standings-alt font-sans text-sm outline-none focus:border-brand-accent"
          />
        </div>
        <div className="w-full md:w-32 flex flex-col gap-2">
          <label className="text-[10px] text-brand-gray font-sans uppercase tracking-widest font-bold">Interval (Days)</label>
          <input 
            type="number" 
            min="0"
            value={bulkInterval}
            onChange={e => setBulkInterval(e.target.value)}
            className="p-3 border border-brand-border bg-brand-standings-alt font-sans text-sm outline-none focus:border-brand-accent"
          />
        </div>
        <button 
          onClick={handleBulkSet}
          className="w-full md:w-auto mt-4 md:mt-0 px-6 py-3 border border-brand-accent text-brand-accent hover:bg-brand-accent hover:text-white transition-colors font-sans font-bold text-[10px] uppercase tracking-widest"
        >
          Set All Unscheduled
        </button>
      </div>

      <div className="flex flex-col gap-2">
        {matches.map(match => {
          const clubA = match.teamA === 'tbd' ? { name: 'TBD', shortName: 'TBD' } : getClub(match.teamA);
          const clubB = match.teamB === 'tbd' ? { name: 'TBD', shortName: 'TBD' } : getClub(match.teamB);
          
          return (
            <div key={match.id} className="bg-brand-surface border border-brand-border p-4 flex flex-col sm:flex-row sm:items-center gap-4 justify-between hover:bg-brand-standings-alt transition-colors duration-200">
              <div className="flex items-center gap-4">
                <span className="font-mono text-sm font-bold text-brand-dark w-6">#{match.matchNumber}</span>
                <span className="font-sans text-sm font-bold text-brand-dark shrink-0 hidden md:inline w-24 text-right">{clubA.name}</span>
                <span className="font-sans text-sm font-bold text-brand-dark shrink-0 md:hidden w-10 text-right">{clubA.shortName}</span>
                <span className="font-playfair italic text-xs text-brand-accent shrink-0">vs</span>
                <span className="font-sans text-sm font-bold text-brand-dark shrink-0 hidden md:inline w-24 text-left">{clubB.name}</span>
                <span className="font-sans text-sm font-bold text-brand-dark shrink-0 md:hidden w-10 text-left">{clubB.shortName}</span>
              </div>
              <div className="flex items-center gap-2 mt-2 sm:mt-0">
                <input 
                  type="datetime-local" 
                  value={match.date || ''}
                  onChange={e => updateMatchDate(match.id, e.target.value)}
                  className="w-full sm:w-auto p-2 border border-brand-border bg-white dark:bg-[#222] font-sans text-xs outline-none focus:border-brand-accent"
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
