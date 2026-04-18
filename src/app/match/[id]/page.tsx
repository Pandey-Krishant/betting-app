'use client';

import { useEventsStore } from '@/store/useEventsStore';
import { Event, RunnerOdds } from '@/types/betting';
import { useBetSlipStore, useBetStore } from '@/store/useBetStore';
import { useParams } from 'next/navigation';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Lock, Tv, BarChart2, Info, Zap } from 'lucide-react';
import BetSlip from '@/components/BetSlip';

export default function MatchDetail() {
  const { id } = useParams<{ id: string }>();
  const { events, lastPrices } = useEventsStore();
  const { setSelection, selection: currentSelection } = useBetSlipStore();
  const openBets = useBetStore(state => state.openBets);
  
  const [activeTab, setActiveTab] = useState('All');
  const [ballByBall, setBallByBall] = useState('Dot');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const tickerInterval = setInterval(() => {
      const eventsList = ['Dot', '1 run', '4!', '6!', 'W', '2 runs', 'Wide', 'Dot'];
      setBallByBall(eventsList[Math.floor(Math.random() * eventsList.length)]);
    }, 3000);
    return () => clearInterval(tickerInterval);
  }, []);

  if (!mounted) return null;

  const event = events.find(e => e._id === id);
  if (!event) return <div className="p-12 text-center text-gray-500 font-bold uppercase tracking-widest">Match not found</div>;

  const formatMatched = (num: number) => {
    if (num >= 10000000) return `₹${(num / 10000000).toFixed(1)}Cr`;
    if (num >= 100000) return `₹${(num / 100000).toFixed(1)}L`;
    return `₹${num.toLocaleString()}`;
  };

  const getRunnerPnl = (selectionId: string | number) => {
    const relevantBets = openBets.filter(b => b.matchId === id && b.selectionId === selectionId && b.status === 'open');
    return relevantBets.reduce((acc, b) => acc + (b.type === 'back' ? b.profit : -b.liability), 0);
  };

  const renderOddsCell = (runner: RunnerOdds, type: 'back' | 'lay', index: number) => {
    const emptyBg = type === 'back' ? 'bg-back-3' : 'bg-lay-3';
    if (!priceObj || !priceObj.price) return <div className={`w-[50px] sm:w-[58px] h-10 ${emptyBg} border-x border-white`} />;

    const rid = `${event._id}_${runner.selectionId}`;
    const lastPrice = lastPrices[rid];
    const isUp = priceObj.price > lastPrice;
    const isDown = priceObj.price < lastPrice;

    const baseBg = type === 'back' 
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
        className={`w-[50px] sm:w-[58px] h-10 ${baseBg} flex flex-col items-center justify-center border-x border-white cursor-pointer relative overflow-hidden transition-colors hover:opacity-80`}
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
        <span className="text-[13px] font-bold z-10 text-black">{priceObj.price}</span>
        <span className="text-[9px] z-10 text-gray-500">{(priceObj.size / 1000).toFixed(1)}k</span>
      </div>
    );
  };

  const fancyMarkets = [
    { id: "f1", name: "1st Inning 6 Over Runs", no: 42, yes: 44, min: 100, max: 25000, status: "OPEN" },
    { id: "f2", name: "Virat Kohli Runs",        no: 35, yes: 37, min: 100, max: 10000, status: "OPEN" },
    { id: "f3", name: "1st Inning Runs",          no: 280, yes: 284, min: 100, max: 50000, status: "OPEN" },
    { id: "f4", name: "Rohit Sharma Runs",        no: 28, yes: 30, min: 100, max: 10000, status: "OPEN" },
    { id: "f5", name: "Total Fours",              no: 22, yes: 24, min: 100, max: 25000, status: "OPEN" },
    { id: "f6", name: "Total Sixes",              no: 8,  yes: 10, min: 100, max: 25000, status: "OPEN" },
    { id: "f7", name: "Player of the Match",      no: 0,  yes: 0,  min: 100, max: 5000,  status: "SUSPENDED" }
  ];

  return (
    <div className="flex flex-col min-h-screen pt-[112px] bg-[#ededed]">
      {/* Ticker Section */}
      <div className="bg-black text-white px-3 py-1.5 flex items-center justify-between fixed top-[112px] w-full z-[97] h-[44px] shadow-lg border-t border-gray-800">
         <div className="flex items-center gap-3">
            <span className="text-orange-500 font-bold text-[11px] uppercase whitespace-nowrap hidden sm:block">{event.tournamentName}</span>
            <span className="text-[14px] font-bold">{event.eventName}</span>
         </div>
         <div className="flex items-center gap-4">
            {event.sportName === 'Cricket' && (
              <div className="hidden md:flex items-center gap-4 text-[13px] font-bold">
                 <span className="text-primary tracking-wide">IND 156/3 (14.2)</span>
                 <span className="bg-gray-800 px-2 py-0.5 rounded text-[11px] text-yellow-400 animate-pulse">{ballByBall}</span>
              </div>
            )}
            {event.sportName === 'Football' && (
               <div className="hidden md:flex items-center gap-4 text-[13px] font-bold">
                  <span className="text-primary tracking-wide">LIVE 2 - 1</span>
               </div>
            )}
            <div className="flex gap-1">
               <button className="bg-gray-800 p-1.5 rounded-sm hover:bg-gray-700 transition-colors"><Tv className="w-4 h-4 text-white"/></button>
               <button className="bg-gray-800 p-1.5 rounded-sm hover:bg-gray-700 transition-colors"><BarChart2 className="w-4 h-4 text-white"/></button>
            </div>
         </div>
      </div>

      <div className="container px-2 sm:px-4 mt-[44px] py-3 flex flex-col xl:flex-row gap-4 mb-16">
        <main className="flex-1 space-y-3">
          {/* Dynamic Tabs based on Sport */}
          <div className="bg-white p-1 flex gap-1 overflow-x-auto no-scrollbar shadow-sm rounded-sm">
             {['All', 'Match Odds', 
               ...(event.sportName === 'Cricket' ? ['Bookmaker', 'Fancy'] : []),
               'Sportsbook'
             ].map(tab => (
                <button 
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-4 py-1.5 text-[11px] font-bold uppercase transition-all flex-shrink-0 ${activeTab === tab ? 'bg-[#2e4b5e] text-white' : 'bg-gray-50 text-gray-500 hover:bg-gray-100'}`}
                >
                  {tab}
                </button>
             ))}
          </div>

          <div className="space-y-4">
            {(activeTab === 'All' || activeTab === 'Match Odds') && (
              <div className="bg-white shadow-sm border border-gray-200">
                <div className="exchange-gradient px-3 py-2.5 flex justify-between items-center text-white">
                   <div className="flex items-center gap-2">
                      <span className="font-extrabold text-[15px] uppercase tracking-wider">Match Odds</span>
                      <div className="bg-white/10 px-2 py-0.5 rounded text-[10px] font-bold border border-white/20">
                         MATCHED ₹{Number(event.oddsData.totalMatched).toLocaleString()}
                      </div>
                   </div>
                   <div className="hidden md:flex bg-[#bed5d8] text-[#315195] text-[10px] px-3 py-1 rounded-full font-bold shadow-inner">
                      Min: 100 | Max: 50,000
                   </div>
                </div>

                <div className="bg-gray-50 flex items-center border-b border-gray-200">
                   <div className="flex-1" />
                   <div className="flex">
                      <div className="w-[150px] sm:w-[174px] flex items-center justify-center text-[11px] text-[#243a48] font-black uppercase tracking-widest italic bg-[#72bbef]/30 py-1.5 border-r border-[#72bbef]/30">Back</div>
                      <div className="w-[150px] sm:w-[174px] flex items-center justify-center text-[11px] text-[#d0021b] font-black uppercase tracking-widest italic bg-[#faa9ba]/30 py-1.5">Lay</div>
                   </div>
                </div>

                <div className="divide-y divide-gray-100">
                   {event.oddsData.runners.map(runner => (
                     <div key={runner.selectionId} className="flex flex-col">
                        <div className="flex items-center">
                           <div className="flex-1 px-3 py-3 relative group">
                              <span className="font-extrabold text-[14px] text-black uppercase tracking-tight group-hover:text-match-name transition-colors">{event.runnersData[runner.selectionId.toString()]}</span>
                              <div className="text-[12px] font-bold mt-1 h-5 flex items-center gap-2">
                                 {getRunnerPnl(runner.selectionId) !== 0 && (
                                   <span className={`${getRunnerPnl(runner.selectionId) > 0 ? 'text-pl-plus' : 'text-pl-minus'} px-1.5 py-0.5 bg-gray-50 rounded-sm shadow-sm`}>
                                     {getRunnerPnl(runner.selectionId) > 0 ? `+${getRunnerPnl(runner.selectionId).toFixed(2)}` : `${getRunnerPnl(runner.selectionId).toFixed(2)}`}
                                   </span>
                                 )}
                              </div>
                           </div>
                           <div className="flex">
                              {/* Back Cols - 3 depth */}
                              <div className="hidden md:flex">
                                 {renderOddsCell(runner, 'back', 2)}
                                 {renderOddsCell(runner, 'back', 1)}
                              </div>
                              {renderOddsCell(runner, 'back', 0)}
                              {/* Lay Cols - 3 depth */}
                              {renderOddsCell(runner, 'lay', 0)}
                              <div className="hidden md:flex">
                                 {renderOddsCell(runner, 'lay', 1)}
                                 {renderOddsCell(runner, 'lay', 2)}
                              </div>
                           </div>
                        </div>
                     </div>
                   ))}
                </div>
              </div>
            )}

            {(activeTab === 'All' || activeTab === 'Bookmaker') && event.isBookmakers && (
              <div className="bg-[#faf8d8] shadow-sm border border-gray-200 relative overflow-hidden">
                <div className="exchange-gradient px-3 py-2 text-white font-bold text-[14px] uppercase tracking-wide">Bookmaker</div>
                <div className="divide-y divide-[#e6e0b7]">
                   {event.oddsData.runners.map(runner => (
                      <div key={runner.selectionId} className="flex items-center p-3">
                         <span className="flex-1 font-bold text-[14px] text-[#23282c] uppercase tracking-tight">{event.runnersData[runner.selectionId.toString()]}</span>
                         <div className="flex gap-1">
                            {renderOddsCell(runner, 'back', 0)}
                            {renderOddsCell(runner, 'lay', 0)}
                         </div>
                      </div>
                   ))}
                </div>
              </div>
            )}

            {(activeTab === 'All' || activeTab === 'Fancy') && event.isFancy && (
               <div className="bg-white shadow-sm border border-gray-200">
                  <div className="fancy-gradient px-3 py-2 text-white font-bold text-[14px] uppercase tracking-wide">Fancy Bets</div>
                  <div className="divide-y divide-gray-100">
                     {fancyMarkets.map((m, i) => (
                        <div key={i} className={`flex items-center justify-between p-3 relative ${m.status === 'SUSPENDED' ? 'opacity-70 bg-gray-50' : ''}`}>
                           <div className="flex flex-col">
                              <span className="font-bold text-[13px] text-black uppercase tracking-tight">{m.name}</span>
                              <span className="text-[10px] text-gray-500 font-bold uppercase tracking-widest mt-0.5">Min: {m.min} | Max: {m.max}</span>
                           </div>
                           
                           {m.status === 'SUSPENDED' ? (
                              <div className="flex items-center gap-2 bg-[#ca1010]/10 border border-[#ca1010]/20 px-4 py-2 rounded-sm">
                                 <span className="text-[#ca1010] font-black uppercase text-[12px] tracking-widest">Suspended</span>
                              </div>
                           ) : (
                              <div className="flex gap-[1px]">
                                 <div className="w-14 h-11 bg-[#faa9ba] flex flex-col items-center justify-center rounded-sm cursor-pointer hover:opacity-80 transition-all shadow-sm">
                                    <span className="text-[10px] font-black text-black/40 tracking-tighter -mb-1">NO</span>
                                    <span className="text-[17px] font-black text-black">{m.no}</span>
                                 </div>
                                 <div className="w-14 h-11 bg-[#72bbef] flex flex-col items-center justify-center rounded-sm cursor-pointer hover:opacity-80 transition-all shadow-sm">
                                    <span className="text-[10px] font-black text-black/40 tracking-tighter -mb-1">YES</span>
                                    <span className="text-[17px] font-black text-black">{m.yes}</span>
                                 </div>
                              </div>
                           )}
                        </div>
                     ))}
                  </div>
               </div>
            )}
          </div>
        </main>

        <aside className="w-full xl:w-80 flex-shrink-0">
           <div className="sticky top-[168px] space-y-4">
              {currentSelection ? (
                 <BetSlip />
              ) : (
                <div className="bg-white shadow-sm border border-gray-200 rounded-sm">
                   <div className="exchange-gradient px-3 py-2 text-white font-bold text-[13px] uppercase">
                      Bet Slip
                   </div>
                   <div className="p-10 text-center text-gray-400 text-[12px] font-medium italic bg-white tracking-tight">
                      Click on the odds to place a bet
                   </div>
                </div>
              )}
              
              <div className="bg-white shadow-sm border border-gray-200 overflow-hidden rounded-sm">
                 <div className="exchange-gradient px-3 py-2 flex justify-between items-center text-white border-b border-white/10">
                    <span className="font-bold text-[13px] uppercase">Open Bets ({openBets.filter(b => b.matchId === id).length})</span>
                    <Info className="w-4 h-4 text-white/60 cursor-pointer" />
                 </div>
                 <div className="divide-y divide-gray-100 max-h-[400px] overflow-y-auto no-scrollbar">
                    {openBets.filter(b => b.matchId === id).length === 0 ? (
                       <div className="p-10 text-center text-gray-300 text-[11px] italic uppercase tracking-[0.2em] font-black bg-gray-50/50">
                          No Records Found
                       </div>
                    ) : (
                       openBets.filter(b => b.matchId === id).reverse().map(bet => (
                        <div key={bet.id} className="p-3 bg-white hover:bg-gray-50 transition-colors border-l-4 border-transparent hover:border-match-name">
                           <div className="flex items-center justify-between mb-1.5">
                              <div className="flex items-center gap-2">
                                 <span className={`px-2 py-0.5 rounded-[2px] text-[10px] font-black uppercase tracking-tight ${bet.type === 'back' ? 'bg-[#72bbef]/20 text-[#1a8ee1]' : 'bg-[#faa9ba]/20 text-[#f4496d]'}`}>
                                    {bet.type}
                                 </span>
                                 <span className="text-[12px] font-extrabold text-[#223869] uppercase tracking-tight truncate">{bet.selectionName}</span>
                              </div>
                              <span className="text-[10px] text-gray-400 font-bold">{new Date(bet.createdAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
                           </div>
                           <div className="flex justify-between items-center text-[12px] font-bold">
                              <div className="flex gap-4">
                                 <span className="text-gray-400 uppercase text-[9px] font-black">Odds: <span className="text-black ml-1">{bet.odds}</span></span>
                                 <span className="text-gray-400 uppercase text-[9px] font-black">Stake: <span className="text-black ml-1">₹{bet.stake}</span></span>
                              </div>
                              <span className="text-pl-plus font-black">₹{bet.profit.toFixed(0)}</span>
                           </div>
                           <div className="flex items-center justify-between mt-2">
                              <div className="text-[9px] text-gray-400 uppercase font-black tracking-tighter opacity-70">Match Odds</div>
                              <button className="bg-yellow-400 hover:bg-yellow-500 text-black text-[9px] font-black px-2 py-0.5 rounded-sm uppercase tracking-tighter shadow-sm flex items-center gap-1 active:scale-95 transition-all">
                                 <Zap className="w-2.5 h-2.5" /> Cash Out
                              </button>
                           </div>
                        </div>
                       ))
                    )}
                 </div>
              </div>
           </div>
        </aside>
      </div>
    </div>
  );
}
