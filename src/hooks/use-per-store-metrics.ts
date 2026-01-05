'use client';

import { useState } from 'react';
import { getPerStoreMetricsByDomain } from '@/services/analytics-service';

interface UsePerStoreMetricsReturn {
  data: any | null;
  loading: boolean;
  error: string | null;
  searchByDomain: (shopId: string, startDate?: string, endDate?: string) => Promise<void>;
}

/**
 * Hook for fetching per store metrics by shop ID
 * - Search by shop ID to fetch stats
 * - Optional date range filtering
 */
export function usePerStoreMetrics(): UsePerStoreMetricsReturn {
  const [data, setData] = useState<any | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const searchByDomain = async (shopId: string, startDate?: string, endDate?: string) => {
    if (!shopId.trim()) {
      setError('Please enter a shop ID');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const result = await getPerStoreMetricsByDomain(shopId.trim(), startDate, endDate);
      setData(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load store metrics');
      setData(null);
    } finally {
      setLoading(false);
    }
  };

  return {
    data,
    loading,
    error,
    searchByDomain,
  };
}
