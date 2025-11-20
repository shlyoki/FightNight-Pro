import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, PlayCircle, Clock, MapPin, Calendar } from 'lucide-react';
import { dataService } from '../services/mockData';
import { FightWithFighters, Media } from '../types';

const Countdown = ({ targetDate }: { targetDate: string }) => {
  const [timeLeft, setTimeLeft] = useState<{d:number, h:number, m:number, s:number} | null>(null);

  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date().getTime();
      const target = new Date(targetDate).getTime();
      const diff = target - now;

      if (diff < 0) {
        setTimeLeft(null);
        clearInterval(interval);
        return;
      }

      setTimeLeft({
        d: Math.floor(diff / (1000 * 60 * 60 * 24)),
        h: Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
        m: Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60)),
        s: Math.floor((diff % (1000 * 60)) / 1000),
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [targetDate]);

  if (!timeLeft) return <div className="text-red-500 font-bold">EVENT LIVE or FINISHED</div>;

  return (
    <div className="flex space-x-4 mt-6">
      {Object.entries(timeLeft).map(([unit, value]) => (
        <div key={unit} className="flex flex-col items-center">
          <div className="text-3xl md:text-5xl font-black bg-zinc-900/80 backdrop-blur-md border border-zinc-700 rounded-lg w-16 h-16 md:w-24 md:h-24 flex items-center justify-center text-white shadow-lg">
            {value.toString().padStart(2, '0')}
          </div>
          <span className="text-xs md:text-sm uppercase mt-2 text-zinc-400 font-bold tracking-wider">{unit}</span>
        </div>
      ))}
    </div>
  );
};

