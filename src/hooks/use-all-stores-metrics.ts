'use client';

import { useState, useEffect, useCallback } from 'react';
import { getAggregateStats } from '@/services/analytics-service';
import type { AllStoresMetricsData } from '@/types/all-stores-metrics';

interface UseAllStoresMetricsReturn {
  data: AllStoresMetricsData | null;
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export function useAllStoresMetrics(
  startDate?: string,
  endDate?: string
): UseAllStoresMetricsReturn {
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

  return { data, loading, error, refetch: fetchData };
}

