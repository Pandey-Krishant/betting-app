'use client';

import { useEffect, useState } from 'react';
import { useEventsStore } from '@/store/useEventsStore';
import { useBetSlipStore } from '@/store/useBetStore';
import { useLiveMatches } from '@/hooks/useApi';
import { Event, RunnerOdds } from '@/types/betting';
import Link from 'next/link';
import { Pin } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';

export default function Home() {
  const { events, lastPrices, setEvents } = useEventsStore();
  const setSelection = useBetSlipStore(state => state.setSelection);
  const [activeTab, setActiveTab] = useState('Cricket');
  const [mounted, setMounted] = useState(false);

  // Trigger Live Data Polling
  useLiveMatches();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const tabs = ['Cricket', 'Football', 'Tennis', 'Horse Racing', 'Greyhounds', 'Basketball', 'Kabaddi', 'Politics', 'Casino'];
  const filteredEvents = events.filter(e => e.sportName === activeTab);

  const formatMatched = (num: number) => {
    if (num >= 10000000) return `₹${(num / 10000000).toFixed(1)}Cr`;
    if (num >= 100000) return `₹${(num / 100000).toFixed(1)}L`;
    return `₹${num.toLocaleString()}`;
  };

  const formatSize = (num: number) => {
    if (num >= 1000) return `${(num / 1000).toFixed(1)}k`;
    return num.toString();
  };

  const handleToggleInPlay = (matchId: string) => {
    const updated = events.map(e => e._id === matchId ? { ...e, oddsData: { ...e.oddsData, inPlay: !e.oddsData.inPlay } } : e);
    (setEvents as any)(updated);
    toast.success('InPlay updated');
  };

  const handleToggleSuspend = (matchId: string) => {
    const updated = events.map(e => e._id === matchId ? { ...e, oddsData: { ...e.oddsData, status: e.oddsData.status === 'OPEN' ? 'SUSPENDED' : 'OPEN' } } : e);
    (setEvents as any)(updated);
    toast.success('Market suspended/opened');
  };

  const renderOddsCell = (event: Event, runner: RunnerOdds, type: 'back' | 'lay', index: number) => {
    const priceObj = type === 'back' ? runner.price.back[index] : runner.price.lay[index];
    const emptyBg = type === 'back' 
      ? (index === 0 ? 'bg-back-1/30' : 'bg-back-3') 
      : (index === 0 ? 'bg-lay-1/30' : 'bg-lay-3');
    
    if (!priceObj || !priceObj.price) return <div className={`w-14 h-10 ${emptyBg} border-x border-white`} />;

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
        className={`w-14 h-10 ${bgClass} flex flex-col items-center justify-center border-x border-white cursor-pointer relative overflow-hidden transition-all hover:opacity-80 shadow-sm`}
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
        <span className="text-[13px] font-bold text-black z-10 leading-none">{priceObj.price}</span>
        <span className="text-[9px] text-gray-500 z-10 font-bold opacity-70 tracking-tighter">{formatSize(priceObj.size)}</span>
      </div>
    );
  };

  return (
    <div className="flex flex-col min-h-screen pt-[72px] pb-[55px] sm:pb-0 bg-[#ededed]">
      {/* Sports Nav Bar */}
      <div className="sports-gradient h-[40px] w-full flex items-center fixed top-[72px] z-[998] px-2 overflow-x-auto no-scrollbar shadow-md">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`h-full px-4 text-[13px] font-bold transition-all uppercase whitespace-nowrap border-b-2 ${
              activeTab === tab ? 'border-black text-black' : 'border-transparent text-black opacity-60 hover:opacity-100'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      <div className="container px-2 sm:px-4 mt-[40px] py-4 flex gap-4">
        {/* Left Sidebar */}
        <aside className="hidden lg:block w-64 flex-shrink-0">
          <div className="bg-white border border-gray-200 rounded-sm overflow-hidden shadow-sm sticky top-[124px]">
            <div className="exchange-gradient px-3 py-2 text-white font-bold text-[12px] uppercase tracking-widest border-b border-white/10">
              All Sports
            </div>
            <div className="divide-y divide-gray-100">
               {[
                 { name: 'Cricket', icon: '🏏' },
                 { name: 'Football', icon: '⚽' },
                 { name: 'Tennis', icon: '🎾' },
                 { name: 'Horse Racing', icon: '🏇' },
                 { name: 'Greyhounds', icon: '🐕' },
                 { name: 'Basketball', icon: '🏀' },
                 { name: 'Kabaddi', icon: '🤼' }
               ].map((sport) => {
                 const sportCount = events.filter(e => e.sportName === sport.name).length;
                 return (
                   <div 
                     key={sport.name} 
                     onClick={() => setActiveTab(sport.name)} 
                     className={`flex justify-between items-center px-4 py-3.5 hover:bg-gray-50 cursor-pointer group transition-colors ${activeTab === sport.name ? 'bg-blue-50/50' : ''}`}
                   >
                      <div className="flex items-center gap-3">
                         <span className="text-xl">{sport.icon}</span>
                         <span className={`font-black text-[12px] uppercase tracking-tight ${activeTab === sport.name ? 'text-match-name' : 'text-[#223869]'}`}>
                            {sport.name}
                         </span>
                      </div>
                      <span className="bg-gray-100/80 text-gray-500 text-[10px] px-2 py-0.5 rounded-full font-black ml-2 tabular-nums">{sportCount}</span>
                   </div>
                 );
               })}
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 space-y-3">
          <div className="bg-white shadow-sm overflow-hidden border border-gray-200 rounded-sm">
             <div className="bg-gray-50 px-3 py-2 flex justify-between items-center border-b border-gray-100">
                <span className="text-black font-black text-[12px] uppercase tracking-widest italic">{activeTab} Games</span>
                <div className="flex gap-1 pr-1">
                   <div className="w-14 text-center text-[10px] font-black text-gray-400 uppercase tracking-widest italic">Back</div>
                   <div className="w-14 text-center text-[10px] font-black text-gray-400 uppercase tracking-widest italic">Lay</div>
                </div>
             </div>

             <div className="divide-y divide-gray-100">
                {filteredEvents.map((event) => (
                   <div key={event._id} className="flex flex-col sm:flex-row sm:items-center bg-white hover:bg-gray-50/50 transition-colors">
                      <Link href={`/match/${event._id}`} className="flex-1 p-3 cursor-pointer group">
                         <div className="flex items-center gap-2 mb-1">
                            <Pin className="w-3.5 h-3.5 text-gray-200 group-hover:text-match-name transition-colors" />
                            <span className="text-match-name font-black text-[14px] uppercase tracking-tight">{event.eventName}</span>
                            {(event.oddsData.inPlay || (event.sportName === 'Horse Racing' && event.oddsData.totalMatched > 0)) && (
                               <span className="text-[10px] font-black italic inplay-text uppercase flex items-center gap-1.5 px-2 py-0.5 bg-green-50 rounded-[2px] border border-green-100 ml-2">
                                  <span className="w-1.5 h-1.5 rounded-full bg-current animate-pulse" />
                                  Live Now
                               </span>
                            )}
                         </div>
                         <div className="flex items-center gap-2">
                            <span className="text-match-time font-bold text-[11px] opacity-60">
                              {new Date(event.eventTime).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' })}
                            </span>
                            <div className="flex gap-1 ml-1 scale-90 origin-left">
                               {event.isFancy && <span className="bg-[#0a92a5] text-white text-[9px] px-1 rounded-sm font-black flex items-center justify-center h-4">F</span>}
                               {event.isBookmakers && <span className="bg-[#faf8d8] text-black text-[9px] px-1 rounded-sm font-black border border-[#d6d0a7] flex items-center justify-center h-4 shadow-sm">BM</span>}
                               {event.isSportsbook && <span className="bg-[#f26d1c] text-white text-[9px] px-1 rounded-sm font-black flex items-center justify-center h-4 shadow-sm">S</span>}
                            </div>
                            <span className="text-[10px] text-gray-400 font-black ml-auto sm:ml-4 tracking-tighter italic">
                              MATCHED: {formatMatched(event.oddsData.totalMatched)}
                            </span>
                         </div>
                      </Link>

                      <div className="flex px-3 pb-3 sm:pb-0 sm:pr-4 gap-[2px]">
                         <div className="flex gap-[1px]">
                            {renderOddsCell(event, event.oddsData.runners[0], 'back', 0)}
                            {renderOddsCell(event, event.oddsData.runners[0], 'lay', 0)}
                         </div>
                         <div className="flex gap-[1px] ml-1">
                            {renderOddsCell(event, event.oddsData.runners[1] || event.oddsData.runners[0], 'back', 0)}
                            {renderOddsCell(event, event.oddsData.runners[1] || event.oddsData.runners[0], 'lay', 0)}
                         </div>
                      </div>
                   </div>
                ))}
                {filteredEvents.length === 0 && (
                  <div className="p-10 text-center text-gray-400 text-[11px] uppercase tracking-[0.2em] font-black italic">No records found</div>
                )}
             </div>
          </div>
        </main>

        {/* Right Sidebar */}
        <aside className="hidden xl:block w-72 flex-shrink-0">
          <div className="bg-white shadow-sm border border-gray-200 sticky top-[124px] rounded-sm overflow-hidden">
             <div className="exchange-gradient px-3 py-2 text-white font-bold text-[12px] uppercase tracking-widest border-b border-white/10">
                Your Selection
             </div>
             <div className="p-10 text-center text-gray-300 text-[11px] font-bold italic bg-white leading-relaxed">
                SELECT ODDS TO<br />PLACE A BET
             </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
