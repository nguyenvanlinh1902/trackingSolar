'use client';

import { useMemo } from 'react';
import { LineChart, SparkLineChart, PolarisVizProvider } from '@shopify/polaris-viz';
import type { RevenueMetrics } from '@/types/survey-metrics';
import { COLORS, RADIUS, SHADOWS, SPACING, formatCurrency, formatPercent, formatDate } from '@/lib/constants';
import { cardStyle, badgeStyle, gridResponsive } from '@/lib/styles';

// Revenue colors
const REVENUE_COLORS = {
  inVideo: COLORS.success,
  postVideo: COLORS.warning,
} as const;

interface RevenueChartsProps {
  revenue: {
    inVideo: RevenueMetrics;
    postVideo: RevenueMetrics;
  };
}

function RevenueSummaryCard({
  label,
  metric,
  color,
}: {
  label: string;
  metric: RevenueMetrics;
  color: string;
}) {
  const isPositive = metric.changePercent >= 0;
  const changeIcon = isPositive ? '↑' : '↓';

  const sparklineData = useMemo(
    () => [{ data: metric.timeSeries.map((d) => ({ key: d.date, value: d.value })) }],
    [metric.timeSeries]
  );

  return (
    <div
      style={{
        backgroundColor: COLORS.surface,
        borderRadius: RADIUS.xl,
        padding: `${SPACING.lg}px`,
        boxShadow: SHADOWS.sm,
        borderLeft: `4px solid ${color}`,
      }}
    >
      <p
        style={{
          fontSize: '13px',
          color: COLORS.textSecondary,
          marginBottom: `${SPACING.sm}px`,
          fontWeight: 500,
        }}
      >
        {label}
      </p>
      <p
        style={{
          fontSize: '24px',
          fontWeight: 600,
          color: COLORS.textPrimary,
          marginBottom: `${SPACING.sm}px`,
        }}
      >
        {formatCurrency(metric.value)}
      </p>
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: `${SPACING.md}px` }}>
        <span style={badgeStyle(isPositive)}>
          {changeIcon} {formatPercent(Math.abs(metric.changePercent))}
        </span>
        <span style={{ fontSize: '12px', color: COLORS.textMuted }}>vs previous</span>
      </div>
      <div style={{ height: '40px' }}>
        <PolarisVizProvider>
          <SparkLineChart
            data={sparklineData}
            theme="Light"
            accessibilityLabel={`${label} trend`}
          />
        </PolarisVizProvider>
      </div>
    </div>
  );
}

export function RevenueCharts({ revenue }: RevenueChartsProps) {
  // Combined line chart data
  const lineChartData = useMemo(
    () => [
      {
        name: 'In-Video Revenue',
        data: revenue.inVideo.timeSeries.map((d) => ({ key: d.date, value: d.value })),
        color: REVENUE_COLORS.inVideo,
      },
      {
        name: 'Post-Video Revenue',
        data: revenue.postVideo.timeSeries.map((d) => ({ key: d.date, value: d.value })),
        color: REVENUE_COLORS.postVideo,
      },
    ],
    [revenue]
  );

  return (
    <div>
      <h3
        style={{
          fontSize: '16px',
          fontWeight: 600,
          color: COLORS.textPrimary,
          marginBottom: `${SPACING.lg}px`,
        }}
      >
        Revenue Metrics
      </h3>

      {/* Summary Cards */}
      <div style={{ ...gridResponsive('220px'), marginBottom: `${SPACING.xl}px` }}>
        <RevenueSummaryCard
          label="In-Video Revenue"
          metric={revenue.inVideo}
          color={REVENUE_COLORS.inVideo}
        />
        <RevenueSummaryCard
          label="Post-Video Revenue"
          metric={revenue.postVideo}
          color={REVENUE_COLORS.postVideo}
        />
      </div>

      {/* Combined Line Chart */}
      <div style={cardStyle}>
        <h4
          style={{
            fontSize: '14px',
            fontWeight: 500,
            color: COLORS.textSecondary,
            marginBottom: `${SPACING.lg}px`,
          }}
        >
          Revenue Trend Over Time
        </h4>
        <div style={{ height: '250px' }}>
          <PolarisVizProvider>
            <LineChart
              data={lineChartData}
              theme="Light"
              showLegend
              xAxisOptions={{
                labelFormatter: (value) => (value ? formatDate(String(value)) : ''),
              }}
            />
          </PolarisVizProvider>
        </div>
      </div>
    </div>
  );
}
