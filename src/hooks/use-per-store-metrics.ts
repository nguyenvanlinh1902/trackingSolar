'use client';

import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { getPerStoreMetricsByDomain } from '@/services/analytics-service';
import type { PerStoreMetricsData } from '@/types/survey-metrics';

interface UsePerStoreMetricsReturn {
  data: PerStoreMetricsData | null;
  loading: boolean;
  error: string | null;
  searchByDomain: (shopId: string, startDate?: string, endDate?: string) => Promise<void>;
}

/**
 * Hook for fetching per store metrics by shop ID using React Query
 * - Search by shop ID to fetch stats
 * - Optional date range filtering
 */
export function usePerStoreMetrics(): UsePerStoreMetricsReturn {
  const [data, setData] = useState<PerStoreMetricsData | null>(null);

  const mutation = useMutation({
    mutationFn: async ({
      shopId,
      startDate,
      endDate,
    }: {
      shopId: string;
      startDate?: string;
      endDate?: string;
    }) => {
      if (!shopId.trim()) {
        throw new Error('Please enter a shop ID');
      }
      return await getPerStoreMetricsByDomain(shopId.trim(), startDate, endDate);
    },
    onSuccess: (result) => {
      setData(result as unknown as PerStoreMetricsData);
    },
    onError: () => {
      setData(null);
    },
  });

  const searchByDomain = async (shopId: string, startDate?: string, endDate?: string) => {
    await mutation.mutateAsync({ shopId, startDate, endDate });
  };

  return {
    data,
    loading: mutation.isPending,
    error: mutation.error?.message ?? null,
    searchByDomain,
  };
}
