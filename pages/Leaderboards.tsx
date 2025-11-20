import React, { useEffect, useState } from 'react';
import { dataService } from '../services/mockData';
import { Fighter } from '../types';
import { Trophy, User } from 'lucide-react';

const Leaderboards = () => {
  const [activeTab, setActiveTab] = useState<'FIGHTERS' | 'PREDICTIONS'>('FIGHTERS');
  const [fighters, setFighters] = useState<Fighter[]>([]);
  const [userStats, setUserStats] = useState<{userEmail: string, correct: number, total: number}[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const f = await dataService.getFighters();
        setFighters(f.sort((a, b) => b.recordWins - a.recordWins)); // Mock ranking
        
        const stats = await dataService.getPredictionLeaderboard();
        setUserStats(stats);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <h1 className="text-4xl font-black text-white uppercase tracking-tight mb-8 text-center">Rankings & Leaderboards</h1>
      
      <div className="flex justify-center mb-8">
        <div className="bg-zinc-900 p-1 rounded-lg inline-flex border border-zinc-800">
            <button 
                onClick={() => setActiveTab('FIGHTERS')}
                className={`px-6 py-2 rounded-md text-sm font-bold transition-colors flex items-center ${activeTab === 'FIGHTERS' ? 'bg-zinc-800 text-white shadow-sm' : 'text-zinc-400 hover:text-white'}`}
            >
                <Trophy className="w-4 h-4 mr-2" /> P4P Fighters
            </button>
            <button 
                onClick={() => setActiveTab('PREDICTIONS')}
                className={`px-6 py-2 rounded-md text-sm font-bold transition-colors flex items-center ${activeTab === 'PREDICTIONS' ? 'bg-zinc-800 text-white shadow-sm' : 'text-zinc-400 hover:text-white'}`}
            >
                <User className="w-4 h-4 mr-2" /> Fan Predictions
            </button>
        </div>
      </div>

      <div className="bg-zinc-900 rounded-xl border border-zinc-800 overflow-hidden">
        {loading ? (
             <table className="w-full text-left">
                <thead className="bg-zinc-950 text-zinc-400 uppercase text-xs tracking-wider font-bold">
                    <tr>
                        <th className="p-4 w-16 text-center">Rank</th>
                        <th className="p-4">Name</th>
                        <th className="p-4 text-right">Record</th>
                    </tr>
                </thead>
                <tbody>
                    {Array.from({ length: 5 }).map((_, i) => (
                        <tr key={i} className="animate-pulse">
                            <td className="p-4 text-center">
                                <div className="h-6 w-6 bg-zinc-800 rounded mx-auto"></div>
                            </td>
                            <td className="p-4">
                                <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 rounded-full bg-zinc-800"></div>
                                    <div className="space-y-2">
                                        <div className="h-4 w-32 bg-zinc-800 rounded"></div>
                                        <div className="h-3 w-20 bg-zinc-800 rounded"></div>
                                    </div>
                                </div>
                            </td>
                            <td className="p-4">
                                <div className="h-4 w-16 bg-zinc-800 rounded ml-auto"></div>
                            </td>
                        </tr>
                    ))}
                </tbody>
             </table>
        ) : activeTab === 'FIGHTERS' ? (
            <table className="w-full text-left">
            <thead className="bg-zinc-950 text-zinc-400 uppercase text-xs tracking-wider font-bold">
                <tr>
                <th className="p-4 w-16 text-center">Rank</th>
                <th className="p-4">Fighter</th>
                <th className="p-4">Weight Class</th>
                <th className="p-4 text-right">Record</th>
                </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800">
                {fighters.map((fighter, idx) => (
                <tr key={fighter.id} className="hover:bg-zinc-800/50 transition-colors">
                    <td className="p-4 text-center font-black text-zinc-500 text-lg">{idx + 1}</td>
                    <td className="p-4">
                    <div className="flex items-center gap-4">
                        <img src={fighter.imageUrl} alt="" className="w-10 h-10 rounded-full object-cover bg-zinc-800" />
                        <div>
                        <div className="font-bold text-white">{fighter.name}</div>
                        <div className="text-xs text-zinc-500">{fighter.gym}</div>
                        </div>
                    </div>
                    </td>
                    <td className="p-4 text-zinc-300 text-sm">{fighter.weightClass}</td>
                    <td className="p-4 text-right font-mono text-zinc-300">{fighter.recordWins}-{fighter.recordLosses}-{fighter.recordDraws}</td>
                </tr>
                ))}
            </tbody>
            </table>
        ) : (
            <table className="w-full text-left">
            <thead className="bg-zinc-950 text-zinc-400 uppercase text-xs tracking-wider font-bold">
                <tr>
                <th className="p-4 w-16 text-center">Rank</th>
                <th className="p-4">User</th>
                <th className="p-4 text-center">Correct Picks</th>
                <th className="p-4 text-right">Accuracy</th>
                </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800">
                {userStats.length === 0 ? (
                    <tr><td colSpan={4} className="p-8 text-center text-zinc-500">No predictions yet. Be the first!</td></tr>
                ) : (
                    userStats.map((stat, idx) => {
                        const accuracy = stat.total > 0 ? Math.round((stat.correct / stat.total) * 100) : 0;
                        return (
                            <tr key={stat.userEmail} className="hover:bg-zinc-800/50 transition-colors">
                                <td className="p-4 text-center font-black text-zinc-500 text-lg">{idx + 1}</td>
                                <td className="p-4 font-bold text-white">{stat.userEmail.split('@')[0]}</td>
                                <td className="p-4 text-center text-zinc-300 font-mono">{stat.correct} / {stat.total}</td>
                                <td className="p-4 text-right font-mono text-zinc-300">
                                    <span className={`px-2 py-1 rounded text-xs font-bold ${accuracy > 50 ? 'bg-green-900 text-green-400' : 'bg-zinc-800 text-zinc-400'}`}>
                                        {accuracy}%
                                    </span>
                                </td>
                            </tr>
                        );
                    })
                )}
            </tbody>
            </table>
        )}
      </div>
    </div>
  );
};

export default Leaderboards;