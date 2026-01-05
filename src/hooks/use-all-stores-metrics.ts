'use client';

import { useState, useEffect } from 'react';
import { getAggregateStats } from '@/services/analytics-service';

export function useAllStoresMetrics(startDate?: string, endDate?: string) {
  const [data, setData] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        setError(null);
        const result = await getAggregateStats(startDate, endDate);
        setData(result);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load all stores metrics');
        setData(null);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [startDate, endDate]);

  return {
    data,
    loading,
    error,
  };
}

