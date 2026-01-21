'use client';

import { useMemo, useState, CSSProperties } from 'react';
import type { PerStoreWidgetUsage } from '@/types/survey-metrics';
import { COLORS, RADIUS, SPACING } from '@/lib/constants';
import { glassCardStyle, iconContainerStyle, sectionHeaderStyle, sectionTitleStyle, GRADIENTS } from '../all-stores/shared-styles';
import { WidgetTypesChart } from '../all-stores/widget-types-chart';
import { CtaActionsGrid } from '../all-stores/cta-actions-grid';
import { PageDistribution } from '../all-stores/page-distribution';

interface WidgetMetricsProps {
  widgetUsage: PerStoreWidgetUsage;
}

// Metric card styles
const metricCardStyle = (color: string): CSSProperties => ({
  padding: `${SPACING.lg}px`,
  borderRadius: RADIUS.lg,
  background: 'rgba(255, 255, 255, 0.05)',
  backdropFilter: 'blur(8px)',
  WebkitBackdropFilter: 'blur(8px)',
  border: `1px solid rgba(255, 255, 255, 0.1)`,
  borderLeft: `4px solid ${color}`,
  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
});

const metricLabelStyle: CSSProperties = {
  fontSize: '12px',
  color: COLORS.textMuted,
  textTransform: 'uppercase',
  letterSpacing: '0.05em',
  fontWeight: 700,
  marginBottom: '8px',
};

const metricValueStyle: CSSProperties = {
  fontSize: '32px',
  fontWeight: 800,
  color: COLORS.textPrimary,
  lineHeight: 1,
};

interface MetricCardProps {
  label: string;
  value: string;
  color: string;
  gradient: string;
}

function MetricCard({ label, value, color, gradient }: MetricCardProps) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      style={{
        ...metricCardStyle(color),
        transform: isHovered ? 'translateY(-4px)' : 'translateY(0)',
        boxShadow: isHovered
          ? `0 12px 24px rgba(0, 0, 0, 0.15), 0 0 0 1px ${color}40`
          : '0 4px 16px rgba(0, 0, 0, 0.1)',
        borderColor: isHovered ? `${color}80` : 'rgba(255, 255, 255, 0.1)',
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <p style={metricLabelStyle}>{label}</p>
      <p style={metricValueStyle}>{value}</p>
      {/* Accent line with gradient */}
      <div style={{
        marginTop: '12px',
        width: isHovered ? '60px' : '48px',
        height: '4px',
        background: gradient,
        borderRadius: '2px',
        transition: 'width 0.3s ease',
      }} />
    </div>
  );
}

export function WidgetMetrics({ widgetUsage }: WidgetMetricsProps) {
  const totalWidgets = useMemo(() => {
    if (!widgetUsage?.widgetTypes || widgetUsage.widgetTypes.length === 0) {
      return 0;
    }
    return widgetUsage.widgetTypes.reduce((sum, item) => sum + (item.count || 0), 0);
  }, [widgetUsage?.widgetTypes]);

  return (
    <div style={glassCardStyle}>
      <div style={sectionHeaderStyle}>
        <div style={iconContainerStyle(GRADIENTS.green)}>🎛️</div>
        <h3 style={sectionTitleStyle}>Widget Usage</h3>
      </div>

      <div style={{ display: 'flex', gap: `${SPACING['2xl']}px`, flexWrap: 'wrap' }}>
        {/* Premium stats cards */}
        <div style={{ flex: '1 1 220px', display: 'flex', flexDirection: 'column', gap: `${SPACING.lg}px` }}>
          <MetricCard
            label="Total Widgets"
            value={totalWidgets.toString()}
            color={COLORS.primary}
            gradient={GRADIENTS.blue}
          />
          <MetricCard
            label="Avg Widgets/Store"
            value={widgetUsage.avgWidgetsPerMerchant.toFixed(1)}
            color={COLORS.success}
            gradient={GRADIENTS.green}
          />
          <MetricCard
            label="Avg Active/Store"
            value={widgetUsage.avgActiveWidgetsPerMerchant.toFixed(1)}
            color={COLORS.info}
            gradient={GRADIENTS.cyan}
          />
        </div>

        {/* Premium chart */}
        <WidgetTypesChart widgetTypes={widgetUsage.widgetTypes} />
      </div>

      {/* Page Distribution */}
      <PageDistribution
        productPagesCount={widgetUsage.productPagesCount || 0}
        otherPagesCount={widgetUsage.otherPagesCount || 0}
      />

      {/* CTA Actions */}
      <CtaActionsGrid ctaActions={widgetUsage.ctaActions} />
    </div>
  );
}
