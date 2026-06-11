import { useMemo } from 'react';
import { motion } from 'motion/react';
import {
  LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Legend,
  BarChart, Bar, Cell, LabelList,
  ComposedChart, Scatter, ScatterChart, ZAxis
} from 'recharts';
import { Match, CLUBS, ClubStats } from '../types';
import { useInView } from 'motion/react';
import { useRef } from 'react';

function getClubByShortName(shortName: string) {
  return CLUBS.find(c => c.shortName === shortName)!;
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    // Reverse logic based on text color css var, or just use custom styles
    return (
      <div 
        className="px-3 py-2 rounded shadow-lg text-sm font-sans z-50"
        style={{ 
          backgroundColor: 'var(--text-primary)', 
          color: 'var(--bg-surface)' 
        }}
      >
        <p className="font-bold mb-1" style={{ color: 'var(--bg-surface)' }}>{label}</p>
        {payload.map((entry: any, index: number) => (
          <p key={index} style={{ color: entry.color || entry.fill }}>
            {entry.name}: <span className="font-mono">{entry.value}</span>
          </p>
        ))}
      </div>
    );
  }
  return null;
};

// 1. Points Progression Chart
function PointsProgression({ matches }: { matches: Match[] }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });

  const data = useMemo(() => {
    const groupMatches = matches.filter(m => m.stage === 'group' && m.isCompleted);
    if (groupMatches.length === 0) return [];

    let currentPoints: Record<string, number> = {};
    CLUBS.forEach(c => currentPoints[c.id] = 0);

    const matchHistory = [];
    
    // Create an initial point
    const initialPoint: any = { matchStr: 'Start' };
    CLUBS.forEach(c => initialPoint[c.shortName] = 0);
    matchHistory.push(initialPoint);

    for (const match of groupMatches) {
      if (match.scoreA! > match.scoreB!) {
        currentPoints[match.teamA] += 3;
      } else if (match.scoreA! < match.scoreB!) {
        currentPoints[match.teamB] += 3;
      } else {
        currentPoints[match.teamA] += 1;
        currentPoints[match.teamB] += 1;
      }

      const pointData: any = { matchStr: `M${match.matchNumber}` };
      CLUBS.forEach(c => pointData[c.shortName] = currentPoints[c.id]);
      matchHistory.push(pointData);
    }
    return matchHistory;
  }, [matches]);

  if (data.length === 0) {
    return (
      <div className="bg-brand-surface border-t border-brand-accent shadow-[0_4px_20px_rgba(0,0,0,0.06)] p-6 mb-8 border border-brand-border h-[300px] flex items-center justify-center">
        <p className="text-brand-gray italic font-sans">No data yet</p>
      </div>
    );
  }

  return (
    <motion.div 
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5 }}
      className="bg-brand-surface border-t border-brand-accent shadow-[0_4px_20px_rgba(0,0,0,0.06)] p-4 md:p-6 mb-8 border border-brand-border w-full overflow-x-auto"
    >
      <h3 className="font-sans font-bold text-[10px] tracking-[0.2em] uppercase text-brand-accent mb-6">Points Race</h3>
      <div className="min-w-[600px] w-full h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border-color)" />
            <XAxis dataKey="matchStr" tick={{ fill: 'var(--text-secondary)', fontSize: 10, fontFamily: 'DM Sans' }} axisLine={{ stroke: 'var(--border-color)' }} tickLine={{ stroke: 'var(--border-color)' }} />
            <YAxis tick={{ fill: 'var(--text-secondary)', fontSize: 10, fontFamily: 'DM Mono' }} axisLine={false} tickLine={false} />
            <Tooltip content={<CustomTooltip />} />
            <Legend wrapperStyle={{ fontSize: '10px', fontFamily: 'DM Sans', paddingTop: '10px' }} />
            {CLUBS.map((club) => (
              <Line 
                key={club.id}
                type="stepAfter" 
                dataKey={club.shortName} 
                name={club.name}
                stroke={club.color} 
                strokeWidth={2}
                dot={{ r: 3, strokeWidth: 2, fill: 'var(--bg-surface)' }}
                activeDot={{ r: 5 }}
                isAnimationActive={isInView}
                animationDuration={1000}
              />
            ))}
          </LineChart>
        </ResponsiveContainer>
      </div>
    </motion.div>
  );
}

