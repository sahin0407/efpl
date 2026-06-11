export interface Club {
  id: string;
  name: string;
  owner: string;
  shortName: string;
  color: string;
}

export interface Match {
  id: string;
  teamA: string; // Club ID
  teamB: string; // Club ID
  scoreA: number | null;
  scoreB: number | null;
  isCompleted: boolean;
  matchNumber: number;
  stage: 'group' | 'semi' | 'final';
  date?: string; // ISO string or similar
  isLive?: boolean;
  penaltyScoreA?: number | null;
  penaltyScoreB?: number | null;
  completedAt?: string;
}

export interface ClubStats {
  clubId: string;
  played: number;
  won: number;
  drawn: number;
  lost: number;
  goalsFor: number;
  goalsAgainst: number;
  goalDifference: number;
  points: number;
  form: ('W' | 'D' | 'L')[];
  cleanSheets: number;
  penaltyWins: number;
  penaltyLosses: number;
}

export const CLUBS: Club[] = [
  { id: 'mumbai', name: 'Mumbai City FC', owner: 'Sahin', shortName: 'MUM', color: '#0066cc' },
  { id: 'chennai', name: 'Chennai Super FC', owner: 'Mahshin', shortName: 'CHE', color: '#cc0000' },
  { id: 'bengaluru', name: 'Bengaluru United FC', owner: 'Khokan', shortName: 'BEN', color: '#ffaa00' },
  { id: 'rajasthan', name: 'Rajasthan Royals FC', owner: 'Nasim', shortName: 'RAJ', color: '#8800cc' },
  { id: 'hyderabad', name: 'Hyderabad Kings FC', owner: 'Rayhan', shortName: 'HYD', color: '#00aa44' },
];

export const getClub = (id: string) => CLUBS.find(c => c.id === id)!;

