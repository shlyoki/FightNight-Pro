
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { dataService, socketService } from '../services/mockData';
import { Fighter, Bounty, FightWithFighters, Bet } from '../types';
import { TrendingUp, TrendingDown, Coins, Briefcase, Target, Trophy, AlertCircle, Flame, DollarSign, Lock, ShieldAlert, X, PartyPopper } from 'lucide-react';
import confetti from 'canvas-confetti';

interface PortfolioItem {
    fighterId: string;
    shares: number;
    avgBuyPrice: number;
}

const WinModal = ({ bet, onClose }: { bet: Bet, onClose: () => void }) => {
  useEffect(() => {
    // Trigger confetti when modal mounts
    const duration = 3 * 1000;
    const animationEnd = Date.now() + duration;
    const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 100 };

    const randomInRange = (min: number, max: number) => Math.random() * (max - min) + min;

    const interval: any = setInterval(function() {
      const timeLeft = animationEnd - Date.now();

      if (timeLeft <= 0) {
        return clearInterval(interval);
      }

      const particleCount = 50 * (timeLeft / duration);
      confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 } });
      confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 } });
    }, 250);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/90 backdrop-blur-sm animate-fade-in">
      <div className="bg-zinc-900 border-2 border-yellow-500/50 rounded-2xl p-8 max-w-md w-full text-center relative overflow-hidden shadow-[0_0_50px_rgba(234,179,8,0.3)]">
        <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-yellow-600 via-yellow-300 to-yellow-600 animate-pulse"></div>
        
        <div className="inline-block bg-yellow-500/20 p-4 rounded-full mb-6">
          <Trophy className="w-12 h-12 text-yellow-400 animate-bounce" />
        </div>
        
        <h2 className="text-4xl font-black text-white uppercase italic mb-2">You Won!</h2>
        <p className="text-zinc-400 mb-6">Your prediction was spot on.</p>
        
        <div className="bg-black/40 rounded-xl p-4 border border-zinc-800 mb-8">
          <p className="text-xs text-zinc-500 uppercase font-bold mb-1">Total Payout</p>
          <p className="text-4xl font-mono font-bold text-green-400 flex items-center justify-center gap-2">
            +{bet.potentialReturn.toFixed(0)} <span className="text-sm text-zinc-500">DOJO</span>
          </p>
        </div>

        <button 
          onClick={onClose}
          className="w-full py-4 bg-yellow-500 hover:bg-yellow-400 text-black font-black uppercase tracking-wider rounded-lg transition-all hover:scale-105"
        >
          Collect Winnings
        </button>
      </div>
    </div>
  );
};

