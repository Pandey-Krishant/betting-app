'use client';

import { useAuthStore } from '@/store/useAuthStore';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Trophy, ShieldCheck, Zap, ChevronRight, Activity, 
  TrendingUp, Play, Users, Globe, Smartphone, Crown 
} from 'lucide-react';
import LoginModal from '@/components/LoginModal';
import Link from 'next/link';

export default function LandingPage() {
  const { user } = useAuthStore();
  const router = useRouter();
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    if (user) router.replace('/home');
  }, [user, router]);

  if (!mounted || user) return null;

  return (
    <div className="min-h-screen bg-[#ededed] text-black selection:bg-orange-500/30">
      {/* Premium Dark Navigation */}
      <nav className="fixed top-0 w-full h-[60px] bg-black/95 backdrop-blur-md flex items-center justify-between px-6 sm:px-12 z-[1000] border-b border-white/5">
        <div className="flex items-center gap-2">
           <img src="https://20wickets.com/api/users/images/theme-1709893719009-20wicket.png" alt="20wickets" className="h-8" />
           <span className="text-white font-black italic text-2xl tracking-tighter ml-2">20wickets</span>
        </div>
        <div className="flex items-center gap-4">
           <Link href="/register" className="hidden sm:block text-white/70 hover:text-white text-[11px] font-black uppercase tracking-widest transition-colors">Register</Link>
           <button 
             onClick={() => setIsLoginOpen(true)}
             className="login-btn-bg px-8 py-2 rounded-sm text-[12px] font-black uppercase text-white shadow-[0_0_20px_rgba(253,143,59,0.3)] active:scale-95 transition-all"
           >
             Login
           </button>
        </div>
      </nav>

      {/* Hero Section with Live Preview */}
      <section className="relative pt-32 pb-24 overflow-hidden bg-black text-white">
        {/* Animated Background */}
        <div className="absolute inset-0 opacity-20 pointer-events-none">
           <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-blue-600 rounded-full blur-[160px] animate-pulse" />
           <div className="absolute inset-0" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, rgba(255,255,255,0.05) 1px, transparent 0)', backgroundSize: '40px 40px' }} />
        </div>

        <div className="max-w-7xl mx-auto px-6 relative z-10 grid lg:grid-cols-2 gap-16 items-center">
          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-[0.2em] text-blue-500 mb-8 backdrop-blur-sm">
              <Crown className="w-3.5 h-3.5" /> India's Most Trusted Exchange
            </div>
            
            <h1 className="text-6xl md:text-8xl font-black italic tracking-tighter leading-[0.85] mb-8 uppercase">
              The Home of<br />
              <span className="text-transparent text-stroke-white">Exchange</span>.<br />
              <span className="text-blue-500 underline decoration-white/20 underline-offset-8">20wickets</span>.
            </h1>

            <p className="text-gray-400 text-lg md:text-xl font-bold max-w-xl mb-12 leading-relaxed uppercase tracking-tight opacity-80">
              Trade sports odds in real-time. Join over 2.4 million users on the world's most robust peer-to-peer exchange.
            </p>

            <div className="flex flex-col sm:flex-row gap-5">
              <Link 
                href="/register"
                className="group relative px-12 py-5 bg-orange-500 hover:bg-orange-600 text-white font-black uppercase text-lg italic tracking-widest rounded-sm transition-all shadow-[0_15px_30px_rgba(253,143,59,0.4)] active:scale-95 text-center overflow-hidden"
              >
                <div className="absolute inset-0 bg-white/20 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 ease-in-out" />
                Start Winning <ChevronRight className="inline-block w-6 h-6 ml-2 -mt-1 group-hover:translate-x-1 transition-transform" />
              </Link>
              <button 
                onClick={() => setIsLoginOpen(true)}
                className="px-12 py-5 bg-white/5 hover:bg-white/10 text-white font-black uppercase text-lg italic tracking-widest rounded-sm transition-all backdrop-blur-md border border-white/20 active:scale-95"
              >
                Access Demo
              </button>
            </div>

            <div className="mt-12 flex items-center gap-10">
               <div>
                  <p className="text-[10px] text-gray-500 font-black uppercase tracking-widest mb-1">Total Volume</p>
                  <p className="text-2xl font-black italic tracking-tighter">₹245Cr+</p>
               </div>
               <div className="w-[1px] h-10 bg-white/10" />
               <div>
                  <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest mb-1">Active Users</p>
                  <p className="text-2xl font-black italic tracking-tighter">2.4M</p>
               </div>
            </div>
          </motion.div>

          {/* Live Match Preview Widget */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.9, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.2 }}
            className="w-full max-w-lg mx-auto"
          >
            <div className="bg-[#161616] rounded-sm p-4 shadow-[0_30px_60px_rgba(0,0,0,0.5)] border border-white/10 relative group">
               <div className="absolute -top-4 -right-4 bg-orange-500 text-black px-4 py-1 font-black text-xs rounded-sm shadow-xl z-20 group-hover:scale-110 transition-transform">IN-PLAY NOW</div>
               
               <div className="bg-black/40 rounded-sm overflow-hidden mb-4 border border-white/5">
                  <div className="p-4 border-b border-white/5 flex justify-between items-center">
                     <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                        <span className="text-[11px] font-black uppercase text-gray-400">Match Odds | 14:30 GMT</span>
                     </div>
                     <Activity className="w-4 h-4 text-orange-500 opacity-50" />
                  </div>
                  <div className="p-6 space-y-6">
                     <div className="flex justify-between items-center">
                        <div className="flex items-center gap-4">
                           <div className="w-10 h-10 bg-blue-600 rounded-sm flex items-center justify-center font-black text-xl italic shadow-inner">M</div>
                           <span className="text-lg font-black uppercase tracking-tight">Mumbai Indians</span>
                        </div>
                        <div className="flex gap-1">
                           <div className="w-14 h-12 bg-[#72bbef] flex flex-col items-center justify-center rounded-sm text-black">
                              <span className="text-lg font-black leading-none">1.85</span>
                              <span className="text-[9px] font-black opacity-40 uppercase">Back</span>
                           </div>
                           <div className="w-14 h-12 bg-[#faa9ba] flex flex-col items-center justify-center rounded-sm text-black">
                              <span className="text-lg font-black leading-none">1.86</span>
                              <span className="text-[9px] font-black opacity-40 uppercase">Lay</span>
                           </div>
                        </div>
                     </div>
                     <div className="flex justify-between items-center opacity-60">
                        <div className="flex items-center gap-4">
                           <div className="w-10 h-10 bg-yellow-500 rounded-sm flex items-center justify-center font-black text-xl italic shadow-inner text-black">C</div>
                           <span className="text-lg font-black uppercase tracking-tight">Chennai Kings</span>
                        </div>
                        <div className="flex gap-1">
                           <div className="w-14 h-12 bg-[#72bbef] flex flex-col items-center justify-center rounded-sm text-black">
                              <span className="text-lg font-black leading-none">2.12</span>
                              <span className="text-[9px] font-black opacity-40 uppercase">Back</span>
                           </div>
                           <div className="w-14 h-12 bg-[#faa9ba] flex flex-col items-center justify-center rounded-sm text-black">
                              <span className="text-lg font-black leading-none">2.14</span>
                              <span className="text-[9px] font-black opacity-40 uppercase">Lay</span>
                           </div>
                        </div>
                     </div>
                  </div>
               </div>

               <div className="grid grid-cols-2 gap-3">
                  <div className="bg-white/5 p-4 rounded-sm border border-white/5">
                     <p className="text-[9px] font-black text-gray-500 uppercase mb-2">Total Matched</p>
                     <p className="text-xl font-black italic tracking-tighter text-orange-500">₹2.45Cr</p>
                  </div>
                  <div className="bg-white/5 p-4 rounded-sm border border-white/5 flex flex-col justify-end">
                     <div className="flex items-center gap-2">
                        <TrendingUp className="w-4 h-4 text-green-500" />
                        <span className="text-[10px] font-black uppercase text-green-500">Fast Growth</span>
                     </div>
                  </div>
               </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Trust & Features Section */}
      <section className="py-24 bg-[#ededed]">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
           {[
             { icon: Zap, title: "Speed", desc: "Fastest odds movement and sub-second settlement in the industry." },
             { icon: ShieldCheck, title: "Trust", desc: "Secured with bank-grade encryption and 24/7 fraud monitoring." },
             { icon: Smartphone, title: "Mobile", desc: "Fully responsive platform designed for professional trading on the go." },
             { icon: Globe, title: "Global", desc: "Access markets from every major sporting event around the globe." }
           ].map((item, i) => (
              <div key={i} className="bg-white p-10 rounded-sm border border-gray-200 shadow-sm hover:shadow-xl hover:-translate-y-2 transition-all group">
                 <div className="w-14 h-14 bg-gray-50 flex items-center justify-center rounded-sm mb-6 group-hover:bg-orange-500 transition-all">
                    <item.icon className="w-7 h-7 text-orange-500 group-hover:text-white" />
                 </div>
                 <h3 className="text-xl font-black uppercase italic mb-4 text-[#243a48]">{item.title}</h3>
                 <p className="text-gray-400 font-bold text-xs uppercase tracking-widest leading-relaxed italic">{item.desc}</p>
              </div>
           ))}
        </div>
      </section>

      {/* Social Proof */}
      <section className="bg-white border-t border-gray-100 py-16 overflow-hidden">
         <div className="flex whitespace-nowrap animate-[marquee_20s_linear_infinite] px-4 gap-20">
            {Array(10).fill(0).map((_, i) => (
              <div key={i} className="flex items-center gap-4 grayscale opacity-20">
                <span className="text-3xl font-black italic tracking-tighter uppercase">Premium Exchange</span>
                <Crown className="w-6 h-6" />
                <span className="text-3xl font-black italic tracking-tighter uppercase">Striker Exchange</span>
              </div>
            ))}
         </div>
      </section>

      <footer className="bg-black text-gray-500 py-20 px-6">
         <div className="max-w-7xl mx-auto flex flex-col items-center gap-8 text-center">
            <div className="flex items-center gap-2">
               <span className="text-white font-black italic text-3xl tracking-tighter">STRIKER</span>
               <span className="text-orange-500 font-bold italic text-3xl ml-0.5">EXCHANGE</span>
            </div>
            <div className="flex gap-8 text-[11px] font-black uppercase tracking-[0.2em] text-white/40">
               <a href="#" className="hover:text-orange-500">Rules</a>
               <a href="#" className="hover:text-orange-500">Security</a>
               <a href="#" className="hover:text-orange-500">Responsibility</a>
               <a href="#" className="hover:text-orange-500">History</a>
            </div>
            <p className="text-[10px] uppercase font-bold tracking-[0.3em] opacity-40">
               © 2026 STRIKER EXCHANGE | FOR USERS 18+ | GAMBLING CAN BE ADDICTIVE.
            </p>
         </div>
      </footer>

      <LoginModal isOpen={isLoginOpen} onClose={() => setIsLoginOpen(false)} />

      <style jsx global>{`
        .text-stroke-white {
          -webkit-text-stroke: 1px rgba(255, 255, 255, 0.4);
        }
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
      `}</style>
    </div>
  );
}
