'use client';

import { useAuthStore } from '@/store/useAuthStore';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Wallet as WalletIcon, ArrowUpRight, ArrowDownRight, InfinityIcon } from 'lucide-react';
import { motion } from 'framer-motion';
import { toast } from 'sonner';

export default function Wallet() {
  const { user: currentUser, transactions } = useAuthStore();
  const router = useRouter();

  useEffect(() => {
    if (!currentUser) router.push('/login');
  }, [currentUser, router]);

  if (!currentUser) return null;

  const userTransactions = transactions.filter(t => t.username === currentUser.username).reverse();

  const handleAddFunds = () => {
    toast.success('Addition of funds initiated.', { description: 'Processing via secure payment gateway...' });
  };

  return (
    <div className="container px-4 py-8 max-w-4xl mx-auto space-y-8">
      <h1 className="font-heading text-4xl mb-6">Wallet</h1>

      {/* Balance Card */}
      <Card className="bg-[#161616] border border-[#2A2A2A] relative overflow-hidden rounded-sm">
        {currentUser.isUnlimited && <div className="absolute inset-0 bg-gold/5 animate-pulse" />}
        <CardContent className="p-8 flex flex-col md:flex-row items-center justify-between gap-6 relative z-10">
          <div className="flex items-center gap-6">
            <div className={`w-16 h-16 rounded-full flex items-center justify-center ${currentUser.isUnlimited ? 'bg-gold/20' : 'bg-white/10'}`}>
              <WalletIcon className={`w-8 h-8 ${currentUser.isUnlimited ? 'text-gold' : 'text-white'}`} />
            </div>
            <div>
              <p className="text-[10px] uppercase font-bold tracking-widest text-gray-500 mb-1">Available Balance</p>
              {currentUser.isUnlimited ? (
                <div className="flex items-center gap-2">
                  <motion.div animate={{ rotate: [0, 5, -5, 0] }} transition={{ repeat: Infinity, duration: 2 }}>
                    <InfinityIcon className="w-10 h-10 text-gold drop-shadow-[0_0_8px_rgba(255,184,0,0.8)]" />
                  </motion.div>
                  <span className="font-heading text-4xl font-bold tracking-widest text-gold drop-shadow-[0_0_8px_rgba(255,184,0,0.8)]">UNLIMITED</span>
                </div>
              ) : (
                <span className="font-heading text-5xl font-bold tracking-widest">₹{currentUser.balance.toLocaleString()}</span>
              )}
            </div>
          </div>
          
          <div className="flex flex-col gap-3 w-full md:w-auto">
            <Button onClick={handleAddFunds} className="w-full md:w-48 bg-primary text-black font-bold uppercase tracking-widest hover:bg-green-500 rounded-sm h-12">
              Deposit
            </Button>
            <Button variant="outline" className="w-full md:w-48 border-[#2A2A2A] text-white hover:bg-white/5 uppercase tracking-widest text-xs font-bold rounded-sm h-12" disabled>
              Withdraw (KYC REQ)
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Transactions */}
      <div>
        <h3 className="font-heading text-2xl font-bold mb-4 uppercase tracking-widest">Transaction History</h3>
        <Card className="bg-[#161616] border-[#2A2A2A] rounded-sm">
           <div className="overflow-x-auto w-full">
             <table className="w-full text-sm text-left text-gray-400">
               <thead className="text-[10px] text-gray-500 uppercase bg-[#0D0D0D] border-b border-[#2A2A2A]">
                 <tr>
                   <th className="px-4 py-3 font-medium">Date</th>
                   <th className="px-4 py-3 font-medium">Description</th>
                   <th className="px-4 py-3 font-medium text-right">Amount</th>
                   <th className="px-4 py-3 font-medium text-right">Balance After</th>
                 </tr>
               </thead>
               <tbody>
                 {userTransactions.length === 0 ? (
                   <tr><td colSpan={4} className="text-center py-8">No transactions yet.</td></tr>
                 ) : userTransactions.map((tx) => (
                   <tr key={tx.id} className="border-b border-[#2A2A2A] hover:bg-white/5 transition-colors">
                     <td className="px-4 py-3 whitespace-nowrap">
                       <div className="font-bold text-white">{new Date(tx.createdAt).toISOString().split('T')[0]}</div>
                       <div className="text-[10px]">{new Date(tx.createdAt).toISOString().substring(11, 16)}</div>
                     </td>
                     <td className="px-4 py-3">
                       <span className="font-medium text-white">{tx.note || tx.type.replace('_', ' ').toUpperCase()}</span>
                     </td>
                     <td className="px-4 py-3 text-right">
                       <div className="flex items-center justify-end gap-1 font-bold">
                         {tx.amount === 999999999 ? (
                           <span className="text-gold flex items-center"><InfinityIcon className="w-4 h-4 mr-1"/> Grant</span>
                         ) : tx.type === 'bet_place' || tx.type === 'withdrawal' ? (
                           <span className="text-lay flex items-center">-₹{tx.amount}</span>
                         ) : (
                           <span className="text-back flex items-center">+₹{tx.amount}</span>
                         )}
                       </div>
                     </td>
                     <td className="px-4 py-3 text-right font-medium">
                        {tx.balanceAfter === 999999999 ? <span className="text-gold font-bold">∞</span> : `₹${tx.balanceAfter}`}
                     </td>
                   </tr>
                 ))}
               </tbody>
             </table>
           </div>
        </Card>
      </div>
    </div>
  );
}

