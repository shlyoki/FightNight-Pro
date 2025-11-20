import { Fight, Fighter, FightStatus, Media, MediaType, FightWithFighters, Prediction, FightUpdate } from '../types';

// --- Initial Seed Data ---

const INITIAL_FIGHTERS: Fighter[] = [
  {
    id: '1',
    name: 'Alex "The Lion" Pereira',
    nickname: 'Poatan',
    country: 'Brazil',
    gym: 'Teixeira MMA',
    weightClass: 'Light Heavyweight',
    stance: 'Orthodox',
    recordWins: 9,
    recordLosses: 2,
    recordDraws: 0,
    koWins: 7,
    submissionWins: 0,
    decisionWins: 2,
    heightCm: 193,
    reachCm: 200,
    bio: 'A terrifying striker with legendary power in his left hook.',
    imageUrl: 'https://picsum.photos/seed/alex/400/400'
  },
  {
    id: '2',
    name: 'Israel Adesanya',
    nickname: 'The Last Stylebender',
    country: 'Nigeria',
    gym: 'City Kickboxing',
    weightClass: 'Middleweight',
    stance: 'Switch',
    recordWins: 24,
    recordLosses: 3,
    recordDraws: 0,
    koWins: 16,
    submissionWins: 0,
    decisionWins: 8,
    heightCm: 193,
    reachCm: 203,
    bio: 'One of the most technical strikers in MMA history.',
    imageUrl: 'https://picsum.photos/seed/izzy/400/400'
  },
  {
    id: '3',
    name: 'Jon Jones',
    nickname: 'Bones',
    country: 'USA',
    gym: 'Jackson Wink',
    weightClass: 'Heavyweight',
    stance: 'Orthodox',
    recordWins: 27,
    recordLosses: 1,
    recordDraws: 0,
    koWins: 10,
    submissionWins: 7,
    decisionWins: 10,
    heightCm: 193,
    reachCm: 215,
    bio: 'Widely considered the greatest of all time.',
    imageUrl: 'https://picsum.photos/seed/jones/400/400'
  },
  {
    id: '4',
    name: 'Stipe Miocic',
    nickname: '',
    country: 'USA',
    gym: 'Strong Style',
    weightClass: 'Heavyweight',
    stance: 'Orthodox',
    recordWins: 20,
    recordLosses: 4,
    recordDraws: 0,
    koWins: 15,
    submissionWins: 0,
    decisionWins: 5,
    heightCm: 193,
    reachCm: 203,
    bio: 'The most successful heavyweight champion in UFC history.',
    imageUrl: 'https://picsum.photos/seed/stipe/400/400'
  },
  {
    id: '5',
    name: 'Charles Oliveira',
    nickname: 'Do Bronx',
    country: 'Brazil',
    gym: 'Chute Boxe',
    weightClass: 'Lightweight',
    stance: 'Orthodox',
    recordWins: 34,
    recordLosses: 9,
    recordDraws: 0,
    koWins: 10,
    submissionWins: 21,
    decisionWins: 3,
    heightCm: 178,
    reachCm: 188,
    bio: 'The submission king of the lightweight division.',
    imageUrl: 'https://picsum.photos/seed/charlie/400/400'
  }
];

const INITIAL_FIGHTS: Fight[] = [
  {
    id: '101',
    eventName: 'UFC 300: Pereira vs Adesanya 3',
    date: new Date(Date.now() + 86400000 * 5).toISOString(), // 5 days from now
    location: 'Las Vegas, NV',
    weightClass: 'Light Heavyweight',
    fighterAId: '1',
    fighterBId: '2',
    status: FightStatus.UPCOMING,
  },
  {
    id: '102',
    eventName: 'UFC 309: Jones vs Miocic',
    date: new Date(Date.now() + 86400000 * 20).toISOString(), // 20 days from now
    location: 'New York, NY',
    weightClass: 'Heavyweight',
    fighterAId: '3',
    fighterBId: '4',
    status: FightStatus.UPCOMING,
  },
  {
    id: '103',
    eventName: 'UFC 280: Oliveira vs Makhachev',
    date: '2022-10-22T22:00:00Z',
    location: 'Abu Dhabi',
    weightClass: 'Lightweight',
    fighterAId: '5',
    fighterBId: '3',
    status: FightStatus.FINISHED,
    resultWinnerId: '3',
    resultMethod: 'Submission',
    resultRound: 2,
    resultTime: '3:16'
  },
  {
    id: '104',
    eventName: 'Fight Night: Live Main Event',
    date: new Date().toISOString(),
    location: 'London, UK',
    weightClass: 'Middleweight',
    fighterAId: '2',
    fighterBId: '5', // Fantasy matchup for demo
    status: FightStatus.IN_PROGRESS,
  }
];

