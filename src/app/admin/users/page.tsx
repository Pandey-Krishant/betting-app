'use client';

import { useAuthStore } from '@/store/useAuthStore';
import { useState } from 'react';
import { Wallet, X, Gift, InfinityIcon, Search } from 'lucide-react';
import { toast } from 'sonner';
import { useRegisteredUsers } from '@/hooks/useRegisteredUsers';

export default function AdminUsers() {
  const { users, updateUserBalance, toggleUserBan, setUnlimitedBalance, giftCoins } = useAuthStore();
  const { registeredUsers, getTotalRegistered, getNew24h } = useRegisteredUsers();
  const [editingUser, setEditingUser] = useState<string | null>(null);
  const [amount, setAmount] = useState('');
  const [query, setQuery] = useState('');
  const [giftUser, setGiftUser] = useState<string | null>(null);
  const [giftAmount, setGiftAmount] = useState('');

  const handleUpdate = (username: string, type: 'set' | 'add' | 'deduct') => {
    const val = parseFloat(amount);
    if (isNaN(val)) return toast.error('Invalid amount');
    updateUserBalance(username, val, type);
    toast.success('Funds updated successfully');
    setEditingUser(null);
    setAmount('');
  };

const filteredUsers = [...users.filter(u => u.role === 'admin'), ...registeredUsers].filter(u =>
    u.username.toLowerCase().includes(query.toLowerCase())
  );

  const isNewUser = (createdAt?: string) => {
    if (!createdAt) return false;
    const created = new Date(createdAt);
    const now = new Date();
    const hours = (now.getTime() - created.getTime()) / (1000 * 60 * 60);
    return hours < 24;
  };

  const handleGift = () => {
    if (!giftUser) return toast.error('Select user');
    const val = parseFloat(giftAmount);
    if (isNaN(val) || val <= 0) return toast.error('Invalid amount');
    const res = giftCoins(giftUser, val);
    if (!res.success) return toast.error(res.msg || 'Gift failed');
    toast.success('Coins gifted successfully');
    setGiftUser(null);
    setGiftAmount('');
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between pb-4 border-b border-gray-100">
         <h2 className="font-bold text-lg uppercase tracking-widest text-[#223869] flex items-center gap-2">
            Member Management
         </h2>
         <button
           onClick={() => setGiftUser('')}
           className="h-9 px-4 bg-match-inplay text-white rounded-sm text-[11px] font-black uppercase tracking-widest flex items-center gap-2 hover:opacity-95 active:scale-95 transition-all shadow-sm"
         >
           <Gift className="w-4 h-4" /> Gift Coins
         </button>
      </div>

      <div className="py-3 px-4 bg-orange-50 border-y border-orange-200 text-sm">
        <span className="font-black uppercase tracking-widest text-gray-800">Stats: Total Users: <span className="text-orange-500 font-black">{users.length + registeredUsers.length}</span> | Real Registered: <span className="text-match-inplay font-black">{getTotalRegistered()}</span> | New 24h: <span className="text-green-600 font-black">{getNew24h()}</span></span>
      </div>

      <div className="bg-white border border-gray-100 rounded-sm p-3 flex items-center gap-3">
         <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search username..."
              className="w-full bg-gray-50 border border-gray-200 outline-none focus:border-match-name px-9 py-2 rounded-sm text-sm font-bold transition-all"
            />
         </div>
      </div>

      <div className="text-right py-3 px-4 bg-gray-50 border-t border-gray-100">
        <span className="font-black text-gray-600 text-sm uppercase tracking-widest">Total Members: <span className="text-orange-500 font-black text-lg">{users.length}</span></span>
      </div>

      <div className="overflow-x-auto bg-white rounded-sm border border-gray-100">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-50 text-[10px] font-black text-gray-500 uppercase tracking-widest border-b border-gray-100">
              <th className="px-5 py-4 text-left">#</th>
              <th className="px-5 py-4 text-left">Username</th>
              <th className="px-5 py-4 text-left">Mobile</th>
              <th className="px-5 py-4 text-left">Created</th>
              <th className="px-5 py-4 text-left">Balance</th>
              <th className="px-5 py-4 text-left">Exposure</th>
              <th className="px-5 py-4 text-left">Role</th>
              <th className="px-5 py-4 text-left">Status</th>
              <th className="px-5 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50 text-[13px] font-bold">
            {filteredUsers.map((u, i) => (
              <tr key={u.username} className="hover:bg-gray-50/50 transition-colors">
                <td className="px-5 py-4 text-gray-400 font-mono">{i + 1}</td>
                <td className="px-5 py-4">
                  <div className="flex items-center gap-2">
                    <span className="text-black">{u.username}</span>
{u.isUnlimited && <span className="text-[16px] animate-bounce">👑</span>}
                    {isNewUser(u.createdAt) && <span className="ml-2 px-1.5 py-0.5 bg-orange-400 text-black text-[9px] font-black uppercase rounded-sm tracking-widest shadow-sm animate-pulse">NEW</span>}
                  </div>
                </td>
                <td className="px-5 py-4 text-gray-500 text-[12px]">{u.mobile || '-'}</td>
                <td className="px-5 py-4 text-gray-400 text-[11px] whitespace-nowrap">
                  {u.createdAt ? new Date(u.createdAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: '2-digit' }) : '-'}
                </td>
                <td className="px-5 py-4">
                  <span className={`font-black ${u.isUnlimited ? 'text-gold drop-shadow-sm' : 'text-black'}`}>
                    {u.isUnlimited ? '∞' : `₹${u.balance.toLocaleString()}`}
                  </span>
                </td>
                <td className="px-5 py-4 text-pl-minus">₹{u.exposure.toLocaleString()}</td>
                <td className="px-5 py-4 font-black uppercase text-[10px] tracking-widest text-[#223869] italic">{u.role}</td>
                <td className="px-5 py-4">
                   <div className="flex items-center gap-1.5">
                      <div className={`w-1.5 h-1.5 rounded-full ${u.status === 'active' ? 'bg-match-inplay' : 'bg-red-500'}`} />
                      <span className={`text-[11px] font-black uppercase tracking-tight ${u.status === 'active' ? 'text-match-inplay' : 'text-red-500'}`}>
                         {u.status}
                      </span>
                   </div>
                </td>
                <td className="px-5 py-4 text-right">
                  <div className="flex items-center justify-end gap-2">
                    <button
                      onClick={() => setUnlimitedBalance(u.username, !u.isUnlimited)}
                      className={`h-8 px-3 ${u.isUnlimited ? 'bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100' : 'bg-yellow-50 text-yellow-700 border-yellow-100 hover:bg-yellow-100'} border rounded-sm text-[10px] uppercase font-black transition-all flex items-center gap-1.5`}
                      title="Toggle unlimited (∞)"
                    >
                      <InfinityIcon className="w-3.5 h-3.5" /> ∞
                    </button>
                    <button 
                      onClick={() => setEditingUser(u.username)}
                      className="h-8 px-3 bg-blue-50 text-match-name border border-blue-100 hover:bg-blue-100 rounded-sm text-[10px] uppercase font-black transition-all"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => setGiftUser(u.username)}
                      className="h-8 px-3 bg-green-50 text-green-700 border border-green-100 hover:bg-green-100 rounded-sm text-[10px] uppercase font-black transition-all"
                    >
                      Gift
                    </button>
                    <button 
                      onClick={() => { toggleUserBan(u.username); toast.info(`User ${u.status === 'active' ? 'Suspended' : 'Activated'}`); }}
                      className={`h-8 px-3 ${u.status === 'active' ? 'bg-red-50 text-red-600 border-red-100 hover:bg-red-100' : 'bg-green-50 text-green-600 border-green-100 hover:bg-green-100'} rounded-sm text-[10px] uppercase font-black transition-all`}
                    >
                      {u.status === 'active' ? 'Ban' : 'Unban'}
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {editingUser && (
        <div className="fixed inset-0 z-[1100] bg-black/70 flex items-center justify-center p-4">
           <div className="bg-white rounded-sm w-full max-w-[340px] shadow-2xl overflow-hidden animate-in zoom-in duration-200">
              <div className="exchange-gradient p-4 text-white flex items-center justify-between">
                 <h3 className="font-bold text-[14px] uppercase tracking-widest flex items-center gap-2">
                    <Wallet className="w-4 h-4" /> Edit Balance
                 </h3>
                 <button onClick={() => setEditingUser(null)} className="hover:rotate-90 transition-all"><X className="w-5 h-5"/></button>
              </div>
              <div className="p-6 space-y-5">
                 <div className="text-center pb-2">
                    <span className="text-[11px] font-bold text-gray-400 uppercase tracking-widest">Editing User</span>
                    <p className="text-[18px] font-black text-match-name uppercase">{editingUser}</p>
                 </div>
                 <div className="space-y-1.5">
                    <input 
                       type="number" 
                       value={amount}
                       onChange={(e) => setAmount(e.target.value)}
                       className="w-full bg-blue-50 border-2 border-blue-100 p-4 text-[20px] font-black focus:border-[#fd8f3b] focus:bg-white transition-all focus:outline-none rounded-sm text-center"
                       placeholder="0.00"
                       autoFocus
                    />
                 </div>
                 <div className="grid grid-cols-1 gap-2">
                    <button onClick={() => handleUpdate(editingUser!, 'set')} className="bg-[#243a48] text-white font-black py-3 text-[11px] uppercase rounded-sm hover:opacity-95 active:scale-95 transition-all shadow-md">Set Balance</button>
                    <div className="grid grid-cols-2 gap-2">
                        <button onClick={() => handleUpdate(editingUser!, 'add')} className="bg-match-inplay text-white font-black py-3 text-[11px] uppercase rounded-sm hover:opacity-95 active:scale-95 transition-all shadow-md">Add Coins</button>
                        <button onClick={() => handleUpdate(editingUser!, 'deduct')} className="bg-pl-minus text-white font-black py-3 text-[11px] uppercase rounded-sm hover:opacity-95 active:scale-95 transition-all shadow-md">Deduct</button>
                    </div>
                 </div>
              </div>
           </div>
        </div>
      )}

      {giftUser !== null && (
        <div className="fixed inset-0 z-[1100] bg-black/70 flex items-center justify-center p-4">
          <div className="bg-white rounded-sm w-full max-w-[360px] shadow-2xl overflow-hidden animate-in zoom-in duration-200">
            <div className="exchange-gradient p-4 text-white flex items-center justify-between">
              <h3 className="font-bold text-[14px] uppercase tracking-widest flex items-center gap-2">
                <Gift className="w-4 h-4" /> Gift Coins
              </h3>
              <button onClick={() => setGiftUser(null)} className="hover:rotate-90 transition-all">
                <X className="w-5 h-5"/>
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div className="space-y-1">
                <label className="text-[10px] uppercase font-bold tracking-widest text-gray-400">User</label>
                <select
                  value={giftUser}
                  onChange={(e) => setGiftUser(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-200 px-3 py-2 text-[13px] font-bold rounded-sm focus:outline-none focus:border-match-name"
                >
                  <option value="">Select user</option>
                  {users.filter(u => u.role === 'user').map(u => (
                    <option key={u.username} value={u.username}>{u.username}</option>
                  ))}
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] uppercase font-bold tracking-widest text-gray-400">Amount</label>
                <input
                  type="number"
                  value={giftAmount}
                  onChange={(e) => setGiftAmount(e.target.value)}
                  className="w-full bg-blue-50 border-2 border-blue-100 p-4 text-[20px] font-black focus:border-[#fd8f3b] focus:bg-white transition-all focus:outline-none rounded-sm text-center"
                  placeholder="0.00"
                  autoFocus
                />
              </div>

              <div className="grid grid-cols-2 gap-2 pt-2">
                <button
                  onClick={() => setGiftUser(null)}
                  className="py-3 rounded-sm bg-gray-100 text-gray-600 font-black uppercase text-[11px] tracking-widest hover:bg-gray-200 transition-all"
                >
                  Cancel
                </button>
                <button
                  onClick={handleGift}
                  className="py-3 rounded-sm bg-match-inplay text-white font-black uppercase text-[11px] tracking-widest shadow-lg active:scale-95 transition-all"
                >
                  Send Gift
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
