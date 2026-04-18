'use client';

import { useAuthStore } from '@/store/useAuthStore';
import { useBetStore } from '@/store/useBetStore';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { 
  ChevronRight, FileText, ClipboardList, History, 
  ShieldEllipsis, KeyRound, LogOut, Wallet, User as UserIcon,
  Activity, BarChart3, TrendingUp
} from 'lucide-react';

export default function AccountPage() {
  const { user, logout } = useAuthStore();
  const openBets = useBetStore(state => state.openBets);
  const router = useRouter();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    if (!user) router.push('/home');
  }, [user, router]);

  if (!mounted || !user) return null;

  const balanceLabel = user.isUnlimited ? '∞' : `₹${user.balance.toLocaleString('en-IN')}`;

  const menuItems = [
    { label: 'My Profile', icon: UserIcon, href: '/account/profile' },
    { label: 'Multi Markets', icon: Activity, href: '/account/markets' },
    { label: 'Rolling Commission', icon: TrendingUp, href: '/account/commission' },
    { label: 'Account Statement', icon: FileText, href: '/account/statement' },
    { label: 'Bets History', icon: History, href: '/account/bets' },
    { label: 'Profit & Loss', icon: BarChart3, href: '/account/pl' },
  ];

  return (
    <div className="flex flex-col min-h-screen pt-[72px] pb-[55px] bg-[#ededed]">
       <div className="exchange-gradient px-4 py-6 text-white sticky top-[72px] z-[90] shadow-md">
          <div className="flex items-center gap-4">
             <div className="w-16 h-16 rounded-full bg-white/10 flex items-center justify-center border-2 border-white/20">
                <UserIcon className="w-8 h-8 text-white" />
             </div>
             <div>
                <h1 className="font-bold text-[20px] uppercase tracking-wider">{user.username} {user.isUnlimited && '👑'}</h1>
                <p className="text-[12px] opacity-80 font-bold uppercase tracking-widest">Main Wallet: {balanceLabel}</p>
             </div>
          </div>
       </div>

       <div className="container max-w-2xl px-2 sm:px-4 py-6 space-y-4">
          <div className="grid grid-cols-2 gap-3 mb-4">
             <div className="bg-white p-4 border border-gray-200 shadow-sm flex flex-col items-center">
                <span className="text-gray-400 text-[10px] uppercase font-bold tracking-widest">Balance</span>
                <span className="text-xl font-bold text-[#223869]">{balanceLabel}</span>
             </div>
             <div className="bg-white p-4 border border-gray-200 shadow-sm flex flex-col items-center">
                <span className="text-gray-400 text-[10px] uppercase font-bold tracking-widest">Exposure</span>
                <span className="text-xl font-bold text-red-500">({user.exposure.toLocaleString('en-IN')})</span>
             </div>
          </div>

          <div className="bg-white shadow-sm border border-gray-200 overflow-hidden rounded-sm">
             {menuItems.map((item, i) => (
                <div 
                  key={i}
                  onClick={() => router.push(item.href)}
                  className={`flex justify-between items-center px-4 py-4 cursor-pointer hover:bg-gray-50 transition-all active:bg-gray-100 ${i < menuItems.length - 1 ? 'border-b border-gray-100' : ''}`}
                >
                   <div className="flex items-center gap-4">
                      <div className="bg-gray-50 p-2 rounded-full">
                        <item.icon className="w-4 h-4 text-match-name" />
                      </div>
                      <span className="text-[#223869] font-bold text-[14px] uppercase tracking-tight">{item.label}</span>
                   </div>
                   <ChevronRight className="w-4 h-4 text-gray-300" />
                </div>
             ))}
          </div>

          <button 
            onClick={() => logout()}
            className="w-full bg-[#d0021b] text-white font-bold py-4 rounded-sm uppercase tracking-widest text-[14px] shadow-lg flex items-center justify-center gap-2 mt-6 active:scale-95 transition-all"
          >
            <LogOut className="w-5 h-5" />
            Logout
          </button>

          <div className="mt-12 pt-8 border-t border-gray-300 text-center opacity-40">
             <span className="text-black font-bold italic text-3xl tracking-tighter">STRIKER</span>
             <span className="text-orange-500 font-bold italic text-3xl ml-1">EXCHANGE</span>
             <div className="text-[10px] mt-2 font-bold uppercase tracking-widest">Secure & encrypted infrastructure</div>
          </div>
       </div>
    </div>
  );
}
