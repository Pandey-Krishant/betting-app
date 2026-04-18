'use client';

import { useAuthStore } from '@/store/useAuthStore';
import { useBetStore } from '@/store/useBetStore';
import { useRouter } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';
import { BarChart3 } from 'lucide-react';

export default function ProfitLossPage() {
  const { user } = useAuthStore();
  const openBets = useBetStore(state => state.openBets);
  const router = useRouter();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    if (!user) router.push('/home');
  }, [user, router]);

  const totals = useMemo(() => {
    const myBets = openBets.filter(b => b.userId === user?.username);
    const exposure = myBets.reduce((acc, b) => acc + (b.liability || 0), 0);
    const potentialProfit = myBets.reduce((acc, b) => acc + (b.type === 'back' ? b.profit : b.stake), 0);
    return { exposure, potentialProfit, count: myBets.length };
  }, [openBets, user?.username]);

  if (!mounted || !user) return null;

  return (
    <div className="flex flex-col min-h-screen pt-[72px] bg-[#ededed]">
      <div className="exchange-gradient px-4 py-3 text-white sticky top-[72px] z-[90]">
        <h1 className="font-bold text-[18px] uppercase tracking-wider flex items-center gap-2">
          <BarChart3 className="w-5 h-5" /> Profit &amp; Loss
        </h1>
      </div>

      <div className="container max-w-2xl px-2 sm:px-4 py-6 space-y-3">
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-white p-4 border border-gray-200 shadow-sm rounded-sm flex flex-col items-center">
            <span className="text-gray-400 text-[10px] uppercase font-bold tracking-widest">Open Bets</span>
            <span className="text-xl font-bold text-[#223869] tabular-nums">{totals.count}</span>
          </div>
          <div className="bg-white p-4 border border-gray-200 shadow-sm rounded-sm flex flex-col items-center">
            <span className="text-gray-400 text-[10px] uppercase font-bold tracking-widest">Exposure</span>
            <span className="text-xl font-bold text-red-500 tabular-nums">₹{Math.round(totals.exposure).toLocaleString('en-IN')}</span>
          </div>
        </div>

        <div className="bg-white p-4 border border-gray-200 shadow-sm rounded-sm flex flex-col items-center">
          <span className="text-gray-400 text-[10px] uppercase font-bold tracking-widest">Potential Profit</span>
          <span className="text-2xl font-black text-pl-plus tabular-nums">₹{Math.round(totals.potentialProfit).toLocaleString('en-IN')}</span>
        </div>

        <div className="bg-white border border-gray-200 shadow-sm rounded-sm p-8 text-center text-gray-400 font-bold uppercase tracking-widest text-[11px]">
          Settled P&amp;L coming soon
        </div>
      </div>
    </div>
  );
}

