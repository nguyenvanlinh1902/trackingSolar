'use client';

import { useMemo, CSSProperties } from 'react';
import { ResponsiveLine } from '@nivo/line';
import type { MetricWithTimeSeries } from '@/types/survey-metrics';
import { COLORS, RADIUS, SPACING } from '@/lib/constants';
import { cardStyle, badgeStyle } from '@/lib/styles';

interface CVRChartProps {
  data: MetricWithTimeSeries | null;
  loading?: boolean;
}

const CHART_COLOR = '#EC4899'; // Pink

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

export function CVRChart({ data, loading }: CVRChartProps) {
  const lineData = useMemo(() => {
    if (!data?.timeSeries?.length) return [];
    return [
      {
        id: 'CVR',
        color: CHART_COLOR,
        data: data.timeSeries.map((d) => ({ x: d.date.slice(5), y: d.value })),
      },
    ];
  }, [data?.timeSeries]);

  const isPositive = (data?.changePercent ?? 0) >= 0;
  const hasData = lineData.length > 0 && lineData[0].data.length > 0;

  if (loading) {
    return (
      <div style={styles.card}>
        <div style={styles.header}>
          <p style={styles.title}>Tỷ lệ chuyển đổi (CVR)</p>
        </div>
        <div style={styles.emptyState}>Loading...</div>
      </div>
    );
  }

  return (
    <div style={styles.card}>
      <div style={styles.header}>
        <p style={styles.title}>Tỷ lệ chuyển đổi (CVR)</p>
        <div style={styles.valueRow}>
          <span style={styles.value}>{(data?.value ?? 0).toFixed(2)}%</span>
          {data && (
            <span style={badgeStyle(isPositive)}>
              {isPositive ? '↑' : '↓'} {Math.abs(data.changePercent).toFixed(1)}%
            </span>
          )}
        </div>
      </div>

      {hasData ? (
        <div style={styles.chartWrapper}>
          <ResponsiveLine
            data={lineData}
            margin={{ top: 10, right: 10, bottom: 30, left: 40 }}
            xScale={{ type: 'point' }}
            yScale={{ type: 'linear', min: 'auto', max: 'auto' }}
            axisBottom={{ tickRotation: -45 }}
            axisLeft={{ tickSize: 0, tickPadding: 8 }}
            colors={[CHART_COLOR]}
            lineWidth={2}
            pointSize={4}
            pointBorderWidth={2}
            enableGridX={false}
            useMesh
            enableArea
            areaOpacity={0.1}
          />
        </div>
      ) : (
        <div style={styles.emptyState}>No data available</div>
      )}
    </div>
  );
}
