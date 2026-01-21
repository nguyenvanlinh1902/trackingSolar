'use client';

import { useMemo, useState } from 'react';
import { useAllStoresContext } from '@/contexts/all-stores-context';
import { COLORS, SPACING } from '@/lib/constants';
import {
  glassCardStyle,
  sectionHeaderStyle,
  iconContainerStyle,
  sectionTitleStyle,
  metricCardStyle,
  metricLabelStyle,
  metricValueStyle,
  GRADIENTS,
} from './shared-styles';
import { WidgetTypesChart } from './widget-types-chart';
import { CtaActionsGrid } from './cta-actions-grid';
import { PageDistribution } from './page-distribution';

export function WidgetUsageMetrics() {
  const { data } = useAllStoresContext();
  const widgetUsage = data?.widgetUsage;

  const totalWidgets = useMemo(() => {
    if (!widgetUsage?.widgetTypes?.length) return 0;
    return widgetUsage.widgetTypes.reduce((sum, item) => sum + (item.count || 0), 0);
  }, [widgetUsage?.widgetTypes]);

  if (!widgetUsage) return null;

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
            label="Avg Widgets/Merchant"
            value={widgetUsage.avgWidgetsPerMerchant.toFixed(1)}
            color={COLORS.success}
            gradient={GRADIENTS.green}
          />
          <MetricCard
            label="Avg Active/Merchant"
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
