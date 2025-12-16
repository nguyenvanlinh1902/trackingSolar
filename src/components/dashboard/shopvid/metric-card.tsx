'use client';

import type { AnalyticsMetric } from '@/services/analytics-service';
import { COLORS, formatNumber, formatPercent, formatCurrency } from '@/lib/constants';
import { cardStyle, badgeStyle } from '@/lib/styles';

interface MetricCardProps {
  label: string;
  metric: AnalyticsMetric;
  type?: 'number' | 'currency' | 'percent';
  color?: string;
}

function formatValue(value: number, type: MetricCardProps['type']): string {
  switch (type) {
    case 'currency': return formatCurrency(value);
    case 'percent': return formatPercent(value);
    default: return formatNumber(value);
  }
}

export function MetricCard({ label, metric, type = 'number', color }: MetricCardProps) {
  const isPositive = metric.changePercent >= 0;
  const changeIcon = isPositive ? '↑' : '↓';

  return (
    <div style={{ ...cardStyle, borderLeft: color ? `4px solid ${color}` : undefined }}>
      <p style={{
        fontSize: '14px',
        color: COLORS.textSecondary,
        marginBottom: '8px'
      }}>
        {label}
      </p>
      <p style={{
        fontSize: '28px',
        fontWeight: 600,
        color: COLORS.textPrimary,
        marginBottom: '8px'
      }}>
        {formatValue(metric.value, type)}
      </p>
    </div>
  );
}
