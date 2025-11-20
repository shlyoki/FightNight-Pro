import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { dataService } from '../services/mockData';
import { FightWithFighters, FightStatus } from '../types';
import { Calendar, MapPin, Radio } from 'lucide-react';

const Fights = () => {
  const [fights, setFights] = useState<FightWithFighters[]>([]);
  const [filter, setFilter] = useState<FightStatus | 'ALL'>('ALL');

  useEffect(() => {
    const load = async () => {
      const data = await dataService.getFightsWithFighters();
      setFights(data.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()));
    };
    load();
  }, []);

  const filteredFights = fights.filter(f => filter === 'ALL' || f.status === filter);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
        <h1 className="text-4xl font-black text-white uppercase tracking-tight">Fight Cards</h1>
        <div className="flex bg-zinc-900 p-1 rounded-lg border border-zinc-800 overflow-x-auto">
          {(['ALL', 'UPCOMING', 'IN_PROGRESS', 'FINISHED'] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-2 rounded-md text-sm font-bold transition-colors whitespace-nowrap ${
                filter === f ? 'bg-red-600 text-white' : 'text-zinc-400 hover:text-white'
              }`}
            >
              {f === 'IN_PROGRESS' ? 'LIVE' : f}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-4">
        {filteredFights.map((fight) => (
          <Link
            key={fight.id}
            to={`/fights/${fight.id}`}
            className={`block bg-zinc-900 border rounded-xl overflow-hidden transition-all group ${
                fight.status === 'IN_PROGRESS' ? 'border-red-500 shadow-lg shadow-red-900/20' : 'border-zinc-800 hover:border-red-600'
            }`}
          >
            <div className="p-6 flex flex-col md:flex-row items-center">
              
              {/* Date Box */}
              <div className="flex-shrink-0 w-full md:w-32 text-center mb-4 md:mb-0 md:mr-8 bg-zinc-950 rounded-lg py-4 border border-zinc-800 relative overflow-hidden">
                {fight.status === 'IN_PROGRESS' && (
                    <div className="absolute top-0 left-0 w-full h-1 bg-red-600 animate-pulse"></div>
                )}
                <span className={`block text-2xl font-black ${fight.status === 'IN_PROGRESS' ? 'text-white' : 'text-red-500'}`}>
                  {new Date(fight.date).getDate()}
                </span>
                <span className="block text-sm font-bold text-zinc-400 uppercase">
                  {new Date(fight.date).toLocaleString('default', { month: 'short' })}
                </span>
                {fight.status === 'IN_PROGRESS' && (
                    <span className="inline-flex items-center text-xs font-bold text-red-500 mt-1 animate-pulse">
                        <Radio className="w-3 h-3 mr-1" /> LIVE
                    </span>
                )}
              </div>

              {/* Event Info */}
              <div className="flex-grow text-center md:text-left">
                <h3 className="text-2xl font-black text-white group-hover:text-red-500 transition-colors">
                  {fight.eventName}
                </h3>
                <div className="flex flex-col md:flex-row md:items-center text-zinc-400 mt-2 space-y-1 md:space-y-0 md:space-x-4">
                  <div className="flex items-center justify-center md:justify-start">
                    <MapPin className="w-4 h-4 mr-1" />
                    {fight.location}
                  </div>
                  <div className="flex items-center justify-center md:justify-start">
                    <Calendar className="w-4 h-4 mr-1" />
                    {new Date(fight.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </div>
                  <span className="px-2 py-0.5 rounded bg-zinc-800 text-xs font-bold text-zinc-300 border border-zinc-700">
                    {fight.weightClass}
                  </span>
                </div>
              </div>

              {/* Fighters Mini Preview */}
              <div className="mt-6 md:mt-0 flex items-center space-x-4 md:ml-8 min-w-[200px] justify-center">
                 <div className="text-right">
                    <p className="font-bold text-white text-sm md:text-base">{fight.fighterA.name}</p>
                    <p className="text-xs text-zinc-500">
                      {fight.status === 'FINISHED' && fight.resultWinnerId === fight.fighterAId ? 'WINNER' : ''}
                    </p>
                 </div>
                 <span className="text-red-600 font-black italic text-xl">VS</span>
                 <div className="text-left">
                    <p className="font-bold text-white text-sm md:text-base">{fight.fighterB.name}</p>
                     <p className="text-xs text-zinc-500">
                      {fight.status === 'FINISHED' && fight.resultWinnerId === fight.fighterBId ? 'WINNER' : ''}
                    </p>
                 </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default Fights;