// 2. Goals Scored Per Club
function GoalsScoredChart({ standings }: { standings: ClubStats[] }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });

  const data = useMemo(() => {
    return standings.map(s => {
      const club = CLUBS.find(c => c.id === s.clubId)!;
      return {
        name: club.shortName,
        clubName: club.name,
        goals: s.goalsFor,
        color: club.color
      };
    }).sort((a, b) => b.goals - a.goals);
  }, [standings]);

  if (standings.length === 0 || standings[0].played === 0) return null;

  return (
    <motion.div 
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, delay: 0.1 }}
      className="bg-brand-surface border-t border-brand-accent shadow-[0_4px_20px_rgba(0,0,0,0.06)] p-4 md:p-6 mb-8 border border-brand-border w-full"
    >
      <h3 className="font-sans font-bold text-[10px] tracking-[0.2em] uppercase text-brand-accent mb-6">Goals Scored</h3>
      <div className="w-full h-[250px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 20, right: 0, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border-color)" />
            <XAxis dataKey="name" tick={{ fill: 'var(--text-secondary)', fontSize: 10, fontFamily: 'DM Sans' }} axisLine={{ stroke: 'var(--border-color)' }} tickLine={false} />
            <YAxis tick={{ fill: 'var(--text-secondary)', fontSize: 10, fontFamily: 'DM Mono' }} axisLine={false} tickLine={false} />
            <Tooltip content={<CustomTooltip />} cursor={{ fill: 'var(--border-color)', opacity: 0.4 }} />
            <Bar dataKey="goals" name="Goals" radius={[2, 2, 0, 0]} isAnimationActive={isInView} animationDuration={600}>
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
              <LabelList dataKey="goals" position="top" fill="var(--text-primary)" fontSize={10} fontFamily="DM Mono" />
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </motion.div>
  );
}

// 3. Win/Draw/Loss Breakdown
function MatchRecordChart({ standings }: { standings: ClubStats[] }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });

  const data = useMemo(() => {
    return standings.map(s => {
      const club = CLUBS.find(c => c.id === s.clubId)!;
      return {
        name: club.shortName,
        Wins: s.won,
        Draws: s.drawn,
        Losses: s.lost,
        winRate: s.played > 0 ? Math.round((s.won / s.played) * 100) : 0
      };
    });
  }, [standings]);

  if (standings.length === 0 || standings[0].played === 0) return null;

  return (
    <motion.div 
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="bg-brand-surface border-t border-brand-accent shadow-[0_4px_20px_rgba(0,0,0,0.06)] p-4 md:p-6 mb-8 border border-brand-border w-full"
    >
      <h3 className="font-sans font-bold text-[10px] tracking-[0.2em] uppercase text-brand-accent mb-6">Match Record</h3>
      <div className="w-full h-[250px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} layout="vertical" margin={{ top: 0, right: 30, left: 10, bottom: 0 }}>
            <XAxis type="number" hide />
            <YAxis dataKey="name" type="category" tick={{ fill: 'var(--text-secondary)', fontSize: 10, fontFamily: 'DM Sans', fontWeight: 'bold' }} axisLine={false} tickLine={false} />
            <Tooltip content={<CustomTooltip />} cursor={{ fill: 'var(--border-color)', opacity: 0.4 }} />
            <Legend wrapperStyle={{ fontSize: '10px', fontFamily: 'DM Sans', paddingTop: '10px' }} />
            <Bar dataKey="Wins" stackId="a" fill="#22C55E" isAnimationActive={isInView} animationDuration={600} />
            <Bar dataKey="Draws" stackId="a" fill="#F59E0B" isAnimationActive={isInView} animationDuration={600} />
            <Bar dataKey="Losses" stackId="a" fill="#EF4444" isAnimationActive={isInView} animationDuration={600}>
              <LabelList dataKey="winRate" position="right" formatter={(v: number) => `${v}%`} fill="var(--text-muted)" fontSize={10} fontFamily="DM Mono" />
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </motion.div>
  );
}

// 4. Goals For vs Against
function AttackVsDefenceChart({ standings }: { standings: ClubStats[] }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });

  const data = useMemo(() => {
    return standings.map(s => {
      const club = CLUBS.find(c => c.id === s.clubId)!;
      return {
        name: club.shortName,
        'Goals For': s.goalsFor,
        'Goals Against': s.goalsAgainst,
        color: club.color
      };
    });
  }, [standings]);

  if (standings.length === 0 || standings[0].played === 0) return null;

  return (
    <motion.div 
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, delay: 0.3 }}
      className="bg-brand-surface border-t border-brand-accent shadow-[0_4px_20px_rgba(0,0,0,0.06)] p-4 md:p-6 mb-8 border border-brand-border w-full"
    >
      <h3 className="font-sans font-bold text-[10px] tracking-[0.2em] uppercase text-brand-accent mb-6">Attack vs Defence</h3>
      <div className="w-full h-[250px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 20, right: 0, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border-color)" />
            <XAxis dataKey="name" tick={{ fill: 'var(--text-secondary)', fontSize: 10, fontFamily: 'DM Sans' }} axisLine={{ stroke: 'var(--border-color)' }} tickLine={false} />
            <YAxis tick={{ fill: 'var(--text-secondary)', fontSize: 10, fontFamily: 'DM Mono' }} axisLine={false} tickLine={false} />
            <Tooltip content={<CustomTooltip />} cursor={{ fill: 'var(--border-color)', opacity: 0.4 }} />
            <Legend wrapperStyle={{ fontSize: '10px', fontFamily: 'DM Sans', paddingTop: '10px' }} />
            <Bar dataKey="Goals For" radius={[2, 2, 0, 0]} isAnimationActive={isInView} animationDuration={600}>
               {data.map((entry, index) => (
                <Cell key={`cell-gf-${index}`} fill={entry.color} />
              ))}
            </Bar>
            <Bar dataKey="Goals Against" fill="#E63946" radius={[2, 2, 0, 0]} isAnimationActive={isInView} animationDuration={600} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </motion.div>
  );
}

