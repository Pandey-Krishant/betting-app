'use client';

import { useAuthStore } from '@/store/useAuthStore';
import { useBetStore } from '@/store/useBetStore';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function BetHistory() {
  const { user } = useAuthStore();
  const { openBets } = useBetStore();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('Open');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    if (!user) router.push('/home');
  }, [user, router]);

  if (!mounted || !user) return null;

  const settledBets = [
    { match: 'MI v CSK', market: 'Match Odds', selection: 'Mumbai Indians', type: 'back', odds: 1.85, stake: 1000, pnl: 850, result: 'WON', date: '2024-04-17' },
    { match: 'India v Australia', market: 'Match Odds', selection: 'India', type: 'back', odds: 2.10, stake: 500, pnl: -500, result: 'LOST', date: '2024-04-17' },
  ];

  return (
    <div className="flex flex-col min-h-screen pt-[72px] bg-[#ededed]">
       <div className="exchange-gradient px-4 py-3 text-white sticky top-[72px] z-[90]">
          <h1 className="font-bold text-[18px] uppercase tracking-wider">Bet History</h1>
       </div>

       <div className="bg-white border-b border-gray-200 p-1 flex">
          {['Open', 'Settled'].map(tab => (
             <button 
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`flex-1 py-3 text-[13px] font-bold uppercase transition-all ${activeTab === tab ? 'bg-[#2e4b5e] text-white shadow-inner' : 'text-gray-400 hover:bg-gray-50'}`}
             >
                {tab} Bets
             </button>
          ))}
       </div>

       <div className="overflow-x-auto bg-white flex-1">
          {activeTab === 'Open' ? (
             <table className="w-full text-left border-collapse">
                <thead className="bg-[#f0f3f5] text-[11px] font-bold text-gray-500 uppercase tracking-widest border-b border-gray-200">
                   <tr>
                      <th className="px-4 py-4">Match</th>
                      <th className="px-4 py-4">Market</th>
                      <th className="px-4 py-4">Selection</th>
                      <th className="px-4 py-4">Type</th>
                      <th className="px-4 py-4">Odds</th>
                      <th className="px-4 py-4">Stake</th>
                      <th className="px-4 py-4">P&L</th>
                      <th className="px-4 py-4">Status</th>
                   </tr>
                </thead>
                <tbody className="text-[13px] font-bold divide-y divide-gray-100">
                   {openBets.map(bet => (
                      <tr key={bet.id} className="hover:bg-blue-50 transition-colors">
                         <td className="px-4 py-4 text-gray-500 truncate max-w-[150px]">{bet.eventName}</td>
                         <td className="px-4 py-4 uppercase text-[11px]">{bet.marketName}</td>
                         <td className="px-4 py-4 text-[#223869] font-black uppercase text-[12px]">{bet.selectionName}</td>
                         <td className="px-4 py-4">
                            <span className={`px-2 py-0.5 rounded-[2px] text-[10px] uppercase font-black ${bet.type === 'back' ? 'bg-[#72bbef] text-black' : 'bg-[#faa9ba] text-black'}`}>
                               {bet.type}
                            </span>
                         </td>
                         <td className="px-4 py-4 font-mono">{bet.odds}</td>
                         <td className="px-4 py-4">₹{bet.stake}</td>
                         <td className="px-4 py-4 text-pl-plus">₹{bet.profit.toFixed(0)}</td>
                         <td className="px-4 py-4 text-match-inplay font-black uppercase text-[11px] italic">Active</td>
                      </tr>
                   ))}
                </tbody>
             </table>
          ) : (
             <table className="w-full text-left border-collapse">
                <thead className="bg-[#f0f3f5] text-[11px] font-bold text-gray-500 uppercase tracking-widest border-b border-gray-200">
                   <tr>
                      <th className="px-4 py-4">Match</th>
                      <th className="px-4 py-4">Selection</th>
                      <th className="px-4 py-4">Odds</th>
                      <th className="px-4 py-4">Stake</th>
                      <th className="px-4 py-4">P&L</th>
                      <th className="px-4 py-4">Result</th>
                      <th className="px-4 py-4">Date</th>
                   </tr>
                </thead>
                <tbody className="text-[13px] font-bold divide-y divide-gray-100">
                   {settledBets.map((bet, i) => (
                      <tr key={i} className="hover:bg-blue-50 transition-colors">
                         <td className="px-4 py-4 text-gray-500 truncate max-w-[180px]">{bet.match}</td>
                         <td className="px-4 py-4 text-[#223869] font-black uppercase text-[12px]">{bet.selection}</td>
                         <td className="px-4 py-4 font-mono">{bet.odds}</td>
                         <td className="px-4 py-4">₹{bet.stake}</td>
                         <td className={`px-4 py-4 ${bet.pnl > 0 ? 'text-pl-plus' : 'text-pl-minus'}`}>₹{bet.pnl}</td>
                         <td className="px-4 py-4">
                            <span className={`px-2 py-0.5 rounded-[2px] text-[10px] uppercase font-black ${bet.result === 'WON' ? 'bg-[#228b22] text-white' : 'bg-[#d0021b] text-white'}`}>
                               {bet.result}
                            </span>
                         </td>
                         <td className="px-4 py-4 text-gray-400 text-[11px]">{bet.date}</td>
                      </tr>
                   ))}
                </tbody>
             </table>
          )}
       </div>
    </div>
  );
}
