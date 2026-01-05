'use client';

import { useState, useMemo } from 'react';
import { ResponsiveLine } from '@nivo/line';
import type { DaybreakAnalytics } from '@/hooks/use-daybreak-analytics';
import { COLORS, RADIUS, SPACING, formatDate } from '@/lib/constants';
import { cardStyle } from '@/lib/styles';

interface DaybreakChartProps {
  data: DaybreakAnalytics | null;
  loading: boolean;
  onDateRangeChange?: (startDate: string, endDate: string) => void;
}

const METRIC_COLORS = {
  orders: '#3b82f6',
  revenue: '#10b981',
  views: '#8b5cf6',
  inVideoOrders: '#f59e0b',
  postVideoOrders: '#ec4899',
} as const;

export function DaybreakChart({ data, loading, onDateRangeChange }: DaybreakChartProps) {
  const [selectedMetrics, setSelectedMetrics] = useState<string[]>(['orders', 'revenue', 'views']);
  const [dateRange, setDateRange] = useState<{ start: string; end: string }>(() => {
    const today = new Date();
    const sevenDaysAgo = new Date(today);
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    return {
      start: sevenDaysAgo.toISOString().split('T')[0],
      end: today.toISOString().split('T')[0],
    };
  });

  const lineChartData = useMemo(() => {
    if (!data?.data || data.data.length === 0) return [];

    const metrics = [
      { id: 'orders', label: 'Orders', color: METRIC_COLORS.orders, key: 'orders' as const },
      { id: 'revenue', label: 'Revenue ($)', color: METRIC_COLORS.revenue, key: 'revenue' as const },
      { id: 'views', label: 'Views', color: METRIC_COLORS.views, key: 'views' as const },
      { id: 'inVideoOrders', label: 'In-Video Orders', color: METRIC_COLORS.inVideoOrders, key: 'inVideoOrders' as const },
      { id: 'postVideoOrders', label: 'Post-Video Orders', color: METRIC_COLORS.postVideoOrders, key: 'postVideoOrders' as const },
    ];

    return metrics
      .filter((metric) => selectedMetrics.includes(metric.id))
      .map((metric) => ({
        id: metric.label,
        color: metric.color,
        data: data.data.map((point) => ({
          x: point.date,
          y: point[metric.key] || 0,
        })),
      }));
  }, [data, selectedMetrics]);

  const handleMetricToggle = (metricId: string) => {
    setSelectedMetrics((prev) =>
      prev.includes(metricId)
        ? prev.filter((id) => id !== metricId)
        : [...prev, metricId]
    );
  };

  const handleDateChange = (field: 'start' | 'end', value: string) => {
    const newRange = { ...dateRange, [field]: value };
    setDateRange(newRange);
    if (onDateRangeChange) {
      onDateRangeChange(newRange.start, newRange.end);
    }
  };

  const hasData = lineChartData.length > 0 && lineChartData.some((series) => series.data.length > 0);

  return (
    <div style={cardStyle}>
      <div style={{ marginBottom: `${SPACING.lg}px` }}>
        <h3
          style={{
            fontSize: '16px',
            fontWeight: 600,
            color: COLORS.textPrimary,
            marginBottom: `${SPACING.md}px`,
          }}
        >
          Time Series Analysis (Daybreak)
        </h3>

        {/* Date Range Filters */}
        <div style={{ display: 'flex', gap: `${SPACING.md}px`, marginBottom: `${SPACING.md}px` }}>
          <div>
            <label
              htmlFor="start-date"
              style={{
                display: 'block',
                fontSize: '12px',
                color: COLORS.textSecondary,
                marginBottom: '4px',
                fontWeight: 500,
              }}
            >
              Start Date
            </label>
            <input
              id="start-date"
              type="date"
              value={dateRange.start}
              onChange={(e) => handleDateChange('start', e.target.value)}
              style={{
                padding: '8px 12px',
                borderRadius: RADIUS.md,
                border: `1px solid ${COLORS.border}`,
                fontSize: '14px',
                fontFamily: 'inherit',
              }}
            />
          </div>
          <div>
            <label
              htmlFor="end-date"
              style={{
                display: 'block',
                fontSize: '12px',
                color: COLORS.textSecondary,
                marginBottom: '4px',
                fontWeight: 500,
              }}
            >
              End Date
            </label>
            <input
              id="end-date"
              type="date"
              value={dateRange.end}
              onChange={(e) => handleDateChange('end', e.target.value)}
              style={{
                padding: '8px 12px',
                borderRadius: RADIUS.md,
                border: `1px solid ${COLORS.border}`,
                fontSize: '14px',
                fontFamily: 'inherit',
              }}
            />
          </div>
        </div>

        {/* Metric Toggles */}
        <div style={{ display: 'flex', gap: `${SPACING.sm}px`, flexWrap: 'wrap' }}>
          {[
            { id: 'orders', label: 'Orders', color: METRIC_COLORS.orders },
            { id: 'revenue', label: 'Revenue', color: METRIC_COLORS.revenue },
            { id: 'views', label: 'Views', color: METRIC_COLORS.views },
            { id: 'inVideoOrders', label: 'In-Video Orders', color: METRIC_COLORS.inVideoOrders },
            { id: 'postVideoOrders', label: 'Post-Video Orders', color: METRIC_COLORS.postVideoOrders },
          ].map((metric) => (
            <button
              key={metric.id}
              type="button"
              onClick={() => handleMetricToggle(metric.id)}
              style={{
                padding: '6px 12px',
                fontSize: '12px',
                borderRadius: RADIUS.md,
                border: `1px solid ${selectedMetrics.includes(metric.id) ? metric.color : COLORS.border}`,
                backgroundColor: selectedMetrics.includes(metric.id) ? metric.color + '15' : 'transparent',
                color: selectedMetrics.includes(metric.id) ? metric.color : COLORS.textSecondary,
                cursor: 'pointer',
                fontWeight: 500,
                transition: 'all 0.2s',
              }}
            >
              {metric.label}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div
          style={{
            height: '350px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: COLORS.textMuted,
          }}
        >
          Loading time series data...
        </div>
      ) : hasData ? (
        <div style={{ height: '350px' }}>
          <ResponsiveLine
            data={lineChartData}
            margin={{ top: 20, right: 24, bottom: 50, left: 60 }}
            xScale={{ type: 'point' }}
            yScale={{ type: 'linear', min: 'auto', max: 'auto', stacked: false }}
            axisBottom={{
              tickRotation: -45,
              format: (value) => (value ? formatDate(String(value)) : ''),
            }}
            axisLeft={{
              tickSize: 0,
              tickPadding: 8,
            }}
            colors={(series) => series.color as string}
            lineWidth={2}
            pointSize={6}
            pointBorderWidth={2}
            useMesh
            enableGridX={false}
            legends={[
              {
                anchor: 'top',
                direction: 'row',
                justify: false,
                translateX: 0,
                translateY: -20,
                itemsSpacing: 16,
                itemDirection: 'left-to-right',
                itemWidth: 120,
                itemHeight: 20,
                itemOpacity: 0.9,
                symbolSize: 10,
                symbolShape: 'circle',
              },
            ]}
          />
        </div>
      ) : (
        <div
          style={{
            height: '350px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: COLORS.textMuted,
            fontSize: '14px',
            backgroundColor: COLORS.gray50,
            borderRadius: RADIUS.md,
          }}
        >
          No time series data available
        </div>
      )}
    </div>
  );
}
