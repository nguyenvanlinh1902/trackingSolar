'use client';

import { useState, useEffect } from 'react';
import { getAnalytics, type AnalyticsData, type PeriodType } from '@/services/analytics-service';

export function useAnalytics(initialPeriod: PeriodType = 'THIS_WEEK') {
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData | null>(null);
  const [period, setPeriod] = useState<PeriodType>(initialPeriod);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        setError(null);
        const data = await getAnalytics(period);
        setAnalyticsData(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load analytics data');
        setAnalyticsData(null);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [period]);

  return {
    analyticsData,
    period,
    setPeriod,
    loading,
    error,
  };
}

