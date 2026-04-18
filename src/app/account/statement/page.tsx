'use client';

import { useAuthStore } from '@/store/useAuthStore';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function AccountStatement() {
  const { user } = useAuthStore();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    if (!user) router.push('/home');
  }, [user, router]);

  if (!mounted || !user) return null;

  const mockStatements = [
    { date: '2024-04-18 10:15', desc: 'Lay Bet AUS (Won)', credit: 300, debit: 0, bal: 10650 },
    { date: '2024-04-18 09:30', desc: 'Back Bet MI (Won)', credit: 850, debit: 0, bal: 10350 },
    { date: '2024-04-17 18:45', desc: 'Back Bet India (Lost)', credit: 0, debit: 500, bal: 9500 },
    { date: '2024-04-17 12:20', desc: 'Deposit UPI Ref: 44231...', credit: 10000, debit: 0, bal: 10000 },
    { date: '2024-04-16 21:05', desc: 'Fancy Bet Over Runs (Won)', credit: 1200, debit: 0, bal: 0 },
    { date: '2024-04-16 19:40', desc: 'Membership Renewal', credit: 0, debit: 500, bal: 0 },
    { date: '2024-04-15 22:30', desc: 'Bonus Credited', credit: 250, debit: 0, bal: 0 },
    { date: '2024-04-15 14:10', desc: 'Withdrawal SENT', credit: 0, debit: 2000, bal: 0 },
    { date: '2024-04-14 11:20', desc: 'Casino Win - Lightning Roulette', credit: 4200, debit: 0, bal: 0 },
    { date: '2024-04-14 09:00', desc: 'Opening Balance', credit: 500, debit: 0, bal: 500 },
  ];

  return (
    <div className="flex flex-col min-h-screen pt-[72px] bg-[#ededed]">
       <div className="exchange-gradient px-4 py-3 text-white sticky top-[72px] z-[90]">
          <h1 className="font-bold text-[18px] uppercase tracking-wider">Account Statement</h1>
       </div>

       <div className="bg-[#e0e6e6] p-4 flex flex-col sm:flex-row gap-3 items-end border-b border-gray-300">
          <div className="flex-1 space-y-1 w-full">
             <span className="text-[10px] uppercase font-bold text-gray-500 ml-1">From Date</span>
             <input type="date" className="w-full bg-white border border-gray-300 px-3 py-2 text-[13px] rounded-sm focus:outline-none focus:border-match-name" defaultValue="2024-04-01" />
          </div>
          <div className="flex-1 space-y-1 w-full">
             <span className="text-[10px] uppercase font-bold text-gray-500 ml-1">To Date</span>
             <input type="date" className="w-full bg-white border border-gray-300 px-3 py-2 text-[13px] rounded-sm focus:outline-none focus:border-match-name" defaultValue="2024-04-18" />
          </div>
          <button className="bg-[#243a48] text-white font-bold h-[39px] px-8 uppercase text-[12px] rounded-sm hover:opacity-90 transition-all w-full sm:w-auto active:scale-95">
             Submit
          </button>
       </div>

       <div className="overflow-x-auto bg-white">
          <table className="w-full text-left border-collapse">
             <thead className="bg-[#2e4b5e] text-white text-[10px] uppercase tracking-wider">
                <tr>
                   <th className="px-4 py-4 font-bold border-r border-white/10">Date/Time</th>
                   <th className="px-4 py-4 font-bold border-r border-white/10">Description</th>
                   <th className="px-4 py-4 font-bold text-right border-r border-white/10">Credit</th>
                   <th className="px-4 py-4 font-bold text-right border-r border-white/10">Debit</th>
                   <th className="px-4 py-4 font-bold text-right">Balance</th>
                </tr>
             </thead>
             <tbody className="text-[13px] font-bold">
                {mockStatements.map((row, i) => (
                   <tr key={i} className={`${i % 2 === 0 ? 'bg-white' : 'bg-gray-50'} border-b border-gray-100 hover:bg-blue-50 transition-colors`}>
                      <td className="px-4 py-4 whitespace-nowrap text-gray-500 text-[11px]">{row.date}</td>
                      <td className="px-4 py-4 text-[#223869] text-[13px] uppercase tracking-tight">{row.desc}</td>
                      <td className="px-4 py-4 text-right text-pl-plus">{row.credit > 0 ? `₹${row.credit.toLocaleString()}` : '-'}</td>
                      <td className="px-4 py-4 text-right text-pl-minus">{row.debit > 0 ? `₹${row.debit.toLocaleString()}` : '-'}</td>
                      <td className="px-4 py-4 text-right text-black">₹{row.bal.toLocaleString()}</td>
                   </tr>
                ))}
             </tbody>
          </table>
       </div>
    </div>
  );
}
