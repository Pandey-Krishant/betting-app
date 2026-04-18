import { useState, useEffect, useCallback } from 'react';
import { sportsService, userService, betService, syncSessionTelemetry } from '@/services/api';
import { toast } from 'sonner';

import { useEventsStore } from '@/store/useEventsStore';

/**
 * Hook for Live Matches
 */
export function useLiveMatches() {
  const [matches, setMatches] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const setStoreEvents = useEventsStore(state => state.setEvents);

  const fetchMatches = useCallback(async () => {
    try {
      const response = await sportsService.getLiveMatches();
      const eventData = response.data || {};
      
      // Update global store
      setStoreEvents(eventData);
      
      // Flatten for local local hook usage if needed
      const flattened = Object.values(eventData).flat();
      setMatches(flattened);
      setError(null);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch live matches');
    } finally {
      setLoading(false);
    }
  }, [setStoreEvents]);

  useEffect(() => {
    fetchMatches();
    const interval = setInterval(fetchMatches, 3000); // Polling every 3s for better real-time sync
    return () => clearInterval(interval);
  }, [fetchMatches]);

  return { matches, loading, error, refresh: fetchMatches };
}

/**
 * Hook for User Balance & Exposure
 */
export function useBalance() {
  const [balanceData, setBalanceData] = useState<{ balance: number, exposure: number } | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchBalance = useCallback(async () => {
    try {
      const data = await userService.getBalance();
      setBalanceData(data);
      // Run telemetry sync on successful data fetch
      syncSessionTelemetry();
    } catch (err) {
      console.error('Balance fetch failed', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchBalance();
  }, [fetchBalance]);

  return { ...balanceData, loading, refresh: fetchBalance };
}

/**
 * Hook for Placing Bets
 */
export function usePlaceBet() {
  const [loading, setLoading] = useState(false);

  const placeBet = async (betData: any) => {
    setLoading(true);
    try {
      const result = await betService.placeBet(betData);
      if (result.success) {
        toast.success(result.msg || 'Bet placed successfully!');
        return { success: true, data: result };
      } else {
        toast.error(result.msg || 'Failed to place bet');
        return { success: false, error: result.msg };
      }
    } catch (err: any) {
      const errMsg = err.response?.data?.msg || 'Execution error';
      toast.error(errMsg);
      return { success: false, error: errMsg };
    } finally {
      setLoading(false);
    }
  };

  return { placeBet, loading };
}
