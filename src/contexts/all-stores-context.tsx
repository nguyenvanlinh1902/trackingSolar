'use client';

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  useMemo,
  type ReactNode,
} from 'react';
import { getAggregateStats } from '@/services/analytics-service';
import type { AllStoresContextState, AllStoresMetricsData } from '@/types/all-stores-metrics';

const AllStoresContext = createContext<AllStoresContextState | null>(null);

interface AllStoresProviderProps {
  children: ReactNode;
  startDate?: string;
  endDate?: string;
}

export function AllStoresProvider({
  children,
  startDate,
  endDate,
}: AllStoresProviderProps) {
  const [data, setData] = useState<AllStoresMetricsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const result = await getAggregateStats(startDate, endDate);
      setData(result as unknown as AllStoresMetricsData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load metrics');
      setData(null);
    } finally {
      setLoading(false);
    }
  }, [startDate, endDate]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const value = useMemo<AllStoresContextState>(
    () => ({
      data,
      loading,
      error,
      refetch: fetchData,
    }),
    [data, loading, error, fetchData]
  );

  return (
    <AllStoresContext.Provider value={value}>
      {children}
    </AllStoresContext.Provider>
  );
}

export function useAllStoresContext(): AllStoresContextState {
  const context = useContext(AllStoresContext);
  if (!context) {
    throw new Error('useAllStoresContext must be used within AllStoresProvider');
  }
  return context;
}

export function useAllStoresContextOptional(): AllStoresContextState | null {
  return useContext(AllStoresContext);
}
