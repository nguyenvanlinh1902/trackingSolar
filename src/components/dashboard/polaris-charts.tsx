'use client';

import { useMemo } from 'react';
import {
  LineChart,
  BarChart,
  DonutChart,
  SparkLineChart,
  PolarisVizProvider,
} from '@shopify/polaris-viz';
import '@shopify/polaris-viz/build/esm/styles.css';

import { CHART_COLORS, COLORS, formatDate } from '@/lib/constants';
import { cardStyle, sectionTitleStyle, gridResponsive } from '@/lib/styles';
import type { AnalyticsData } from '@/services/analytics-service';

// Chart configuration constants
const CHART_THEME = 'Light' as const;
const LINE_CHART_HEIGHT = '300px';
const BAR_CHART_HEIGHT = '250px';
const SPARKLINE_HEIGHT = '50px';
const MAX_BAR_VIDEOS = 5;
const MAX_TITLE_LENGTH = 20;

interface PolarisChartsProps {
  data: AnalyticsData;
}

// Transform chart data for line chart format
function transformLineChartData(chartData: AnalyticsData['chartData']) {
  return [
    {
      name: 'Views',
      data: chartData.map((d) => ({ key: d.date, value: d.views })),
      color: CHART_COLORS.views,
    },
    {
      name: 'Likes',
      data: chartData.map((d) => ({ key: d.date, value: d.likes })),
      color: CHART_COLORS.likes,
    },
    {
      name: 'Shares',
      data: chartData.map((d) => ({ key: d.date, value: d.shares })),
      color: CHART_COLORS.shares,
    },
  ];
}

// Transform data for bar chart format
function transformBarChartData(topVideos: AnalyticsData['topVideos']) {
  return [
    {
      name: 'Video Performance',
      data: topVideos.slice(0, MAX_BAR_VIDEOS).map((v) => ({
        key: v.title.length > MAX_TITLE_LENGTH ? `${v.title.slice(0, MAX_TITLE_LENGTH)}...` : v.title,
        value: v.views,
      })),
    },
  ];
}

// Transform data for donut chart format
function transformDonutData(summary: AnalyticsData['summary']) {
  return [
    {
      name: 'Engagement Breakdown',
      data: [
        { key: 'Views', name: 'Views', value: summary.totalViews.value, color: CHART_COLORS.views },
        { key: 'Likes', name: 'Likes', value: summary.totalLikes.value, color: CHART_COLORS.likes },
        { key: 'Shares', name: 'Shares', value: summary.totalShares.value, color: CHART_COLORS.shares },
      ],
    },
  ];
}

// Sparkline trend items configuration
const SPARKLINE_CONFIG = [
  { key: 'views', label: 'Views Trend', color: CHART_COLORS.views },
  { key: 'likes', label: 'Likes Trend', color: CHART_COLORS.likes },
  { key: 'shares', label: 'Shares Trend', color: CHART_COLORS.shares },
] as const;

// X-axis label formatter for dates
function formatAxisLabel(value: string | number | null): string {
  if (!value) return '';
  return formatDate(String(value));
}

export function PolarisCharts({ data }: PolarisChartsProps) {
  const { chartData, topVideos, summary } = data;

  // Memoize transformed data to prevent recalculation
  const lineChartData = useMemo(() => transformLineChartData(chartData), [chartData]);
  const barChartData = useMemo(() => transformBarChartData(topVideos), [topVideos]);
  const donutData = useMemo(() => transformDonutData(summary), [summary]);

  // Memoize sparkline data
  const sparklineItems = useMemo(
    () =>
      SPARKLINE_CONFIG.map((config) => ({
        ...config,
        data: chartData.map((d) => ({
          key: d.date,
          value: d[config.key as keyof typeof d] as number,
        })),
      })),
    [chartData]
  );

  return (
    <PolarisVizProvider>
      <div style={{ display: 'grid', gap: '24px' }}>
        {/* Performance Trends Line Chart */}
        <div style={cardStyle}>
          <h3 style={sectionTitleStyle}>Performance Trends</h3>
          <div style={{ height: LINE_CHART_HEIGHT }}>
            <LineChart
              data={lineChartData}
              theme={CHART_THEME}
              showLegend
              xAxisOptions={{ labelFormatter: formatAxisLabel }}
            />
          </div>
        </div>

        {/* Two column layout for Bar and Donut charts */}
        <div style={gridResponsive('350px')}>
          {/* Top Videos Bar Chart */}
          <div style={cardStyle}>
            <h3 style={sectionTitleStyle}>Top Performing Videos</h3>
            <div style={{ height: BAR_CHART_HEIGHT }}>
              <BarChart data={barChartData} theme={CHART_THEME} />
            </div>
          </div>

          {/* Engagement Donut Chart */}
          <div style={cardStyle}>
            <h3 style={sectionTitleStyle}>Engagement Breakdown</h3>
            <div style={{ height: BAR_CHART_HEIGHT }}>
              <DonutChart data={donutData} theme={CHART_THEME} legendPosition="right" />
            </div>
          </div>
        </div>

        {/* Quick Stats with Sparklines */}
        <div style={gridResponsive('200px')}>
          {sparklineItems.map((item) => (
            <div
              key={item.key}
              style={{
                backgroundColor: COLORS.surface,
                borderRadius: '12px',
                padding: '16px',
                boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
              }}
            >
              <p style={{ fontSize: '14px', color: COLORS.textSecondary, marginBottom: '8px' }}>
                {item.label}
              </p>
              <div style={{ height: SPARKLINE_HEIGHT }}>
                <SparkLineChart
                  data={[{ data: item.data }]}
                  theme={CHART_THEME}
                  accessibilityLabel={item.label}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </PolarisVizProvider>
  );
}
