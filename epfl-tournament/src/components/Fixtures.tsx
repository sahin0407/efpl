import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Match, CLUBS } from '../types';
import { ClubBadge } from './ClubBadge';
import { Bell } from 'lucide-react';
import { MatchShareButton } from './MatchShareButton';

const getClub = (id: string) => CLUBS.find(c => c.id === id)!;

const formatMatchDate = (dateStr?: string) => {
  if (!dateStr) return { date: 'TBD', time: '', remainingLabel: null, remainingClass: '' };
  const d = new Date(dateStr);
  const formatter = new Intl.DateTimeFormat('en-GB', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' });
  const timeFormatter = new Intl.DateTimeFormat('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
  
  const now = new Date();
  const diffTime = d.getTime() - now.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  let remainingLabel = null;
  let remainingClass = '';

  if (diffDays === 0 || (d.getDate() === now.getDate() && diffDays < 0 && diffTime > -86400000)) {
    remainingLabel = 'Today';
    remainingClass = 'text-brand-danger animate-pulse';
  } else if (diffDays === 1) {
    remainingLabel = 'Tomorrow';
    remainingClass = 'text-brand-accent';
  } else if (diffDays > 1) {
    remainingLabel = `In ${diffDays} days`;
    remainingClass = 'text-[#22C55E]';
  }

  return {
    date: formatter.format(d),
    time: timeFormatter.format(d),
    remainingLabel,
    remainingClass
  };
};

const MatchCard = ({ 
  match, 
  index,
  isNotified,
  onToggleNotification,
  opacityClass = ''
}: { 
  key?: React.Key, 
  match: Match, 
  index: number,
  isNotified: boolean,
  onToggleNotification: (id: string, matchTitle: string) => void,
  opacityClass?: string
}) => {
  const teamA = match.teamA === 'tbd' ? { name: 'TBD', shortName: 'TBD', color: '#D0D0D0' } as any : getClub(match.teamA);
  const teamB = match.teamB === 'tbd' ? { name: 'TBD', shortName: 'TBD', color: '#D0D0D0' } as any : getClub(match.teamB);
  
  const stageNumber = match.stage === 'group' ? `Match ${match.matchNumber}` : (match.stage === 'semi' ? 'SEMIFINAL' : 'FINAL');
  const isTBD = match.teamA === 'tbd' || match.teamB === 'tbd';

  const { date, time, remainingLabel, remainingClass } = formatMatchDate(match.date);

  const matchTitle = `${teamA.name} vs ${teamB.name}`;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ delay: index * 0.05, duration: 0.25 }}
      className={`border-b border-brand-border py-4 px-2 hover:bg-brand-standings-alt transition-colors ${opacityClass} ${isTBD ? 'opacity-50 grayscale' : ''} ${match.isLive ? 'border border-brand-danger shadow-[0_0_15px_rgba(200,0,0,0.1)] rounded-sm mb-4 relative overflow-hidden' : ''}`}
    >
      {match.isLive && (
        <div className="absolute top-0 left-0 w-full h-full pointer-events-none border border-brand-danger opacity-50 animate-pulse rounded-sm" />
      )}
      <div className={`flex flex-col sm:flex-row sm:items-center justify-between gap-2 relative z-10`}>
        {/* Match label & Date */}
        <div className="flex justify-between sm:flex-col sm:w-28 text-left">
          <span className="text-[10px] font-sans font-bold text-[#999999] uppercase tracking-wider">{stageNumber}</span>
          <div className="flex flex-col text-right sm:text-left">
            <span className="text-[9px] font-sans text-brand-gray mt-1 block h-[13px]">{date} {time && `• ${time}`}</span>
            {!isTBD && remainingLabel && (
              <span className={`text-[9px] font-sans font-bold uppercase tracking-widest mt-0.5 block ${remainingClass}`}>
                {remainingLabel}
              </span>
            )}
          </div>
        </div>

        {/* Center Teams */}
        <div className="flex-1 flex items-center justify-center gap-4 py-2 sm:py-0">
          <div className="flex-1 flex items-center justify-end gap-3">
            <span className="font-sans font-bold text-sm text-brand-dark hidden sm:inline">{teamA.name}</span>
            <span className="font-sans font-bold text-sm text-brand-dark sm:hidden">{teamA.shortName}</span>
            {match.teamA !== 'tbd' && <ClubBadge clubId={match.teamA} size={40} />}
          </div>
          
          {match.isLive ? (
            <div className="flex items-center gap-2">
              <span className="font-mono text-2xl font-black text-brand-dark">{match.scoreA ?? 0}</span>
              <span className="font-sans text-brand-gray text-lg">-</span>
              <span className="font-mono text-2xl font-black text-brand-dark">{match.scoreB ?? 0}</span>
            </div>
          ) : (
            <span className="font-playfair italic text-sm text-brand-accent">vs</span>
          )}
          
          <div className="flex-1 flex items-center justify-start gap-3">
            {match.teamB !== 'tbd' && <ClubBadge clubId={match.teamB} size={40} />}
            <span className="font-sans font-bold text-sm text-brand-dark hidden sm:inline">{teamB.name}</span>
            <span className="font-sans font-bold text-sm text-brand-dark sm:hidden">{teamB.shortName}</span>
          </div>
        </div>

        {/* Status chip & Alerts */}
        <div className="w-28 text-right flex items-center justify-end gap-1.5 shrink-0">
          {!isTBD && (
            <>
              <MatchShareButton match={match} iconSize={14} />
              <button
                onClick={() => onToggleNotification(match.id, matchTitle)}
                className="p-1.5 hover:bg-brand-nav/20 rounded-full transition-all focus:outline-none focus:ring-1 focus:ring-[#C8A84B]"
                title={isNotified ? 'Unsubscribe from alerts' : 'Notify me when live'}
              >
                <Bell 
                  size={14} 
                  className={`transition-all ${isNotified ? 'text-[#C8A84B] fill-[#C8A84B] scale-110' : 'text-brand-gray/60 hover:text-[#C8A84B]'}`} 
                />
              </button>
            </>
          )}
          {match.isLive ? (
            <span className="inline-block bg-brand-danger-surface border border-brand-danger-border text-brand-danger rounded-sm text-[9px] font-sans font-bold px-2 py-0.5 uppercase tracking-widest animate-pulse flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-brand-danger"></span>LIVE
            </span>
          ) : (
            <span className={`inline-block border ${isTBD ? 'border-[#D0D0D0] text-[#A0A0A0]' : 'border-brand-accent text-brand-accent'} rounded-sm text-[9px] font-sans font-bold px-2 py-0.5 uppercase`}>
              {isTBD ? 'LOCKED' : 'UPCOMING'}
            </span>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default function Fixtures({ data }: { data: any }) {
  const matches: Match[] = data.matches;
  const groupUpcoming = matches.filter(m => m.stage === 'group' && !m.isCompleted);
  const groupCompleted = matches.filter(m => m.stage === 'group' && m.isCompleted);
  const knockoutUpcoming = matches.filter(m => (m.stage === 'semi' || m.stage === 'final') && !m.isCompleted);
  const knockoutCompleted = matches.filter(m => (m.stage === 'semi' || m.stage === 'final') && m.isCompleted);

  const [notifiedMatches, setNotifiedMatches] = useState<string[]>([]);

  useEffect(() => {
    try {
      const saved = localStorage.getItem('efpl_notified_matches');
      if (saved) {
        setNotifiedMatches(JSON.parse(saved));
      }
    } catch (e) {
      console.warn('Could not parse notified matches', e);
    }
  }, []);

  const handleToggleNotification = async (matchId: string, matchTitle: string) => {
    const isSubscribed = notifiedMatches.includes(matchId);
    let updated: string[];

    if (isSubscribed) {
      updated = notifiedMatches.filter(id => id !== matchId);
      setNotifiedMatches(updated);
      localStorage.setItem('efpl_notified_matches', JSON.stringify(updated));
    } else {
      if (!('Notification' in window)) {
        alert('This browser does not support browser action system notifications.');
        return;
      }

      try {
        const permission = await Notification.requestPermission();
        if (permission === 'granted') {
          updated = [...notifiedMatches, matchId];
          setNotifiedMatches(updated);
          localStorage.setItem('efpl_notified_matches', JSON.stringify(updated));

          // Instant high-quality trigger context notification
          new Notification('🔔 EFPL Alert Enabled', {
            body: `You'll be notified immediately when ${matchTitle} goes LIVE!`,
            icon: '/icon-192.png'
          });
        } else {
          alert('Please enable browser notification permissions to receive alerts.');
        }
      } catch (err) {
        // Fallback for simple toggling if permission fails in nested frame
        updated = [...notifiedMatches, matchId];
        setNotifiedMatches(updated);
        localStorage.setItem('efpl_notified_matches', JSON.stringify(updated));
      }
    }
  };

  return (
    <div className="pt-12 px-4 pb-12 w-full max-w-2xl mx-auto">
      <div className="mb-6 text-center sm:text-left border-b border-brand-border pb-4">
        <span className="text-[10px] text-brand-accent font-sans font-bold tracking-[0.25em] uppercase mb-1 block">CALENDAR</span>
        <h2 className="font-playfair text-5xl italic text-brand-dark tracking-tight">
          Fixtures
        </h2>
        <p className="text-[11px] text-brand-gray font-sans mt-2 tracking-wide">
          Tap the bell icon <Bell size={10} className="inline mx-0.5 text-[#C8A84B] fill-[#C8A84B]" /> to receive local browser push notifications when your favorite clubs play LIVE matches.
        </p>
      </div>

      <div className="flex flex-col gap-12">
        {/* GROUP STAGE */}
        <div>
          <h3 className="font-sans font-bold text-[10px] tracking-[0.2em] uppercase text-brand-dark mb-4 border-b border-brand-border pb-2 pb-2">GROUP STAGE</h3>
          {groupCompleted.length > 0 && (
            <div className="flex flex-col bg-brand-surface border border-brand-border box-shadow-editorial rounded-sm p-2 mb-4">
              {groupCompleted.map((m, i) => (
                <MatchCard key={m.id} match={m} index={i} isNotified={notifiedMatches.includes(m.id)} onToggleNotification={handleToggleNotification} opacityClass="opacity-100" />
              ))}
            </div>
          )}
          {groupUpcoming.length > 0 && (
            <div className="flex flex-col bg-brand-surface border border-brand-border box-shadow-editorial rounded-sm p-2 opacity-70 hover:opacity-100 transition-opacity">
              {groupUpcoming.map((m, i) => (
                <MatchCard key={m.id} match={m} index={i} isNotified={notifiedMatches.includes(m.id)} onToggleNotification={handleToggleNotification} opacityClass="" />
              ))}
            </div>
          )}
          {groupCompleted.length === 0 && groupUpcoming.length === 0 && (
            <div className="text-center py-6 bg-brand-surface rounded-sm border border-brand-border">
              <p className="text-brand-gray font-sans text-sm tracking-widest uppercase">No group fixtures.</p>
            </div>
          )}
        </div>

        {/* KNOCKOUT STAGE */}
        <div>
          <h3 className="font-sans font-bold text-[10px] tracking-[0.2em] uppercase text-brand-accent mb-4 border-b border-brand-border pb-2">KNOCKOUT STAGE</h3>
          {knockoutCompleted.length > 0 && (
            <div className="flex flex-col bg-brand-surface border border-brand-border box-shadow-editorial rounded-sm p-2 mb-4">
              {knockoutCompleted.map((m, i) => (
                <MatchCard key={m.id} match={m} index={i} isNotified={notifiedMatches.includes(m.id)} onToggleNotification={handleToggleNotification} opacityClass="opacity-100" />
              ))}
            </div>
          )}
          {knockoutUpcoming.length > 0 && (
            <div className="flex flex-col bg-brand-surface border border-brand-border box-shadow-editorial rounded-sm p-2 opacity-70 hover:opacity-100 transition-opacity">
              {knockoutUpcoming.map((m, i) => (
                <MatchCard key={m.id} match={m} index={i} isNotified={notifiedMatches.includes(m.id)} onToggleNotification={handleToggleNotification} opacityClass="" />
              ))}
            </div>
          )}
          {knockoutCompleted.length === 0 && knockoutUpcoming.length === 0 && (
            <div className="text-center py-6 bg-brand-surface rounded-sm border border-brand-border">
              <p className="text-brand-gray font-sans text-sm tracking-widest uppercase">No knockout fixtures.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
