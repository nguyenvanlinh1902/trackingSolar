'use client';

import { useMemo } from 'react';
import { ResponsiveLine } from '@nivo/line';
import type { RevenueMetrics } from '@/types/survey-metrics';
import { COLORS, RADIUS, SHADOWS, SPACING, formatCurrency, formatPercent } from '@/lib/constants';
import { badgeStyle, gridResponsive } from '@/lib/styles';

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

  const sparklineData = useMemo(() => {
    if (!metric?.timeSeries || !Array.isArray(metric.timeSeries) || metric.timeSeries.length === 0) {
      return null;
    }
    
    const mappedData = metric.timeSeries
      .map((d) => {
        const date = d.date || '';
        const value = typeof d.value === 'number' ? d.value : 0;
        return { x: date, y: value };
      })
      .filter((item) => item.x && typeof item.y === 'number');
    
    if (mappedData.length === 0) {
      return null;
    }
    
    return [
      {
        id: label,
        data: mappedData,
      },
    ];
  }, [metric?.timeSeries, label]);

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
      {sparklineData && sparklineData.length > 0 && sparklineData[0].data.length > 0 ? (
        <div style={{ height: '40px' }}>
          <ResponsiveLine
            data={sparklineData}
            margin={{ top: 4, right: 4, bottom: 4, left: 4 }}
            xScale={{ type: 'point' }}
            yScale={{ type: 'linear', min: 'auto', max: 'auto', stacked: false }}
            axisBottom={null}
            axisLeft={null}
            enableGridX={false}
            enableGridY={false}
            colors={[color]}
            lineWidth={2}
            pointSize={0}
            useMesh
          />
        </div>
      ) : (
        <div
          style={{
            height: '40px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: COLORS.textMuted,
            fontSize: '11px',
            backgroundColor: COLORS.gray50,
            borderRadius: RADIUS.sm,
          }}
        >
          No data
        </div>
      )}
    </div>
  );
}

export function RevenueCharts({ revenue }: RevenueChartsProps) {

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

    </div>
  );
}
