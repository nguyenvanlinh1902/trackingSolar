'use client';

import { CHART_COLORS } from '@/lib/constants';
import { gridResponsive } from '@/lib/styles';
import { MetricCard } from './metric-card';
import type { AnalyticsData } from '@/services/analytics-service';

interface SummaryMetricsGridProps {
  summary: AnalyticsData['summary'];
}

const METRICS_CONFIG = [
  { key: 'totalViews', label: 'Total Views', type: 'number' as const, color: CHART_COLORS.views },
  { key: 'totalLikes', label: 'Total Likes', type: 'number' as const, color: CHART_COLORS.likes },
  { key: 'totalShares', label: 'Total Shares', type: 'number' as const, color: CHART_COLORS.shares },
] as const;

export function SummaryMetricsGrid({ summary }: SummaryMetricsGridProps) {
  return (
    <div style={gridResponsive('220px')}>
      {METRICS_CONFIG.map(({ key, label, type, color }) => (
        <MetricCard
          key={key}
          label={label}
          metric={summary[key]}
          type={type}
          color={color}
        />
      ))}
    </div>
  );
}
