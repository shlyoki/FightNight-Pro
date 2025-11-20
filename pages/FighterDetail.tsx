import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';
import { dataService } from '../services/mockData';
import { Fighter, FightWithFighters } from '../types';
import { Shield, User, Activity } from 'lucide-react';

const FighterDetail = () => {
  const { id } = useParams();
  const [fighter, setFighter] = useState<Fighter | null>(null);
  const [history, setHistory] = useState<FightWithFighters[]>([]);

  useEffect(() => {
    const load = async () => {
      if (!id) return;
      const f = await dataService.getFighterById(id);
      setFighter(f || null);
      const fights = await dataService.getFightsWithFighters();
      const fighterHistory = fights.filter(fi => fi.fighterAId === id || fi.fighterBId === id);
      setHistory(fighterHistory);
    };
    load();
  }, [id]);

  if (!fighter) return <div>Loading...</div>;

  const chartData = [
    { name: 'KO/TKO', value: fighter.koWins },
    { name: 'Submission', value: fighter.submissionWins },
    { name: 'Decision', value: fighter.decisionWins },
  ].filter(d => d.value > 0);

  const COLORS = ['#ef4444', '#eab308', '#3b82f6'];

  return (
    <div>
      {/* Hero */}
      <div className="bg-zinc-900 border-b border-zinc-800 py-12 relative overflow-hidden">
         <div className="absolute top-0 right-0 w-1/3 h-full bg-gradient-to-l from-red-600/10 to-transparent"></div>
         <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row items-center gap-8 relative z-10">
            <img src={fighter.imageUrl} alt={fighter.name} className="w-48 h-48 rounded-full border-4 border-zinc-800 shadow-2xl" />
            <div className="text-center md:text-left">
               <h1 className="text-4xl md:text-6xl font-black text-white uppercase italic tracking-tighter">{fighter.name}</h1>
               {fighter.nickname && <p className="text-2xl text-red-500 font-bold">"{fighter.nickname}"</p>}
               <div className="flex flex-wrap justify-center md:justify-start gap-4 mt-4">
                 <span className="px-3 py-1 bg-zinc-800 rounded text-sm font-bold text-zinc-300">{fighter.weightClass}</span>
                 <span className="px-3 py-1 bg-zinc-800 rounded text-sm font-bold text-zinc-300">{fighter.gym}</span>
                 <span className="px-3 py-1 bg-zinc-800 rounded text-sm font-bold text-zinc-300">{fighter.country}</span>
               </div>
            </div>
            <div className="ml-auto bg-zinc-950 p-6 rounded-xl border border-zinc-800 text-center min-w-[150px]">
               <span className="block text-xs text-zinc-500 uppercase tracking-widest">Record</span>
               <span className="block text-4xl font-black text-white font-mono mt-1">{fighter.recordWins}-{fighter.recordLosses}-{fighter.recordDraws}</span>
            </div>
         </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-12 grid grid-cols-1 md:grid-cols-3 gap-12">
        {/* Stats Column */}
        <div className="md:col-span-1 space-y-8">
          <div className="bg-zinc-900 rounded-xl p-6 border border-zinc-800">
            <h3 className="text-xl font-bold text-white mb-6 flex items-center"><Activity className="w-5 h-5 mr-2 text-red-500"/> Win By Method</h3>
            <div className="h-64 w-full">
               <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={chartData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {chartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} strokeWidth={0} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#18181b', border: '1px solid #27272a', borderRadius: '8px' }}
                    itemStyle={{ color: '#fff' }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="flex justify-center gap-4 text-sm">
              {chartData.map((d, i) => (
                <div key={i} className="flex items-center text-zinc-400">
                  <div className="w-3 h-3 rounded-full mr-2" style={{backgroundColor: COLORS[i]}}></div>
                  {d.name}
                </div>
              ))}
            </div>
          </div>
          
          <div className="bg-zinc-900 rounded-xl p-6 border border-zinc-800">
             <h3 className="text-xl font-bold text-white mb-4 flex items-center"><User className="w-5 h-5 mr-2 text-red-500"/> Bio</h3>
             <p className="text-zinc-400 leading-relaxed">
               {fighter.bio}
             </p>
          </div>
        </div>

        {/* History Column */}
        <div className="md:col-span-2">
          <h3 className="text-xl font-bold text-white mb-6 flex items-center"><Shield className="w-5 h-5 mr-2 text-red-500"/> Fight History</h3>
          <div className="space-y-4">
            {history.length === 0 ? <p className="text-zinc-500">No fights recorded.</p> : 
             history.map((fight) => {
               const isA = fight.fighterAId === fighter.id;
               const opponent = isA ? fight.fighterB : fight.fighterA;
               const isWin = fight.status === 'FINISHED' && fight.resultWinnerId === fighter.id;
               const isLoss = fight.status === 'FINISHED' && fight.resultWinnerId && fight.resultWinnerId !== fighter.id;
               
               return (
                 <div key={fight.id} className="bg-zinc-900 border border-zinc-800 rounded-lg p-4 flex items-center justify-between hover:border-zinc-600 transition-colors">
                    <div className="flex items-center gap-4">
                      <div className={`w-10 h-10 flex items-center justify-center rounded font-black text-sm ${isWin ? 'bg-green-900 text-green-400' : isLoss ? 'bg-red-900 text-red-400' : 'bg-zinc-800 text-zinc-400'}`}>
                        {fight.status === 'UPCOMING' ? '-' : isWin ? 'W' : 'L'}
                      </div>
                      <div>
                        <div className="font-bold text-white">vs {opponent.name}</div>
                        <div className="text-xs text-zinc-500">{fight.eventName} • {new Date(fight.date).getFullYear()}</div>
                      </div>
                    </div>
                    <div className="text-right hidden sm:block">
                       <div className="text-zinc-300 font-medium">{fight.status === 'UPCOMING' ? 'Upcoming' : fight.resultMethod}</div>
                       {fight.status === 'FINISHED' && <div className="text-xs text-zinc-500">R{fight.resultRound} {fight.resultTime}</div>}
                    </div>
                 </div>
               );
             })
            }
          </div>
        </div>
      </div>
    </div>
  );
};

export default FighterDetail;
