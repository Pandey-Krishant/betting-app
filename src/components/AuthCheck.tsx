'use client';

import { useAuthStore } from '@/store/useAuthStore';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

const PUBLIC_ROUTES = ['/', '/login', '/register'];

export default function AuthCheck({ children }: { children: React.ReactNode }) {
  const { user } = useAuthStore();
  const router = useRouter();
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;

    const isPublicRoute = PUBLIC_ROUTES.includes(pathname);
    
    if (!user && !isPublicRoute) {
      router.replace('/');
    }

    if (user && isPublicRoute) {
      router.replace('/home');
    }
  }, [user, pathname, router, mounted]);

  // Prevent flash of protected content
  if (!mounted) return null;
  
  const isPublicRoute = PUBLIC_ROUTES.includes(pathname);
  if (!user && !isPublicRoute) return null;

  return <>{children}</>;
}
