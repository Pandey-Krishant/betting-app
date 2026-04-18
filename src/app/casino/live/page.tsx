'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ChevronLeft, Maximize2, RefreshCw, X, Loader2 } from 'lucide-react';
import Link from 'next/link';

export default function LiveCasinoIframe() {
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  return (
    <div className="fixed inset-0 z-[2000] bg-black flex flex-col">
      {/* Premium Header for the Iframe Shell */}
      <div className="header-gradient h-[50px] flex items-center justify-between px-4 shadow-xl border-b border-white/10">
        <div className="flex items-center gap-3">
           <button 
             onClick={() => router.back()}
             className="w-8 h-8 rounded-full bg-black/20 flex items-center justify-center hover:bg-black/40 transition-all"
           >
              <ChevronLeft className="w-5 h-5 text-white" />
           </button>
           <div>
              <h1 className="text-white font-black uppercase text-[12px] italic tracking-tighter leading-none">Live Mini Casino</h1>
              <p className="text-[9px] text-white/50 font-bold uppercase tracking-widest mt-0.5">Partner Integration</p>
           </div>
        </div>

        <div className="flex items-center gap-2">
           <button onClick={() => window.location.reload()} className="w-8 h-8 flex items-center justify-center text-white/70 hover:text-white">
              <RefreshCw className="w-4 h-4" />
           </button>
           <button 
             onClick={() => router.push('/casino')}
             className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center hover:bg-red-600 transition-all ml-2"
           >
              <X className="w-4 h-4 text-white" />
           </button>
        </div>
      </div>

      <div className="flex-1 relative bg-[#0d0d0d]">
        {loading && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/80 z-10">
             <Loader2 className="w-10 h-10 text-orange-500 animate-spin mb-4" />
             <span className="text-white font-black text-xs uppercase tracking-[0.3em]">Connecting to Live Tables...</span>
          </div>
        )}
        
        <iframe 
          src="https://minicasino.ludoexchange.com/home/live"
          className="w-full h-full border-none"
          onLoad={() => setLoading(false)}
          allow="autoplay; fullscreen"
        />
      </div>

      <style jsx global>{`
        .header-gradient {
          background: linear-gradient(-180deg, #fd8f3b 0%, #fd3523 100%);
        }
      `}</style>
    </div>
  );
}
