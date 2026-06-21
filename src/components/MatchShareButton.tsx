import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Share2, Check } from 'lucide-react';
import { Match, CLUBS } from '../types';

interface MatchShareButtonProps {
  match: Match;
  className?: string;
  iconSize?: number;
}

const getClub = (id: string) => CLUBS.find(c => c.id === id);

const formatMatchDate = (dateStr?: string) => {
  if (!dateStr) return null;
  const d = new Date(dateStr);
  const formatter = new Intl.DateTimeFormat('en-GB', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' });
  return formatter.format(d);
};

export function MatchShareButton({ match, className = "", iconSize = 14 }: MatchShareButtonProps) {
  const [copied, setCopied] = useState(false);

  const handleShare = async (e: React.MouseEvent) => {
    e.stopPropagation();

    const teamA = match.teamA === 'tbd' ? { name: 'TBD', shortName: 'TBD' } : getClub(match.teamA);
    const teamB = match.teamB === 'tbd' ? { name: 'TBD', shortName: 'TBD' } : getClub(match.teamB);

    if (!teamA || !teamB) return;

    let shareText = "";
    let title = "EFPL 2026 Match";

    if (match.isCompleted) {
      title = `EFPL Match Result: ${teamA.shortName} vs ${teamB.shortName}`;
      const hasPenalties = match.penaltyScoreA !== null && match.penaltyScoreB !== null;
      const playedDate = formatMatchDate(match.date);
      
      let pText = "";
      if (hasPenalties) {
        const aWon = match.penaltyScoreA! > match.penaltyScoreB!;
        pText = `\n🏆 Won on penalties by ${aWon ? teamA.name : teamB.name} (${match.penaltyScoreA}-${match.penaltyScoreB})\n`;
      }

      shareText = `🏆 EFPL 2026 - FULL TIME\n\n⚽ ${teamA.name} ${match.scoreA} — ${match.scoreB} ${teamB.name}${pText}\n📅 Played on: ${playedDate || 'TBD'}\n🌐 Check standings at: ${window.location.origin}\n\n#EFPL2026 #MoreThanAMatch`;
    } else if (match.isLive) {
      title = `EFPL LIVE: ${teamA.shortName} vs ${teamB.shortName}`;
      shareText = `🔥 EFPL 2026 - LIVE NOW\n\n⚽ ${teamA.name} ${match.scoreA ?? 0} — ${match.scoreB ?? 0} ${teamB.name}\n\n🌐 Track live scores at: ${window.location.origin}\n\n#EFPL2026 #MoreThanAMatch`;
    } else {
      title = `EFPL Fixture: ${teamA.shortName} vs ${teamB.shortName}`;
      const d = match.date ? new Date(match.date) : null;
      const dateStr = d ? d.toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short' }) : 'TBD';
      const timeStr = d ? d.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true }) : '';
      
      shareText = `📅 EFPL 2026 - UPCOMING MATCH\n\n⚽ ${teamA.name} vs ${teamB.name}\n📅 Scheduled: ${dateStr} ${timeStr ? `at ${timeStr}` : ''}\n🌐 View schedule at: ${window.location.origin}\n\n#EFPL2026 #MoreThanAMatch`;
    }

    // Try Web Share API first
    if (navigator.share) {
      try {
        await navigator.share({
          title,
          text: shareText,
          url: window.location.origin
        });
        return; // Success
      } catch (err) {
        // If aborted, do nothing. If error/not allowed, fallback to clipboard.
        if (err instanceof Error && err.name === 'AbortError') {
          return;
        }
      }
    }

    // Fallback to Clipboard copy
    try {
      await navigator.clipboard.writeText(shareText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (clipboardErr) {
      console.error('Clipboard copy failed', clipboardErr);
    }
  };

  return (
    <div className="relative inline-block">
      <motion.button
        whileTap={{ scale: 0.9 }}
        onClick={handleShare}
        className={`p-1.5 rounded-full hover:bg-brand-nav/20 cursor-pointer text-brand-gray/60 hover:text-[#C8A84B] transition-all focus:outline-none focus:ring-1 focus:ring-[#C8A84B] flex items-center justify-center ${className}`}
        title="Share match details"
      >
        {copied ? (
          <Check size={iconSize} className="text-green-500 transition-transform" />
        ) : (
          <Share2 size={iconSize} className="transition-transform" />
        )}
      </motion.button>

      <AnimatePresence>
        {copied && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -5, scale: 0.95 }}
            className="absolute z-50 bottom-full left-1/2 -translate-x-1/2 mb-2 px-2.5 py-1 text-[10px] bg-brand-dark/95 text-white rounded shadow-md whitespace-nowrap pointer-events-none font-sans font-bold tracking-wider"
          >
            COPIED!
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
