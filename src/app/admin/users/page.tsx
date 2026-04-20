'use client';

import { useAuthStore } from '@/store/useAuthStore';
import { useState, useEffect } from 'react';
import { Wallet, X, InfinityIcon, Search } from 'lucide-react';
import { toast } from 'sonner';

interface DbUser {
  username: string;
  mobile?: string;
  role: 'user' | 'admin';
  balance: number;
  exposure: number;
  isUnlimited: boolean;
  status: 'active' | 'banned';
  createdAt?: string;
}

export default function AdminUsers() {
  const { user: _adminUser, users: storeUsers, updateUserBalance, toggleUserBan, setUnlimitedBalance } = useAuthStore();
  const [dbUsers, setDbUsers] = useState<DbUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingUser, setEditingUser] = useState<string | null>(null);
  const [amount, setAmount] = useState('');
  const [query, setQuery] = useState('');

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const r = await fetch('/api/users', { credentials: 'include' });
      const d = await r.json();
      if (d.success) {
        // Only give unlimited to admins from database, users get 0 unless admin edits
        const usersWithDefaults = d.data.map((u: DbUser) => ({
          ...u,
          // Users from DB, only admin gets unlimited by default
          isUnlimited: u.role === 'admin'
        }));
        setDbUsers(usersWithDefaults);
      }
    } catch (e) { console.error(e); }
    setLoading(false);
  };
  useEffect(() => { fetchUsers(); }, []);

  // Sync balance from DB to store when gift/update happens
  const handleUpdate = async (username: string, type: 'set' | 'add' | 'deduct') => {
    const val = parseFloat(amount);
    if (isNaN(val)) return toast.error('Invalid amount');

    // Update in store first
    updateUserBalance(username, val, type);

    // Also save to database
    try {
      const res = await fetch('/api/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: username.toLowerCase(), amount: val, type }),
        credentials: 'include'
      });
      const data = await res.json();
      if (!data.success) {
        console.error('DB error:', data.msg);
      }
    } catch (e) { console.error('DB sync error:', e); }

    toast.success('Funds updated successfully');
    setEditingUser(null);
    setAmount('');
    fetchUsers(); // Refresh from DB
  };

  const filteredUsers = dbUsers.filter(u =>
    u.username.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between pb-4 border-b border-gray-100">
         <h2 className="font-bold text-lg uppercase tracking-widest text-[#223869] flex items-center gap-2">
            Member Management
         </h2>
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
    </div>
  );
}
