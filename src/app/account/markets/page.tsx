'use client';

import { useAuthStore } from '@/store/useAuthStore';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Activity } from 'lucide-react';

export default function MultiMarketsPage() {
  const { user } = useAuthStore();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    if (!user) router.push('/home');
  }, [user, router]);

  if (!mounted || !user) return null;

  return (
    <div className="flex flex-col min-h-screen pt-[72px] bg-[#ededed]">
      <div className="exchange-gradient px-4 py-3 text-white sticky top-[72px] z-[90]">
        <h1 className="font-bold text-[18px] uppercase tracking-wider flex items-center gap-2">
          <Activity className="w-5 h-5" /> Multi Markets
        </h1>
      </div>

      <div className="container max-w-2xl px-2 sm:px-4 py-6">
        <div className="bg-white border border-gray-200 shadow-sm rounded-sm p-8 text-center text-gray-400 font-bold uppercase tracking-widest text-[11px]">
          Coming soon
        </div>
      </div>
    </div>
  );
}

