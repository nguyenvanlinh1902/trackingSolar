'use client';

import { useState, useEffect } from 'react';
import { getPerStoreMetrics } from '@/services/analytics-service';
import type { DaybreakAnalytics, DaybreakDataPoint } from './use-daybreak-analytics';

/**
 * Per-store daybreak analytics hook
 * - Uses /admin/api/v1/analytics/daybreak/shop/:domain endpoint
 * - Returns data formatted for DaybreakChart
 */
export function usePerStoreDaybreak(
  domain: string | null,
  startDate?: string,
  endDate?: string
) {
  const [data, setData] = useState<DaybreakAnalytics | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // No domain selected yet
    if (!domain) {
      setData(null);
      setLoading(false);
      setError(null);
      return;
    }

    async function fetchData() {
      try {
        setLoading(true);
        setError(null);
        const result = await getPerStoreMetrics(domain as string, startDate, endDate);

        const daybreakData = transformPerStoreDaybreakResponse(result as Record<string, unknown>);
        setData(daybreakData);
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : 'Failed to load per-store time series analytics'
        );
        setData(null);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [domain, startDate, endDate]);

  return {
    data,
    loading,
    error,
  };
}

/**
 * Transform per-store daybreak response to chart format
 * API returns object with numeric keys: { "0": {...}, "1": {...}, "code": 200, "success": true }
 */
function transformPerStoreDaybreakResponse(response: Record<string, unknown>): DaybreakAnalytics {
  const dataPoints: DaybreakDataPoint[] = [];

  for (const [key, value] of Object.entries(response)) {
    if (!/^\d+$/.test(key)) continue;

    const point = value as Record<string, unknown>;
    dataPoints.push({
      date: (point.date as string) || '',
      orders: (point.totalOrders as number) || 0,
      revenue: (point.totalRevenue as number) || 0,
      views: (point.totalViews as number) || 0,
      inVideoOrders: (point.inVideoOrders as number) || 0,
      inVideoRevenue: (point.inVideoRevenue as number) || 0,
      postVideoOrders: (point.postVideoOrders as number) || 0,
      postVideoRevenue: (point.postVideoRevenue as number) || 0,
    });
  }

  if (dataPoints.length > 0) {
    return {
      data: dataPoints.sort(
        (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
      ),
      startDate: dataPoints[0]?.date,
      endDate: dataPoints[dataPoints.length - 1]?.date,
    };
  }

  // If no data points, return empty dataset (chart will show empty state)
  return {
    data: [],
  };
}


