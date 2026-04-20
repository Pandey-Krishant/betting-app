'use client';

import { useState } from 'react';
import { useAuthStore } from '@/store/useAuthStore';
import { useRouter } from 'next/navigation';
import { X, User, Lock, Mail, Phone, ChevronRight, CheckCircle2 } from 'lucide-react';
import { toast } from 'sonner';
import Link from 'next/link';

export default function RegisterPage() {
  const [formData, setFormData] = useState({ username: '', password: '', confirmPassword: '', mobile: '' });
  const [error, setError] = useState('');
  const register = useAuthStore(state => state.register);
  const router = useRouter();

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      return setError('Passwords do not match');
    }
    
    const res = register(formData.username, formData.password, formData.mobile);
    if (res.success) {
      toast.success('Registration successful! Please login.');
      router.push('/login');
    } else {
      setError(res.msg);
    }
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4">
      <div className="w-full max-w-[420px] bg-black shadow-2xl overflow-hidden rounded-sm border border-gray-900 border-t-0">
        <div className="sports-gradient h-12 flex items-center justify-between px-4">
           <span className="text-black font-black uppercase text-[15px] italic tracking-widest leading-none">Register</span>
           <Link href="/">
              <X className="w-5 h-5 text-black" strokeWidth={3} />
           </Link>
        </div>

        <form onSubmit={handleRegister} className="p-8 space-y-6">
              {error && <div className="p-3 bg-[#ca1010]/10 text-red-600 border border-red-100 text-[11px] font-bold uppercase text-center rounded-sm">{error}</div>}
              
              <div className="space-y-1">
                 <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none">Username</label>
                 <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                    <input 
                      type="text" 
                      required
                      value={formData.username}
                      onChange={(e) => setFormData({...formData, username: e.target.value})}
                      className="w-full bg-white border-4 border-orange-500/30 ring-1 ring-orange-500 px-10 py-3 text-sm font-bold focus:outline-none placeholder:text-gray-400 text-black rounded-sm"
                      placeholder="Enter chosen username"
                    />
                 </div>
              </div>

              <div className="space-y-1">
                 <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none">Mobile Number</label>
                 <div className="relative">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                    <input 
                      type="tel" 
                      required
                      value={formData.mobile}
                      onChange={(e) => setFormData({...formData, mobile: e.target.value})}
                      className="w-full bg-white border-4 border-orange-500/30 ring-1 ring-orange-500 px-10 py-3 text-sm font-bold focus:outline-none placeholder:text-gray-400 text-black rounded-sm"
                      placeholder="+91 XXXXX XXXXX"
                    />
                 </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                 <div className="space-y-1">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none">Password</label>
                    <input 
                      type="password" 
                      required
                      value={formData.password}
                      onChange={(e) => setFormData({...formData, password: e.target.value})}
                      className="w-full bg-white border-4 border-orange-500/30 ring-1 ring-orange-500 px-4 py-3 text-sm font-bold focus:outline-none placeholder:text-gray-400 text-black rounded-sm"
                      placeholder="******"
                    />
                 </div>
                 <div className="space-y-1">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none">Confirm</label>
                    <input 
                      type="password" 
                      required
                      value={formData.confirmPassword}
                      onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})}
                      className="w-full bg-white border-4 border-orange-500/30 ring-1 ring-orange-500 px-4 py-3 text-sm font-bold focus:outline-none placeholder:text-gray-400 text-black rounded-sm"
                      placeholder="******"
                    />
                 </div>
              </div>

              <div className="flex items-center gap-2 pt-2">
                 <CheckCircle2 className="w-4 h-4 text-green-500" />
                 <span className="text-[10px] text-gray-500 font-bold uppercase tracking-tight">I agree to the 18+ gambling terms & privacy policy.</span>
              </div>

              <button 
                type="submit"
                className="w-full header-gradient text-black font-black py-4 uppercase tracking-widest text-[14px] rounded-sm shadow-xl active:scale-95 transition-all flex items-center justify-center gap-2 mt-4"
              >
                Create Account <ChevronRight className="w-5 h-5" />
              </button>
           </form>

           <div className="pt-4 border-t border-gray-900 text-center flex flex-col gap-2">
              <div>
                 <span className="text-gray-400 text-[10px] font-bold uppercase">Already have an account?</span>
                 <Link href="/login" className="ml-2 text-orange-500 font-black text-[10px] uppercase hover:underline">Login Here</Link>
              </div>
              <div className="flex items-center justify-center gap-1.5 opacity-40">
                 <span className="text-white font-black italic text-xl tracking-tighter leading-none">STRIKER</span>
                 <span className="text-orange-500 font-bold italic text-xl leading-none">EXCHANGE</span>
              </div>
           </div>
        </div>
      </div>
  );
}
