'use client';

import { useMemo, CSSProperties } from 'react';
import { ResponsiveBar } from '@nivo/bar';
import type { RevenueMetrics } from '@/types/survey-metrics';
import { COLORS, RADIUS, SPACING, formatCurrency } from '@/lib/constants';
import { cardStyle, badgeStyle } from '@/lib/styles';

type RevenueType = 'inVideo' | 'postVideo';

interface RevenueBarChartProps {
  data: RevenueMetrics | null;
  type: RevenueType;
  loading?: boolean;
}

const CHART_COLORS: Record<RevenueType, string> = {
  inVideo: COLORS.success,
  postVideo: COLORS.warning,
};

const TITLES: Record<RevenueType, string> = {
  inVideo: 'In-Video Revenue',
  postVideo: 'Post-Video Revenue',
};

const styles = {
  card: cardStyle as CSSProperties,
  header: {
    marginBottom: `${SPACING.md}px`,
  } as CSSProperties,
  title: {
    fontSize: '14px',
    fontWeight: 600,
    color: COLORS.textPrimary,
    marginBottom: `${SPACING.sm}px`,
  } as CSSProperties,
  valueRow: {
    display: 'flex',
    alignItems: 'center',
    gap: `${SPACING.md}px`,
  } as CSSProperties,
  value: {
    fontSize: '28px',
    fontWeight: 700,
    color: COLORS.textPrimary,
  } as CSSProperties,
  chartWrapper: {
    height: '180px',
  } as CSSProperties,
  emptyState: {
    height: '180px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: COLORS.textMuted,
    backgroundColor: COLORS.gray50,
    borderRadius: RADIUS.md,
  } as CSSProperties,
};

export function RevenueBarChart({ data, type, loading }: RevenueBarChartProps) {
  const chartData = useMemo(() => {
    if (!data?.timeSeries?.length) return [];
    return data.timeSeries.map((d) => ({
      date: d.date.slice(5), // MM-DD
      value: d.value,
    }));
  }, [data?.timeSeries]);

  const color = CHART_COLORS[type];
  const title = TITLES[type];
  const isPositive = (data?.changePercent ?? 0) >= 0;
  const hasData = chartData.length > 0;

  if (loading) {
    return (
      <div style={styles.card}>
        <div style={styles.header}>
          <p style={styles.title}>{title}</p>
        </div>
        <div style={styles.emptyState}>Loading...</div>
      </div>
    );
  }

  return (
    <div style={styles.card}>
      <div style={styles.header}>
        <p style={styles.title}>{title}</p>
        <div style={styles.valueRow}>
          <span style={styles.value}>{formatCurrency(data?.value ?? 0)}</span>
          {data && (
            <span style={badgeStyle(isPositive)}>
              {isPositive ? '↑' : '↓'} {Math.abs(data.changePercent).toFixed(1)}%
            </span>
          )}
        </div>
      </div>

      {hasData ? (
        <div style={styles.chartWrapper}>
          <ResponsiveBar
            data={chartData}
            keys={['value']}
            indexBy="date"
            margin={{ top: 10, right: 10, bottom: 30, left: 50 }}
            padding={0.3}
            colors={[color]}
            axisBottom={{ tickRotation: -45 }}
            axisLeft={{
              tickSize: 0,
              tickPadding: 8,
              format: (v) => `$${v}`,
            }}
            enableLabel={false}
            enableGridY={false}
          />
        </div>
      ) : (
        <div style={styles.emptyState}>No data available</div>
      )}
    </div>
  );
}
