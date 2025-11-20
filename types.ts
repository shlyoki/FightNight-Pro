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
}

export interface Media {
  id: string;
  title: string;
  type: MediaType;
  thumbnailUrl: string;
  mediaUrl: string;
  createdAt: string;
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
  type: 'STRIKE' | 'TAKEDOWN' | 'SUBMISSION_ATTEMPT' | 'KNOCKDOWN' | 'ROUND_END' | 'INFO';
}