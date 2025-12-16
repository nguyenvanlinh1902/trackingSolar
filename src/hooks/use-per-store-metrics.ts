'use client';

import { useState } from 'react';
import { getPerStoreMetricsByDomain } from '@/services/analytics-service';
import type { PerStoreMetricsData } from '@/types/survey-metrics';

interface UsePerStoreMetricsReturn {
  data: PerStoreMetricsData | null;
  loading: boolean;
  error: string | null;
  searchByDomain: (domain: string) => Promise<void>;
}

/**
 * Hook for fetching per store metrics by domain
 * - No stores list fetching
 * - Search by domain to fetch metrics
 */
export function usePerStoreMetrics(): UsePerStoreMetricsReturn {
  const [data, setData] = useState<PerStoreMetricsData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const searchByDomain = async (domain: string) => {
    if (!domain.trim()) {
      setError('Please enter a domain');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const result = await getPerStoreMetricsByDomain(domain.trim());
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
