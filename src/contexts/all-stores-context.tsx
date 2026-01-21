'use client';

import { useQuery } from '@tanstack/react-query';
import { getAggregateStats } from '@/services/analytics-service';
import type { AllStoresMetricsData } from '@/types/all-stores-metrics';

interface UseAllStoresQueryOptions {
  startDate?: string;
  endDate?: string;
}

export function useAllStoresQuery(options: UseAllStoresQueryOptions = {}) {
  const { startDate, endDate } = options;

  return useQuery({
    queryKey: ['all-stores-metrics', startDate, endDate],
    queryFn: async () => {
      const result = await getAggregateStats(startDate, endDate);
      return result as unknown as AllStoresMetricsData;
    },
  });
}

// Backward compatibility - keep the old hook name
export function useAllStoresContext() {
  const query = useAllStoresQuery();

  return {
    data: query.data ?? null,
    loading: query.isLoading,
    error: query.error?.message ?? null,
    refetch: query.refetch,
  };
}
