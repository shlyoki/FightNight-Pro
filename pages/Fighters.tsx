
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { dataService } from '../services/mockData';
import { Fighter } from '../types';
import { Search } from 'lucide-react';

const Fighters = () => {
  const [fighters, setFighters] = useState<Fighter[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const load = async () => {
        const data = await dataService.getFighters();
        setFighters(data);
        setLoading(false);
    };
    load();
  }, []);

  const filteredFighters = fighters.filter(fighter => 
    fighter.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (fighter.nickname && fighter.nickname.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
        <h1 className="text-4xl font-black text-white uppercase tracking-tight">Roster</h1>
        
        {/* Search Bar */}
        <div className="relative w-full md:max-w-md">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-zinc-500" />
          </div>
          <input
            type="text"
            className="block w-full pl-10 pr-3 py-3 border border-zinc-800 rounded-lg leading-5 bg-zinc-900 text-zinc-300 placeholder-zinc-500 focus:outline-none focus:bg-zinc-950 focus:border-red-600 focus:ring-1 focus:ring-red-600 sm:text-sm transition-colors shadow-lg"
            placeholder="Search fighters by name or nickname..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {loading ? (
          // Skeleton Loader
          Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="bg-zinc-900 rounded-xl overflow-hidden border border-zinc-800 animate-pulse">
                <div className="aspect-square bg-zinc-800 w-full"></div>
                <div className="p-5 space-y-3">
                    <div className="flex justify-between">
                        <div className="h-4 w-20 bg-zinc-800 rounded"></div>
                        <div className="h-4 w-8 bg-zinc-800 rounded"></div>
                    </div>
                    <div className="h-6 w-3/4 bg-zinc-800 rounded"></div>
                    <div className="pt-4 mt-4 border-t border-zinc-800 flex justify-between">
                        <div className="h-4 w-16 bg-zinc-800 rounded"></div>
                        <div className="h-4 w-16 bg-zinc-800 rounded"></div>
                    </div>
                </div>
            </div>
          ))
        ) : filteredFighters.length > 0 ? (
          filteredFighters.map((fighter) => (
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
          ))
        ) : (
            <div className="col-span-full text-center py-20">
                <p className="text-zinc-500 text-lg font-medium">No fighters found matching "{searchTerm}"</p>
            </div>
        )}
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
