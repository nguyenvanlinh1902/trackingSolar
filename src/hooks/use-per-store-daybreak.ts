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
        
        console.log('[usePerStoreDaybreak] Raw API response:', result);

        const daybreakData = transformPerStoreDaybreakResponse(result as Record<string, unknown>);
        
        console.log('[usePerStoreDaybreak] Transformed data:', daybreakData);
        
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
 * API returns: { code, success, message, data: [...] }
 */
function transformPerStoreDaybreakResponse(response: Record<string, unknown>): DaybreakAnalytics {
  const dataPoints: DaybreakDataPoint[] = [];

  // Handle new API format: { data: [...] }
  const rawData = response.data as Array<Record<string, unknown>> | undefined;

  if (Array.isArray(rawData) && rawData.length > 0) {
    // Group by date (API có thể trả duplicate dates)
    const groupedByDate = new Map<string, DaybreakDataPoint>();

    for (const point of rawData) {
      const date = (point.date as string) || '';
      const existing = groupedByDate.get(date);

      if (existing) {
        // Aggregate values for same date
        existing.orders += (point.totalOrders as number) || 0;
        existing.revenue += (point.totalRevenue as number) || 0;
        existing.inVideoOrders = (existing.inVideoOrders ?? 0) + ((point.inVideoOrders as number) || 0);
        existing.inVideoRevenue = (existing.inVideoRevenue ?? 0) + ((point.inVideoRevenue as number) || 0);
        existing.postVideoOrders = (existing.postVideoOrders ?? 0) + ((point.postVideoOrders as number) || 0);
        existing.postVideoRevenue = (existing.postVideoRevenue ?? 0) + ((point.postVideoRevenue as number) || 0);
      } else {
        groupedByDate.set(date, {
          date,
          orders: (point.totalOrders as number) || 0,
          revenue: (point.totalRevenue as number) || 0,
          views: (point.totalViews as number) || 0,
          inVideoOrders: (point.inVideoOrders as number) || 0,
          inVideoRevenue: (point.inVideoRevenue as number) || 0,
          postVideoOrders: (point.postVideoOrders as number) || 0,
          postVideoRevenue: (point.postVideoRevenue as number) || 0,
        });
      }
    }

    dataPoints.push(...groupedByDate.values());
  } else {
    // Legacy format: numeric keys { "0": {...}, "1": {...} }
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
  }

  if (dataPoints.length > 0) {
    const sorted = dataPoints.sort(
      (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
    );
    return {
      data: sorted,
      startDate: sorted[0]?.date,
      endDate: sorted[sorted.length - 1]?.date,
    };
  }

  // If no data points, return empty dataset (chart will show empty state)
  return { data: [] };
}