const INITIAL_MEDIA: Media[] = [
  {
    id: '201',
    title: 'Face off: Pereira vs Adesanya',
    type: MediaType.VIDEO,
    thumbnailUrl: 'https://picsum.photos/seed/vid1/600/337',
    mediaUrl: '#',
    createdAt: new Date().toISOString()
  },
  {
    id: '202',
    title: 'Jon Jones Training Camp',
    type: MediaType.PHOTO,
    thumbnailUrl: 'https://picsum.photos/seed/pic1/600/337',
    mediaUrl: 'https://picsum.photos/seed/pic1/1200/800',
    createdAt: new Date().toISOString()
  },
  {
    id: '203',
    title: 'Top 5 Knockouts of 2024',
    type: MediaType.VIDEO,
    thumbnailUrl: 'https://picsum.photos/seed/vid2/600/337',
    mediaUrl: '#',
    createdAt: new Date().toISOString()
  }
];

const INITIAL_PREDICTIONS: Prediction[] = [
  { id: 'p1', userId: 'demo_user', userEmail: 'fan@demo.com', fightId: '103', predictedWinnerId: '3', isCorrect: true, timestamp: new Date().toISOString() },
  { id: 'p2', userId: 'user2', userEmail: 'expert@mma.com', fightId: '103', predictedWinnerId: '5', isCorrect: false, timestamp: new Date().toISOString() },
  { id: 'p3', userId: 'user3', userEmail: 'casual@fan.com', fightId: '103', predictedWinnerId: '3', isCorrect: true, timestamp: new Date().toISOString() }
];

// --- Mock Socket for Real-time Updates ---

type UpdateCallback = (update: FightUpdate) => void;

class MockSocketService {
  private intervals: Map<string, any> = new Map();
  private subscribers: Map<string, UpdateCallback[]> = new Map();

  subscribe(fightId: string, callback: UpdateCallback) {
    if (!this.subscribers.has(fightId)) {
      this.subscribers.set(fightId, []);
    }
    this.subscribers.get(fightId)?.push(callback);

    if (!this.intervals.has(fightId)) {
      // Simulate real-time events
      const interval = setInterval(() => {
        this.emitRandomEvent(fightId);
      }, 3000);
      this.intervals.set(fightId, interval);
    }
  }

  unsubscribe(fightId: string, callback: UpdateCallback) {
    const subs = this.subscribers.get(fightId);
    if (subs) {
      this.subscribers.set(fightId, subs.filter(s => s !== callback));
    }
    if (this.subscribers.get(fightId)?.length === 0) {
      const interval = this.intervals.get(fightId);
      if (interval) clearInterval(interval);
      this.intervals.delete(fightId);
    }
  }

  private emitRandomEvent(fightId: string) {
    const subs = this.subscribers.get(fightId);
    if (!subs || subs.length === 0) return;

    const types: FightUpdate['type'][] = ['STRIKE', 'TAKEDOWN', 'INFO', 'KNOCKDOWN', 'SUBMISSION_ATTEMPT'];
    const messages = [
      "Solid jab connects!",
      "Crowd goes wild as they trade blows!",
      "Attempted head kick blocked.",
      "Beautiful takedown defense.",
      "Heavy leg kick lands.",
      "They are clinching against the cage.",
      "Big right hand misses just barely."
    ];

    const update: FightUpdate = {
      id: Date.now().toString(),
      fightId,
      timestamp: new Date().toISOString(),
      type: types[Math.floor(Math.random() * types.length)],
      message: messages[Math.floor(Math.random() * messages.length)]
    };

    subs.forEach(cb => cb(update));
  }
}

export const socketService = new MockSocketService();

// --- Service Implementation ---

