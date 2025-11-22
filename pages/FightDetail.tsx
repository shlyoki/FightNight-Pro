
import React, { useEffect, useState, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import { dataService, socketService } from '../services/mockData';
import { FightWithFighters, Prediction, FightUpdate, Fighter } from '../types';
import { MapPin, Calendar, Trophy, Radio, CheckCircle, XCircle, BarChart2, Activity, Zap, AlertTriangle, History } from 'lucide-react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, 
  Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis 
} from 'recharts';

const TaleOfTheTapeVisualizer = ({ fighterA, fighterB }: { fighterA: Fighter, fighterB: Fighter }) => {
  const [activeTab, setActiveTab] = useState<'PHYSICAL' | 'MATRIX' | 'METHODS'>('PHYSICAL');

  // Prepare Data
  const physicalData = [
    { name: 'Height', A: fighterA.heightCm || 0, B: fighterB.heightCm || 0, unit: 'cm' },
    { name: 'Reach', A: fighterA.reachCm || 0, B: fighterB.reachCm || 0, unit: 'cm' },
  ];

  const totalFightsA = fighterA.recordWins + fighterA.recordLosses + fighterA.recordDraws;
  const totalFightsB = fighterB.recordWins + fighterB.recordLosses + fighterB.recordDraws;

  // Normalize for Radar Chart (Rough approximations for visual balance)
  const radarData = [
    { subject: 'Experience', A: Math.min(totalFightsA * 3, 100), B: Math.min(totalFightsB * 3, 100), fullMark: 100 },
    { subject: 'Striking', A: Math.min((fighterA.koWins / (fighterA.recordWins || 1)) * 100, 100), B: Math.min((fighterB.koWins / (fighterB.recordWins || 1)) * 100, 100), fullMark: 100 },
    { subject: 'Grappling', A: Math.min((fighterA.submissionWins / (fighterA.recordWins || 1)) * 100, 100), B: Math.min((fighterB.submissionWins / (fighterB.recordWins || 1)) * 100, 100), fullMark: 100 },
    { subject: 'Win %', A: Math.min((fighterA.recordWins / totalFightsA) * 100, 100), B: Math.min((fighterB.recordWins / totalFightsB) * 100, 100), fullMark: 100 },
    { subject: 'Endurance', A: Math.min((fighterA.decisionWins / (fighterA.recordWins || 1)) * 100, 100), B: Math.min((fighterB.decisionWins / (fighterB.recordWins || 1)) * 100, 100), fullMark: 100 },
  ];

  const methodsData = [
    { method: 'KO/TKO', A: fighterA.koWins, B: fighterB.koWins },
    { method: 'Submission', A: fighterA.submissionWins, B: fighterB.submissionWins },
    { method: 'Decision', A: fighterA.decisionWins, B: fighterB.decisionWins },
  ];

  return (
    <div className="bg-zinc-900 rounded-xl border border-zinc-800 overflow-hidden">
        {/* Tabs */}
        <div className="flex border-b border-zinc-800">
            <button 
                onClick={() => setActiveTab('PHYSICAL')}
                className={`flex-1 py-4 text-sm font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-colors ${activeTab === 'PHYSICAL' ? 'bg-zinc-800 text-white' : 'text-zinc-500 hover:text-zinc-300'}`}
            >
                <Activity className="w-4 h-4" /> Physical
            </button>
            <button 
                onClick={() => setActiveTab('MATRIX')}
                className={`flex-1 py-4 text-sm font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-colors ${activeTab === 'MATRIX' ? 'bg-zinc-800 text-white' : 'text-zinc-500 hover:text-zinc-300'}`}
            >
                <Zap className="w-4 h-4" /> Skills Matrix
            </button>
            <button 
                onClick={() => setActiveTab('METHODS')}
                className={`flex-1 py-4 text-sm font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-colors ${activeTab === 'METHODS' ? 'bg-zinc-800 text-white' : 'text-zinc-500 hover:text-zinc-300'}`}
            >
                <BarChart2 className="w-4 h-4" /> Victory Path
            </button>
        </div>

        <div className="p-6 md:p-8 min-h-[400px] flex flex-col justify-center">
            
            {/* Header Names */}
            <div className="flex justify-between items-center mb-8 text-xl font-black uppercase italic">
                <span className="text-white">{fighterA.name}</span>
                <span className="text-red-600">VS</span>
                <span className="text-white">{fighterB.name}</span>
            </div>

            {activeTab === 'PHYSICAL' && (
                <div className="space-y-8">
                    {/* Stance Comparison (Text) */}
                    <div className="flex justify-between items-center border-b border-zinc-800 pb-4">
                        <div className="text-2xl font-bold text-white">{fighterA.stance || 'Orthodox'}</div>
                        <div className="text-xs text-zinc-500 uppercase tracking-widest">Stance</div>
                        <div className="text-2xl font-bold text-white">{fighterB.stance || 'Orthodox'}</div>
                    </div>
                    
                    {/* Age (Simulated) */}
                    <div className="flex justify-between items-center border-b border-zinc-800 pb-4">
                        <div className="text-2xl font-bold text-white">34</div>
                        <div className="text-xs text-zinc-500 uppercase tracking-widest">Age</div>
                        <div className="text-2xl font-bold text-white">32</div>
                    </div>

                    {/* Height & Reach Bars */}
                    <div className="space-y-6">
                        {physicalData.map((stat) => (
                             <div key={stat.name}>
                                <div className="flex justify-between text-xs text-zinc-500 uppercase font-bold mb-2">
                                    <span>{stat.A} {stat.unit}</span>
                                    <span>{stat.name}</span>
                                    <span>{stat.B} {stat.unit}</span>
                                </div>
                                <div className="flex h-4 bg-zinc-800 rounded-full overflow-hidden relative">
                                    {/* Middle Line */}
                                    <div className="absolute left-1/2 top-0 bottom-0 w-0.5 bg-zinc-950 z-10"></div>
                                    
                                    {/* Fighter A Bar (Right aligned in left half) */}
                                    <div className="w-1/2 flex justify-end">
                                        <div 
                                            className="h-full bg-white rounded-l-full" 
                                            style={{ width: `${(stat.A / 250) * 100}%` }}
                                        ></div>
                                    </div>
                                    
                                    {/* Fighter B Bar (Left aligned in right half) */}
                                    <div className="w-1/2 flex justify-start">
                                        <div 
                                            className="h-full bg-red-600 rounded-r-full" 
                                            style={{ width: `${(stat.B / 250) * 100}%` }}
                                        ></div>
                                    </div>
                                </div>
                             </div>
                        ))}
                    </div>
                </div>
            )}

            {activeTab === 'MATRIX' && (
                <div className="h-[350px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <RadarChart outerRadius={110} data={radarData}>
                            <PolarGrid stroke="#3f3f46" />
                            <PolarAngleAxis dataKey="subject" tick={{ fill: '#a1a1aa', fontSize: 12 }} />
                            <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
                            <Radar name={fighterA.name} dataKey="A" stroke="#ffffff" strokeWidth={3} fill="#ffffff" fillOpacity={0.3} />
                            <Radar name={fighterB.name} dataKey="B" stroke="#dc2626" strokeWidth={3} fill="#dc2626" fillOpacity={0.3} />
                            <Legend wrapperStyle={{ paddingTop: '20px' }}/>
                            <Tooltip 
                                contentStyle={{ backgroundColor: '#18181b', border: '1px solid #27272a', borderRadius: '8px', color: '#fff' }}
                                itemStyle={{ color: '#fff' }}
                            />
                        </RadarChart>
                    </ResponsiveContainer>
                </div>
            )}

            {activeTab === 'METHODS' && (
                <div className="h-[350px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={methodsData} layout="vertical" margin={{ left: 20, right: 20 }}>
                            <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#3f3f46" />
                            <XAxis type="number" stroke="#71717a" hide />
                            <YAxis dataKey="method" type="category" stroke="#a1a1aa" width={80} />
                            <Tooltip 
                                cursor={{fill: '#27272a'}}
                                contentStyle={{ backgroundColor: '#18181b', border: '1px solid #27272a', borderRadius: '8px', color: '#fff' }}
                            />
                            <Legend />
                            <Bar dataKey="A" name={fighterA.name} fill="#ffffff" radius={[0, 4, 4, 0]} barSize={20} />
                            <Bar dataKey="B" name={fighterB.name} fill="#dc2626" radius={[0, 4, 4, 0]} barSize={20} />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            )}
        </div>
    </div>
  );
};


