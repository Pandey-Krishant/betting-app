'use client';

import { useEffect, useState } from 'react';
import { useEventsStore, Event, RunnerOdds } from '@/store/useEventsStore';
import { useBetSlipStore } from '@/store/useBetStore';
import { useLiveMatches } from '@/hooks/useApi';
import Link from 'next/link';
import { Pin, ChevronRight, Activity, Play } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function InPlayPage() {
  const { events, lastPrices } = useEventsStore();
  const setSelection = useBetSlipStore(state => state.setSelection);
  const [activeSport, setActiveSport] = useState('Cricket');
  const [mounted, setMounted] = useState(false);

  useLiveMatches();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const sports = [
    { name: 'Cricket', icon: '🏏' },
    { name: 'Football', icon: '⚽' },
    { name: 'Tennis', icon: '🎾' },
    { name: 'Horse Racing', icon: '🏇' }
  ];

  const inPlayMatches = events.filter(e => {
    if (activeSport === 'Horse Racing') {
      // Show Horse Racing if it's strictly inPlay OR has active matched volume
      return e.sportName === 'Horse Racing' && (e.oddsData.inPlay || e.oddsData.totalMatched > 0);
    }
    return e.oddsData.inPlay && e.sportName === activeSport;
  });

  const formatMatched = (num: number) => {
    if (num >= 10000000) return `₹${(num / 10000000).toFixed(1)}Cr`;
    if (num >= 100000) return `₹${(num / 100000).toFixed(1)}L`;
    return `₹${num.toLocaleString()}`;
  };

  const formatSize = (num: number) => {
    if (num >= 1000) return `${(num / 1000).toFixed(1)}k`;
    return num.toString();
  };

  const renderOddsCell = (event: Event, runner: RunnerOdds, type: 'back' | 'lay', index: number) => {
    const priceObj = type === 'back' ? runner.price.back[index] : runner.price.lay[index];
    const emptyBg = type === 'back' ? 'bg-back-3' : 'bg-lay-3';
    if (!priceObj || !priceObj.price) return <div className={`w-12 h-9 sm:w-14 sm:h-10 ${emptyBg} border-x border-white`} />;

    const rid = `${event._id}_${runner.selectionId}`;
    const lastPrice = lastPrices[rid];
    const isUp = priceObj.price > lastPrice;
    const isDown = priceObj.price < lastPrice;

    const bgClass = type === 'back' 
      ? (index === 0 ? 'bg-back-1' : index === 1 ? 'bg-back-2' : 'bg-back-3')
      : (index === 0 ? 'bg-lay-1' : index === 1 ? 'bg-lay-2' : 'bg-lay-3');

    return (
      <div 
        onClick={() => setSelection({
          matchId: event._id,
          eventName: event.eventName,
          marketId: event.marketId,
          marketName: event.marketName,
          selectionId: runner.selectionId,
          selectionName: event.runnersData[runner.selectionId.toString()],
          type,
          price: priceObj.price
        })}
        className={`w-12 h-9 sm:w-14 sm:h-10 ${bgClass} flex flex-col items-center justify-center border-x border-white cursor-pointer relative overflow-hidden transition-all hover:opacity-80 active:scale-95`}
      >
        <AnimatePresence>
          {(isUp || isDown) && (
            <motion.div 
              initial={{ opacity: 0.5 }} animate={{ opacity: 0 }} exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className={`absolute inset-0 ${isUp ? 'bg-green-500' : 'bg-red-500'}`}
            />
          )}
        </AnimatePresence>
        <span className="text-[12px] sm:text-[13px] font-black text-black z-10">{priceObj.price}</span>
        <span className="text-[8px] sm:text-[9px] text-gray-500 z-10 font-bold opacity-70 italic tracking-tighter">{formatSize(priceObj.size)}</span>
      </div>
    );
  };

  return (
    <div className="flex flex-col min-h-screen pt-[72px] pb-[55px] sm:pb-0 bg-[#ededed]">
      {/* In-Play Header */}
      <div className="exchange-gradient px-4 py-4 text-white sticky top-[72px] z-[998] shadow-md">
         <div className="max-w-4xl mx-auto flex items-center justify-between">
            <h1 className="font-extrabold text-[18px] sm:text-[22px] uppercase tracking-wider flex items-center gap-3">
               <Activity className="w-6 h-6 animate-pulse" /> Live In-Play
            </h1>
            <span className="bg-white/10 px-3 py-1 rounded-[2px] text-[10px] font-black uppercase tracking-widest border border-white/20">
               {inPlayMatches.length} Matches
            </span>
         </div>
      </div>

      {/* Sports Filter */}
      <div className="bg-white border-b border-gray-200 sticky top-[138px] sm:top-[144px] z-[997] shadow-sm">
         <div className="max-w-4xl mx-auto flex overflow-x-auto no-scrollbar">
            {sports.map(sport => {
               const liveCount = events.filter(e => e.sportName === sport.name && e.oddsData.inPlay).length;
               return (
                 <button
                   key={sport.name}
                   onClick={() => setActiveSport(sport.name)}
                   className={`flex-1 min-w-[100px] py-3.5 text-[11px] font-black uppercase transition-all flex flex-col items-center gap-1.5 border-b-4 relative ${activeSport === sport.name ? 'border-[#fd8f3b] text-black bg-gray-50/50' : 'border-transparent text-gray-400 hover:text-gray-600'}`}
                 >
                    <span className="text-xl sm:text-2xl filter saturate-[0.8]">{sport.icon}</span>
                    <span className="flex items-center gap-1.5">
                       {sport.name}
                       {liveCount > 0 && <span className="bg-[#fd8f3b] text-white text-[9px] px-1.5 rounded-full h-3.5 flex items-center justify-center min-w-[14px]">{liveCount}</span>}
                    </span>
                 </button>
               );
            })}
         </div>
      </div>

      <div className="container max-w-4xl px-2 sm:px-4 py-6 space-y-4 mx-auto">
         <div className="bg-white shadow-sm overflow-hidden border border-gray-200 rounded-sm">
            <div className="divide-y divide-gray-100">
               {inPlayMatches.length === 0 ? (
                  <div className="p-20 text-center text-gray-300 flex flex-col items-center">
                     <Play className="w-12 h-12 mb-4 opacity-10 rotate-90" />
                     <p className="text-[11px] uppercase tracking-[0.3em] font-black italic">No matches currently in-play</p>
                  </div>
               ) : inPlayMatches.map((event) => (
                  <div key={event._id} className="flex flex-col sm:flex-row sm:items-center bg-white hover:bg-gray-50/50 transition-colors">
                     <Link href={`/match/${event._id}`} className="flex-1 p-3.5 cursor-pointer group">
                        <div className="flex items-center gap-2 mb-1.5">
                           <Pin className="w-3.5 h-3.5 text-gray-200 group-hover:text-match-name transition-colors" />
                           <span className="text-match-name font-black text-[15px] uppercase tracking-tight leading-none truncate">{event.eventName}</span>
                           <span className="text-[10px] font-black italic inplay-text uppercase flex items-center gap-1 px-2 py-0.5 bg-green-50 rounded-[2px] border border-green-100 ml-1">
                              <span className="w-1.5 h-1.5 rounded-full bg-current animate-pulse" />
                              {(event.oddsData.inPlay || (event.sportName === 'Horse Racing' && event.oddsData.totalMatched > 0)) ? 'Live Now' : 'Active'}
                           </span>
                        </div>
                        <div className="flex items-center gap-3">
                           <span className="text-[10px] text-gray-400 font-bold uppercase tracking-tight opacity-70 italic">{event.tournamentName}</span>
                           <div className="flex gap-1 ml-auto sm:ml-0 scale-90 origin-left">
                              {event.isFancy && <span className="bg-[#0a92a5] text-white text-[9px] px-1 rounded-sm font-black flex items-center justify-center h-4">F</span>}
                              {event.isBookmakers && <span className="bg-[#faf8d8] text-black text-[9px] px-1 rounded-sm font-black border border-[#d6d0a7] flex items-center justify-center h-4 shadow-sm">BM</span>}
                           </div>
                        </div>
                     </Link>

                     <div className="flex items-center justify-end px-3 pb-3 sm:pb-0 sm:pr-4 gap-[2px]">
                        <div className="flex flex-col items-end mr-3">
                           <span className="text-[9px] text-gray-400 font-black uppercase tracking-tighter italic opacity-60">Total Matched</span>
                           <span className="text-[10px] text-black font-black">{formatMatched(event.oddsData.totalMatched)}</span>
                        </div>
                        <div className="flex gap-[1px]">
                           {renderOddsCell(event, event.oddsData.runners[0], 'back', 0)}
                           {renderOddsCell(event, event.oddsData.runners[0], 'lay', 0)}
                        </div>
                        <div className="flex gap-[1px] ml-1">
                           {renderOddsCell(event, event.oddsData.runners[1] || event.oddsData.runners[0], 'back', 0)}
                           {renderOddsCell(event, event.oddsData.runners[1] || event.oddsData.runners[0], 'lay', 0)}
                        </div>
                        <Link href={`/match/${event._id}`} className="ml-2 p-1.5 bg-gray-50 hover:bg-gray-100 rounded-sm text-gray-400 hover:text-match-name transition-colors">
                           <ChevronRight className="w-4 h-4" strokeWidth={3} />
                        </Link>
                     </div>
                  </div>
               ))}
            </div>
         </div>
      </div>
    </div>
  );
}
