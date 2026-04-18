'use client';

import { useState, useEffect } from 'react';
import { useAuthStore } from '@/store/useAuthStore';
import { useRouter } from 'next/navigation';
import { X, User, Lock, ChevronRight } from 'lucide-react';
import { toast } from 'sonner';
import Link from 'next/link';

export default function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const login = useAuthStore(state => state.login);
  const router = useRouter();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const res = login(username, password);
    if (res.success) {
      toast.success('Login Successful!');
      router.push('/home');
    } else {
      setError(res.msg || 'Invalid username or password');
    }
  };

  const handleDemo = () => {
    const res = login('demo', 'Demo@123');
    if (res.success) {
      toast.success('Demo Login Successful!');
      router.push('/home');
    }
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4">
      <div className="w-full max-w-[360px] bg-black shadow-2xl overflow-hidden border border-gray-900 border-t-0 rounded-sm">
        {/* Header - Matching Image */}
        <div className="sports-gradient h-12 flex items-center justify-between px-4">
           <span className="text-black font-black uppercase text-[15px] italic tracking-widest leading-none">Login</span>
           <Link href="/">
              <X className="w-5 h-5 text-black" strokeWidth={3} />
           </Link>
        </div>

        <form onSubmit={handleLogin} className="p-8 space-y-6">
           {error && <div className="text-[#ff0000] text-center text-xs font-bold uppercase tracking-tight">{error}</div>}
           
           <div className="space-y-1">
              <input 
                type="text" 
                value={username}
                onChange={(e) => { setUsername(e.target.value); setError(''); }}
                className="w-full bg-white border-4 border-orange-500/30 ring-1 ring-orange-500 px-4 py-3 text-sm font-bold focus:outline-none placeholder:text-gray-400 text-black rounded-sm"
                placeholder="Username"
                required
              />
           </div>

           <div className="space-y-1">
              <input 
                type="password" 
                value={password}
                onChange={(e) => { setPassword(e.target.value); setError(''); }}
                className="w-full bg-white border-4 border-orange-500/30 ring-1 ring-orange-500 px-4 py-3 text-sm font-bold focus:outline-none placeholder:text-gray-400 text-black rounded-sm"
                placeholder="Password"
                required
              />
           </div>

           <div className="flex flex-col gap-3 py-2">
              <button 
                type="submit"
                className="sports-gradient w-full h-12 text-black font-black uppercase tracking-widest text-[14px] shadow-lg active:scale-95 transition-all rounded-sm flex items-center justify-center"
              >
                Login
              </button>
              <button 
                type="button"
                onClick={handleDemo}
                className="sports-gradient w-full h-12 text-black font-black uppercase tracking-widest text-[14px] shadow-lg active:scale-95 transition-all rounded-sm flex items-center justify-center opacity-90"
              >
                Demo Login
              </button>
           </div>

           <div className="text-center pt-4">
              <div className="flex items-center justify-center gap-1.5 grayscale-0">
                 <span className="text-white font-black italic text-2xl tracking-tighter">STRIKER</span>
                 <span className="text-orange-500 font-bold italic text-2xl">EXCHANGE</span>
              </div>
              <div className="mt-4">
                 <Link href="/register" className="text-gray-400 text-[10px] font-bold uppercase tracking-widest hover:text-white transition-colors">
                    New to Striker? <span className="text-orange-500">Register New Account</span>
                 </Link>
              </div>
           </div>
        </form>
      </div>

    </div>
  );
}
