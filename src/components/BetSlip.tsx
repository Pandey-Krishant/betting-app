'use client';

import { useState, useEffect } from 'react';
import { useBetSlipStore } from '@/store/useBetStore';
import { useBetStore } from '@/store/useBetStore';
import { useAuthStore } from '@/store/useAuthStore';
import { X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';

export default function BetSlip() {
  const { selection, clearSelection } = useBetSlipStore();
  const addBet = useBetStore(state => state.addBet);
  const { user, updateBalance, updateExposure, addTransaction } = useAuthStore();
  const [stake, setStake] = useState<number>(0);
  const [odds, setOdds] = useState<number>(0);

  useEffect(() => {
    if (selection) {
      setOdds(selection.price);
    }
  }, [selection]);

  if (!selection) return null;

  const isSession = selection.type === 'session';

  // For session bets: Yes = back, No = lay logic
  const pnl = isSession
    ? (selection.isSessionYes ? 1 : -1) * (odds - 1) * stake
    : selection.type === 'back'
      ? (odds - 1) * stake
      : (odds - 1) * stake;

  const handlePlaceBet = () => {
    if (!user) {
      toast.error('Please login to place bet');
      return;
    }
    if (stake <= 0) {
      toast.error('Please enter stake amount');
      return;
    }
    if (!user.isUnlimited && user.balance < stake) {
      toast.error('Insufficient balance');
      return;
    }
    toast.success('Wait for bet confirmation...');
    // Real API integration would go here
    setTimeout(() => {
       const now = new Date().toISOString();
       const betId = `b_${Date.now()}_${Math.random().toString(16).slice(2)}`;

       // Session bets have different liability calc
       const betType = selection.type === 'session'
         ? (selection.isSessionYes ? 'back' : 'lay')
         : selection.type;
       const liability = selection.type === 'session'
         ? (selection.isSessionYes ? (odds - 1) * stake : stake)
         : selection.type === 'lay' ? (odds - 1) * stake : stake;

       addBet({
         id: betId,
         userId: user.username,
         matchId: selection.matchId,
         eventName: selection.eventName,
         marketId: selection.marketId,
         marketName: selection.marketName,
         selectionId: selection.selectionId,
         selectionName: selection.selectionName,
         type: betType,
         odds,
         stake,
         liability,
         profit: selection.type === 'back' ? (odds - 1) * stake : stake,
         pnl: 0,
         status: 'open',
         createdAt: now
       });

       updateExposure(liability);
       if (!user.isUnlimited) {
         updateBalance(-stake);
         addTransaction({
           id: `tx_${betId}`,
           username: user.username,
           type: 'debit',
           amount: stake,
           description: `Bet placed: ${selection.eventName} (${selection.type.toUpperCase()})`,
           createdAt: now,
           balanceAfter: user.balance - stake
         });
       } else {
         addTransaction({
           id: `tx_${betId}`,
           username: user.username,
           type: 'debit',
           amount: stake,
           description: `Bet placed (∞ mode): ${selection.eventName} (${selection.type.toUpperCase()})`,
           createdAt: now,
           balanceAfter: user.balance
         });
       }

       toast.success('Bet Placed Successfully!');
       clearSelection();
    }, 1500);
  };

  return (
    <AnimatePresence mode="wait">
      {selection && (
        <motion.div 
           key={`betslip-${selection.matchId}-${selection.selectionId}`}
           initial={{ opacity: 0, scale: 0.95, y: 10 }}
           animate={{ opacity: 1, scale: 1, y: 0 }}
           exit={{ opacity: 0, scale: 0.95, y: 10 }}
           className="w-full bg-white border-2 border-match-name/20 shadow-2xl rounded-sm overflow-hidden"
        >
           {/* Header with Theme Gradient */}
           <div className="header-gradient px-3 py-2 flex items-center justify-between border-b border-white/10">
              <span className="text-white font-black text-[11px] uppercase tracking-widest italic">Place Bet</span>
              <button 
                onClick={clearSelection}
                className="w-6 h-6 rounded-full bg-black/20 flex items-center justify-center hover:bg-black/40 transition-all"
              >
                 <X className="w-3.5 h-3.5 text-white" />
              </button>
           </div>

           <div className="p-3">
              <div className="flex justify-between items-start mb-3">
                 <div>
                    <div className="text-match-name font-black text-[13px] uppercase tracking-tight">{selection.eventName}</div>
                    <div className="text-[#243a48] font-bold text-[11px] opacity-60 uppercase">
                      {selection.type === 'session' && selection.sessionValue
                        ? `Session: ${selection.selectionName} ${selection.isSessionYes ? '>' : '<'} ${selection.sessionValue}`
                        : selection.marketName}
                    </div>
                 </div>
                 <div className={`px-2 py-0.5 rounded-sm text-[10px] font-black uppercase text-white ${selection.type === 'back' || (selection.type === 'session' && selection.isSessionYes) ? 'bg-back-selected' : 'bg-lay-selected'}`}>
                    {selection.type === 'session' ? (selection.isSessionYes ? 'YES' : 'NO') : selection.type}
                 </div>
              </div>

              <div className="grid grid-cols-2 gap-2 mb-4">
                 <div className="space-y-1">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Odds</label>
                    <input 
                      type="number" 
                      step="0.01"
                      value={odds}
                      onChange={(e) => setOdds(parseFloat(e.target.value))}
                      className="w-full bg-gray-50 border-2 border-gray-100 px-3 py-2 text-sm font-black focus:border-match-name focus:bg-white outline-none transition-all rounded-sm text-black"
                    />
                 </div>
                 <div className="space-y-1">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Stake</label>
                    <input 
                      type="number" 
                      value={stake === 0 ? '' : stake}
                      onChange={(e) => setStake(parseFloat(e.target.value) || 0)}
                      className="w-full bg-gray-50 border-2 border-gray-100 px-3 py-2 text-sm font-black focus:border-match-name focus:bg-white outline-none transition-all rounded-sm text-black"
                      placeholder="0"
                    />
                 </div>
              </div>

              {/* Quick Stakes */}
              <div className="grid grid-cols-4 gap-1 mb-4">
                 {[100, 500, 1000, 5000].map(val => (
                    <button 
                      key={val}
                      onClick={() => setStake(prev => prev + val)}
                      className="bg-gray-100 h-8 text-[10px] font-black text-gray-600 rounded-sm hover:bg-gray-200 active:scale-95 transition-all uppercase"
                    >
                       +{val}
                    </button>
                 ))}
              </div>

              {/* Profit/Liability Info */}
              <div className="bg-gray-50 rounded-sm p-3 mb-4 border border-gray-100">
                 <div className="flex justify-between items-center">
                    <span className="text-[10px] font-black text-gray-400 uppercase">
                       {selection.type === 'back' ? 'Potential Profit' : 'Liability'}
                    </span>
                    <span className={`text-[13px] font-black ${selection.type === 'back' ? 'text-pl-plus' : 'text-pl-minus'}`}>
                       ₹{pnl.toFixed(2)}
                    </span>
                 </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                 <button 
                   onClick={clearSelection}
                   className="py-2.5 rounded-sm bg-gray-100 text-gray-500 font-black uppercase text-[11px] tracking-widest hover:bg-gray-200 transition-all"
                 >
                    Cancel
                 </button>
                 <button 
                   onClick={handlePlaceBet}
                   className="py-2.5 rounded-sm header-gradient text-white font-black uppercase text-[11px] tracking-widest shadow-lg active:scale-95 transition-all"
                 >
                    Place Bet
                 </button>
              </div>
           </div>
        </motion.div>
      )}
      <style jsx global>{`
        .header-gradient {
          background: var(--header-bg);
        }
      `}</style>
    </AnimatePresence>
  );
}
