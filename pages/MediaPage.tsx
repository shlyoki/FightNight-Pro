import React, { useEffect, useState } from 'react';
import { dataService } from '../services/mockData';
import { Media } from '../types';
import { PlayCircle, Image as ImageIcon, X, Play, Maximize2, Share2 } from 'lucide-react';

const MediaPage = () => {
  const [media, setMedia] = useState<Media[]>([]);
  const [selectedMedia, setSelectedMedia] = useState<Media | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
        const data = await dataService.getMedia();
        setMedia(data);
        setLoading(false);
    };
    load();
  }, []);

  // Handle escape key to close modal
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setSelectedMedia(null);
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <h1 className="text-4xl font-black text-white uppercase tracking-tight mb-8">Media Gallery</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {loading ? (
            // Skeleton Loader
            Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="bg-zinc-900 rounded-xl overflow-hidden border border-zinc-800 animate-pulse">
                    <div className="aspect-video bg-zinc-800 w-full"></div>
                    <div className="p-5 space-y-3">
                        <div className="h-6 w-3/4 bg-zinc-800 rounded"></div>
                        <div className="h-4 w-1/2 bg-zinc-800 rounded"></div>
                    </div>
                </div>
            ))
        ) : (
            media.map((item) => (
            <div 
                key={item.id} 
                onClick={() => setSelectedMedia(item)}
                className="bg-zinc-900 rounded-xl overflow-hidden border border-zinc-800 group cursor-pointer hover:border-red-600 transition-all hover:-translate-y-1 shadow-lg hover:shadow-red-900/10"
            >
                <div className="aspect-video relative overflow-hidden">
                <img 
                    src={item.thumbnailUrl} 
                    alt={item.title} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" 
                />
                {/* Overlay Icons */}
                <div className="absolute top-2 right-2 bg-black/60 backdrop-blur-sm p-1.5 rounded-lg text-white border border-white/10">
                    {item.type === 'VIDEO' ? <PlayCircle className="w-4 h-4" /> : <ImageIcon className="w-4 h-4" />}
                </div>
                
                {/* Hover Overlay */}
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-[2px]">
                    <div className="bg-red-600 p-3 rounded-full transform scale-0 group-hover:scale-100 transition-transform duration-300">
                    <Maximize2 className="w-6 h-6 text-white" />
                    </div>
                </div>
                </div>
                
                <div className="p-5">
                <h3 className="font-bold text-white leading-snug line-clamp-2 group-hover:text-red-500 transition-colors mb-2">{item.title}</h3>
                <div className="flex items-center justify-between mt-4 border-t border-zinc-800 pt-3">
                    <span className="text-xs text-zinc-500 font-mono">{new Date(item.createdAt).toLocaleDateString()}</span>
                    <span className="text-[10px] uppercase font-bold tracking-wider text-zinc-600 bg-zinc-950 px-2 py-1 rounded border border-zinc-800">
                        {item.type}
                    </span>
                </div>
                </div>
            </div>
            ))
        )}
      </div>

      {/* Media Modal */}
      {selectedMedia && (
        <div 
          className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-8 bg-black/95 backdrop-blur-sm animate-fade-in"
          onClick={() => setSelectedMedia(null)}
        >
          <div 
            className="relative w-full max-w-6xl bg-zinc-950 rounded-2xl overflow-hidden shadow-2xl border border-zinc-800 flex flex-col max-h-[90vh]"
            onClick={e => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 md:p-6 border-b border-zinc-800 bg-zinc-900/50">
              <div className="pr-12">
                <h3 className="font-black text-white text-xl md:text-2xl leading-tight line-clamp-1">{selectedMedia.title}</h3>
                <p className="text-zinc-500 text-xs md:text-sm mt-1 font-mono">Added on {new Date(selectedMedia.createdAt).toLocaleDateString(undefined, { dateStyle: 'long' })}</p>
              </div>
              
              <div className="flex items-center gap-2 absolute right-4 top-4">
                <button className="p-2 hover:bg-zinc-800 rounded-full transition-colors text-zinc-400 hover:text-white hidden md:block">
                    <Share2 className="w-5 h-5" />
                </button>
                <button 
                    onClick={() => setSelectedMedia(null)}
                    className="p-2 bg-zinc-800 hover:bg-red-600 rounded-full transition-colors text-white"
                >
                    <X className="w-6 h-6" />
                </button>
              </div>
            </div>

            {/* Content */}
            <div className="flex-1 bg-black flex items-center justify-center overflow-hidden relative min-h-[300px]">
              {selectedMedia.type === 'PHOTO' ? (
                <img 
                  src={selectedMedia.mediaUrl || selectedMedia.thumbnailUrl} 
                  alt={selectedMedia.title} 
                  className="w-full h-full object-contain max-h-[70vh]" 
                />
              ) : (
                <div className="relative w-full h-full flex items-center justify-center group bg-zinc-900 aspect-video max-h-[70vh]">
                   {/* Simulated Video Player */}
                   <img 
                    src={selectedMedia.thumbnailUrl} 
                    alt="Video Thumbnail" 
                    className="w-full h-full object-cover opacity-40 blur-sm scale-110" 
                   />
                   <img 
                    src={selectedMedia.thumbnailUrl} 
                    alt="Video Thumbnail" 
                    className="absolute inset-0 w-full h-full object-contain shadow-2xl" 
                   />
                   
                   {/* Play Button Overlay */}
                   <div className="absolute inset-0 flex items-center justify-center bg-black/20 group-hover:bg-black/40 transition-colors cursor-pointer">
                      <div className="w-20 h-20 md:w-24 md:h-24 bg-red-600 rounded-full flex items-center justify-center pl-2 hover:scale-110 transition-transform shadow-[0_0_40px_rgba(220,38,38,0.5)] border-4 border-white/10">
                        <Play className="w-8 h-8 md:w-10 md:h-10 text-white fill-current" />
                      </div>
                   </div>
                   
                   {/* Fake Controls */}
                   <div className="absolute bottom-0 left-0 w-full bg-gradient-to-t from-black/90 to-transparent p-6 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <div className="w-full h-1.5 bg-zinc-700 rounded-full mb-4 overflow-hidden">
                          <div className="w-1/3 h-full bg-red-600 rounded-full"></div>
                      </div>
                      <div className="flex justify-between text-xs font-bold text-zinc-400">
                          <span>03:24 / 10:05</span>
                          <span>1080p</span>
                      </div>
                   </div>
                </div>
              )}
            </div>
            
            {/* Footer/Context */}
            {selectedMedia.type === 'VIDEO' && (
                <div className="p-4 bg-zinc-950 border-t border-zinc-800 text-center">
                    <p className="text-zinc-500 text-sm italic">
                        Video playback is simulated in this demo environment.
                    </p>
                </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default MediaPage;