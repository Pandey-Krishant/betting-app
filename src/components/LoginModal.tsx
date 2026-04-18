'use client';

import { useState } from 'react';
import { useAuthStore } from '@/store/useAuthStore';
import { X } from 'lucide-react';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function LoginModal({ isOpen, onClose }: LoginModalProps) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const login = useAuthStore(state => state.login);
  const router = useRouter();

  if (!isOpen) return null;

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const res = login(username, password);
    if (res.success) {
      toast.success('Login Successful!');
      onClose();
      router.push('/home');
    } else {
      setError(res.msg || 'Invalid username or password');
    }
  };

  const handleDemo = () => {
    const res = login('demo', 'Demo@123');
    if (res.success) {
      toast.success('Demo Login Successful!');
      onClose();
      router.push('/home');
    }
  };

  return (
    <div className="fixed inset-0 z-[1100] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
      <div className="w-full max-w-[360px] bg-black shadow-2xl overflow-hidden border border-gray-900 border-t-0 rounded-sm animate-in fade-in zoom-in duration-200">
        {/* Header - Matching Image */}
        <div className="header-gradient h-12 flex items-center justify-between px-4">
           <span className="text-black font-black uppercase text-[15px] italic tracking-widest leading-none">Login</span>
           <button onClick={onClose}>
              <X className="w-5 h-5 text-black" strokeWidth={3} />
           </button>
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
                className="header-gradient w-full h-12 text-black font-black uppercase tracking-widest text-[14px] shadow-lg active:scale-95 transition-all rounded-sm flex items-center justify-center font-sans"
              >
                Login
              </button>
              <button 
                type="button"
                onClick={handleDemo}
                className="header-gradient w-full h-12 text-black font-black uppercase tracking-widest text-[14px] shadow-lg active:scale-95 transition-all rounded-sm flex items-center justify-center opacity-90 font-sans"
              >
                Demo Login
              </button>
           </div>

           <div className="text-center">
              <div className="flex items-center justify-center gap-1.5 flex-nowrap mb-4">
                 <span className="text-white font-black italic text-2xl tracking-tighter">STRIKER</span>
                 <span className="text-orange-500 font-bold italic text-2xl">EXCHANGE</span>
              </div>
              <Link href="/register" onClick={onClose} className="text-gray-400 text-[10px] font-bold uppercase tracking-widest hover:text-white transition-colors">
                New to Striker? <span className="text-orange-500">Register New Account</span>
              </Link>
           </div>
        </form>
      </div>

      <style jsx global>{`
        .header-gradient {
          background: var(--header-bg);
        }
      `}</style>
    </div>
  );
}
