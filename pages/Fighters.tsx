import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { dataService } from '../services/mockData';
import { Fighter } from '../types';

const Fighters = () => {
  const [fighters, setFighters] = useState<Fighter[]>([]);

  useEffect(() => {
    dataService.getFighters().then(setFighters);
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-4xl font-black text-white uppercase tracking-tight mb-8">Roster</h1>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {fighters.map((fighter) => (
          <Link key={fighter.id} to={`/fighters/${fighter.id}`} className="group bg-zinc-900 rounded-xl overflow-hidden border border-zinc-800 hover:border-red-600 transition-all hover:-translate-y-1">
            <div className="aspect-square overflow-hidden bg-zinc-800">
              <img src={fighter.imageUrl} alt={fighter.name} className="w-full h-full object-cover opacity-90 group-hover:opacity-100 group-hover:scale-105 transition-all duration-500" />
            </div>
            <div className="p-5">
              <div className="flex justify-between items-start mb-2">
                 <p className="text-xs text-red-500 font-bold uppercase tracking-wider">{fighter.weightClass}</p>
                 <img src={`https://flagcdn.com/w20/${getCode(fighter.country)}.png`} alt={fighter.country} className="opacity-70" />
              </div>
              <h3 className="text-xl font-black text-white leading-tight uppercase">{fighter.name}</h3>
              {fighter.nickname && <p className="text-zinc-500 italic">"{fighter.nickname}"</p>}
              <div className="mt-4 pt-4 border-t border-zinc-800 flex justify-between items-center">
                <span className="text-zinc-400 text-sm font-mono">Record</span>
                <span className="text-white font-bold font-mono">{fighter.recordWins}-{fighter.recordLosses}-{fighter.recordDraws}</span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

// Helper for dummy flag url
function getCode(country: string) {
  const map: Record<string, string> = { 'USA': 'us', 'Brazil': 'br', 'Nigeria': 'ng' };
  return map[country] || 'us';
}

export default Fighters;
