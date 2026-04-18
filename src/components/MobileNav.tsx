'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Play, Trophy, LayoutGrid, User } from 'lucide-react';

export default function MobileNav() {
  const pathname = usePathname();

  const links = [
    { href: '/home', icon: Home, label: 'Home' },
    { href: '/inplay', icon: Play, label: 'In-Play' },
    { href: '/sports', icon: Trophy, label: 'Sports' },
    { href: '/casino', icon: LayoutGrid, label: 'Casino' },
    { href: '/account', icon: User, label: 'Account' },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 sm:hidden z-[1000] h-[55px] flex shadow-2xl overflow-hidden" style={{ background: 'linear-gradient(-180deg, #243a48 20%, #172732 91%)' }}>
      {links.map((link) => {
        const isActive = pathname.startsWith(link.href);
        const Icon = link.icon;
        return (
          <Link 
            key={link.href} 
            href={link.href}
            className={`flex-1 flex flex-col items-center justify-center gap-1 transition-all relative ${isActive ? '' : 'opacity-70'}`}
          >
            {isActive && (
                <div className="absolute inset-0" style={{ background: 'linear-gradient(-180deg, #32617f 20%, #1f4258 91%)' }} />
            )}
            <Icon className={`w-5 h-5 text-white z-10`} strokeWidth={isActive ? 3 : 2} />
            <span className={`text-[10px] font-bold text-white uppercase tracking-tighter z-10`}>
              {link.label}
            </span>
          </Link>
        );
      })}
    </div>
  );
}
