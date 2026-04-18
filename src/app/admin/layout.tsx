'use client';

import { useAuthStore } from '@/store/useAuthStore';
import { useRouter, usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Users, ShieldAlert, LayoutDashboard, Settings2, Trophy, InfinityIcon, BadgeCheck } from 'lucide-react';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { user, setUnlimitedBalance } = useAuthStore();
  const router = useRouter();
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    if (!user || user.role !== 'admin') {
      router.push('/home');
    }
  }, [user, router]);

  if (!mounted || !user || user.role !== 'admin') return null;

  const links = [
    { href: '/admin', icon: LayoutDashboard, label: 'Dashboard' },
    { href: '/admin/users', icon: Users, label: 'Users' },
    { href: '/admin/matches', icon: Trophy, label: 'Matches' },
  ];

  return (
    <div className="flex flex-col min-h-screen pt-[72px] bg-[#f4f7f6]">
      {/* Admin Sub-Header */}
      <div className="bg-black text-white px-4 py-8 flex flex-col md:flex-row items-center justify-between border-t border-gray-800">
         <div className="flex items-center gap-4 mb-4 md:mb-0">
            <div className="relative">
               <ShieldAlert className="w-12 h-12 text-orange-500" />
               <span className="absolute -top-1 -right-1 bg-red-600 text-[10px] font-bold px-1 rounded-full animate-pulse">LIVE</span>
            </div>
            <div>
               <div className="flex items-center gap-2">
                 <h1 className="font-bold text-2xl uppercase tracking-widest leading-none">Admin Console</h1>
                 <span className="bg-orange-500 text-black px-2 py-0.5 rounded text-[10px] font-black uppercase shadow-lg">STRIKER</span>
               </div>
               <p className="text-[11px] text-gray-400 mt-1 uppercase font-bold tracking-tighter">System Operations & Risk Management</p>
            </div>
         </div>

         <div className="flex items-center gap-3">
            <div className="bg-[#161616] border border-gray-800 px-4 py-2 rounded-sm flex items-center gap-3 shadow-inner">
               <div className="flex flex-col text-right">
                  <span className="text-[10px] text-gray-500 uppercase font-black uppercase text-[9px]">Admin Session</span>
                  <span className="text-white font-bold text-sm tracking-tight">{user.username} <span className="text-gold">👑</span></span>
               </div>
               <button 
                  onClick={() => setUnlimitedBalance(user.username, !user.isUnlimited)}
                  className={`w-10 h-10 rounded-full flex items-center justify-center transition-all shadow-lg active:scale-95 ${user.isUnlimited ? 'bg-gold ring-4 ring-gold/20' : 'bg-gray-800 grayscale hover:grayscale-0'}`}
               >
                  <InfinityIcon className={`w-6 h-6 ${user.isUnlimited ? 'text-black' : 'text-gray-500'}`} />
               </button>
            </div>
         </div>
      </div>

      <div className="container px-2 sm:px-4 py-8 max-w-7xl mx-auto flex flex-col xl:flex-row gap-8">
        <aside className="w-full xl:w-64 space-y-2">
          <div className="bg-white border border-gray-100 rounded-sm shadow-sm p-1 flex xl:flex-col overflow-x-auto no-scrollbar">
            {links.map((link) => {
              const isActive = pathname === link.href;
              const Icon = link.icon;
              return (
                <Link key={link.href} href={link.href} className="flex-1">
                  <div className={`flex items-center gap-3 px-5 py-3 transition-all duration-200 rounded-sm whitespace-nowrap ${isActive ? 'bg-[#243a48] text-white font-bold' : 'text-gray-500 hover:bg-gray-50 hover:text-match-name'}`}>
                    <Icon className="w-4 h-4" />
                    <span className="text-[11px] font-bold uppercase tracking-widest">{link.label}</span>
                  </div>
                </Link>
              );
            })}
          </div>
          
          <div className="hidden xl:block bg-orange-50 border border-orange-100 p-4 rounded-sm">
             <h4 className="text-[10px] font-black uppercase text-orange-600 mb-2">Security Advice</h4>
             <p className="text-[10px] text-orange-800/70 font-bold italic leading-relaxed">Always check the Match ID before settling. Suspicious IP activities are logged automatically.</p>
          </div>
        </aside>
        
        <main className="flex-1 bg-white border border-gray-100 shadow-xl rounded-sm overflow-hidden p-6 sm:p-8 min-h-[600px]">
           {children}
        </main>
      </div>
    </div>
  );
}
