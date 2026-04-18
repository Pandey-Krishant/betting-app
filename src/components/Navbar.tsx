'use client';

import { useAuthStore } from '@/store/useAuthStore';
import { useEventsStore } from '@/store/useEventsStore';
import { 
  Settings, RefreshCw, User as UserIcon, X, Wallet, 
  ChevronRight, LogOut, FileText, History, ShieldEllipsis, 
  KeyRound, TrendingUp, Activity, Lock, Save
} from 'lucide-react';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import LoginModal from './LoginModal';
import { AnimatePresence, motion } from 'framer-motion';
import { toast } from 'sonner';

export default function Navbar() {
  const { user, logout, changePassword } = useAuthStore();
  const updateOdds = useEventsStore(state => state.updateOdds);
  const [mounted, setMounted] = useState(false);
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isAccountOpen, setIsAccountOpen] = useState(false);
  const [isChangePassOpen, setIsChangePassOpen] = useState(false);
  const [newPass, setNewPass] = useState('');

  useEffect(() => {
    setMounted(true);
    const interval = setInterval(() => updateOdds(), 2000);
    return () => clearInterval(interval);
  }, [updateOdds]);

  if (!mounted) return <nav className="h-[44px] w-full bg-black"></nav>;

  const handleLogout = () => {
    logout();
    setIsAccountOpen(false);
    toast.success('Logged out successfully');
  };

  const handleChangePass = (e: React.FormEvent) => {
    e.preventDefault();
    if (newPass.length < 6) return toast.error('Password must be at least 6 characters');
    changePassword(newPass);
    toast.success('Password changed successfully');
    setIsChangePassOpen(false);
    setNewPass('');
  };

  const menuItems = [
    { label: 'My Profile', icon: UserIcon, href: '/account' },
    { label: 'Multi Markets', icon: Activity, href: '/home' },
    { label: 'Rolling Commission', icon: TrendingUp, href: '/account' },
    { label: 'Account Statement', icon: FileText, href: '/account/statement' },
    { label: 'Bets History', icon: History, href: '/account/bets' },
    { label: 'Profit & Loss', icon: TrendingUp, href: '/account' },
    { label: 'Change Password', icon: KeyRound, onClick: () => setIsChangePassOpen(true) },
    { label: 'Activity Log', icon: ShieldEllipsis, href: '/account' },
  ];

  return (
    <>
      <div className="w-full">
        {/* Main Header */}
        <nav className="h-[44px] w-full bg-header-bg flex items-center justify-between px-3 fixed top-0 z-[1000] shadow-md">
          <div className="flex items-center gap-3">
            <Link href="/" className="flex items-center gap-2">
              <img src="https://20wickets.com/api/users/images/theme-1709893719009-20wicket.png" alt="20wickets" className="h-6" />
              <div className="flex flex-col">
                <span className="text-white font-black italic text-sm tracking-tighter leading-none">20wickets</span>
                <span className="text-orange-500 font-bold text-[8px] uppercase tracking-widest leading-none">Exchange</span>
              </div>
            </Link>

            {user && (
              <div className="hidden lg:flex items-center gap-6 ml-6">
                <Link href="/home" className="text-white/70 hover:text-white text-[11px] font-black uppercase tracking-widest transition-all">Exchange</Link>
                <Link href="/inplay" className="text-white/70 hover:text-white text-[11px] font-black uppercase tracking-widest transition-all">In-Play</Link>
                <Link href="/casino" className="text-white/70 hover:text-white text-[11px] font-black uppercase tracking-widest transition-all">Casino</Link>
                <Link href="/sports" className="text-white/70 hover:text-white text-[11px] font-black uppercase tracking-widest transition-all">Sports</Link>
              </div>
            )}
          </div>

          <div className="hidden xl:flex items-center bg-white/10 rounded-sm px-3 py-1 ml-4 w-64 border border-white/10 group focus-within:border-orange-500/50 transition-all">
             <span className="text-white/40 group-focus-within:text-orange-500"><Activity className="w-3.5 h-3.5" /></span>
             <input type="text" placeholder="Search matches..." className="bg-transparent border-none outline-none text-[11px] text-white px-2 w-full font-bold placeholder:text-white/20" />
          </div>

          <div className="flex items-center gap-2">
            {user ? (
              <div className="flex items-center gap-2">
                <div className="hidden md:flex flex-col text-[11px] font-black text-white/90 text-right mr-3 leading-tight uppercase tracking-tighter">
                  <div>Main P&L: <span className="text-white font-mono">₹0.00</span></div>
                  <div>Exposure: <span className="text-red-500 font-mono">(₹{user.exposure.toLocaleString('en-IN', { minimumFractionDigits: 2 })})</span></div>
                </div>

                <div className="flex items-center gap-1">
                  <button onClick={() => window.location.reload()} className="h-8 w-8 flex items-center justify-center text-white hover:bg-white/10 rounded-sm">
                    <RefreshCw className="h-4 w-4" />
                  </button>
                  
                  <button 
                    onClick={() => setIsAccountOpen(true)}
                    className="bg-transparent h-[30px] px-2 text-[12px] text-white hover:bg-white/10 flex items-center gap-1 rounded-sm uppercase font-black border border-white/20 ml-1 transition-all"
                  >
                    {user.username} {user.isUnlimited ? <span className="text-gold animate-pulse text-[14px]">👑</span> : <ChevronRight className="w-3 h-3 rotate-90" />}
                  </button>

                  <div className="flex items-center gap-1 bg-[#161616] h-[30px] px-3 border border-gray-800 rounded-sm ml-1 min-w-[90px] justify-center shadow-inner">
                     {user.isUnlimited ? (
                       <span className="text-gold font-black text-xl drop-shadow-[0_0_5px_rgba(255,185,0,0.5)] leading-none -mt-1">∞</span>
                     ) : (
                       <span className="text-white font-black text-[12px] font-mono tracking-tighter">₹{user.balance.toLocaleString('en-IN')}</span>
                     )}
                  </div>
                </div>
              </div>
            ) : (
              <button 
                onClick={() => setIsLoginOpen(true)}
                className="login-btn-gradient h-[30px] px-4 text-[11px] font-black text-white uppercase rounded-sm border-none shadow-md active:scale-95 transition-all tracking-wider"
              >
                Login
              </button>
            )}
            {user?.role === 'admin' && (
              <Link href="/admin">
                <span className="bg-orange-500 text-black px-2 py-0.5 rounded-[1px] text-[10px] font-black uppercase ml-2 shadow-lg scale-90 sm:scale-100">Admin Panel</span>
              </Link>
            )}
          </div>
        </nav>

        {/* Marquee Ticker */}
        <div className="sports-gradient h-[28px] w-full flex items-center overflow-hidden fixed top-[44px] z-[999] border-t border-white/5">
           <div className="whitespace-nowrap flex animate-[marquee_25s_linear_infinite] px-4 items-center">
             <span className="text-white text-[11px] font-black uppercase italic tracking-widest mr-[120px]">Welcome to 20wickets | 🏏 India's Most Trusted Trading Platform | 🔒 Secured by Enterprise Encryption | Play Responsibly | 18+ Only</span>
             <span className="text-white text-[11px] font-black uppercase italic tracking-widest mr-[120px]">Welcome to 20wickets | 🏏 India's Most Trusted Trading Platform | 🔒 Secured by Enterprise Encryption | Play Responsibly | 18+ Only</span>
           </div>
        </div>
      </div>

      <LoginModal isOpen={isLoginOpen} onClose={() => setIsLoginOpen(false)} />

      {/* Account Side Drawer - Web & Mobile Validation */}
      <AnimatePresence>
        {isAccountOpen && (
          <>
            <motion.div 
               initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
               onClick={() => setIsAccountOpen(false)}
               className="fixed inset-0 bg-black/70 z-[1001] backdrop-blur-sm"
            />
            <motion.div 
               initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }}
               transition={{ type: 'spring', damping: 25, stiffness: 200 }}
               className="fixed right-0 top-0 bottom-0 w-full sm:w-[320px] bg-[#f4f7f6] z-[1002] shadow-2xl flex flex-col"
            >
               <div className="exchange-gradient p-6 text-white flex items-center justify-between border-b border-white/10 shadow-lg">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-white/10 rounded-sm flex items-center justify-center border border-white/20">
                       <UserIcon className="w-6 h-6" />
                    </div>
                    <div>
                      <h2 className="font-extrabold text-[15px] uppercase leading-none tracking-widest">
                         {user?.username} {user?.isUnlimited && "👑"}
                      </h2>
                      <p className="text-[10px] font-black opacity-70 mt-1 uppercase tracking-tighter">
                         Wallet: ₹{user?.balance.toLocaleString()}
                      </p>
                    </div>
                  </div>
                  <button onClick={() => setIsAccountOpen(false)} className="bg-black/20 p-2 rounded-sm hover:bg-black/40 transition-all">
                     <X className="w-5 h-5"/>
                  </button>
               </div>
               
               <div className="flex-1 overflow-y-auto no-scrollbar py-2">
                  <div className="p-4 grid grid-cols-2 gap-2 mb-2">
                     <div className="bg-white p-3 rounded-sm border border-gray-100 shadow-sm flex flex-col items-center">
                        <span className="text-[9px] font-black text-gray-400 uppercase">Balance</span>
                        <span className="font-black text-sm text-[#223869] font-mono">₹{user?.balance.toLocaleString()}</span>
                     </div>
                     <div className="bg-white p-3 rounded-sm border border-gray-100 shadow-sm flex flex-col items-center">
                        <span className="text-[9px] font-black text-gray-400 uppercase">Exposure</span>
                        <span className="font-black text-sm text-pl-minus font-mono">₹{user?.exposure}</span>
                     </div>
                  </div>

                  {menuItems.map((item: any, i) => (
                    <div 
                       key={i} 
                       onClick={() => { if (item.onClick) item.onClick(); else setIsAccountOpen(false); }}
                       className="group"
                    >
                      {item.href ? (
                        <Link href={item.href}>
                          <div className="flex items-center justify-between px-6 py-4 border-b border-[#e0e6e6] group hover:bg-white transition-all cursor-pointer">
                            <div className="flex items-center gap-4">
                              <item.icon className="w-4 h-4 text-match-name group-hover:scale-110 transition-transform" />
                              <span className="text-match-name font-black text-[12px] uppercase tracking-tight group-hover:translate-x-1 transition-transform">{item.label}</span>
                            </div>
                            <ChevronRight className="w-4 h-4 text-gray-200 group-hover:text-match-name transition-all" />
                          </div>
                        </Link>
                      ) : (
                        <div className="flex items-center justify-between px-6 py-4 border-b border-[#e0e6e6] group hover:bg-white transition-all cursor-pointer">
                           <div className="flex items-center gap-4">
                              <item.icon className="w-4 h-4 text-match-name" />
                              <span className="text-match-name font-black text-[12px] uppercase tracking-tight">{item.label}</span>
                           </div>
                           <ChevronRight className="w-4 h-4 text-gray-200 group-hover:text-match-name transition-all" />
                        </div>
                      )}
                    </div>
                  ))}
               </div>

               <div className="p-4 bg-white border-t border-gray-100">
                  <button 
                    onClick={handleLogout}
                    className="w-full bg-[#d0021b] text-white font-black py-4 uppercase tracking-widest text-[13px] rounded-sm shadow-xl active:scale-95 transition-all flex items-center justify-center gap-2"
                  >
                    <LogOut className="w-4 h-4" /> Logout Account
                  </button>
               </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Change Password Modal */}
      <AnimatePresence>
        {isChangePassOpen && (
          <div className="fixed inset-0 z-[1200] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
             <motion.div 
                initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }}
                className="bg-white rounded-sm w-full max-w-[340px] shadow-2xl overflow-hidden"
             >
                <div className="bg-[#243a48] px-4 py-3 text-white flex justify-between items-center">
                   <h3 className="font-bold text-sm uppercase tracking-widest flex items-center gap-2">
                      <Lock className="w-4 h-4" /> Change Password
                   </h3>
                   <button onClick={() => setIsChangePassOpen(false)}><X className="w-5 h-5"/></button>
                </div>
                <form onSubmit={handleChangePass} className="p-6 space-y-4">
                   <div className="space-y-1">
                      <label className="text-[10px] font-black text-gray-400 uppercase">New Password</label>
                      <input 
                        type="password" 
                        value={newPass}
                        onChange={(e) => setNewPass(e.target.value)}
                        className="w-full bg-gray-50 border border-gray-200 p-3 text-[14px] font-bold focus:border-match-name focus:bg-white transition-all outline-none"
                        placeholder="Enter 6+ characters"
                        required
                        autoFocus
                      />
                   </div>
                   <button 
                     type="submit"
                     className="w-full sports-gradient text-white font-black py-3 px-4 uppercase text-[12px] rounded-sm shadow-md active:scale-95 transition-all flex items-center justify-center gap-2"
                   >
                     <Save className="w-4 h-4" /> Update Password
                   </button>
                </form>
             </motion.div>
          </div>
        )}
      </AnimatePresence>

      <style jsx global>{`
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
      `}</style>
    </>
  );
}
