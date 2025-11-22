
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { 
  Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer, Tooltip, BarChart, Bar, XAxis, YAxis, Cell 
} from 'recharts';
import { dataService } from '../services/mockData';
import { Fighter, FightWithFighters } from '../types';
import { Shield, User, Activity, BadgeCheck, Hexagon, Ruler, Scale } from 'lucide-react';

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

  if (!fighter) return <div className="py-20 text-center text-zinc-500">Loading Fighter Profile...</div>;

  // Calculate Gladiator Stats for Spider Chart
  const totalWins = fighter.recordWins || 1;
  const finishRate = ((fighter.koWins + fighter.submissionWins) / totalWins) * 100;
  const strikingBias = (fighter.koWins / totalWins) * 100;
  const grapplingBias = (fighter.submissionWins / totalWins) * 100;
  const endurance = (fighter.decisionWins / totalWins) * 100;
  
  const spiderData = [
    { subject: 'Striking', value: Math.min(strikingBias * 1.2, 100), fullMark: 100 },
    { subject: 'Grappling', value: Math.min(grapplingBias * 1.5, 100), fullMark: 100 },
    { subject: 'Finish Rate', value: Math.min(finishRate, 100), fullMark: 100 },
    { subject: 'Endurance', value: Math.min(endurance * 2, 100), fullMark: 100 },
    { subject: 'Defense', value: 85, fullMark: 100 },
  ];

  // Tale of the Tape Comparison Data
  const avgHeight = 180; // Division avg placeholder
  const avgReach = 185; // Division avg placeholder
  
  const comparisonData = [
    { name: 'Height (cm)', value: fighter.heightCm || 0, avg: avgHeight },
    { name: 'Reach (cm)', value: fighter.reachCm || 0, avg: avgReach }
  ];

  return (
    <div>
      {/* Hero */}
      <div className="bg-zinc-900 border-b border-zinc-800 py-12 relative overflow-hidden">
         <div className="absolute top-0 right-0 w-1/3 h-full bg-gradient-to-l from-red-600/10 to-transparent"></div>
         <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row items-center gap-8 relative z-10">
            <div className="relative">
              <img src={fighter.imageUrl} alt={fighter.name} className="w-48 h-48 rounded-full border-4 border-zinc-800 shadow-2xl object-cover" />
              {fighter.isVerified && (
                <div className="absolute -bottom-2 -right-2 bg-blue-600 text-white p-2 rounded-full border-4 border-zinc-900 shadow-lg tooltip-container group cursor-help">
                  <BadgeCheck className="w-6 h-6" />
                  <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-48 bg-zinc-950 text-xs text-zinc-300 p-2 rounded border border-zinc-800 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                    <p className="font-bold text-white flex items-center mb-1"><Hexagon className="w-3 h-3 mr-1 text-blue-500"/> Blockchain Verified</p>
                    <p className="font-mono text-[10px]">0x71C...9A2F</p>
                    <p>Belt credentials verified on-chain.</p>
                  </div>
                </div>
              )}
            </div>
            
            <div className="text-center md:text-left">
               <h1 className="text-4xl md:text-6xl font-black text-white uppercase italic tracking-tighter">{fighter.name}</h1>
               {fighter.nickname && <p className="text-2xl text-red-500 font-bold">"{fighter.nickname}"</p>}
               <div className="flex flex-wrap justify-center md:justify-start gap-4 mt-4">
                 <span className="px-3 py-1 bg-zinc-800 rounded text-sm font-bold text-zinc-300 uppercase tracking-wide">{fighter.weightClass}</span>
                 <span className="px-3 py-1 bg-zinc-800 rounded text-sm font-bold text-zinc-300">{fighter.gym}</span>
                 <span className="px-3 py-1 bg-zinc-800 rounded text-sm font-bold text-zinc-300 flex items-center gap-2">
                   <img src={`https://flagcdn.com/w20/${fighter.country === 'Brazil' ? 'br' : fighter.country === 'USA' ? 'us' : 'ng'}.png`} className="w-4" alt=""/>
                   {fighter.country}
                 </span>
               </div>
            </div>
            <div className="ml-auto bg-zinc-950 p-6 rounded-xl border border-zinc-800 text-center min-w-[150px]">
               <span className="block text-xs text-zinc-500 uppercase tracking-widest">Record</span>
               <span className="block text-4xl font-black text-white font-mono mt-1">{fighter.recordWins}-{fighter.recordLosses}-{fighter.recordDraws}</span>
            </div>
         </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-12 grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* Left Column: Stats */}
        <div className="lg:col-span-1 space-y-8">
          {/* Tale of the Tape Visualizer */}
          <div className="bg-zinc-900 rounded-xl p-6 border border-zinc-800 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-red-600 to-purple-600"></div>
            <h3 className="text-xl font-bold text-white mb-6 flex items-center uppercase tracking-tighter italic">
                <Activity className="w-5 h-5 mr-2 text-red-500"/> Tale of the Tape
            </h3>
            
            {/* Height/Reach Visuals */}
            <div className="mb-8 space-y-6">
                 <div>
                     <div className="flex justify-between text-xs font-bold text-zinc-500 mb-1 uppercase">
                         <span className="flex items-center"><Ruler className="w-3 h-3 mr-1"/> Height</span>
                         <span className="text-white">{fighter.heightCm} cm</span>
                     </div>
                     <div className="h-2 bg-zinc-800 rounded-full overflow-hidden relative">
                         <div className="absolute top-0 left-0 h-full bg-zinc-700 w-[60%]" title="Div Avg"></div>
                         <div className="absolute top-0 left-0 h-full bg-red-600" style={{width: `${Math.min((fighter.heightCm || 0)/220 * 100, 100)}%`}}></div>
                     </div>
                 </div>
                 <div>
                     <div className="flex justify-between text-xs font-bold text-zinc-500 mb-1 uppercase">
                         <span className="flex items-center"><Scale className="w-3 h-3 mr-1"/> Reach</span>
                         <span className="text-white">{fighter.reachCm} cm</span>
                     </div>
                     <div className="h-2 bg-zinc-800 rounded-full overflow-hidden relative">
                         <div className="absolute top-0 left-0 h-full bg-zinc-700 w-[60%]" title="Div Avg"></div>
                         <div className="absolute top-0 left-0 h-full bg-blue-500" style={{width: `${Math.min((fighter.reachCm || 0)/220 * 100, 100)}%`}}></div>
                     </div>
                 </div>
                 <div className="flex justify-between text-[10px] text-zinc-600 pt-1">
                     <span>Grey bar indicates division average</span>
                 </div>
            </div>

            {/* Spider Chart */}
            <div className="h-64 w-full -ml-4">
               <ResponsiveContainer width="100%" height="100%">
                <RadarChart cx="50%" cy="50%" outerRadius="70%" data={spiderData}>
                  <PolarGrid stroke="#3f3f46" strokeDasharray="3 3" />
                  <PolarAngleAxis dataKey="subject" tick={{ fill: '#a1a1aa', fontSize: 11, fontWeight: 'bold' }} />
                  <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
                  <Radar
                    name={fighter.name}
                    dataKey="value"
                    stroke="#ef4444"
                    strokeWidth={3}
                    fill="#ef4444"
                    fillOpacity={0.3}
                  />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#18181b', border: '1px solid #27272a', borderRadius: '8px', color: '#fff' }}
                    itemStyle={{ color: '#fff' }}
                  />
                </RadarChart>
              </ResponsiveContainer>
            </div>
          </div>
          
          <div className="bg-zinc-900 rounded-xl p-6 border border-zinc-800">
             <h3 className="text-xl font-bold text-white mb-4 flex items-center"><User className="w-5 h-5 mr-2 text-red-500"/> Bio</h3>
             <p className="text-zinc-400 leading-relaxed text-sm">
               {fighter.bio}
             </p>
          </div>
        </div>

        {/* Right Column: History */}
        <div className="lg:col-span-2">
          <h3 className="text-xl font-bold text-white mb-6 flex items-center"><Shield className="w-5 h-5 mr-2 text-red-500"/> Fight History</h3>
          <div className="space-y-4">
            {history.length === 0 ? <p className="text-zinc-500 italic">No fights recorded.</p> : 
             history.map((fight) => {
               const isA = fight.fighterAId === fighter.id;
               const opponent = isA ? fight.fighterB : fight.fighterA;
               const isWin = fight.status === 'FINISHED' && fight.resultWinnerId === fighter.id;
               const isLoss = fight.status === 'FINISHED' && fight.resultWinnerId && fight.resultWinnerId !== fighter.id;
               
               return (
                 <div key={fight.id} className="bg-zinc-900 border border-zinc-800 rounded-lg p-4 flex flex-col sm:flex-row sm:items-center justify-between hover:border-zinc-600 transition-colors group gap-4">
                    <div className="flex items-center gap-4">
                      <div className={`w-12 h-12 flex-shrink-0 flex items-center justify-center rounded font-black text-lg border ${isWin ? 'bg-green-900/20 text-green-400 border-green-900' : isLoss ? 'bg-red-900/20 text-red-400 border-red-900' : 'bg-zinc-800 text-zinc-400 border-zinc-700'}`}>
                        {fight.status === 'UPCOMING' ? '-' : isWin ? 'W' : 'L'}
                      </div>
                      <div>
                        <div className="font-bold text-white group-hover:text-red-500 transition-colors text-lg">vs {opponent.name}</div>
                        <div className="text-xs text-zinc-500">{fight.eventName} • {new Date(fight.date).getFullYear()}</div>
                      </div>
                    </div>
                    <div className="text-left sm:text-right pl-16 sm:pl-0">
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