const FantasyDojo = ({ user }: { user?: any }) => {
  const [activeTab, setActiveTab] = useState<'ARENA' | 'MARKET' | 'BOUNTIES'>('ARENA');
  const [fighters, setFighters] = useState<Fighter[]>([]);
  const [bounties, setBounties] = useState<Bounty[]>([]);
  const [upcomingFights, setUpcomingFights] = useState<FightWithFighters[]>([]);
  const [wallet, setWallet] = useState<number>(1000);
  const [portfolio, setPortfolio] = useState<PortfolioItem[]>([]);
  const [myBets, setMyBets] = useState<Bet[]>([]);
  const [loading, setLoading] = useState(true);
  const [recentWinBet, setRecentWinBet] = useState<Bet | null>(null);

  // Betting Slip State
  const [selectedWager, setSelectedWager] = useState<{fightId: string, fighterId: string, amount: number} | null>(null);

  useEffect(() => {
    const load = async () => {
      const f = await dataService.getFighters();
      setFighters(f.map(fighter => ({
          ...fighter,
          stockChange: fighter.stockChange + (Math.random() * 2 - 1)
      })));
      
      const b = await dataService.getBounties();
      setBounties(b);

      const allFights = await dataService.getFightsWithFighters();
      const upcoming = allFights.filter(fi => new Date(fi.date) > new Date() || fi.status === 'UPCOMING' || fi.status === 'IN_PROGRESS');
      setUpcomingFights(upcoming);
      
      // Load User Data
      const savedWallet = localStorage.getItem('dojo_wallet');
      if (savedWallet) setWallet(parseFloat(savedWallet));
      else setWallet(1000);

      const savedPort = localStorage.getItem('dojo_portfolio');
      if (savedPort) setPortfolio(JSON.parse(savedPort));

      if (user) {
         const bets = await dataService.getMyBets(user.id);
         setMyBets(bets);
         // Check for recent unchecked wins
         const win = bets.find(b => b.status === 'WON');
         if (win) {
           // Simple session check to avoid spamming on refresh in real app, 
           // but for demo we show it if we find one.
           setRecentWinBet(win);
         }
      }

      setLoading(false);
    };
    load();
  }, [user]);

  useEffect(() => {
      localStorage.setItem('dojo_wallet', wallet.toString());
      localStorage.setItem('dojo_portfolio', JSON.stringify(portfolio));
  }, [wallet, portfolio]);

  // Real-time odds listeners
  useEffect(() => {
      const handlers: {id: string, fn: any}[] = [];
      upcomingFights.forEach(fight => {
          const handler = (update: any) => {
              if (update.type === 'ODDS_UPDATE') {
                 setUpcomingFights(prev => prev.map(p => {
                     if(p.id === update.fightId) {
                         return { ...p, poolA: update.data.poolA, poolB: update.data.poolB };
                     }
                     return p;
                 }));
              }
              if (update.type === 'BETS_LOCKED') {
                  setUpcomingFights(prev => prev.map(p => p.id === update.fightId ? { ...p, isBettingLocked: true } : p));
              }
          };
          socketService.subscribe(fight.id, handler);
          handlers.push({id: fight.id, fn: handler});
      });

      return () => {
          handlers.forEach(h => socketService.unsubscribe(h.id, h.fn));
      };
  }, [upcomingFights.length]); 

  // --- Market Actions ---
  const handleBuy = (fighter: Fighter) => {
      if (wallet < fighter.stockPrice) { alert("Not enough funds!"); return; }
      setWallet(prev => prev - fighter.stockPrice);
      setPortfolio(prev => {
          const existing = prev.find(p => p.fighterId === fighter.id);
          if (existing) return prev.map(p => p.fighterId === fighter.id ? { ...p, shares: p.shares + 1 } : p);
          return [...prev, { fighterId: fighter.id, shares: 1, avgBuyPrice: fighter.stockPrice }];
      });
  };

  const handleSell = (fighter: Fighter) => {
      const item = portfolio.find(p => p.fighterId === fighter.id);
      if (!item || item.shares <= 0) return;
      setWallet(prev => prev + fighter.stockPrice);
      setPortfolio(prev => {
          if (item.shares === 1) return prev.filter(p => p.fighterId !== fighter.id);
          return prev.map(p => p.fighterId === fighter.id ? { ...p, shares: p.shares - 1 } : p);
      });
  };

  // --- Betting Actions ---
  const placeBet = async () => {
      if (!selectedWager || !user) return;
      if (selectedWager.amount <= 0) { alert("Enter valid amount"); return; }
      if (wallet < selectedWager.amount) { alert("Insufficient funds"); return; }

      const res = await dataService.placeBet(user.id, selectedWager.fightId, selectedWager.fighterId, selectedWager.amount);
      if (res.success) {
          setWallet(prev => prev - selectedWager.amount);
          if(res.bet) setMyBets(prev => [res.bet!, ...prev]);
          setSelectedWager(null);
          // Animation effect on button
      } else {
          alert(res.message);
      }
  };

  const claimAllowance = () => {
      if (wallet < 100) {
          setWallet(prev => prev + 500);
          // Trigger mini confetti
          confetti({ particleCount: 30, spread: 60, origin: { y: 0.8 } });
      }
  };

  const portfolioValue = portfolio.reduce((acc, item) => {
      const fighter = fighters.find(f => f.id === item.fighterId);
      return acc + (item.shares * (fighter?.stockPrice || 0));
  }, 0);

  if (loading) return <div className="p-12 text-center text-zinc-500">Loading Dojo...</div>;

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      
      {recentWinBet && (
        <WinModal bet={recentWinBet} onClose={() => setRecentWinBet(null)} />
      )}

      {/* Header */}
      <div className="text-center mb-10">
          <h1 className="text-5xl font-black text-white uppercase italic tracking-tighter flex items-center justify-center gap-4">
              <Coins className="w-12 h-12 text-yellow-500" /> Fantasy Dojo
          </h1>
          <p className="text-zinc-400 mt-2">Bet on fights, trade fighters, earn glory.</p>
      </div>

      {/* Wallet Bar */}
      <div className="bg-zinc-900 border border-zinc-800 p-4 rounded-xl flex flex-wrap justify-between items-center mb-8 shadow-lg sticky top-20 z-40 backdrop-blur-md bg-opacity-90">
           <div className="flex items-center gap-6">
              <div className="flex items-center gap-2">
                  <div className="bg-yellow-500/20 p-2 rounded-full"><Coins className="w-5 h-5 text-yellow-500" /></div>
                  <div>
                      <p className="text-[10px] text-zinc-500 uppercase font-bold">Wallet</p>
                      <p className="text-xl font-mono font-bold text-white">{wallet.toFixed(0)} DOJO</p>
                  </div>
              </div>
              <div className="hidden md:flex items-center gap-2 border-l border-zinc-800 pl-6">
                  <div className="bg-blue-500/20 p-2 rounded-full"><Briefcase className="w-5 h-5 text-blue-500" /></div>
                  <div>
                      <p className="text-[10px] text-zinc-500 uppercase font-bold">Assets</p>
                      <p className="text-xl font-mono font-bold text-white">${portfolioValue.toFixed(0)}</p>
                  </div>
              </div>
           </div>
           
           {wallet < 100 && (
               <button 
                 onClick={claimAllowance} 
                 className="bg-red-600/90 hover:bg-red-600 text-white px-4 py-2 rounded-full font-bold text-xs animate-pulse flex items-center shadow-[0_0_15px_rgba(220,38,38,0.5)] border border-red-400"
               >
                   <ShieldAlert className="w-4 h-4 mr-2"/> Claim Bankruptcy Relief (+500)
               </button>
           )}
      </div>

      {/* Nav */}
      <div className="flex justify-center mb-8">
        <div className="bg-zinc-900 p-1 rounded-lg inline-flex border border-zinc-800">
            <button onClick={() => setActiveTab('ARENA')} className={`px-6 py-2 rounded-md text-sm font-bold flex items-center transition-all ${activeTab === 'ARENA' ? 'bg-red-600 text-white shadow' : 'text-zinc-400 hover:text-white'}`}>
                <Target className="w-4 h-4 mr-2" /> Betting Arena
            </button>
            <button onClick={() => setActiveTab('MARKET')} className={`px-6 py-2 rounded-md text-sm font-bold flex items-center transition-all ${activeTab === 'MARKET' ? 'bg-zinc-800 text-white shadow' : 'text-zinc-400 hover:text-white'}`}>
                <TrendingUp className="w-4 h-4 mr-2" /> Stock Market
            </button>
            <button onClick={() => setActiveTab('BOUNTIES')} className={`px-6 py-2 rounded-md text-sm font-bold flex items-center transition-all ${activeTab === 'BOUNTIES' ? 'bg-zinc-800 text-white shadow' : 'text-zinc-400 hover:text-white'}`}>
                <Trophy className="w-4 h-4 mr-2" /> Bounties
            </button>
        </div>
      </div>

      {/* ARENA TAB */}
      {activeTab === 'ARENA' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Betting Cards */}
              <div className="lg:col-span-2 space-y-6">
                  <h3 className="text-xl font-black text-white uppercase italic flex items-center"><Flame className="w-5 h-5 text-orange-500 mr-2" /> Live Betting Lines</h3>
                  {upcomingFights.map(fight => {
                      const poolA = fight.poolA || 0;
                      const poolB = fight.poolB || 0;
                      const total = poolA + poolB;
                      const net = total * 0.95;
                      const oddsA = poolA > 0 ? (net / poolA).toFixed(2) : '1.00';
                      const oddsB = poolB > 0 ? (net / poolB).toFixed(2) : '1.00';
                      const isLocked = fight.isBettingLocked || fight.status !== 'UPCOMING';

                      return (
                          <div key={fight.id} className={`bg-zinc-900 border rounded-xl p-6 relative overflow-hidden transition-all ${isLocked ? 'border-zinc-800 opacity-80 grayscale-[0.5]' : 'border-zinc-700 hover:border-zinc-500'}`}>
                              {isLocked && (
                                  <div className="absolute inset-0 bg-black/60 flex items-center justify-center z-10 backdrop-blur-[1px]">
                                      <div className="bg-red-600 text-white px-6 py-2 rounded-lg font-black uppercase tracking-widest flex items-center shadow-2xl border-2 border-red-400 transform -rotate-12">
                                          <Lock className="w-5 h-5 mr-2"/> Locked
                                      </div>
                                  </div>
                              )}
                              
                              <div className="flex justify-between text-xs text-zinc-500 mb-6 border-b border-zinc-800 pb-2">
                                  <span className="flex items-center"><PartyPopper className="w-3 h-3 mr-1 text-zinc-600"/> {new Date(fight.date).toLocaleString()}</span>
                                  <span className="uppercase font-bold text-zinc-300">{fight.eventName}</span>
                              </div>
                              
                              <div className="flex items-center justify-between gap-4">
                                  {/* Fighter A */}
                                  <div 
                                    className={`flex-1 text-center p-4 rounded-xl cursor-pointer transition-all relative group ${selectedWager?.fighterId === fight.fighterAId ? 'bg-red-900/20 border-2 border-red-500 shadow-[0_0_20px_rgba(220,38,38,0.2)]' : 'bg-black/20 border border-zinc-800 hover:bg-zinc-800'}`}
                                    onClick={() => !isLocked && setSelectedWager({ fightId: fight.id, fighterId: fight.fighterAId, amount: 0 })}
                                  >
                                      <h4 className="font-black text-white uppercase text-lg">{fight.fighterA.name}</h4>
                                      <div className="text-3xl font-mono font-bold text-green-400 mt-2 tracking-tighter">x{oddsA}</div>
                                      <p className="text-[10px] text-zinc-500 mt-1 font-mono">{poolA.toLocaleString()} pts</p>
                                      
                                      {parseFloat(oddsA) > 2.5 && (
                                          <div className="absolute -top-3 -right-2 bg-yellow-500 text-black text-[10px] font-black px-2 py-1 rounded shadow-lg uppercase tracking-wider animate-pulse">
                                              High Return
                                          </div>
                                      )}
                                  </div>

                                  <div className="text-center font-black text-zinc-700 text-2xl italic select-none">VS</div>

                                  {/* Fighter B */}
                                  <div 
                                     className={`flex-1 text-center p-4 rounded-xl cursor-pointer transition-all relative group ${selectedWager?.fighterId === fight.fighterBId ? 'bg-blue-900/20 border-2 border-blue-500 shadow-[0_0_20px_rgba(59,130,246,0.2)]' : 'bg-black/20 border border-zinc-800 hover:bg-zinc-800'}`}
                                     onClick={() => !isLocked && setSelectedWager({ fightId: fight.id, fighterId: fight.fighterBId, amount: 0 })}
                                  >
                                      <h4 className="font-black text-white uppercase text-lg">{fight.fighterB.name}</h4>
                                      <div className="text-3xl font-mono font-bold text-green-400 mt-2 tracking-tighter">x{oddsB}</div>
                                      <p className="text-[10px] text-zinc-500 mt-1 font-mono">{poolB.toLocaleString()} pts</p>

                                      {parseFloat(oddsB) > 2.5 && (
                                          <div className="absolute -top-3 -left-2 bg-yellow-500 text-black text-[10px] font-black px-2 py-1 rounded shadow-lg uppercase tracking-wider animate-pulse">
                                              High Return
                                          </div>
                                      )}
                                  </div>
                              </div>
                          </div>
                      );
                  })}
              </div>

              {/* Sidebar: Slip & Leaderboard */}
              <div className="space-y-6">
                  {/* Betting Slip - Ticket Style */}
                  <div className="relative">
                      {/* Ticket Perforations */}
                      <div className="absolute -left-2 top-1/2 w-4 h-4 bg-zinc-950 rounded-full z-10"></div>
                      <div className="absolute -right-2 top-1/2 w-4 h-4 bg-zinc-950 rounded-full z-10"></div>

                      <div className="bg-zinc-900 border-x border-zinc-800 rounded-xl overflow-hidden shadow-2xl">
                          <div className="bg-gradient-to-r from-zinc-800 to-zinc-900 p-4 border-b-2 border-dashed border-zinc-700 flex justify-between items-center">
                              <h3 className="font-black text-white uppercase flex items-center"><DollarSign className="w-5 h-5 text-green-500 mr-1"/> Betting Slip</h3>
                              <div className="text-[10px] bg-zinc-950 px-2 py-1 rounded text-zinc-500 font-mono">TICKET #{Math.floor(Math.random()*10000)}</div>
                          </div>
                          
                          <div className="p-6">
                              {!user ? (
                                  <div className="text-center py-8">
                                      <p className="text-zinc-500 text-sm mb-3">Log in to start placing bets</p>
                                      <Link to="/login" className="inline-block bg-zinc-800 hover:bg-zinc-700 text-white px-4 py-2 rounded font-bold text-sm">Sign In</Link>
                                  </div>
                              ) : selectedWager ? (
                                  <div className="space-y-4 animate-fade-in">
                                      <div className="bg-zinc-950 p-4 rounded-lg border border-zinc-800 relative overflow-hidden">
                                          <div className="absolute top-0 right-0 bg-red-600 w-2 h-full"></div>
                                          <span className="text-[10px] text-zinc-500 uppercase font-bold tracking-wider block mb-1">Selection</span>
                                          <p className="font-black text-white text-lg uppercase italic leading-none">
                                              {fighters.find(f => f.id === selectedWager.fighterId)?.name}
                                          </p>
                                          <p className="text-xs text-zinc-500 mt-1">To Win</p>
                                      </div>
                                      <div>
                                          <label className="text-[10px] text-zinc-500 uppercase font-bold tracking-wider mb-1 block">Wager Amount</label>
                                          <div className="relative">
                                              <input 
                                                type="number" 
                                                autoFocus
                                                className="w-full bg-zinc-950 border border-zinc-800 rounded-lg p-3 text-white font-mono font-bold text-lg focus:border-red-600 focus:ring-1 focus:ring-red-600 focus:outline-none transition-all"
                                                value={selectedWager.amount || ''}
                                                onChange={e => setSelectedWager({...selectedWager, amount: parseInt(e.target.value)})}
                                                placeholder="0"
                                              />
                                              <span className="absolute right-3 top-3.5 text-zinc-600 font-bold text-xs">PTS</span>
                                          </div>
                                      </div>
                                      <div className="flex justify-between items-center bg-green-900/10 p-3 rounded border border-green-900/30">
                                          <span className="text-xs text-green-500 font-bold uppercase">Potential Payout</span>
                                          <span className="font-mono font-black text-xl text-green-400">
                                              {(selectedWager.amount * dataService.getOdds(upcomingFights.find(f => f.id === selectedWager.fightId)!, selectedWager.fighterId) || 0).toFixed(0)}
                                          </span>
                                      </div>
                                      <div className="flex gap-2 pt-2">
                                          <button onClick={() => setSelectedWager(null)} className="flex-1 py-3 bg-zinc-800 hover:bg-zinc-700 rounded-lg font-bold text-xs text-zinc-300 uppercase tracking-wider">Cancel</button>
                                          <button onClick={placeBet} className="flex-[2] py-3 bg-red-600 hover:bg-red-500 rounded-lg font-black text-xs text-white uppercase tracking-wider shadow-lg shadow-red-900/20 hover:scale-[1.02] transition-transform active:scale-95">Place Wager</button>
                                      </div>
                                  </div>
                              ) : (
                                  <div className="text-center py-8 text-zinc-600 text-sm italic flex flex-col items-center">
                                      <Target className="w-8 h-8 mb-2 opacity-20" />
                                      Select a fighter to build your slip.
                                  </div>
                              )}
                          </div>
                      </div>

                      {/* Recent Bets Mini List */}
                      {myBets.length > 0 && (
                          <div className="mt-6 bg-zinc-900 border border-zinc-800 rounded-xl p-4">
                              <h4 className="text-[10px] font-bold text-zinc-500 uppercase mb-3 flex justify-between items-center">
                                  <span>Active History</span>
                                  <span className="bg-zinc-800 text-zinc-400 px-1.5 rounded">{myBets.length}</span>
                              </h4>
                              <div className="space-y-2 max-h-40 overflow-y-auto pr-1 custom-scrollbar">
                                  {myBets.map(bet => (
                                      <div key={bet.id} className="flex justify-between items-center text-xs bg-zinc-950 p-2.5 rounded border border-zinc-800 hover:border-zinc-700 transition-colors">
                                          <div>
                                              <span className={`font-bold block ${bet.status === 'WON' ? 'text-green-500' : bet.status === 'LOST' ? 'text-red-500 line-through opacity-50' : 'text-white'}`}>
                                                  {fighters.find(f => f.id === bet.fighterId)?.name.split(' ').pop()}
                                              </span>
                                              <span className="text-zinc-600 text-[10px]">{new Date(bet.timestamp).toLocaleTimeString([], {hour:'2-digit', minute:'2-digit'})}</span>
                                          </div>
                                          <div className="text-right">
                                              <span className={`block font-mono font-bold ${bet.status === 'WON' ? 'text-green-400' : 'text-zinc-400'}`}>
                                                  {bet.status === 'WON' ? `+${bet.potentialReturn.toFixed(0)}` : bet.amount}
                                              </span>
                                              <span className={`text-[9px] uppercase font-bold px-1 rounded ${bet.status === 'OPEN' ? 'bg-blue-900/30 text-blue-500' : bet.status === 'WON' ? 'bg-green-900/30 text-green-500' : 'bg-red-900/30 text-red-500'}`}>
                                                  {bet.status}
                                              </span>
                                          </div>
                                      </div>
                                  ))}
                              </div>
                          </div>
                      )}
                  </div>
                  
                  {/* Leaderboard Widget */}
                  <div className="bg-zinc-900 border border-zinc-800 p-6 rounded-xl relative overflow-hidden">
                      <div className="absolute top-0 right-0 p-4 opacity-10"><Trophy className="w-24 h-24" /></div>
                      <h3 className="font-black text-white uppercase mb-6 flex items-center relative z-10"><Trophy className="w-4 h-4 text-yellow-500 mr-2"/> Top Senseis</h3>
                      <div className="space-y-4 relative z-10">
                          {[
                              { user: 'CryptoKing', score: 12400, streak: 8 },
                              { user: 'JiuJitsuDave', score: 9200, streak: 3 },
                              { user: 'Striker99', score: 8150, streak: 5 }
                          ].map((player, i) => (
                              <div key={i} className="flex items-center justify-between bg-zinc-950/50 p-3 rounded-lg border border-zinc-800/50">
                                  <div className="flex items-center gap-3">
                                      <div className={`w-6 h-6 flex items-center justify-center rounded font-bold text-xs ${i === 0 ? 'bg-yellow-500 text-black' : i === 1 ? 'bg-zinc-400 text-black' : 'bg-orange-700 text-white'}`}>
                                          {i + 1}
                                      </div>
                                      <span className="text-sm font-bold text-zinc-300">{player.user}</span>
                                  </div>
                                  <div className="text-right">
                                      <div className="text-sm font-mono font-bold text-white">{player.score.toLocaleString()}</div>
                                      {player.streak > 3 && (
                                          <div className="text-[10px] font-bold text-orange-500 flex items-center justify-end">
                                              <Flame className="w-3 h-3 mr-1 fill-current animate-pulse"/> {player.streak} Streak
                                          </div>
                                      )}
                                  </div>
                              </div>
                          ))}
                      </div>
                  </div>
              </div>
          </div>
      )}

      {/* MARKET TAB */}
      {activeTab === 'MARKET' && (
          <div className="bg-zinc-900 rounded-xl border border-zinc-800 overflow-hidden">
                <div className="overflow-x-auto">
                <table className="w-full text-left">
                    <thead className="bg-zinc-950 text-zinc-500 text-xs uppercase font-bold">
                        <tr>
                            <th className="p-4">Fighter</th>
                            <th className="p-4 text-right">Price</th>
                            <th className="p-4 text-right">24h Change</th>
                            <th className="p-4 text-center">You Own</th>
                            <th className="p-4 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-zinc-800">
                        {fighters.map(fighter => {
                            const owned = portfolio.find(p => p.fighterId === fighter.id)?.shares || 0;
                            return (
                                <tr key={fighter.id} className="hover:bg-zinc-800/50 transition-colors">
                                    <td className="p-4">
                                        <Link to={`/fighters/${fighter.id}`} className="flex items-center gap-3 hover:opacity-80">
                                            <img src={fighter.imageUrl} className="w-10 h-10 rounded-full object-cover" alt={fighter.name} />
                                            <div>
                                                <p className="font-bold text-white">{fighter.name}</p>
                                                <p className="text-xs text-zinc-500">{fighter.nickname}</p>
                                            </div>
                                        </Link>
                                    </td>
                                    <td className="p-4 text-right font-mono text-white font-bold">
                                        ${fighter.stockPrice.toFixed(2)}
                                    </td>
                                    <td className={`p-4 text-right font-mono font-bold flex items-center justify-end gap-1 ${fighter.stockChange >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                                        {fighter.stockChange >= 0 ? <TrendingUp className="w-4 h-4"/> : <TrendingDown className="w-4 h-4"/>}
                                        {Math.abs(fighter.stockChange).toFixed(2)}%
                                    </td>
                                    <td className="p-4 text-center font-mono text-zinc-300">
                                        {owned}
                                    </td>
                                    <td className="p-4 text-right">
                                        <div className="flex justify-end gap-2">
                                            <button onClick={() => handleSell(fighter)} disabled={owned === 0} className="px-3 py-1 bg-zinc-800 hover:bg-zinc-700 disabled:opacity-30 text-white text-xs font-bold rounded">Sell</button>
                                            <button onClick={() => handleBuy(fighter)} disabled={wallet < fighter.stockPrice} className="px-3 py-1 bg-green-600 hover:bg-green-700 disabled:opacity-30 text-white text-xs font-bold rounded">Buy</button>
                                        </div>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
              </div>
          </div>
      )}

      {/* BOUNTIES TAB */}
      {activeTab === 'BOUNTIES' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {bounties.map(bounty => (
                  <div key={bounty.id} className={`p-6 rounded-xl border-2 relative overflow-hidden transition-all hover:-translate-y-1 ${bounty.status === 'ACTIVE' ? 'bg-zinc-900 border-dashed border-zinc-700 hover:border-yellow-500' : 'bg-zinc-950 border-zinc-800 opacity-60'}`}>
                      <div className="flex justify-between items-start mb-4">
                          <span className={`text-[10px] font-black uppercase tracking-widest px-2 py-1 rounded mb-2 inline-block ${bounty.status === 'ACTIVE' ? 'bg-yellow-500/20 text-yellow-500' : 'bg-zinc-800 text-zinc-500'}`}>{bounty.status}</span>
                          <div className="text-right"><p className="text-xs text-zinc-500 uppercase font-bold">Reward</p><p className="text-green-400 font-bold font-mono">{bounty.reward}</p></div>
                      </div>
                      <h3 className="text-xl font-black text-white uppercase mb-2">{bounty.title}</h3>
                      <p className="text-zinc-300 mb-6 text-sm">{bounty.description}</p>
                      {bounty.status === 'CLAIMED' ? (
                          <div className="flex items-center text-sm text-zinc-500 bg-zinc-900 p-3 rounded"><AlertCircle className="w-4 h-4 mr-2" /> Claimed by ID #{bounty.claimedByFighterId}</div>
                      ) : <div className="flex items-center text-sm text-yellow-500 font-bold">Waiting for completion...</div>}
                  </div>
              ))}
          </div>
      )}
    </div>
  );
};

export default FantasyDojo;
