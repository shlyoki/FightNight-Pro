import React, { useEffect, useState, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import { dataService, socketService } from '../services/mockData';
import { FightWithFighters, Prediction, FightUpdate } from '../types';
import { MapPin, Calendar, Trophy, Radio, CheckCircle, XCircle, AlertCircle } from 'lucide-react';

const FightDetail = ({ user }: { user?: any }) => {
  const { id } = useParams();
  const [fight, setFight] = useState<FightWithFighters | null>(null);
  const [updates, setUpdates] = useState<FightUpdate[]>([]);
  const [userPrediction, setUserPrediction] = useState<Prediction | undefined>(undefined);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const updatesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const load = async () => {
      if (!id) return;
      const fights = await dataService.getFightsWithFighters();
      const found = fights.find(f => f.id === id);
      setFight(found || null);

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

        {/* Tale of the Tape */}
        <div className="max-w-3xl mx-auto mt-20 bg-zinc-900 rounded-xl border border-zinc-800 p-8">
          <h3 className="text-center text-xl font-black text-white uppercase mb-8 tracking-widest">Tale of the Tape</h3>
          
          <div className="space-y-6">
            {[
              { label: 'Country', valA: fight.fighterA.country, valB: fight.fighterB.country },
              { label: 'Height', valA: `${fight.fighterA.heightCm} cm`, valB: `${fight.fighterB.heightCm} cm` },
              { label: 'Reach', valA: `${fight.fighterA.reachCm} cm`, valB: `${fight.fighterB.reachCm} cm` },
              { label: 'KO Wins', valA: fight.fighterA.koWins, valB: fight.fighterB.koWins },
              { label: 'Sub Wins', valA: fight.fighterA.submissionWins, valB: fight.fighterB.submissionWins },
            ].map((stat, i) => (
              <div key={i} className="flex justify-between items-center border-b border-zinc-800 pb-4 last:border-0 last:pb-0">
                <div className="w-1/3 text-right font-bold text-zinc-300">{stat.valA}</div>
                <div className="w-1/3 text-center text-xs text-zinc-600 uppercase font-bold tracking-widest">{stat.label}</div>
                <div className="w-1/3 text-left font-bold text-zinc-300">{stat.valB}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FightDetail;