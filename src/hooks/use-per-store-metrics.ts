'use client';

import { useState, useEffect } from 'react';
import { getStores, getPerStoreMetrics, type PeriodType } from '@/services/analytics-service';
import type { Store, PerStoreMetricsData } from '@/types/survey-metrics';

interface UsePerStoreMetricsReturn {
  stores: Store[];
  storesLoading: boolean;
  data: PerStoreMetricsData | null;
  loading: boolean;
  error: string | null;
}

/**
 * Hook for fetching per store metrics
 * - Fetches stores list on mount
 * - Only fetches metrics when storeId is selected (not null)
 * - Supports period parameter for time range filtering
 */
export function usePerStoreMetrics(
  storeId: string | null,
  period: PeriodType = 'THIS_WEEK'
): UsePerStoreMetricsReturn {
  const [stores, setStores] = useState<Store[]>([]);
  const [storesLoading, setStoresLoading] = useState(true);
  const [data, setData] = useState<PerStoreMetricsData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch stores on mount
  useEffect(() => {
    async function fetchStores() {
      try {
        setStoresLoading(true);
        const result = await getStores();
        setStores(result);
      } catch (err) {
        console.error('Failed to fetch stores:', err);
        setError('Failed to load stores list');
      } finally {
        setStoresLoading(false);
      }
    }
    fetchStores();
  }, []);

  // Fetch metrics ONLY when storeId is selected (not null)
  useEffect(() => {
    async function fetchMetrics() {
      // CRITICAL: Don't fetch if storeId is null
      if (!storeId) {
        setData(null);
        setLoading(false);
        setError(null);
        return;
      }

      try {
        setLoading(true);
        setError(null);
        const result = await getPerStoreMetrics(storeId, period);
        setData(result);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load per store metrics');
        setData(null);
      } finally {
        setLoading(false);
      }
    }

    fetchMetrics();
  }, [storeId, period]);

  return {
    stores,
    storesLoading,
    data,
    loading,
    error,
  };
}
