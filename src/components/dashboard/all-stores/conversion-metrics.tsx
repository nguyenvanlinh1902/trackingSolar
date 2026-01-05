'use client';

import { ResponsiveBar } from '@nivo/bar';
import { COLORS, RADIUS, SHADOWS, SPACING } from '@/lib/constants';
import { cardStyle } from '@/lib/styles';

interface ConversionData {
  totalOrders: number;
  totalRevenue: number;
  inVideoOrders: number;
  inVideoRevenue: number;
  postVideoOrders: number;
  postVideoRevenue: number;
  totalViews: number;
  cvr: number;
}

interface ConversionMetricsProps {
  conversionData: ConversionData;
}

export function ConversionMetrics({ conversionData }: ConversionMetricsProps) {
  // Prepare data for charts
  const ordersChartData = [
    {
      metric: 'In-Video Orders',
      value: conversionData.inVideoOrders,
      color: '#3b82f6',
    },
    {
      metric: 'Post-Video Orders',
      value: conversionData.postVideoOrders,
      color: '#10b981',
    },
  ];

  const revenueChartData = [
    {
      metric: 'In-Video Revenue',
      value: conversionData.inVideoRevenue,
      color: '#8b5cf6',
    },
    {
      metric: 'Post-Video Revenue',
      value: conversionData.postVideoRevenue,
      color: '#f59e0b',
    },
  ];

  return (
    <div style={cardStyle}>
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

      {/* Summary Cards */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
          gap: `${SPACING.md}px`,
          marginBottom: `${SPACING.xl}px`,
        }}
      >
        <div
          style={{
            padding: `${SPACING.md}px`,
            backgroundColor: COLORS.surface,
            borderRadius: RADIUS.lg,
            boxShadow: SHADOWS.sm,
            borderLeft: `3px solid ${COLORS.primary}`,
          }}
        >
          <p style={{ fontSize: '12px', color: COLORS.textSecondary, marginBottom: '4px' }}>
            Total Orders
          </p>
          <p style={{ fontSize: '20px', fontWeight: 600, color: COLORS.textPrimary }}>
            {conversionData.totalOrders.toLocaleString()}
          </p>
        </div>

        <div
          style={{
            padding: `${SPACING.md}px`,
            backgroundColor: COLORS.surface,
            borderRadius: RADIUS.lg,
            boxShadow: SHADOWS.sm,
            borderLeft: `3px solid ${COLORS.success}`,
          }}
        >
          <p style={{ fontSize: '12px', color: COLORS.textSecondary, marginBottom: '4px' }}>
            Total Revenue
          </p>
          <p style={{ fontSize: '20px', fontWeight: 600, color: COLORS.textPrimary }}>
            ${conversionData.totalRevenue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </p>
        </div>

        <div
          style={{
            padding: `${SPACING.md}px`,
            backgroundColor: COLORS.surface,
            borderRadius: RADIUS.lg,
            boxShadow: SHADOWS.sm,
            borderLeft: `3px solid ${COLORS.info}`,
          }}
        >
          <p style={{ fontSize: '12px', color: COLORS.textSecondary, marginBottom: '4px' }}>
            Total Views
          </p>
          <p style={{ fontSize: '20px', fontWeight: 600, color: COLORS.textPrimary }}>
            {conversionData.totalViews.toLocaleString()}
          </p>
        </div>

        <div
          style={{
            padding: `${SPACING.md}px`,
            backgroundColor: COLORS.surface,
            borderRadius: RADIUS.lg,
            boxShadow: SHADOWS.sm,
            borderLeft: `3px solid ${COLORS.warning}`,
          }}
        >
          <p style={{ fontSize: '12px', color: COLORS.textSecondary, marginBottom: '4px' }}>
            Conversion Rate
          </p>
          <p style={{ fontSize: '20px', fontWeight: 600, color: COLORS.textPrimary }}>
            {conversionData.cvr.toFixed(2)}%
          </p>
        </div>
      </div>

      {/* Charts */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: `${SPACING.lg}px`,
        }}
      >
        {/* Orders Breakdown */}
        <div>
          <h4
            style={{
              fontSize: '14px',
              fontWeight: 600,
              color: COLORS.textPrimary,
              marginBottom: `${SPACING.md}px`,
            }}
          >
            Orders Breakdown
          </h4>
          <div style={{ height: '200px' }}>
            <ResponsiveBar
              data={ordersChartData}
              keys={['value']}
              indexBy="metric"
              margin={{ top: 10, right: 10, bottom: 40, left: 50 }}
              padding={0.4}
              colors={(bar) => (bar.data as { color: string }).color}
              axisBottom={{
                tickSize: 0,
                tickPadding: 8,
              }}
              axisLeft={{
                tickSize: 0,
                tickPadding: 8,
              }}
              enableLabel
              labelSkipWidth={12}
              labelSkipHeight={12}
            />
          </div>
        </div>

        {/* Revenue Breakdown */}
        <div>
          <h4
            style={{
              fontSize: '14px',
              fontWeight: 600,
              color: COLORS.textPrimary,
              marginBottom: `${SPACING.md}px`,
            }}
          >
            Revenue Breakdown
          </h4>
          <div style={{ height: '200px' }}>
            <ResponsiveBar
              data={revenueChartData}
              keys={['value']}
              indexBy="metric"
              margin={{ top: 10, right: 10, bottom: 40, left: 60 }}
              padding={0.4}
              colors={(bar) => (bar.data as { color: string }).color}
              axisBottom={{
                tickSize: 0,
                tickPadding: 8,
              }}
              axisLeft={{
                tickSize: 0,
                tickPadding: 8,
                format: (value) => `$${value}`,
              }}
              enableLabel
              labelSkipWidth={12}
              labelSkipHeight={12}
              valueFormat={(value) => `$${value}`}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
