export interface Price {
  price: number;
  size: number;
}

export interface RunnerOdds {
  selectionId: string | number;
  status: string;
  price: {
    back: Price[];
    lay: Price[];
  };
}

export interface Event {
  _id: string;
  marketId: string;
  marketName: string;
  eventName: string;
  sportId: string;
  sportName: string;
  eventTime: string;
  tournamentName: string;
  isFancy: boolean;
  isBookmakers: boolean;
  isSportsbook: boolean;
  popular?: boolean;
  oddsData: {
    inPlay: boolean;
    totalMatched: number;
    status: string;
    runners: RunnerOdds[];
  };
  runnersData: Record<string, string>;
}

export type BetStatus = 'open' | 'won' | 'lost' | 'void';
export type BetType = 'back' | 'lay';

export interface Bet {
  id: string;
  userId: string;
  matchId: string;
  eventName: string;
  marketId: string;
  marketName: string;
  selectionId: string | number;
  selectionName: string;
  type: BetType;
  odds: number;
  stake: number;
  liability: number;
  profit: number; 
  pnl: number;    
  status: BetStatus;
  createdAt: string;
}

export interface User {
  id?: string;
  username: string;
  password?: string;
  mobile?: string;
  createdAt?: string;
  role: 'user' | 'admin';
  balance: number;
  exposure: number;
  isUnlimited?: boolean;
  status?: 'active' | 'banned';
  transactions?: any[];
}

export interface Transaction {
  id: string;
  username: string;
  type: 'credit' | 'debit';
  amount: number;
  description: string;
  createdAt: string;
  balanceAfter?: number;
}

// Legacy/Admin Market Types
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
