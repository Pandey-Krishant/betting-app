import type { Metadata } from 'next';
import { Inter, Rajdhani } from 'next/font/google';
import './globals.css';
import { Toaster } from '@/components/ui/sonner';
import Navbar from '@/components/Navbar';
import MobileNav from '@/components/MobileNav';
import AuthCheck from '@/components/AuthCheck';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });
const rajdhani = Rajdhani({ subsets: ['latin'], weight: ['500', '600', '700'], variable: '--font-rajdhani' });

export const metadata: Metadata = {
  title: '20wickets | India’s Most Trusted Betting Exchange',
  description: 'Trade sports odds in real-time. Peer-to-peer betting exchange.',
  icons: {
    icon: 'https://20wickets.com/api/users/images/theme-1709701978646-t20exch arrow.ico',
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} ${rajdhani.variable} font-sans bg-[#ededed] text-black min-h-screen antialiased flex flex-col`}>
        <Navbar />
        <main className="flex-1 flex flex-col w-full overflow-x-hidden">
          <AuthCheck>
             {children}
          </AuthCheck>
        </main>
        <MobileNav />
        <Toaster position="top-right" />
      </body>
    </html>
  );
}