const Home = () => {
  const [nextFight, setNextFight] = useState<FightWithFighters | null>(null);
  const [latestMedia, setLatestMedia] = useState<Media[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const fights = await dataService.getFightsWithFighters();
        // Find next upcoming fight
        const upcoming = fights
          .filter(f => new Date(f.date) > new Date())
          .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())[0];
        setNextFight(upcoming);

        const media = await dataService.getMedia();
        setLatestMedia(media.slice(0, 3));
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  if (loading) {
    return (
      <div>
        {/* Hero Skeleton */}
        <div className="relative w-full min-h-[85vh] flex items-center bg-zinc-900 overflow-hidden">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full py-12">
            <div className="flex flex-col md:flex-row items-center justify-between gap-12">
              <div className="flex-1 space-y-6 w-full">
                <div className="h-8 w-48 bg-zinc-800 rounded animate-pulse"></div>
                <div className="space-y-2">
                   <div className="h-16 w-full md:w-3/4 bg-zinc-800 rounded animate-pulse"></div>
                   <div className="h-16 w-1/2 md:w-2/3 bg-zinc-800 rounded animate-pulse"></div>
                </div>
                <div className="flex space-x-6">
                   <div className="h-6 w-32 bg-zinc-800 rounded animate-pulse"></div>
                   <div className="h-6 w-32 bg-zinc-800 rounded animate-pulse"></div>
                </div>
                <div className="flex gap-4 pt-4">
                   <div className="h-12 w-40 bg-zinc-800 rounded animate-pulse"></div>
                   <div className="h-12 w-40 bg-zinc-800 rounded animate-pulse"></div>
                </div>
              </div>
              <div className="flex-1 w-full flex justify-center">
                 <div className="w-full max-w-md h-[400px] bg-zinc-800 rounded-2xl animate-pulse opacity-50"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* Hero Section */}
      <div className="relative w-full min-h-[85vh] flex items-center bg-zinc-900 overflow-hidden">
        {/* Background Overlay */}
        <div className="absolute inset-0 z-0">
           <img 
            src="https://images.unsplash.com/photo-1599058945522-28d584b6f0ff?q=80&w=2069&auto=format&fit=crop" 
            className="w-full h-full object-cover opacity-30 grayscale"
            alt="Arena"
           />
           <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/50 to-transparent"></div>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full py-12">
          {nextFight ? (
            <div className="flex flex-col md:flex-row items-center justify-between">
              <div className="flex-1 text-center md:text-left space-y-6">
                <div className="inline-flex items-center px-3 py-1 rounded-full bg-red-600/20 border border-red-600/30 text-red-500 text-sm font-bold tracking-wider uppercase mb-2">
                  Next Main Event
                </div>
                <h1 className="text-5xl md:text-7xl font-black text-white leading-tight italic uppercase tracking-tighter">
                  {nextFight.fighterA.nickname && <span className="block text-2xl md:text-3xl text-red-600 mb-1 font-bold not-italic tracking-normal">{nextFight.fighterA.nickname} vs {nextFight.fighterB.nickname}</span>}
                  {nextFight.fighterA.name.split(' ').pop()} <span className="text-zinc-600">VS</span> {nextFight.fighterB.name.split(' ').pop()}
                </h1>
                <div className="flex items-center justify-center md:justify-start space-x-6 text-zinc-300">
                  <div className="flex items-center">
                    <Calendar className="w-5 h-5 mr-2 text-red-600" />
                    <span className="font-medium">{new Date(nextFight.date).toLocaleDateString(undefined, { weekday: 'long', month: 'long', day: 'numeric' })}</span>
                  </div>
                  <div className="flex items-center">
                    <MapPin className="w-5 h-5 mr-2 text-red-600" />
                    <span className="font-medium">{nextFight.location}</span>
                  </div>
                </div>
                
                <div className="flex justify-center md:justify-start">
                  <Countdown targetDate={nextFight.date} />
                </div>

                <div className="pt-8 flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
                  <Link to={`/fights/${nextFight.id}`} className="px-8 py-4 bg-red-600 hover:bg-red-700 text-white font-bold rounded-lg uppercase tracking-wider shadow-lg shadow-red-900/20 transition-all transform hover:scale-105">
                    View Fight Card
                  </Link>
                  <Link to="/fights" className="px-8 py-4 bg-zinc-800 hover:bg-zinc-700 text-white font-bold rounded-lg uppercase tracking-wider border border-zinc-700 transition-all">
                    All Events
                  </Link>
                </div>
              </div>

              {/* Versus Visual */}
              <div className="flex-1 mt-12 md:mt-0 flex justify-center items-end relative h-[400px] md:h-[500px] w-full max-w-2xl">
                 {/* Simulated Fighter Cutouts using placeholders */}
                 <img src={nextFight.fighterA.imageUrl} className="h-64 md:h-96 w-auto object-contain absolute left-0 bottom-0 z-10 drop-shadow-2xl mask-image-gradient" alt="Fighter A" />
                 <img src={nextFight.fighterB.imageUrl} className="h-64 md:h-96 w-auto object-contain absolute right-0 bottom-0 z-10 drop-shadow-2xl mask-image-gradient" alt="Fighter B" />
                 <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-transparent to-transparent z-20"></div>
              </div>
            </div>
          ) : (
             <div className="text-center">
               <h1 className="text-4xl font-bold">No Upcoming Events</h1>
             </div>
          )}
        </div>
      </div>

      {/* Media Section Preview */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-3xl font-black text-white uppercase tracking-tight">Latest Media</h2>
          <Link to="/media" className="text-red-500 hover:text-red-400 flex items-center font-semibold">
            View All <ArrowRight className="w-4 h-4 ml-1" />
          </Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {latestMedia.map((item) => (
            <div key={item.id} className="group relative bg-zinc-900 rounded-xl overflow-hidden border border-zinc-800 hover:border-red-600/50 transition-all">
              <div className="aspect-video w-full relative overflow-hidden">
                <img src={item.thumbnailUrl} alt={item.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center group-hover:bg-black/20 transition-colors">
                  {item.type === 'VIDEO' && <PlayCircle className="w-12 h-12 text-white opacity-80 group-hover:opacity-100 group-hover:scale-110 transition-all" />}
                </div>
              </div>
              <div className="p-4">
                <span className="text-xs text-red-500 font-bold uppercase tracking-wider">{item.type}</span>
                <h3 className="text-lg font-bold text-white mt-1 group-hover:text-red-500 transition-colors line-clamp-2">{item.title}</h3>
                <div className="flex items-center mt-4 text-zinc-500 text-xs">
                  <Clock className="w-3 h-3 mr-1" />
                  {new Date(item.createdAt).toLocaleDateString()}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Home;