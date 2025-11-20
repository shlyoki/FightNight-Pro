import React, { useEffect, useState } from 'react';
import { dataService } from '../services/mockData';
import { Media } from '../types';
import { PlayCircle, Image as ImageIcon } from 'lucide-react';

const MediaPage = () => {
  const [media, setMedia] = useState<Media[]>([]);

  useEffect(() => {
    dataService.getMedia().then(setMedia);
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <h1 className="text-4xl font-black text-white uppercase tracking-tight mb-8">Media Gallery</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {media.map((item) => (
          <div key={item.id} className="bg-zinc-900 rounded-xl overflow-hidden border border-zinc-800 group cursor-pointer">
             <div className="aspect-video relative">
               <img src={item.thumbnailUrl} alt={item.title} className="w-full h-full object-cover group-hover:opacity-80 transition-opacity" />
               <div className="absolute top-2 right-2 bg-black/60 backdrop-blur p-1 rounded text-white">
                 {item.type === 'VIDEO' ? <PlayCircle className="w-4 h-4" /> : <ImageIcon className="w-4 h-4" />}
               </div>
             </div>
             <div className="p-4">
               <h3 className="font-bold text-white line-clamp-2 group-hover:text-red-500 transition-colors">{item.title}</h3>
               <p className="text-xs text-zinc-500 mt-2">{new Date(item.createdAt).toLocaleDateString()}</p>
             </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MediaPage;
