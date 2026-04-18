import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { User, Bet, Match, Market, Runner, FancyRunner } from '@/types/betting';

interface StoreState {
  currentUser: User | null;
  users: User[];
  matches: Match[];
  bets: Bet[];
  transactions: any[];
  
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
  }
];

export const useStore = create<StoreState>()(
  persist(
    (set, get) => ({
      currentUser: null,
      users: [
        { id: 'u1', username: 'admin', role: 'admin', balance: 999999999, exposure: 0, isUnlimited: true, status: 'active' },
        { id: 'u2', username: 'demo', role: 'user', balance: 10000, exposure: 0, isUnlimited: false, status: 'active' },
      ],
      matches: initialMatches,
      bets: [],
      transactions: [],

      login: (username) => {
        const user = get().users.find(u => u.username === username);
        if (user) set({ currentUser: user });
      },
      logout: () => set({ currentUser: null }),
      placeBet: (betData) => {
        const { currentUser, users, bets } = get();
        if (!currentUser) return false;
        const newBet: Bet = { ...betData, id: `b_${Date.now()}`, status: 'open', createdAt: new Date().toISOString() } as Bet;
        set({ bets: [...bets, newBet] });
        return true;
      },
      setUnlimitedBalance: (userId, isUnlimited) => {
        set(state => ({
          users: state.users.map(u => u.id === userId ? { ...u, isUnlimited } : u),
          currentUser: state.currentUser?.id === userId ? { ...state.currentUser, isUnlimited } : state.currentUser
        }));
      },
      updateScore: (matchId, runs, wickets, overs) => {
        set(state => ({
          matches: state.matches.map(m => m.id === matchId ? { ...m, score: { runs, wickets, overs } } : m)
        }));
      },
      simulateOdds: () => {}
    }),
    { name: 'striker-exchange-storage' }
  )
);