const FightDetail = ({ user }: { user?: any }) => {
  const { id } = useParams();
  const [fight, setFight] = useState<FightWithFighters | null>(null);
  const [updates, setUpdates] = useState<FightUpdate[]>([]);
  const [userPrediction, setUserPrediction] = useState<Prediction | undefined>(undefined);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [pastMatchups, setPastMatchups] = useState<FightWithFighters[]>([]);
  const updatesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const load = async () => {
      if (!id) return;
      const fights = await dataService.getFightsWithFighters();
      const found = fights.find(f => f.id === id);
      setFight(found || null);

      if (found) {
        // Check for nemesis history
        const past = fights.filter(f => 
          f.id !== found.id && 
          f.status === 'FINISHED' &&
          ((f.fighterAId === found.fighterAId && f.fighterBId === found.fighterBId) ||
           (f.fighterAId === found.fighterBId && f.fighterBId === found.fighterAId))
        );
        setPastMatchups(past);
      }

      if (user) {
        const pred = await dataService.getUserPrediction(user.id, id);
        setUserPrediction(pred);
      }
    };
    load();
  }, [id, user]);

  // Real-time updates effect
  useEffect(() => {
    if (!id || !fight || fight.status !== 'IN_PROGRESS') return;

    const handleUpdate = (update: FightUpdate) => {
      setUpdates(prev => [...prev, update]);
    };

    socketService.subscribe(id, handleUpdate);
    return () => socketService.unsubscribe(id, handleUpdate);
  }, [id, fight]);

  // Scroll to bottom of logs
  useEffect(() => {
    updatesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [updates]);

  const handlePredict = async (fighterId: string) => {
    if (!user || !id) return;
    setIsSubmitting(true);
    const newPred = await dataService.submitPrediction({
      userId: user.id,
      userEmail: user.email,
      fightId: id,
      predictedWinnerId: fighterId
    });
    setUserPrediction(newPred);
    setIsSubmitting(false);
  };

  if (!fight) return <div className="text-center py-20">Loading...</div>;

  const isFinished = fight.status === 'FINISHED';
  const isLive = fight.status === 'IN_PROGRESS';

  return (
    <div className="min-h-screen pb-20">
      {/* Header */}
      <div className="bg-zinc-900 border-b border-zinc-800 py-12 relative overflow-hidden">
        {isLive && (
            <div className="absolute top-0 left-0 w-full bg-red-600/20 border-b border-red-600 text-center py-1 text-red-500 text-xs font-bold uppercase tracking-widest animate-pulse">
                <Radio className="w-3 h-3 inline mr-1" /> Live Event In Progress
            </div>
        )}
        <div className="max-w-5xl mx-auto px-4 text-center mt-6">
          <span className="inline-block px-3 py-1 bg-zinc-800 text-zinc-300 text-xs font-bold uppercase tracking-wider rounded mb-4">
            {fight.weightClass} Bout
          </span>
          <h1 className="text-3xl md:text-5xl font-black text-white uppercase italic">{fight.eventName}</h1>
          <div className="flex justify-center items-center space-x-6 mt-4 text-zinc-400">
            <div className="flex items-center"><Calendar className="w-4 h-4 mr-2"/> {new Date(fight.date).toLocaleString()}</div>
            <div className="flex items-center"><MapPin className="w-4 h-4 mr-2"/> {fight.location}</div>
          </div>
        </div>
      </div>

      {/* Nemesis Alert */}
      {pastMatchups.length > 0 && (
        <div className="max-w-3xl mx-auto mt-8 px-4">
          <div className="bg-amber-900/20 border border-amber-600/50 rounded-xl p-4 flex items-start gap-4 shadow-lg shadow-amber-900/10">
            <div className="p-2 bg-amber-600/20 rounded-full mt-1">
              <AlertTriangle className="w-6 h-6 text-amber-500" />
            </div>
            <div className="flex-1">
              <h4 className="text-amber-500 font-black uppercase tracking-wider text-lg">Nemesis Alert: Rematch Detected</h4>
              <p className="text-zinc-300 text-sm mt-1">
                These fighters have met {pastMatchups.length} time{pastMatchups.length > 1 ? 's' : ''} before.
              </p>
              <div className="mt-3 space-y-2">
                {pastMatchups.map(past => {
                   const winner = past.resultWinnerId === fight.fighterAId ? fight.fighterA : fight.fighterB;
                   return (
                     <div key={past.id} className="flex items-center text-xs text-zinc-400 bg-black/30 p-2 rounded">
                        <History className="w-3 h-3 mr-2" />
                        <span className="font-bold text-white mr-2">{past.eventName}:</span>
                        <span className="text-amber-500">Winner {winner.name}</span>
                        <span className="ml-1">by {past.resultMethod}</span>
                     </div>
                   );
                })}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Matchup & Prediction */}
      <div className="max-w-7xl mx-auto px-4 mt-12">
        <div className="flex flex-col md:flex-row items-center justify-center gap-12">
          
          {/* Fighter A */}
          <div className="flex-1 text-center group relative">
            <Link to={`/fighters/${fight.fighterAId}`}>
              <div className={`relative inline-block transition-all ${userPrediction?.predictedWinnerId === fight.fighterAId ? 'ring-4 ring-blue-500 rounded-full' : ''}`}>
                 <img src={fight.fighterA.imageUrl} alt={fight.fighterA.name} className="w-48 h-48 md:w-64 md:h-64 rounded-full object-cover border-4 border-zinc-800 group-hover:border-red-600 transition-all" />
                 {isFinished && fight.resultWinnerId === fight.fighterAId && (
                   <div className="absolute -top-4 -right-4 bg-yellow-500 text-black p-3 rounded-full border-4 border-zinc-950 z-10">
                     <Trophy className="w-6 h-6" />
                   </div>
                 )}
              </div>
              <h2 className="text-3xl font-black text-white mt-4 uppercase">{fight.fighterA.name}</h2>
              <p className="text-zinc-500 font-mono">{fight.fighterA.recordWins}-{fight.fighterA.recordLosses}-{fight.fighterA.recordDraws}</p>
            </Link>
            
            {/* Prediction Button A */}
            {!isFinished && !isLive && user && (
                <button 
                    onClick={() => handlePredict(fight.fighterAId)}
                    disabled={!!userPrediction || isSubmitting}
                    className={`mt-4 px-6 py-2 rounded-full font-bold text-sm transition-all ${
                        userPrediction?.predictedWinnerId === fight.fighterAId 
                        ? 'bg-blue-600 text-white' 
                        : userPrediction 
                            ? 'bg-zinc-800 text-zinc-500 opacity-50'
                            : 'bg-zinc-800 hover:bg-blue-600 text-white'
                    }`}
                >
                    {userPrediction?.predictedWinnerId === fight.fighterAId ? 'Your Pick' : 'Pick to Win'}
                </button>
            )}
          </div>

          {/* VS / Result / Live */}
          <div className="text-center min-w-[200px]">
            {isLive ? (
               <div className="bg-red-600/10 border border-red-600/50 p-4 rounded-xl animate-pulse">
                  <p className="text-red-500 font-black text-2xl">LIVE</p>
                  <p className="text-red-400 text-xs uppercase tracking-widest">Round 1</p>
               </div>
            ) : isFinished ? (
              <div className="bg-zinc-900 p-6 rounded-xl border border-zinc-800">
                <p className="text-xs text-zinc-500 uppercase tracking-wider font-bold mb-2">Result</p>
                <p className="text-2xl font-bold text-white">{fight.resultMethod}</p>
                <p className="text-zinc-400">Round {fight.resultRound} • {fight.resultTime}</p>
              </div>
            ) : (
              <div className="text-6xl font-black text-red-600 italic">VS</div>
            )}
            
            {/* User Prediction Status Display */}
            {userPrediction && (
                <div className="mt-6 bg-zinc-900/50 p-3 rounded border border-zinc-800">
                    <p className="text-xs text-zinc-500 uppercase tracking-wide mb-1">Your Prediction</p>
                    <div className="flex items-center justify-center gap-2 font-bold">
                        {userPrediction.predictedWinnerId === fight.fighterAId ? fight.fighterA.name : fight.fighterB.name}
                        {isFinished && (
                            userPrediction.predictedWinnerId === fight.resultWinnerId 
                            ? <CheckCircle className="w-4 h-4 text-green-500" />
                            : <XCircle className="w-4 h-4 text-red-500" />
                        )}
                    </div>
                </div>
            )}
            {!user && !isFinished && (
                <div className="mt-6">
                    <Link to="/login" className="text-sm text-blue-400 hover:underline">Login to predict winner</Link>
                </div>
            )}
          </div>

          {/* Fighter B */}
          <div className="flex-1 text-center group relative">
            <Link to={`/fighters/${fight.fighterBId}`}>
              <div className={`relative inline-block transition-all ${userPrediction?.predictedWinnerId === fight.fighterBId ? 'ring-4 ring-blue-500 rounded-full' : ''}`}>
                 <img src={fight.fighterB.imageUrl} alt={fight.fighterB.name} className="w-48 h-48 md:w-64 md:h-64 rounded-full object-cover border-4 border-zinc-800 group-hover:border-red-600 transition-all" />
                 {isFinished && fight.resultWinnerId === fight.fighterBId && (
                   <div className="absolute -top-4 -right-4 bg-yellow-500 text-black p-3 rounded-full border-4 border-zinc-950 z-10">
                     <Trophy className="w-6 h-6" />
                   </div>
                 )}
              </div>
              <h2 className="text-3xl font-black text-white mt-4 uppercase">{fight.fighterB.name}</h2>
              <p className="text-zinc-500 font-mono">{fight.fighterB.recordWins}-{fight.fighterB.recordLosses}-{fight.fighterB.recordDraws}</p>
            </Link>

            {/* Prediction Button B */}
            {!isFinished && !isLive && user && (
                <button 
                    onClick={() => handlePredict(fight.fighterBId)}
                    disabled={!!userPrediction || isSubmitting}
                    className={`mt-4 px-6 py-2 rounded-full font-bold text-sm transition-all ${
                        userPrediction?.predictedWinnerId === fight.fighterBId 
                        ? 'bg-blue-600 text-white' 
                        : userPrediction 
                            ? 'bg-zinc-800 text-zinc-500 opacity-50'
                            : 'bg-zinc-800 hover:bg-blue-600 text-white'
                    }`}
                >
                    {userPrediction?.predictedWinnerId === fight.fighterBId ? 'Your Pick' : 'Pick to Win'}
                </button>
            )}
          </div>

        </div>

        {/* Real-time Logs Section */}
        {isLive && (
            <div className="max-w-3xl mx-auto mt-16">
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-xl font-black text-white uppercase flex items-center">
                        <Radio className="w-5 h-5 text-red-600 mr-2 animate-pulse" /> Live Feed
                    </h3>
                    <span className="text-xs text-zinc-500 flex items-center"><div className="w-2 h-2 bg-red-600 rounded-full mr-2 animate-ping"></div> Updating Real-time</span>
                </div>
                <div className="bg-zinc-900 border border-zinc-800 rounded-xl h-80 overflow-y-auto p-4 space-y-3 scroll-smooth">
                    {updates.length === 0 && (
                        <div className="text-center text-zinc-600 py-10 italic">Waiting for updates...</div>
                    )}
                    {updates.map((update) => (
                        <div key={update.id} className="flex gap-4 animate-fade-in">
                            <span className="text-xs text-zinc-500 w-16 text-right font-mono mt-1">
                                {new Date(update.timestamp).toLocaleTimeString([], {minute:'2-digit', second:'2-digit'})}
                            </span>
                            <div className="flex-1">
                                <p className="text-zinc-200 text-sm">{update.message}</p>
                                <span className="text-[10px] text-zinc-600 uppercase font-bold">{update.type.replace('_', ' ')}</span>
                            </div>
                        </div>
                    ))}
                    <div ref={updatesEndRef} />
                </div>
            </div>
        )}

        {/* Interactive Tale of the Tape */}
        <div className="max-w-4xl mx-auto mt-20">
             <div className="text-center mb-8">
                 <h3 className="text-2xl font-black text-white uppercase tracking-widest">Tale of the Tape</h3>
                 <p className="text-zinc-500 text-sm">Interactive Fighter Comparison</p>
             </div>
             <TaleOfTheTapeVisualizer fighterA={fight.fighterA} fighterB={fight.fighterB} />
        </div>
      </div>
    </div>
  );
};

export default FightDetail;
