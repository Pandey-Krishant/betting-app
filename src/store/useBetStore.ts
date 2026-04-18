import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface Bet {
  id: string;
  userId: string;
  matchId: string;
  eventName: string;
  marketId: string;
  marketName: string;
  selectionId: number;
  selectionName: string;
  type: 'back' | 'lay';
  odds: number;
  stake: number;
  liability: number;
  profit: number;
  status: 'open' | 'won' | 'lost' | 'void';
  createdAt: string;
}

interface BetState {
  openBets: Bet[];
  addBet: (bet: Bet) => void;
  settleBet: (betId: string, status: 'won' | 'lost' | 'void') => void;
}

export const useBetStore = create<BetState>()(
  persist(
    (set) => ({
      openBets: [],
      addBet: (bet) => set((state) => ({ openBets: [...state.openBets, bet] })),
      settleBet: (betId, status) => set((state) => ({
        openBets: state.openBets.map(b => b.id === betId ? { ...b, status } : b)
      })),
    }),
    { name: 'striker-bets' }
  )
);

interface BetSlipState {
  selection: {
    matchId: string;
    eventName: string;
    marketId: string;
    marketName: string;
    selectionId: number;
    selectionName: string;
    type: 'back' | 'lay';
    price: number;
  } | null;
  odds: number;
  stake: string;
  setSelection: (selection: BetSlipState['selection']) => void;
  setOdds: (odds: number) => void;
  setStake: (stake: string) => void;
  clear: () => void;
}

export const useBetSlipStore = create<BetSlipState>((set) => ({
  selection: null,
  odds: 0,
  stake: '',
  setSelection: (selection) => {
    set({ selection, odds: selection?.price || 0, stake: '' });
  },
  setOdds: (odds) => set({ odds }),
  setStake: (stake) => set({ stake }),
  clear: () => set({ selection: null, odds: 0, stake: '' }),
}));
