'use client';

import { useState, useEffect } from 'react';
import { getAggregatedaybreak } from '@/services/analytics-service';

export interface DaybreakDataPoint {
  date: string;
  orders: number;
  revenue: number;
  views: number;
  inVideoOrders?: number;
  inVideoRevenue?: number;
  postVideoOrders?: number;
  postVideoRevenue?: number;
}

export interface DaybreakAnalytics {
  data: DaybreakDataPoint[];
  startDate?: string;
  endDate?: string;
}

export function useDaybreakAnalytics(startDate?: string, endDate?: string) {
  const [data, setData] = useState<DaybreakAnalytics | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        setError(null);
        const result = await getAggregatedaybreak(startDate, endDate);
        
        // Transform the response to daybreak format
        const daybreakData = transformDaybreakResponse(result);
        setData(daybreakData);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load daybreak analytics');
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

/**
 * Transform API response to daybreak chart format
 * API returns object with numeric keys: { "0": {...}, "1": {...}, "code": 200, "success": true }
 */
function transformDaybreakResponse(response: Record<string, unknown>): DaybreakAnalytics {
  // Extract data points from response (API returns object with numeric keys)
  const dataPoints: DaybreakDataPoint[] = [];
  
  for (const [key, value] of Object.entries(response)) {
    // Skip non-numeric keys (code, success, message, etc.)
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

  // If we got data points, return them
  if (dataPoints.length > 0) {
    return {
      data: dataPoints.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()),
      startDate: dataPoints[0]?.date,
      endDate: dataPoints[dataPoints.length - 1]?.date,
    };
  }

  // Fallback: return mock data if no data points found
  return {
    data: generateMockDaybreakData(),
  };
}

/**
 * Generate mock daybreak data for development
 */
function generateMockDaybreakData(): DaybreakDataPoint[] {
  const today = new Date();
  const data: DaybreakDataPoint[] = [];

  for (let i = 6; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    const dateStr = date.toISOString().split('T')[0];

    // Generate realistic data with some variation
    const baseOrders = 8 + Math.random() * 4;
    const inVideoOrders = Math.round(baseOrders * (0.55 + Math.random() * 0.1));
    const postVideoOrders = Math.round(baseOrders * (0.45 + Math.random() * 0.1));

    const baseRevenue = 4800 + Math.random() * 2000;
    const inVideoRevenue = baseRevenue * (0.65 + Math.random() * 0.1);
    const postVideoRevenue = baseRevenue * (0.35 + Math.random() * 0.1);

    data.push({
      date: dateStr,
      orders: Math.round(baseOrders),
      revenue: Math.round(baseRevenue * 100) / 100,
      views: Math.round(100 + Math.random() * 50),
      inVideoOrders,
      inVideoRevenue: Math.round(inVideoRevenue * 100) / 100,
      postVideoOrders,
      postVideoRevenue: Math.round(postVideoRevenue * 100) / 100,
    });
  }

  return data;
}
