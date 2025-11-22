
import { Fight, Fighter, FightStatus, Media, MediaType, FightWithFighters, Prediction, FightUpdate, Bounty, Bet, FighterApplication, Tournament, TournamentApplication } from '../types';

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
    imageUrl: 'https://picsum.photos/seed/alex/400/400',
    isVerified: true,
    stockPrice: 145.50,
    stockChange: 12.4
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
    imageUrl: 'https://picsum.photos/seed/izzy/400/400',
    isVerified: true,
    stockPrice: 132.20,
    stockChange: -2.1
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
    imageUrl: 'https://picsum.photos/seed/jones/400/400',
    isVerified: true,
    stockPrice: 180.00,
    stockChange: 0.5
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
    imageUrl: 'https://picsum.photos/seed/stipe/400/400',
    isVerified: true,
    stockPrice: 95.40,
    stockChange: -5.4
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
    imageUrl: 'https://picsum.photos/seed/charlie/400/400',
    isVerified: false,
    stockPrice: 110.75,
    stockChange: 8.2
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
    poolA: 5000,
    poolB: 4200,
    isBettingLocked: false
  },
  {
    id: '099_nemesis',
    eventName: 'UFC 287: Pereira vs Adesanya 2',
    date: '2023-04-08T22:00:00Z',
    location: 'Miami, FL',
    weightClass: 'Middleweight',
    fighterAId: '1',
    fighterBId: '2',
    status: FightStatus.FINISHED,
    resultWinnerId: '2',
    resultMethod: 'KO/TKO',
    resultRound: 2,
    resultTime: '4:21'
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
    poolA: 12000,
    poolB: 1500, // Lopsided
    isBettingLocked: false
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
    fighterBId: '5',
    status: FightStatus.IN_PROGRESS,
    poolA: 8000,
    poolB: 7500,
    isBettingLocked: true
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

const INITIAL_BOUNTIES: Bounty[] = [
  { id: 'b1', title: 'Submission Hunter', description: 'Win by Submission in Round 1', reward: '500 $DOJO', status: 'ACTIVE' },
  { id: 'b2', title: 'Knockout Artist', description: 'Win via Head Kick KO', reward: 'Premium Rashguard', status: 'ACTIVE' },
  { id: 'b3', title: 'Iron Chin', description: 'Absorb 50+ significant strikes and win', reward: 'Signed Gloves', status: 'CLAIMED', claimedByFighterId: '2' },
  { id: 'b4', title: 'Underdog Victory', description: 'Win as a +300 underdog', reward: '1000 $DOJO', status: 'ACTIVE' }
];

const INITIAL_TOURNAMENTS: Tournament[] = [
    {
        id: 't1',
        name: 'Winter Grand Prix 2025',
        date: new Date(Date.now() + 86400000 * 45).toISOString(),
        location: 'Tokyo, Japan',
        division: 'Lightweight (155lbs)',
        prizePool: '$50,000',
        maxEntrants: 16,
        currentEntrants: 12,
        status: 'OPEN',
        description: 'An elimination tournament to crown the new regional king. Winner gets a contract.'
    },
    {
        id: 't2',
        name: 'Grappling Industries Open',
        date: new Date(Date.now() + 86400000 * 10).toISOString(),
        location: 'Austin, TX',
        division: 'Absolute (Open Weight)',
        prizePool: '$5,000',
        maxEntrants: 32,
        currentEntrants: 28,
        status: 'OPEN',
        description: 'Submission only grappling tournament. EBI Rules.'
    },
    {
        id: 't3',
        name: 'Rookie Rumble',
        date: new Date(Date.now() - 86400000 * 5).toISOString(),
        location: 'London, UK',
        division: 'Amateur Welterweight',
        prizePool: 'Trophy',
        maxEntrants: 8,
        currentEntrants: 8,
        status: 'CLOSED',
        description: 'Amateur showcase for rising stars.'
    }
];

const INITIAL_BETS: Bet[] = [
    {
        id: 'bet_demo_1',
        userId: 'adminfightnightcom', // matches the ID generated in Login.tsx for admin@fightnight.com
        fightId: '099_nemesis',
        fighterId: '2', // Adesanya
        amount: 200,
        oddsAtPlacement: 2.5,
        potentialReturn: 500,
        status: 'WON', // Simulate a win to show modal
        timestamp: new Date(Date.now() - 100000).toISOString()
    }
];

// Helper for mock applications
const INITIAL_FIGHTER_APPS: FighterApplication[] = [
    { id: 'fa1', fullName: 'John Doe', email: 'john@fighter.com', age: 24, weightClass: 'Welterweight', heightCm: 180, experience: '5-0 Amateur', gym: 'ATT', status: 'PENDING', submittedAt: new Date().toISOString() }
];
const INITIAL_TOURNEY_APPS: TournamentApplication[] = [];

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

  emitEvent(fightId: string, event: FightUpdate) {
     const subs = this.subscribers.get(fightId);
     if(subs) subs.forEach(cb => cb(event));
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
  private bounties: Bounty[] = [...INITIAL_BOUNTIES];
  private bets: Bet[] = [...INITIAL_BETS]; 
  private fighterApplications: FighterApplication[] = [...INITIAL_FIGHTER_APPS];
  private tournaments: Tournament[] = [...INITIAL_TOURNAMENTS];
  private tournamentApplications: TournamentApplication[] = [...INITIAL_TOURNEY_APPS];

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

  // PREDICTIONS / BETTING LOGIC
  
  async submitPrediction(prediction: Omit<Prediction, 'id' | 'timestamp'>): Promise<Prediction> {
    return new Promise(resolve => {
      const newPred: Prediction = {
        ...prediction,
        id: Math.random().toString(36).substr(2, 9),
        timestamp: new Date().toISOString(),
        isCorrect: undefined 
      };
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

  // --- PHASE 1: PARIMUTUEL BETTING LOGIC ---

  // Get Odds (Multiplier)
  getOdds(fight: Fight, fighterId: string): number {
    const poolA = fight.poolA || 0;
    const poolB = fight.poolB || 0;
    const totalPool = poolA + poolB;
    const houseTake = 0.05; // 5% house rake
    const netPool = totalPool * (1 - houseTake);

    if (fighterId === fight.fighterAId) {
      if (poolA === 0) return 1.0;
      return netPool / poolA;
    } else {
      if (poolB === 0) return 1.0;
      return netPool / poolB;
    }
  }

  async getMyBets(userId: string): Promise<Bet[]> {
    return this.bets.filter(b => b.userId === userId).sort((a,b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
  }

  async placeBet(userId: string, fightId: string, fighterId: string, amount: number): Promise<{ success: boolean, message: string, bet?: Bet }> {
    const fight = this.fights.find(f => f.id === fightId);
    if (!fight) return { success: false, message: "Fight not found" };
    
    // Phase 2: Real-time Locking
    if (fight.isBettingLocked || fight.status !== FightStatus.UPCOMING) {
      return { success: false, message: "Betting is closed for this event." };
    }

    // Update Pool
    if (fighterId === fight.fighterAId) {
      fight.poolA = (fight.poolA || 0) + amount;
    } else {
      fight.poolB = (fight.poolB || 0) + amount;
    }

    const currentOdds = this.getOdds(fight, fighterId);

    const newBet: Bet = {
      id: Math.random().toString(36).substr(2, 9),
      userId,
      fightId,
      fighterId,
      amount,
      oddsAtPlacement: currentOdds,
      potentialReturn: amount * currentOdds, // Estimate
      status: 'OPEN',
      timestamp: new Date().toISOString()
    };

    this.bets.push(newBet);

    // Real-time broadcast
    socketService.emitEvent(fightId, {
      id: Date.now().toString(),
      fightId,
      type: 'ODDS_UPDATE',
      timestamp: new Date().toISOString(),
      message: 'Odds updated',
      data: { poolA: fight.poolA, poolB: fight.poolB }
    });

    return { success: true, message: "Bet placed!", bet: newBet };
  }

  // Simulate fight start locking
  lockBetting(fightId: string) {
    const fight = this.fights.find(f => f.id === fightId);
    if (fight) {
      fight.isBettingLocked = true;
      socketService.emitEvent(fightId, {
        id: Date.now().toString(),
        fightId,
        type: 'BETS_LOCKED',
        timestamp: new Date().toISOString(),
        message: "Bets are now LOCKED!"
      });
    }
  }

  // Phase 1: Settlement
  async settleBets(fightId: string, winnerId: string) {
    const fight = this.fights.find(f => f.id === fightId);
    if(!fight) return;

    const finalOdds = this.getOdds(fight, winnerId);

    this.bets.forEach(bet => {
      if (bet.fightId === fightId && bet.status === 'OPEN') {
        if (bet.fighterId === winnerId) {
          bet.status = 'WON';
          bet.potentialReturn = bet.amount * finalOdds; // Finalize return
        } else {
          bet.status = 'LOST';
          bet.potentialReturn = 0;
        }
      }
    });
  }

  // BOUNTIES
  async getBounties(): Promise<Bounty[]> {
    return new Promise(resolve => setTimeout(() => resolve([...this.bounties]), 200));
  }

  // --- APPLICATIONS & TOURNAMENTS ---

  async submitFighterApplication(app: Omit<FighterApplication, 'id' | 'status' | 'submittedAt'>): Promise<void> {
      return new Promise(resolve => {
          setTimeout(() => {
              this.fighterApplications.push({
                  ...app,
                  id: Math.random().toString(36).substr(2, 9),
                  status: 'PENDING',
                  submittedAt: new Date().toISOString()
              });
              resolve();
          }, 1000);
      });
  }

  async getFighterApplications(): Promise<FighterApplication[]> {
    return new Promise(resolve => setTimeout(() => resolve([...this.fighterApplications]), 300));
  }

  async updateFighterApplicationStatus(id: string, status: 'APPROVED' | 'REJECTED'): Promise<void> {
      this.fighterApplications = this.fighterApplications.map(a => a.id === id ? { ...a, status } : a);
  }

  async getTournaments(): Promise<Tournament[]> {
      return new Promise(resolve => setTimeout(() => resolve([...this.tournaments]), 300));
  }

  async createTournament(tournament: Omit<Tournament, 'id'>): Promise<void> {
      const newTournament = { 
          ...tournament, 
          id: Math.random().toString(36).substr(2, 9) 
      };
      this.tournaments.push(newTournament);
  }

  async updateTournament(updated: Tournament): Promise<void> {
      this.tournaments = this.tournaments.map(t => t.id === updated.id ? updated : t);
  }

  async deleteTournament(id: string): Promise<void> {
      this.tournaments = this.tournaments.filter(t => t.id !== id);
  }

  async submitTournamentApplication(app: Omit<TournamentApplication, 'id' | 'status' | 'submittedAt'>): Promise<void> {
      return new Promise(resolve => {
          setTimeout(() => {
              this.tournamentApplications.push({
                  ...app,
                  id: Math.random().toString(36).substr(2, 9),
                  status: 'PENDING',
                  submittedAt: new Date().toISOString()
              });
              resolve();
          }, 800);
      });
  }

  async getTournamentApplications(): Promise<TournamentApplication[]> {
      return new Promise(resolve => setTimeout(() => resolve([...this.tournamentApplications]), 300));
  }

  async updateTournamentApplicationStatus(id: string, status: 'ACCEPTED' | 'PENDING'): Promise<void> {
      this.tournamentApplications = this.tournamentApplications.map(a => a.id === id ? { ...a, status } : a);
  }

  async getDashboardStats() {
      return {
          totalFighters: this.fighters.length,
          upcomingFights: this.fights.filter(f => f.status === FightStatus.UPCOMING).length,
          pendingApplications: this.fighterApplications.filter(a => a.status === 'PENDING').length + this.tournamentApplications.filter(a => a.status === 'PENDING').length,
          totalRevenue: this.bets.filter(b => b.status === 'LOST').reduce((acc, b) => acc + b.amount, 0) // Fake revenue
      };
  }
}

export const dataService = new MockDataService();
