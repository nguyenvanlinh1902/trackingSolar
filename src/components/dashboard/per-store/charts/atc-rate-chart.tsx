'use client';

import { useMemo, CSSProperties } from 'react';
import { ResponsiveLine } from '@nivo/line';
import type { MetricWithTimeSeries } from '@/types/survey-metrics';
import { COLORS, RADIUS, SPACING } from '@/lib/constants';
import { cardStyle, badgeStyle } from '@/lib/styles';

interface ATCRateChartProps {
  mobileData: MetricWithTimeSeries | null;
  desktopData: MetricWithTimeSeries | null;
  loading?: boolean;
}

const CHART_COLORS = {
  mobile: COLORS.info,
  desktop: COLORS.primaryLight,
} as const;

const styles = {
  card: cardStyle as CSSProperties,
  title: {
    fontSize: '14px',
    fontWeight: 600,
    color: COLORS.textPrimary,
    marginBottom: `${SPACING.md}px`,
  } as CSSProperties,
  statsRow: {
    display: 'flex',
    gap: `${SPACING.lg}px`,
    marginBottom: `${SPACING.md}px`,
    flexWrap: 'wrap',
  } as CSSProperties,
  statItem: {
    display: 'flex',
    alignItems: 'center',
    gap: `${SPACING.sm}px`,
  } as CSSProperties,
  colorDot: (color: string): CSSProperties => ({
    width: '10px',
    height: '10px',
    borderRadius: '50%',
    backgroundColor: color,
  }),
  statLabel: {
    fontSize: '12px',
    color: COLORS.textSecondary,
  } as CSSProperties,
  statValue: {
    fontSize: '18px',
    fontWeight: 600,
    color: COLORS.textPrimary,
  } as CSSProperties,
  chartWrapper: {
    height: '200px',
  } as CSSProperties,
  emptyState: {
    height: '200px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: COLORS.textMuted,
    backgroundColor: COLORS.gray50,
    borderRadius: RADIUS.md,
  } as CSSProperties,
};

export function ATCRateChart({ mobileData, desktopData, loading }: ATCRateChartProps) {
  const lineData = useMemo(() => {
    const series = [];

    if (mobileData?.timeSeries?.length) {
      series.push({
        id: 'Mobile',
        color: CHART_COLORS.mobile,
        data: mobileData.timeSeries.map((d) => ({ x: d.date.slice(5), y: d.value })),
      });
    }

    if (desktopData?.timeSeries?.length) {
      series.push({
        id: 'Desktop',
        color: CHART_COLORS.desktop,
        data: desktopData.timeSeries.map((d) => ({ x: d.date.slice(5), y: d.value })),
      });
    }

    return series;
  }, [mobileData?.timeSeries, desktopData?.timeSeries]);

  const hasData = lineData.length > 0;

  if (loading) {
    return (
      <div style={styles.card}>
        <p style={styles.title}>Add-to-Cart Rate (Mobile / Desktop)</p>
        <div style={styles.emptyState}>Loading...</div>
      </div>
    );
  }

  return (
    <div style={styles.card}>
      <p style={styles.title}>Add-to-Cart Rate (Mobile / Desktop)</p>

      <div style={styles.statsRow as CSSProperties}>
        {mobileData && (
          <div style={styles.statItem}>
            <div style={styles.colorDot(CHART_COLORS.mobile)} />
            <span style={styles.statLabel}>Mobile:</span>
            <span style={styles.statValue}>{mobileData.value.toFixed(1)}%</span>
            <span style={badgeStyle(mobileData.changePercent >= 0)}>
              {mobileData.changePercent >= 0 ? '↑' : '↓'} {Math.abs(mobileData.changePercent).toFixed(1)}%
            </span>
          </div>
        )}
        {desktopData && (
          <div style={styles.statItem}>
            <div style={styles.colorDot(CHART_COLORS.desktop)} />
            <span style={styles.statLabel}>Desktop:</span>
            <span style={styles.statValue}>{desktopData.value.toFixed(1)}%</span>
            <span style={badgeStyle(desktopData.changePercent >= 0)}>
              {desktopData.changePercent >= 0 ? '↑' : '↓'} {Math.abs(desktopData.changePercent).toFixed(1)}%
            </span>
          </div>
        )}
      </div>

      {hasData ? (
        <div style={styles.chartWrapper}>
          <ResponsiveLine
            data={lineData}
            margin={{ top: 10, right: 20, bottom: 30, left: 40 }}
            xScale={{ type: 'point' }}
            yScale={{ type: 'linear', min: 'auto', max: 'auto' }}
            axisBottom={{ tickRotation: -45 }}
            axisLeft={{ tickSize: 0, tickPadding: 8 }}
            colors={(series) => series.color as string}
            lineWidth={2}
            pointSize={4}
            pointBorderWidth={2}
            enableGridX={false}
            useMesh
            legends={[
              {
                anchor: 'top-right',
                direction: 'row',
                itemWidth: 70,
                itemHeight: 20,
                symbolSize: 10,
                symbolShape: 'circle',
              },
            ]}
          />
        </div>
      ) : (
        <div style={styles.emptyState}>No data available</div>
      )}
    </div>
  );
}
