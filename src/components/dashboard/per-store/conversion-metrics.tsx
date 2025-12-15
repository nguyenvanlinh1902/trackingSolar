'use client';

import { useMemo } from 'react';
import { SparkLineChart, PolarisVizProvider } from '@shopify/polaris-viz';
import type { ConversionMetrics as ConversionMetricsType } from '@/types/survey-metrics';
import { COLORS, RADIUS, SHADOWS, SPACING, formatPercent } from '@/lib/constants';
import { gridResponsive, badgeStyle } from '@/lib/styles';

// Chart colors for conversion metrics
const CONVERSION_COLORS = {
  ordersFromShopvid: COLORS.secondary,
  atcRateMobile: COLORS.info,
  atcRateDesktop: COLORS.primaryLight,
  cvr: '#EC4899',
} as const;

interface ConversionMetricsProps {
  conversion: ConversionMetricsType;
}

interface MetricCardConfig {
  key: keyof ConversionMetricsType;
  label: string;
  color: string;
  suffix: string;
}

const METRIC_CONFIGS: MetricCardConfig[] = [
  { key: 'ordersFromShopvid', label: '% Orders from Shopvid', color: CONVERSION_COLORS.ordersFromShopvid, suffix: '%' },
  { key: 'atcRateMobile', label: 'ATC Rate (Mobile)', color: CONVERSION_COLORS.atcRateMobile, suffix: '%' },
  { key: 'atcRateDesktop', label: 'ATC Rate (Desktop)', color: CONVERSION_COLORS.atcRateDesktop, suffix: '%' },
  { key: 'cvr', label: 'Conversion Rate (CVR)', color: CONVERSION_COLORS.cvr, suffix: '%' },
];

function ConversionMetricCard({
  label,
  metric,
  color,
  suffix,
}: {
  label: string;
  metric: ConversionMetricsType[keyof ConversionMetricsType];
  color: string;
  suffix: string;
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
      {/* Label */}
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

      {/* Value */}
      <p
        style={{
          fontSize: '24px',
          fontWeight: 600,
          color: COLORS.textPrimary,
          marginBottom: `${SPACING.sm}px`,
        }}
      >
        {metric.value.toFixed(1)}{suffix}
      </p>

      {/* Change badge */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: `${SPACING.md}px` }}>
        <span style={badgeStyle(isPositive)}>
          {changeIcon} {formatPercent(Math.abs(metric.changePercent))}
        </span>
        <span style={{ fontSize: '12px', color: COLORS.textMuted }}>vs previous</span>
      </div>

      {/* Sparkline */}
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

export function ConversionMetrics({ conversion }: ConversionMetricsProps) {
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
        Conversion Metrics
      </h3>

      <div style={gridResponsive('220px')}>
        {METRIC_CONFIGS.map((config) => (
          <ConversionMetricCard
            key={config.key}
            label={config.label}
            metric={conversion[config.key]}
            color={config.color}
            suffix={config.suffix}
          />
        ))}
      </div>
    </div>
  );
}
