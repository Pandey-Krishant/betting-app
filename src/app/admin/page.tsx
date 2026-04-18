'use client';

import { useEventsStore } from '@/store/useEventsStore';
import { useAuthStore } from '@/store/useAuthStore';
import { useBetStore } from '@/store/useBetStore';
import { Users, Activity, BarChart3, Banknote, ShieldCheck, TrendingUp, AlertTriangle } from 'lucide-react';

export default function AdminDashboard() {
  const { events } = useEventsStore();
  const { users } = useAuthStore();
  const { openBets } = useBetStore();

  const totalVolume = openBets.reduce((acc, b) => acc + b.stake, 0);
  const inplayCount = events.filter(e => e.oddsData.inPlay).length;

  const stats = [
    { label: 'Total Users', value: users.length, icon: Users, color: 'text-blue-600', bg: 'bg-blue-50' },
    { label: 'Active Matches', value: events.length, icon: Activity, color: 'text-match-inplay', bg: 'bg-green-50' },
    { label: 'Total Open Bets', value: openBets.length, icon: Banknote, color: 'text-orange-600', bg: 'bg-orange-50' },
    { label: 'Platform Commission', value: `₹${(totalVolume * 0.02).toLocaleString()}`, icon: TrendingUp, color: 'text-purple-600', bg: 'bg-purple-50' },
  ];

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, i) => (
          <div key={i} className="bg-white border border-gray-100 shadow-sm p-6 flex flex-col justify-between rounded-sm">
            <div className="flex justify-between items-start">
               <div className={`${stat.bg} p-2.5 rounded-sm`}>
                  <stat.icon className={`w-5 h-5 ${stat.color}`} />
               </div>
               <span className="text-[10px] font-black text-gray-300 uppercase tracking-widest">Global</span>
            </div>
            <div className="mt-4">
               <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">{stat.label}</p>
               <p className="text-[26px] font-black text-black tracking-tighter leading-none">{stat.value}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
         <div className="bg-white border border-gray-100 p-6 rounded-sm shadow-sm space-y-6">
            <div className="flex items-center justify-between border-b border-gray-50 pb-4">
               <h3 className="font-bold text-[13px] uppercase tracking-widest flex items-center gap-2">
                  <ShieldCheck className="w-5 h-5 text-match-inplay" /> Platform Health
               </h3>
               <span className="text-match-inplay text-[10px] font-bold uppercase tracking-widest animate-pulse">Running Stable</span>
            </div>
            <div className="space-y-5">
               <div className="space-y-1">
                  <div className="flex justify-between text-[11px] font-bold uppercase">
                     <span className="text-gray-400 tracking-tight">API Latency</span>
                     <span className="text-match-inplay">12ms</span>
                  </div>
                  <div className="h-1 w-full bg-gray-50 rounded-full overflow-hidden">
                     <div className="h-full w-[15%] bg-match-inplay" />
                  </div>
               </div>
               <div className="space-y-1">
                  <div className="flex justify-between text-[11px] font-bold uppercase">
                     <span className="text-gray-400 tracking-tight">Odd Server Load</span>
                     <span className="text-orange-500">45%</span>
                  </div>
                  <div className="h-1 w-full bg-gray-50 rounded-full overflow-hidden">
                     <div className="h-full w-[45%] bg-orange-500" />
                  </div>
               </div>
               <div className="space-y-1">
                  <div className="flex justify-between text-[11px] font-bold uppercase">
                     <span className="text-gray-400 tracking-tight">Security Score</span>
                     <span className="text-blue-500">98/100</span>
                  </div>
                  <div className="h-1 w-full bg-gray-50 rounded-full overflow-hidden">
                     <div className="h-full w-[90%] bg-blue-500" />
                  </div>
               </div>
            </div>
         </div>

         <div className="bg-[#fff9f9] border border-red-50 p-6 rounded-sm shadow-sm space-y-6">
            <div className="flex items-center justify-between border-b border-red-100 pb-4">
               <h3 className="font-bold text-[13px] uppercase tracking-widest flex items-center gap-2 text-pl-minus">
                  <AlertTriangle className="w-5 h-5" /> Active Systems Monitoring
               </h3>
            </div>
            <div className="space-y-4">
               {[
                 { msg: "Main settlement engine operating within params", type: "info" },
                 { msg: "High traffic detected on Mumbai v CSK match Odds", type: "warning" },
                 { msg: "Weekly backup successful", type: "success" }
               ].map((alert, i) => (
                  <div key={i} className={`flex gap-3 items-start border-l-2 ${alert.type === 'warning' ? 'border-orange-500' : 'border-blue-500'} pl-3 py-1`}>
                     <div className="flex-1">
                        <p className="text-[12px] font-bold text-gray-800 leading-tight">{alert.msg}</p>
                        <p className="text-[9px] text-gray-400 mt-1 uppercase font-bold">14:22:52 GMT</p>
                     </div>
                  </div>
               ))}
            </div>
         </div>
      </div>
    </div>
  );
}
