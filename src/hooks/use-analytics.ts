'use client';

import { useState, useEffect } from 'react';
import { getAggregateStats } from '@/services/analytics-service';

export function useAnalytics() {
  const [analyticsData, setAnalyticsData] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        setError(null);
        const data = await getAggregateStats();
        setAnalyticsData(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load analytics data');
        setAnalyticsData(null);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  return {
    analyticsData,
    loading,
    error,
  };
}

