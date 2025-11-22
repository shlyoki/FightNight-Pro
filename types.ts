
export enum FightStatus {
  UPCOMING = 'UPCOMING',
  IN_PROGRESS = 'IN_PROGRESS',
  FINISHED = 'FINISHED'
}

export enum MediaType {
  PHOTO = 'PHOTO',
  VIDEO = 'VIDEO'
}

export interface Fighter {
  id: string;
  name: string;
  nickname?: string;
  country: string;
  gym?: string;
  weightClass: string;
  stance?: 'Orthodox' | 'Southpaw' | 'Switch'; 
  recordWins: number;
  recordLosses: number;
  recordDraws: number;
  koWins: number;
  submissionWins: number;
  decisionWins: number;
  heightCm?: number;
  reachCm?: number;
  bio: string;
  imageUrl: string;
  isVerified?: boolean; // Blockchain belt verification
  
  // Fantasy Stock Market
  stockPrice: number;
  stockChange: number; // Percentage change (24h)
}

export interface Fight {
  id: string;
  eventName: string;
  date: string; // ISO string
  location: string;
  weightClass: string;
  fighterAId: string;
  fighterBId: string;
  status: FightStatus;
  resultWinnerId?: string | null;
  resultMethod?: string; // "KO", "Submission", "Decision"
  resultRound?: number;
  resultTime?: string;

  // Betting / Parimutuel Pools
  poolA?: number; // Total points bet on Fighter A
  poolB?: number; // Total points bet on Fighter B
  isBettingLocked?: boolean;
}

export interface Media {
  id: string;
  title: string;
  type: MediaType;
  thumbnailUrl: string;
  mediaUrl: string;
  createdAt: string;
}

export interface Bounty {
  id: string;
  title: string;
  description: string;
  reward: string; // e.g. "Free Rashguard" or "500 Tokens"
  status: 'ACTIVE' | 'CLAIMED';
  claimedByFighterId?: string;
  eventFilter?: string; // Optional: specific event ID
}

export interface Bet {
  id: string;
  userId: string;
  fightId: string;
  fighterId: string;
  amount: number;
  oddsAtPlacement: number; // Snapshot of odds (approximate for user ref)
  potentialReturn: number; // Estimate
  status: 'OPEN' | 'WON' | 'LOST' | 'REFUNDED';
  timestamp: string;
}

// Helper types for UI
export interface FightWithFighters extends Fight {
  fighterA: Fighter;
  fighterB: Fighter;
}

export interface Prediction {
  id: string;
  userId: string;
  userEmail: string;
  fightId: string;
  predictedWinnerId: string;
  isCorrect?: boolean;
  timestamp: string;
}

export interface FightUpdate {
  id: string;
  fightId: string;
  timestamp: string;
  message: string;
  type: 'STRIKE' | 'TAKEDOWN' | 'SUBMISSION_ATTEMPT' | 'KNOCKDOWN' | 'ROUND_END' | 'INFO' | 'ODDS_UPDATE' | 'BETS_LOCKED';
  data?: any;
}

// --- New Application Types ---

export interface FighterApplication {
  id: string;
  fullName: string;
  email: string;
  age: number;
  weightClass: string;
  heightCm: number;
  experience: string; // e.g., "5-0 Amateur"
  gym: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  submittedAt: string;
}

export interface Tournament {
  id: string;
  name: string;
  date: string;
  location: string;
  division: string; // e.g. "Open Weight" or "Lightweight GP"
  prizePool: string;
  maxEntrants: number;
  currentEntrants: number;
  status: 'OPEN' | 'CLOSED' | 'COMPLETED';
  description: string;
}

export interface TournamentApplication {
  id: string;
  tournamentId: string;
  fighterName: string;
  email: string;
  team?: string;
  status: 'PENDING' | 'ACCEPTED';
  submittedAt: string;
}
