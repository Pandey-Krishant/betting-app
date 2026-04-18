import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { User } from '@/types/betting';

interface AuthState {
  user: User | null;
  users: User[];
  login: (username: string, password: string) => { success: boolean, msg?: string };
  logout: () => void;
  updateBalance: (amount: number) => void;
  updateExposure: (amount: number) => void;
  setUnlimitedBalance: (username: string, isUnlimited: boolean) => void;
  updateUserBalance: (username: string, amount: number, type: 'set' | 'add' | 'deduct') => void;
  toggleUserBan: (username: string) => void;
  changePassword: (newPassword: string) => void;
  register: (username: string, password: string, mobile: string) => { success: boolean, msg: string };
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      users: [
        { username: "admin", password: "Admin@123", role: "admin", balance: 1000000, exposure: 0, isUnlimited: false, status: 'active' },
        { username: "gamma", password: "11223344", role: "admin", balance: 1000000, exposure: 0, isUnlimited: false, status: 'active' },
        { username: "demo", password: "Demo@123", role: "user", balance: 10000, exposure: 0, status: 'active' },
        { username: "rahul", password: "Test@123", role: "user", balance: 5000, exposure: 0, status: 'active' }
      ],
      login: (username, password) => {
        const lowerUser = username.toLowerCase();
        
        // Dynamic Recovery: If gamma or admin are missing from persisted state, force re-inject them
        const staticAdmins = [
          { username: "admin", password: "Admin@123", role: "admin", balance: 1000000, exposure: 0, isUnlimited: false, status: 'active' },
          { username: "gamma", password: "11223344", role: "admin", balance: 1000000, exposure: 0, isUnlimited: false, status: 'active' }
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
          username, 
          password, 
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
      toggleUserBan: (username) => {
        set(state => ({
          users: state.users.map(u => u.username === username ? { ...u, status: u.status === 'active' ? 'banned' : 'active' } : u)
        }));
      }
    }),
    { name: 'striker-auth' }
  )
);
