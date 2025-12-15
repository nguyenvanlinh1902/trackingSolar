'use client';

import { useMemo } from 'react';
import { SparkLineChart, PolarisVizProvider } from '@shopify/polaris-viz';
import type { PerStoreWidgetUsage } from '@/types/survey-metrics';
import { COLORS, RADIUS, SPACING, formatPercent } from '@/lib/constants';
import { cardStyle, sectionTitleStyle, badgeStyle } from '@/lib/styles';

interface WidgetMetricsProps {
  widgetUsage: PerStoreWidgetUsage;
}

export function WidgetMetrics({ widgetUsage }: WidgetMetricsProps) {
  const isPositive = widgetUsage.activeWidgetsChangePercent >= 0;
  const changeIcon = isPositive ? '↑' : '↓';

  const sparklineData = useMemo(
    () => [
      {
        data: widgetUsage.activeWidgetsTimeSeries.map((d) => ({
          key: d.date,
          value: d.value,
        })),
      },
    ],
    [widgetUsage.activeWidgetsTimeSeries]
  );

  return (
    <div style={cardStyle}>
      <h3 style={sectionTitleStyle}>Widget Usage</h3>

      <div style={{ display: 'flex', gap: `${SPACING.xl}px`, alignItems: 'flex-start', flexWrap: 'wrap' }}>
        {/* Active Widgets Card */}
        <div
          style={{
            flex: '1 1 180px',
            padding: `${SPACING.lg}px`,
            backgroundColor: COLORS.gray50,
            borderRadius: RADIUS.lg,
            borderLeft: `4px solid ${COLORS.success}`,
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
            Active Widgets
          </p>
          <p
            style={{
              fontSize: '28px',
              fontWeight: 600,
              color: COLORS.textPrimary,
              marginBottom: `${SPACING.sm}px`,
            }}
          >
            {widgetUsage.activeWidgets}
          </p>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={badgeStyle(isPositive)}>
              {changeIcon} {formatPercent(Math.abs(widgetUsage.activeWidgetsChangePercent))}
            </span>
            <span style={{ fontSize: '12px', color: COLORS.textMuted }}>vs previous</span>
          </div>
        </div>

        {/* Sparkline Trend */}
        <div style={{ flex: '2 1 250px' }}>
          <p
            style={{
              fontSize: '13px',
              color: COLORS.textSecondary,
              marginBottom: `${SPACING.sm}px`,
              fontWeight: 500,
            }}
          >
            Active Widgets Trend
          </p>
          <div style={{ height: '80px' }}>
            <PolarisVizProvider>
              <SparkLineChart
                data={sparklineData}
                theme="Light"
                accessibilityLabel="Active widgets trend"
              />
            </PolarisVizProvider>
          </div>
        </div>
      </div>
    </div>
  );
}