class MockDataService {
  private fighters: Fighter[] = [...INITIAL_FIGHTERS];
  private fights: Fight[] = [...INITIAL_FIGHTS];
  private media: Media[] = [...INITIAL_MEDIA];
  private predictions: Prediction[] = [...INITIAL_PREDICTIONS];

  // FIGHTERS
  async getFighters(): Promise<Fighter[]> {
    return new Promise(resolve => setTimeout(() => resolve([...this.fighters]), 300));
  }

  async getFighterById(id: string): Promise<Fighter | undefined> {
    const fighter = this.fighters.find(f => f.id === id);
    return new Promise(resolve => setTimeout(() => resolve(fighter), 200));
  }

  async updateFighter(updated: Fighter): Promise<void> {
    this.fighters = this.fighters.map(f => f.id === updated.id ? updated : f);
  }

  async createFighter(fighter: Omit<Fighter, 'id'>): Promise<void> {
    const newFighter = { ...fighter, id: Math.random().toString(36).substr(2, 9) };
    this.fighters.push(newFighter);
  }

  async deleteFighter(id: string): Promise<void> {
    this.fighters = this.fighters.filter(f => f.id !== id);
  }

  // FIGHTS
  async getFights(): Promise<Fight[]> {
    return new Promise(resolve => setTimeout(() => resolve([...this.fights]), 300));
  }

  async getFightById(id: string): Promise<Fight | undefined> {
    return this.fights.find(f => f.id === id);
  }

  async getFightsWithFighters(): Promise<FightWithFighters[]> {
    const fights = await this.getFights();
    return fights.map(fight => {
      const fighterA = this.fighters.find(f => f.id === fight.fighterAId)!;
      const fighterB = this.fighters.find(f => f.id === fight.fighterBId)!;
      return { ...fight, fighterA, fighterB };
    });
  }

  async createFight(fight: Omit<Fight, 'id'>): Promise<void> {
     const newFight = { ...fight, id: Math.random().toString(36).substr(2, 9) };
     this.fights.push(newFight);
  }
  
  async deleteFight(id: string): Promise<void> {
      this.fights = this.fights.filter(f => f.id !== id);
  }

  // MEDIA
  async getMedia(): Promise<Media[]> {
    return new Promise(resolve => setTimeout(() => resolve([...this.media]), 300));
  }
  
  async createMedia(item: Omit<Media, 'id'>): Promise<void> {
      const newItem = { ...item, id: Math.random().toString(36).substr(2, 9) };
      this.media.push(newItem);
  }

  async deleteMedia(id: string): Promise<void> {
      this.media = this.media.filter(m => m.id !== id);
  }

  // PREDICTIONS
  async submitPrediction(prediction: Omit<Prediction, 'id' | 'timestamp'>): Promise<Prediction> {
    return new Promise(resolve => {
      const newPred: Prediction = {
        ...prediction,
        id: Math.random().toString(36).substr(2, 9),
        timestamp: new Date().toISOString(),
        isCorrect: undefined 
      };
      // Remove existing if any
      this.predictions = this.predictions.filter(p => !(p.userId === prediction.userId && p.fightId === prediction.fightId));
      this.predictions.push(newPred);
      resolve(newPred);
    });
  }

  async getUserPrediction(userId: string, fightId: string): Promise<Prediction | undefined> {
     return new Promise(resolve => {
       resolve(this.predictions.find(p => p.userId === userId && p.fightId === fightId));
     });
  }

  async getPredictionLeaderboard(): Promise<{userEmail: string, correct: number, total: number}[]> {
     return new Promise(resolve => {
       const stats: Record<string, {correct: number, total: number}> = {};
       this.predictions.forEach(p => {
         if (!stats[p.userEmail]) stats[p.userEmail] = { correct: 0, total: 0 };
         // We assume a prediction is graded if isCorrect is not undefined
         if (p.isCorrect !== undefined) {
           stats[p.userEmail].total++;
           if (p.isCorrect) stats[p.userEmail].correct++;
         }
       });
       const sorted = Object.entries(stats)
        .map(([email, stat]) => ({ userEmail: email, ...stat }))
        .sort((a, b) => b.correct - a.correct);
       resolve(sorted);
     });
  }
}

export const dataService = new MockDataService();