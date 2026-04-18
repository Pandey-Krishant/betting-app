'use client';

import { useAuthStore } from '@/store/useAuthStore';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { User as UserIcon } from 'lucide-react';

export default function ProfilePage() {
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
          <UserIcon className="w-5 h-5" /> My Profile
        </h1>
      </div>

      <div className="container max-w-2xl px-2 sm:px-4 py-6 space-y-4">
        <div className="bg-white border border-gray-200 shadow-sm rounded-sm p-5 space-y-3">
          <div className="flex justify-between text-[12px] font-bold uppercase tracking-widest text-gray-400">
            <span>Username</span>
            <span className="text-black">{user.username}</span>
          </div>
          <div className="flex justify-between text-[12px] font-bold uppercase tracking-widest text-gray-400">
            <span>Role</span>
            <span className="text-black">{user.role}</span>
          </div>
          <div className="flex justify-between text-[12px] font-bold uppercase tracking-widest text-gray-400">
            <span>Mobile</span>
            <span className="text-black">{user.mobile || '-'}</span>
          </div>
          <div className="flex justify-between text-[12px] font-bold uppercase tracking-widest text-gray-400">
            <span>Created</span>
            <span className="text-black">
              {user.createdAt ? new Date(user.createdAt).toLocaleString('en-GB') : '-'}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

