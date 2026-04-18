'use client';

import { useEffect, useState } from 'react';
import { useEventsStore } from '@/store/useEventsStore';
import { Event, RunnerOdds } from '@/types/betting';
import { useBetSlipStore } from '@/store/useBetStore';
import Link from 'next/link';
import { Pin, ChevronRight, Activity, Search } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function SportsPage() {
  const { events, lastPrices } = useEventsStore();
  const setSelection = useBetSlipStore(state => state.setSelection);
  const [activeTab, setActiveTab] = useState('Cricket');
  const [searchQuery, setSearchQuery] = useState('');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const tabs = ['Cricket', 'Football', 'Tennis', 'Horse Racing', 'Casino'];
  
  const filteredEvents = events.filter(e => {
    const matchesTab = e.sportName === activeTab;
    const matchesSearch = e.eventName.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          e.tournamentName.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesTab && matchesSearch;
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
    if (!priceObj || !priceObj.price) return <div className="w-12 h-9 sm:w-14 sm:h-10 bg-gray-50 border-x border-white" />;

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
      {/* Search & Sports Nav */}
      <div className="bg-white border-b border-gray-200 sticky top-[72px] z-[998]">
         <div className="p-2 sm:p-3 max-w-7xl mx-auto flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
               <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
               <input 
                 type="text" 
                 placeholder="Search team or tournament..." 
                 value={searchQuery}
                 onChange={(e) => setSearchQuery(e.target.value)}
                 className="w-full bg-gray-50 border border-gray-200 outline-none focus:border-match-name px-9 py-2 rounded-sm text-sm font-bold transition-all"
               />
            </div>
            <div className="flex gap-1 overflow-x-auto no-scrollbar pb-1 sm:pb-0">
               {tabs.map(tab => (
                  <button 
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`px-4 py-2 text-[11px] font-black uppercase whitespace-nowrap rounded-sm transition-all border ${activeTab === tab ? 'bg-exchange-from text-white border-exchange-from shadow-md' : 'bg-white text-gray-400 border-gray-100 hover:border-gray-300'}`}
                  >
                    {tab}
                  </button>
               ))}
            </div>
         </div>
      </div>

      <div className="container px-2 sm:px-4 py-4 max-w-7xl mx-auto flex flex-col items-center">
        <div className="w-full max-w-4xl space-y-3">
           <div className="bg-white shadow-sm overflow-hidden border border-gray-200 rounded-sm">
             <div className="bg-gray-50 px-3 py-2 flex justify-between items-center border-b border-gray-100">
                <span className="text-black font-black text-[12px] uppercase tracking-widest italic">{activeTab} Event List</span>
                <div className="hidden sm:flex gap-1 pr-1">
                   <div className="w-14 text-center text-[10px] font-black text-gray-400 uppercase tracking-widest italic px-2">Back</div>
                   <div className="w-14 text-center text-[10px] font-black text-gray-400 uppercase tracking-widest italic px-2">Lay</div>
                </div>
             </div>

             <div className="divide-y divide-gray-100">
                {filteredEvents.map((event) => (
                   <div key={event._id} className="flex flex-col sm:flex-row sm:items-center bg-white hover:bg-gray-50/50 transition-colors">
                      <Link href={`/match/${event._id}`} className="flex-1 p-3 cursor-pointer group">
                         <div className="flex items-center gap-2 mb-1">
                            <Pin className="w-3.5 h-3.5 text-gray-200 group-hover:text-match-name transition-colors" />
                            <span className="text-match-name font-black text-[14px] sm:text-[15px] uppercase tracking-tight leading-none">{event.eventName}</span>
                            {event.oddsData.inPlay && (
                               <span className="text-[10px] font-black italic inplay-text uppercase flex items-center gap-1 px-2 py-0.5 bg-green-50 rounded-[2px] border border-green-100 ml-1">
                                 <span className="w-1.5 h-1.5 rounded-full bg-current animate-pulse" />
                                 Live
                               </span>
                            )}
                         </div>
                         <div className="flex items-center gap-2">
                            <span className="text-match-time font-bold text-[11px] opacity-70">
                               {new Date(event.eventTime).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' })}
                            </span>
                            <span className="hidden sm:inline text-gray-300 text-[10px] font-black uppercase ml-1 italic">{event.tournamentName}</span>
                            <div className="flex gap-1 ml-auto sm:ml-4">
                               {event.isFancy && <span className="bg-[#0a92a5] text-white text-[9px] px-1 rounded-sm font-black flex items-center justify-center h-4">F</span>}
                               {event.isBookmakers && <span className="bg-[#faf8d8] text-black text-[9px] px-1 rounded-sm font-black border border-[#d6d0a7] flex items-center justify-center h-4 shadow-sm">BM</span>}
                            </div>
                            <span className="text-[10px] text-gray-400 font-black tracking-tighter italic ml-2">
                               {formatMatched(event.oddsData.totalMatched)}
                            </span>
                         </div>
                      </Link>

                      <div className="flex items-center justify-end px-3 pb-3 sm:pb-0 sm:pr-4 gap-[2px]">
                         {renderOddsCell(event, event.oddsData.runners[0], 'back', 0)}
                         {renderOddsCell(event, event.oddsData.runners[0], 'lay', 0)}
                         <Link href={`/match/${event._id}`} className="ml-2 p-1.5 bg-gray-50 hover:bg-gray-100 rounded-sm text-gray-400 hover:text-match-name transition-colors">
                            <ChevronRight className="w-4 h-4" strokeWidth={3} />
                         </Link>
                      </div>
                   </div>
                ))}
                {filteredEvents.length === 0 && (
                   <div className="p-16 text-center text-gray-300">
                      <Search className="w-12 h-12 mx-auto mb-4 opacity-20" />
                      <p className="text-[11px] uppercase tracking-[0.3em] font-black italic">No records found matching your query</p>
                   </div>
                )}
             </div>
          </div>
        </div>
      </div>
    </div>
  );
}
