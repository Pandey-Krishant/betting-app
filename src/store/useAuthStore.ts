import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Transaction, User } from '@/types/betting';

interface AuthState {
  user: User | null;
  users: User[];
  transactions: Transaction[];
  login: (username: string, password: string) => { success: boolean, msg?: string };
  logout: () => void;
  updateBalance: (amount: number) => void;
  updateExposure: (amount: number) => void;
  addTransaction: (tx: Transaction) => void;
  setUnlimitedBalance: (username: string, isUnlimited: boolean) => void;
  updateUserBalance: (username: string, amount: number, type: 'set' | 'add' | 'deduct') => void;
  giftCoins: (toUsername: string, amount: number) => { success: boolean; msg?: string };
  toggleUserBan: (username: string) => void;
  changePassword: (newPassword: string) => void;
  register: (username: string, password: string, mobile: string) => { success: boolean, msg: string };
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      users: [
        { id: "u_admin", username: "admin", password: "Admin@123", role: "admin", balance: 1000000, exposure: 0, isUnlimited: true, status: 'active', createdAt: new Date().toISOString() },
        { id: "u_gamma", username: "gamma", password: "11223344", role: "admin", balance: 1000000, exposure: 0, isUnlimited: true, status: 'active', createdAt: new Date().toISOString() },
        { id: "u_demo", username: "demo", password: "Demo@123", role: "user", balance: 0, exposure: 0, status: 'active', createdAt: new Date().toISOString() },
        { id: "u_rahul", username: "rahul", password: "Test@123", role: "user", balance: 0, exposure: 0, status: 'active', createdAt: new Date().toISOString() }
      ],
      transactions: [],
      login: (username, password) => {
        const lowerUser = username.toLowerCase();
        
// Dynamic Recovery: If gamma or admin are missing from persisted state, force re-inject them
        const staticAdmins = [
          { id: "u_admin", username: "admin", password: "Admin@123", role: "admin", balance: 1000000, exposure: 0, isUnlimited: true, status: 'active', createdAt: new Date().toISOString() },
          { id: "u_gamma", username: "gamma", password: "11223344", role: "admin", balance: 1000000, exposure: 0, isUnlimited: true, status: 'active', createdAt: new Date().toISOString() }
        ];

        let currentUsers = get().users;
        let needsSync = false;

        staticAdmins.forEach(sa => {
           if (!currentUsers.find(u => u.username.toLowerCase() === sa.username.toLowerCase())) {
              currentUsers.push(sa as User);
              needsSync = true;
           }
        });

        if (needsSync) set({ users: currentUsers });

        const foundUser = currentUsers.find(u => u.username.toLowerCase() === lowerUser && u.password === password);
        
        if (foundUser) {
          if (foundUser.status === 'banned') return { success: false, msg: 'Account suspended' };
          set({ user: foundUser });
          return { success: true };
        }
        return { success: false, msg: 'Invalid username or password' };
      },
      register: (username, password, mobile) => {
        const exists = get().users.find(u => u.username.toLowerCase() === username.toLowerCase());
        if (exists) return { success: false, msg: 'Username already taken' };
        
        const newUser: User = { 
          id: `u_${Date.now()}`,
          username, 
          password, 
          mobile,
          createdAt: new Date().toISOString(),
          role: 'user', 
          balance: 0, 
          exposure: 0, 
          status: 'active' 
        };
        
        set((state) => ({ users: [...state.users, newUser] }));
        return { success: true, msg: 'Registration successful' };
      },
      logout: () => set({ user: null }),
      changePassword: (newPassword) => {
        set((state) => {
          if (!state.user) return state;
          const updatedUsers = state.users.map(u => u.username === state.user?.username ? { ...u, password: newPassword } : u);
          return { 
            users: updatedUsers,
            user: { ...state.user, password: newPassword }
          };
        });
      },
      updateBalance: (amount) => {
        const currentUser = get().user;
        if (!currentUser || currentUser.isUnlimited) return;
        const newBalance = currentUser.balance + amount;
        set((state) => ({
          user: { ...currentUser, balance: newBalance },
          users: state.users.map(u => u.username === currentUser.username ? { ...u, balance: newBalance } : u)
        }));
      },
      updateExposure: (amount) => {
        const currentUser = get().user;
        if (!currentUser) return;
        const newExposure = currentUser.exposure + amount;
        set((state) => ({
          user: { ...currentUser, exposure: newExposure },
          users: state.users.map(u => u.username === currentUser.username ? { ...u, exposure: newExposure } : u)
        }));
      },
      addTransaction: (tx) => set((state) => ({ transactions: [...state.transactions, tx] })),
      setUnlimitedBalance: (username, isUnlimited) => {
        set((state) => {
          const updatedUsers = state.users.map(u => u.username === username ? { ...u, isUnlimited, balance: isUnlimited ? 999999999 : u.balance } : u);
          const updatedUser = state.user?.username === username ? updatedUsers.find(u => u.username === username)! : state.user;
          return { users: updatedUsers, user: updatedUser };
        });
      },
      updateUserBalance: (username, amount, type) => {
        set((state) => {
          const updatedUsers = state.users.map(u => {
            if (u.username !== username) return u;
            let newBal = u.balance;
            if (type === 'set') newBal = amount;
            if (type === 'add') newBal += amount;
            if (type === 'deduct') newBal -= amount;
            return { ...u, balance: newBal };
          });
          const updatedUser = state.user?.username === username ? updatedUsers.find(u => u.username === username)! : state.user;
          return { users: updatedUsers, user: updatedUser };
        });
      },
      giftCoins: (toUsername, amount) => {
        const from = get().user;
        if (!from || from.role !== 'admin') return { success: false, msg: 'Admin only' };
        if (!toUsername) return { success: false, msg: 'Select user' };
        if (!Number.isFinite(amount) || amount <= 0) return { success: false, msg: 'Invalid amount' };
        if (from.username === toUsername) return { success: false, msg: 'Cannot gift to self' };

        const toUser = get().users.find(u => u.username === toUsername);
        if (!toUser) return { success: false, msg: 'User not found' };

        if (!from.isUnlimited && from.balance < amount) return { success: false, msg: 'Insufficient admin balance' };

        const txId = `tx_${Date.now()}_${Math.random().toString(16).slice(2)}`;
        const now = new Date().toISOString();

        set((state) => {
          const users = state.users.map(u => {
            if (u.username === toUsername) return { ...u, balance: u.balance + amount };
            if (u.username === from.username && !from.isUnlimited) return { ...u, balance: u.balance - amount };
            return u;
          });

          const nextFrom = state.user?.username === from.username
            ? users.find(u => u.username === from.username)!
            : state.user;

          const creditBalanceAfter = users.find(u => u.username === toUsername)!.balance;
          const debitBalanceAfter = !from.isUnlimited ? users.find(u => u.username === from.username)!.balance : undefined;

          const creditTx: Transaction = {
            id: `${txId}_cr`,
            username: toUsername,
            type: 'credit',
            amount,
            description: `Coin gift from ${from.username}`,
            createdAt: now,
            balanceAfter: creditBalanceAfter
          };

          const debitTx: Transaction | null = !from.isUnlimited ? {
            id: `${txId}_db`,
            username: from.username,
            type: 'debit',
            amount,
            description: `Gifted coins to ${toUsername}`,
            createdAt: now,
            balanceAfter: debitBalanceAfter
          } : null;

          const transactions: Transaction[] = debitTx
            ? [...state.transactions, creditTx, debitTx]
            : [...state.transactions, creditTx];

          return { users, user: nextFrom, transactions };
        });

        return { success: true };
      },
      toggleUserBan: (username) => {
        set(state => ({
          users: state.users.map(u => u.username === username ? { ...u, status: u.status === 'active' ? 'banned' : 'active' } : u)
        }));
      }
    }),
    { name: 'striker-auth' }
  )
);
