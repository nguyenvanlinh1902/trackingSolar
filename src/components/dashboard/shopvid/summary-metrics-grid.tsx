'use client';

import { CHART_COLORS } from '@/lib/constants';
import { gridResponsive } from '@/lib/styles';
import { MetricCard } from './metric-card';
import type { AnalyticsMetric } from '@/services/analytics-service';

interface SummaryMetricsGridProps {
  summary: Record<string, AnalyticsMetric>;
}

const METRICS_CONFIG = [
  { key: 'totalViews', label: 'Total Views', type: 'number' as const, color: CHART_COLORS.views }
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
