'use client';

import { useState, useEffect } from 'react';
import { getAllStoresMetrics } from '@/services/analytics-service';
import type { SurveyMetricsData } from '@/types/survey-metrics';

export function useAllStoresMetrics() {
  const [data, setData] = useState<Omit<SurveyMetricsData, 'revenue'> | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        setError(null);
        const result = await getAllStoresMetrics();
        setData(result);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load all stores metrics');
        setData(null);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  return {
    data,
    loading,
    error,
  };
}