export const INITIAL_MATCHES: Match[] = [
  { id: '1', teamA: 'mumbai', teamB: 'chennai', scoreA: null, scoreB: null, isCompleted: false, matchNumber: 1, stage: 'group' },
  { id: '2', teamA: 'bengaluru', teamB: 'rajasthan', scoreA: null, scoreB: null, isCompleted: false, matchNumber: 2, stage: 'group' },
  { id: '3', teamA: 'hyderabad', teamB: 'mumbai', scoreA: null, scoreB: null, isCompleted: false, matchNumber: 3, stage: 'group' },
  { id: '4', teamA: 'chennai', teamB: 'bengaluru', scoreA: null, scoreB: null, isCompleted: false, matchNumber: 4, stage: 'group' },
  { id: '5', teamA: 'rajasthan', teamB: 'hyderabad', scoreA: null, scoreB: null, isCompleted: false, matchNumber: 5, stage: 'group' },
  { id: '6', teamA: 'mumbai', teamB: 'rajasthan', scoreA: null, scoreB: null, isCompleted: false, matchNumber: 6, stage: 'group' },
  { id: '7', teamA: 'chennai', teamB: 'hyderabad', scoreA: null, scoreB: null, isCompleted: false, matchNumber: 7, stage: 'group' },
  { id: '8', teamA: 'bengaluru', teamB: 'mumbai', scoreA: null, scoreB: null, isCompleted: false, matchNumber: 8, stage: 'group' },
  { id: '9', teamA: 'hyderabad', teamB: 'chennai', scoreA: null, scoreB: null, isCompleted: false, matchNumber: 9, stage: 'group' },
  { id: '10', teamA: 'rajasthan', teamB: 'bengaluru', scoreA: null, scoreB: null, isCompleted: false, matchNumber: 10, stage: 'group' },
  { id: '11', teamA: 'mumbai', teamB: 'chennai', scoreA: null, scoreB: null, isCompleted: false, matchNumber: 11, stage: 'group' },
  { id: '12', teamA: 'rajasthan', teamB: 'bengaluru', scoreA: null, scoreB: null, isCompleted: false, matchNumber: 12, stage: 'group' },
  { id: '13', teamA: 'hyderabad', teamB: 'chennai', scoreA: null, scoreB: null, isCompleted: false, matchNumber: 13, stage: 'group' },
  { id: '14', teamA: 'mumbai', teamB: 'rajasthan', scoreA: null, scoreB: null, isCompleted: false, matchNumber: 14, stage: 'group' },
  { id: '15', teamA: 'bengaluru', teamB: 'hyderabad', scoreA: null, scoreB: null, isCompleted: false, matchNumber: 15, stage: 'group' },
  { id: '16', teamA: 'chennai', teamB: 'mumbai', scoreA: null, scoreB: null, isCompleted: false, matchNumber: 16, stage: 'group' },
  { id: '17', teamA: 'bengaluru', teamB: 'rajasthan', scoreA: null, scoreB: null, isCompleted: false, matchNumber: 17, stage: 'group' },
  { id: '18', teamA: 'hyderabad', teamB: 'mumbai', scoreA: null, scoreB: null, isCompleted: false, matchNumber: 18, stage: 'group' },
  { id: '19', teamA: 'rajasthan', teamB: 'chennai', scoreA: null, scoreB: null, isCompleted: false, matchNumber: 19, stage: 'group' },
  { id: '20', teamA: 'bengaluru', teamB: 'hyderabad', scoreA: null, scoreB: null, isCompleted: false, matchNumber: 20, stage: 'group' },
  { id: '21', teamA: 'chennai', teamB: 'rajasthan', scoreA: null, scoreB: null, isCompleted: false, matchNumber: 21, stage: 'group' },
  { id: '22', teamA: 'mumbai', teamB: 'bengaluru', scoreA: null, scoreB: null, isCompleted: false, matchNumber: 22, stage: 'group' },
  { id: '23', teamA: 'hyderabad', teamB: 'rajasthan', scoreA: null, scoreB: null, isCompleted: false, matchNumber: 23, stage: 'group' },
  { id: '24', teamA: 'chennai', teamB: 'mumbai', scoreA: null, scoreB: null, isCompleted: false, matchNumber: 24, stage: 'group' },
  { id: '25', teamA: 'bengaluru', teamB: 'chennai', scoreA: null, scoreB: null, isCompleted: false, matchNumber: 25, stage: 'group' },
  { id: '26', teamA: 'rajasthan', teamB: 'mumbai', scoreA: null, scoreB: null, isCompleted: false, matchNumber: 26, stage: 'group' },
  { id: '27', teamA: 'hyderabad', teamB: 'bengaluru', scoreA: null, scoreB: null, isCompleted: false, matchNumber: 27, stage: 'group' },
  { id: '28', teamA: 'chennai', teamB: 'rajasthan', scoreA: null, scoreB: null, isCompleted: false, matchNumber: 28, stage: 'group' },
  { id: '29', teamA: 'mumbai', teamB: 'hyderabad', scoreA: null, scoreB: null, isCompleted: false, matchNumber: 29, stage: 'group' },
  { id: '30', teamA: 'bengaluru', teamB: 'chennai', scoreA: null, scoreB: null, isCompleted: false, matchNumber: 30, stage: 'group' },
  { id: '31', teamA: 'rajasthan', teamB: 'hyderabad', scoreA: null, scoreB: null, isCompleted: false, matchNumber: 31, stage: 'group' },
  { id: '32', teamA: 'mumbai', teamB: 'bengaluru', scoreA: null, scoreB: null, isCompleted: false, matchNumber: 32, stage: 'group' },
  { id: '33', teamA: 'chennai', teamB: 'hyderabad', scoreA: null, scoreB: null, isCompleted: false, matchNumber: 33, stage: 'group' },
  { id: '34', teamA: 'rajasthan', teamB: 'mumbai', scoreA: null, scoreB: null, isCompleted: false, matchNumber: 34, stage: 'group' },
  { id: '35', teamA: 'hyderabad', teamB: 'bengaluru', scoreA: null, scoreB: null, isCompleted: false, matchNumber: 35, stage: 'group' },
  { id: '36', teamA: 'chennai', teamB: 'bengaluru', scoreA: null, scoreB: null, isCompleted: false, matchNumber: 36, stage: 'group' },
  { id: '37', teamA: 'mumbai', teamB: 'hyderabad', scoreA: null, scoreB: null, isCompleted: false, matchNumber: 37, stage: 'group' },
  { id: '38', teamA: 'rajasthan', teamB: 'chennai', scoreA: null, scoreB: null, isCompleted: false, matchNumber: 38, stage: 'group' },
  { id: '39', teamA: 'hyderabad', teamB: 'rajasthan', scoreA: null, scoreB: null, isCompleted: false, matchNumber: 39, stage: 'group' },
  { id: '40', teamA: 'bengaluru', teamB: 'mumbai', scoreA: null, scoreB: null, isCompleted: false, matchNumber: 40, stage: 'group' },
  { id: 'semi', teamA: 'tbd', teamB: 'tbd', scoreA: null, scoreB: null, isCompleted: false, matchNumber: 41, stage: 'semi' },
  { id: 'final', teamA: 'tbd', teamB: 'tbd', scoreA: null, scoreB: null, isCompleted: false, matchNumber: 42, stage: 'final' }
];
