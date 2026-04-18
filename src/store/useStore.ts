import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type Role = 'user' | 'admin';

export interface User {
  id: string;
  username: string;
  password?: string;
  balance: number;
  exposure: number;
  role: Role;
  isUnlimited: boolean;
  isBanned: boolean;
}

export interface Runner {
  id: string;
  name: string;
  backOdds: [number, number, number];
  layOdds: [number, number, number];
  backSize: [number, number, number];
  laySize: [number, number, number];
  pnl: number;
}

export interface FancyRunner {
  id: string;
  name: string;
  noOdds: number;
  yesOdds: number;
  noSize: number;
  yesSize: number;
  minBet: number;
  maxBet: number;
  status: 'open' | 'suspended' | 'ball_running';
}

export interface Market {
  id: string;
  type: 'matchOdds' | 'bookmaker' | 'fancy' | 'sportsbook';
  name: string;
  status: 'open' | 'suspended' | 'settled';
  runners: Runner[];
  fancyRunners?: FancyRunner[];
  result?: string;
  matched?: number;
}

export interface Match {
  id: string;
  name: string;
  teamA: string;
  teamB: string;
  format: string;
  status: 'inplay' | 'upcoming' | 'completed';
  dateTime: string;
  score?: {
    runs: string;
    wickets: string;
    overs: string;
  };
  markets: Market[];
}

export type BetStatus = 'open' | 'won' | 'lost' | 'void';
export type BetType = 'back' | 'lay';

export interface Bet {
  id: string;
  userId: string;
  matchId: string;
  marketId: string;
  runnerId: string;
  type: BetType;
  odds: number;
  stake: number;
  liability: number;
  profit: number;
  status: BetStatus;
  createdAt: string;
}

interface StoreState {
  currentUser: User | null;
  users: User[];
  matches: Match[];
  bets: Bet[];
  
  // Actions
  login: (username: string) => void;
  logout: () => void;
  placeBet: (bet: Omit<Bet, 'id' | 'status' | 'createdAt'>) => boolean;
  setUnlimitedBalance: (userId: string, isUnlimited: boolean) => void;
  updateScore: (matchId: string, runs: string, wickets: string, overs: string) => void;
  simulateOdds: () => void;
}

const mockDate = new Date().toISOString();
const mockTomorrow = new Date(Date.now() + 86400000).toISOString();

const generateRunners = (teams: string[]): Runner[] => {
  return teams.map((team, i) => ({
    id: `r_${i}_${Math.random()}`,
    name: team,
    backOdds: [1.98, 1.99, 2.00],
    layOdds: [2.02, 2.03, 2.04],
    backSize: [1500, 2500, 5000],
    laySize: [1200, 2200, 4800],
    pnl: 0,
  }));
};

const generateFancy = (): FancyRunner[] => {
  return [
    { id: 'f1', name: '1st Inning 6 Over Runs', noOdds: 42, yesOdds: 43, noSize: 100, yesSize: 100, minBet: 100, maxBet: 25000, status: 'open' },
    { id: 'f2', name: 'Virat Kohli Runs', noOdds: 35, yesOdds: 36, noSize: 100, yesSize: 100, minBet: 100, maxBet: 10000, status: 'open' },
  ];
};

const initialMatches: Match[] = [
  {
    id: 'm1',
    name: 'India vs Australia',
    teamA: 'India',
    teamB: 'Australia',
    format: 'T20I',
    status: 'inplay',
    dateTime: mockDate,
    score: { runs: '156', wickets: '3', overs: '14.2' },
    markets: [
      { id: 'm1_mo', type: 'matchOdds', name: 'Match Odds', status: 'open', runners: generateRunners(['India', 'Australia']), matched: 23000000 },
      { id: 'm1_bm', type: 'bookmaker', name: 'Bookmaker', status: 'open', runners: generateRunners(['India', 'Australia']) },
      { id: 'm1_fy', type: 'fancy', name: 'Fancy Bets', status: 'open', runners: [], fancyRunners: generateFancy() },
    ]
  },
  {
    id: 'm2',
    name: 'Mumbai Indians vs CSK',
    teamA: 'Mumbai Indians',
    teamB: 'Chennai Super Kings',
    format: 'IPL',
    status: 'upcoming',
    dateTime: mockTomorrow,
    markets: [
      { id: 'm2_mo', type: 'matchOdds', name: 'Match Odds', status: 'open', runners: generateRunners(['Mumbai Indians', 'CSK']), matched: 0 },
    ]
  }
];

export const useStore = create<StoreState>()(
  persist(
    (set, get) => ({
      currentUser: null,
      users: [
        { id: 'u1', username: 'admin', role: 'admin', balance: 999999999, exposure: 0, isUnlimited: true, isBanned: false },
        { id: 'u2', username: 'demo', role: 'user', balance: 10000, exposure: 0, isUnlimited: false, isBanned: false },
      ],
      matches: initialMatches,
      bets: [],

      login: (username) => {
        const user = get().users.find(u => u.username === username);
        if (user) set({ currentUser: user });
      },
      
      logout: () => set({ currentUser: null }),

      placeBet: (betData) => {
        const { currentUser, users, bets } = get();
        if (!currentUser) return false;

        if (!currentUser.isUnlimited && currentUser.balance < betData.liability) {
          return false;
        }

        const newBet: Bet = {
          ...betData,
          id: `b_${Date.now()}`,
          status: 'open',
          createdAt: new Date().toISOString(),
        };

        const updatedBalance = currentUser.isUnlimited ? currentUser.balance : currentUser.balance - betData.liability;
        const updatedExposure = currentUser.exposure + betData.liability;

        set({
          bets: [...bets, newBet],
          currentUser: { ...currentUser, balance: updatedBalance, exposure: updatedExposure },
          users: users.map(u => u.id === currentUser.id ? { ...u, balance: updatedBalance, exposure: updatedExposure } : u)
        });

        return true;
      },

      setUnlimitedBalance: (userId, isUnlimited) => {
        set(state => ({
          users: state.users.map(u => u.id === userId ? { ...u, isUnlimited, balance: isUnlimited ? 999999999 : u.balance } : u),
          currentUser: state.currentUser?.id === userId ? { ...state.currentUser, isUnlimited, balance: isUnlimited ? 999999999 : state.currentUser.balance } : state.currentUser
        }));
      },

      updateScore: (matchId, runs, wickets, overs) => {
        set(state => ({
          matches: state.matches.map(m => m.id === matchId ? { ...m, score: { runs, wickets, overs } } : m)
        }));
      },

      simulateOdds: () => {
        set(state => ({
          matches: state.matches.map(m => {
            if (m.status !== 'inplay') return m;
            return {
              ...m,
              markets: m.markets.map(mk => ({
                ...mk,
                runners: mk.runners.map(r => ({
                  ...r,
                  backOdds: r.backOdds.map(o => +(o + (Math.random() * 0.04 - 0.02)).toFixed(2)) as [number, number, number],
                  layOdds: r.layOdds.map(o => +(o + (Math.random() * 0.04 - 0.02)).toFixed(2)) as [number, number, number],
                }))
              }))
            };
          })
        }));
      }
    }),
    {
      name: 'striker-exchange-storage',
    }
  )
);