// 5. Form Tracker
function FormTracker({ standings }: { standings: ClubStats[] }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-10px" });

  if (standings.length === 0 || standings[0].played === 0) return null;

  return (
    <motion.div 
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, delay: 0.4 }}
      className="bg-brand-surface border-t border-brand-accent shadow-[0_4px_20px_rgba(0,0,0,0.06)] p-4 md:p-6 mb-8 border border-brand-border w-full flex flex-col overflow-x-auto"
    >
      <h3 className="font-sans font-bold text-[10px] tracking-[0.2em] uppercase text-brand-accent mb-6">Recent Form</h3>
      <div className="flex justify-between items-center mb-3 min-w-[300px]">
        <div className="w-[60px]"></div>
        <div className="flex-1 flex justify-between px-2 text-[8px] font-sans text-brand-muted uppercase tracking-[0.1em]">
          <span>Older</span>
          <span>Recent</span>
        </div>
      </div>
      
      <div className="flex flex-col gap-5 min-w-[300px]">
        {standings.map((stat, i) => {
          const club = CLUBS.find(c => c.id === stat.clubId)!;
          // Get last 10 
          const form10 = [...stat.form].slice(-10);
          // Pad to 10 with nulls if less than 10
          while (form10.length < 10) form10.unshift(null as any);
          
          return (
            <div key={club.id} className="flex items-center">
              <div className="w-[60px] shrink-0 font-sans font-bold text-sm text-brand-dark">
                {club.shortName}
              </div>
              <div className="flex-1 flex justify-between px-2">
                {form10.map((result, idx) => {
                  let bgColor = 'bg-transparent border border-brand-border';
                  if (result === 'W') bgColor = 'bg-[#22C55E]';
                  else if (result === 'D') bgColor = 'bg-[#F59E0B]';
                  else if (result === 'L') bgColor = 'bg-[#EF4444]';
                  else bgColor = 'bg-brand-border'; // 5 gray empty circles if not complete
                  
                  return (
                    <motion.div
                      key={idx}
                      initial={{ scale: 0, opacity: 0 }}
                      animate={isInView ? { scale: 1, opacity: 1 } : {}}
                      transition={{ delay: 0.5 + (idx * 0.05) + (i * 0.1), duration: 0.2 }}
                      className={`w-[14px] h-[14px] sm:w-[18px] sm:h-[18px] rounded-full flex shrink-0 cursor-pointer ${result ? bgColor : 'border border-brand-border bg-transparent'}`}
                    >
                      {result && (
                        <div 
                          className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover:block whitespace-nowrap text-[10px] font-sans px-2 py-1 rounded shadow-lg z-50"
                          style={{ backgroundColor: 'var(--text-primary)', color: 'var(--bg-primary)' }}
                        >
                          Match {stat.played - form10.filter(r => r).length + 1 + idx} — {result === 'W' ? 'Win' : result === 'D' ? 'Draw' : 'Loss'}
                        </div>
                      )}
                    </motion.div>
                  )
                })}
              </div>
            </div>
          )
        })}
      </div>
    </motion.div>
  );
}

export default function Analytics({ data }: { data: any }) {
  const standings: ClubStats[] = data.standings;
  const matches: Match[] = data.matches;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="w-full"
    >
      <div className="text-center mb-10 pt-4">
        <span className="text-[10px] text-brand-accent font-sans font-bold tracking-[0.25em] uppercase mb-2 block">
          ANALYTICS
        </span>
        <h2 className="font-playfair text-4xl md:text-5xl italic text-brand-dark tracking-tight">
          Progress
        </h2>
      </div>

      <PointsProgression matches={matches} />
      
      {standings.length > 0 && standings[0].played > 0 && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6">
            <GoalsScoredChart standings={standings} />
            <AttackVsDefenceChart standings={standings} />
          </div>
          <MatchRecordChart standings={standings} />
          <FormTracker standings={standings} />
        </>
      )}

    </motion.div>
  );
}
