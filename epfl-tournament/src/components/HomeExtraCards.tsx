import { ClubStats, getClub } from '../types';
import { ClubBadge } from './ClubBadge';
import { OwnerAvatar } from './OwnerAvatar';

export function HomeExtraCards({ standings }: { standings: ClubStats[] }) {
  if (standings.length === 0 || standings[0].played === 0) return null;

  const pointsLeader = standings[0];
  const topScoring = [...standings].sort((a, b) => b.goalsFor - a.goalsFor)[0];

  const leaderClub = getClub(pointsLeader.clubId);
  const scoringClub = getClub(topScoring.clubId);

  return (
    <div className="w-full max-w-2xl mx-auto px-4 mb-12 grid grid-cols-1 md:grid-cols-2 gap-4">
      {/* Points Leader Card */}
      <div className="bg-brand-surface border-t border-brand-accent shadow-[0_4px_20px_rgba(0,0,0,0.06)] py-6 px-4 flex flex-col items-center justify-center text-center">
        <h3 className="text-brand-accent text-[10px] font-sans font-bold tracking-[0.25em] uppercase mb-4">POINTS LEADER</h3>
        <div className="flex flex-col items-center gap-3">
          <div className="relative">
            <ClubBadge clubId={leaderClub.id} size={56} />
            <div className="absolute -bottom-2 -right-2 bg-brand-surface p-0.5 rounded-full border border-brand-border">
              <OwnerAvatar clubId={leaderClub.id} size={24} />
            </div>
          </div>
          <div>
            <span className="font-sans font-bold text-lg text-brand-dark leading-none block">{leaderClub.name}</span>
            <span className="font-mono text-sm text-brand-gray mt-1 block">{pointsLeader.points} PTS</span>
          </div>
        </div>
      </div>

      {/* Top Scoring Card */}
      <div className="bg-brand-surface border-t border-brand-accent shadow-[0_4px_20px_rgba(0,0,0,0.06)] py-6 px-4 flex flex-col items-center justify-center text-center">
        <h3 className="text-brand-accent text-[10px] font-sans font-bold tracking-[0.25em] uppercase mb-4">TOP SCORING CLUB</h3>
        <div className="flex flex-col items-center gap-3">
          <ClubBadge clubId={scoringClub.id} size={56} />
          <div>
            <span className="font-sans font-bold text-lg text-brand-dark leading-none block">{scoringClub.name}</span>
            <span className="font-mono text-sm text-brand-gray mt-1 block">{topScoring.goalsFor} GOALS</span>
          </div>
        </div>
      </div>
    </div>
  );
}
