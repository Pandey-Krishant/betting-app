'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { Play, Star, Flame, Trophy, LayoutGrid, MonitorPlay, Ghost } from 'lucide-react';
import { motion } from 'framer-motion';

export default function Casino() {
  const [activeTab, setActiveTab] = useState('Live Casino');
  const [mounted, setMounted] = useState(false);
  const router = useRouter();
  
  useEffect(() => setMounted(true), []);

  const tabs = [
    { name: 'Live Casino', icon: MonitorPlay },
    { name: 'Slot Games', icon: Flame },
    { name: 'Table Games', icon: Trophy },
    { name: 'Virtual Sports', icon: Ghost }
  ];

  const games = [
    { name: 'Live Casino Lobby', img: 'https://images.unsplash.com/photo-1596464716127-f2a82984de30?w=800&q=80', provider: 'Ludo Exchange', isFeatured: true, href: '/casino/live' },
    { name: 'Teen Patti Live', img: 'https://images.unsplash.com/photo-1606167668584-78701c57f13d?w=400&q=80', provider: 'Evolution' },
    { name: 'Andar Bahar', img: 'https://images.unsplash.com/photo-1596464716127-f2a82984de30?w=400&q=80', provider: 'Ezugi' },
    { name: 'Lightning Roulette', img: 'https://images.unsplash.com/photo-1605787020600-b9bdb5df1507?w=400&q=80', provider: 'Evolution' },
    { name: 'Dragon Tiger', img: 'https://images.unsplash.com/photo-1622323864132-498c0dcbc5a1?w=400&q=80', provider: 'SA Gaming' },
    { name: 'Baccarat Pro', img: 'https://images.unsplash.com/photo-1606167668584-78701c57f13d?w=400&q=80', provider: 'Evolution' },
    { name: '32 Cards', img: 'https://images.unsplash.com/photo-1596464716127-f2a82984de30?w=400&q=80', provider: 'Ezugi' },
    { name: 'Crazy Time', img: 'https://images.unsplash.com/photo-1605787020600-b9bdb5df1507?w=400&q=80', provider: 'Evolution' },
    { name: 'Mega Wheel', img: 'https://images.unsplash.com/photo-1622323864132-498c0dcbc5a1?w=400&q=80', provider: 'Pragmatic' },
    { name: 'Poker Stars', img: 'https://images.unsplash.com/photo-1606167668584-78701c57f13d?w=400&q=80', provider: 'Evolution' },
    { name: 'Roulette 24/7', img: 'https://images.unsplash.com/photo-1596464716127-f2a82984de30?w=400&q=80', provider: 'Ezugi' },
    { name: 'Deal or No Deal', img: 'https://images.unsplash.com/photo-1605787020600-b9bdb5df1507?w=400&q=80', provider: 'Evolution' },
    { name: 'Speed Baccarat', img: 'https://images.unsplash.com/photo-1622323864132-498c0dcbc5a1?w=400&q=80', provider: 'SA Gaming' },
  ];

  if (!mounted) return null;

  return (
    <div className="flex flex-col min-h-screen pt-[72px] pb-[55px] sm:pb-0 bg-[#0d0d0d]">
       {/* Casino Sub-Header */}
       <div className="exchange-gradient px-6 py-10 text-white relative overflow-hidden">
          <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]" />
          <div className="max-w-7xl mx-auto relative z-10 text-center sm:text-left">
             <div className="flex items-center justify-center sm:justify-start gap-3 mb-2">
                <Star className="w-8 h-8 text-yellow-500 fill-current" />
                <h1 className="font-black text-3xl sm:text-5xl uppercase italic tracking-tighter">Live Casino</h1>
             </div>
             <p className="text-gray-300 font-bold uppercase text-[10px] sm:text-xs tracking-[0.3em]">Experience the thrill of a real casino from home</p>
          </div>
       </div>

       {/* Casino Filter Tabs */}
       <div className="bg-black/95 backdrop-blur-md sticky top-[72px] z-[90] border-b border-white/5">
          <div className="max-w-7xl mx-auto flex overflow-x-auto no-scrollbar">
             {tabs.map(tab => (
                <button
                  key={tab.name}
                  onClick={() => setActiveTab(tab.name)}
                  className={`flex-1 min-w-[140px] py-4 text-[11px] font-black uppercase transition-all flex items-center justify-center gap-2 border-b-2 ${activeTab === tab.name ? 'border-orange-500 text-orange-500' : 'border-transparent text-gray-500 hover:text-white'}`}
                >
                   <tab.icon className="w-4 h-4" />
                   {tab.name}
                </button>
             ))}
          </div>
       </div>

       {/* Game Grid */}
       <div className="container max-w-7xl mx-auto px-4 py-8">
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-3 sm:gap-5 pb-10">
             {games.map((game, i) => (
                <motion.div 
                   key={i}
                   initial={{ opacity: 0, y: 20 }}
                   animate={{ opacity: 1, y: 0 }}
                   transition={{ delay: i * 0.05 }}
                   onClick={() => {
                      if (game.href) router.push(game.href);
                      else toast.success(`Launching ${game.name}...`);
                   }}
                   className={`group relative bg-[#1a1a1a] rounded-sm overflow-hidden border border-white/5 cursor-pointer shadow-2xl hover:border-orange-500/50 transition-all hover:-translate-y-1 ${game.isFeatured ? 'col-span-2 sm:col-span-2' : ''}`}
                >
                   <div className={`${game.isFeatured ? 'aspect-[2/1]' : 'aspect-[4/5]'} relative overflow-hidden`}>
                      <img src={game.img} alt={game.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 opacity-60 group-hover:opacity-100" />
                      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent opacity-60 group-hover:opacity-20 transition-all" />
                      
                      <div className="absolute top-2 right-2 bg-red-600 text-white text-[9px] font-black px-1.5 py-0.5 rounded-sm animate-pulse shadow-lg">LIVE</div>
                      
                      <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all">
                        <div className="w-12 h-12 bg-orange-500 rounded-full flex items-center justify-center shadow-[0_0_20px_rgba(253,143,59,0.5)]">
                           <Play className="w-6 h-6 text-black fill-current ml-1" />
                        </div>
                      </div>
                   </div>

                   <div className="p-3 bg-[#111111] group-hover:bg-black transition-colors">
                      <p className="text-[10px] text-gray-500 font-bold uppercase truncate opacity-60">{game.provider}</p>
                      <h3 className="text-white font-black text-[12px] sm:text-[14px] uppercase truncate tracking-tight">{game.name}</h3>
                   </div>
                </motion.div>
             ))}
          </div>
          
          <div className="text-center py-10 border-t border-white/5">
            <p className="text-gray-500 text-[10px] font-black uppercase tracking-[0.5em] mb-4">Official Partners</p>
            <div className="flex flex-wrap justify-center gap-8 opacity-20 filter grayscale invert">
               <span className="text-xl font-black italic">EVOLUTION</span>
               <span className="text-xl font-black italic">EZUGI</span>
               <span className="text-xl font-black italic">PRAGMATIC</span>
               <span className="text-xl font-black italic">SA GAMING</span>
            </div>
          </div>
       </div>
    </div>
  );
}
