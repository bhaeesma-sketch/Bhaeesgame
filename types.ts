
export enum Screen {
  LANDING = 'landing',
  GAMES = 'games',
  STORE = 'store',
  PROFILE = 'profile',
  LEGAL = 'legal'
}

export interface UserState {
  credits: number; // Renamed from balance
  streak: number;
  xp: number;
  wins: number;
  wagered: number;
  lastWin: number;
  hasDeposited: boolean;
  bonusClaimed: boolean;
  genesisClaimed: boolean;
  // Web3 Fields
  isConnected: boolean;
  walletAddress: string | null;
  network: 'TRC20' | 'BTC' | 'EVM' | null;
  provider: 'tronlink' | 'walletconnect' | null;
}

export interface BetHistory {
  game: string;
  user: string;
  bet: number;
  profit: number;
  timestamp: number;
}
