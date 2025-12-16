'use client';

import { useMemo } from 'react';
import { ResponsivePie } from '@nivo/pie';
import type { WidgetUsageMetrics } from '@/types/survey-metrics';
import { COLORS, RADIUS, SPACING } from '@/lib/constants';
import { cardStyle, sectionTitleStyle } from '@/lib/styles';

// Widget type colors
const WIDGET_TYPE_COLORS = [
  COLORS.primary,
  COLORS.secondary,
  COLORS.success,
  COLORS.info,
  COLORS.warning,
  COLORS.cta,
] as const;

interface AllStoresWidgetUsageProps {
  widgetUsage: WidgetUsageMetrics;
}

export function AllStoresWidgetUsage({ widgetUsage }: AllStoresWidgetUsageProps) {
  const pieData = useMemo(() => {
    if (!widgetUsage?.widgetTypes || widgetUsage.widgetTypes.length === 0) {
      return [];
    }
    return widgetUsage.widgetTypes.map((item, index) => ({
      id: item.type || 'Unknown',
      label: item.type || 'Unknown',
      value: Number(item.count) || 0,
      color: WIDGET_TYPE_COLORS[index % WIDGET_TYPE_COLORS.length],
    }));
  }, [widgetUsage?.widgetTypes]);

  const totalWidgets = useMemo(() => {
    if (!widgetUsage?.widgetTypes || widgetUsage.widgetTypes.length === 0) {
      return 0;
    }
    return widgetUsage.widgetTypes.reduce((sum, item) => sum + (item.count || 0), 0);
  }, [widgetUsage?.widgetTypes]);

  const pageCountsData = useMemo(() => {
    const productPages = widgetUsage?.productPagesCount || 0;
    const otherPages = widgetUsage?.otherPagesCount || 0;
    const total = productPages + otherPages;
    
    if (total === 0) {
      return [];
    }
    
    return [
      {
        id: 'Product Pages',
        label: 'Product Pages',
        value: productPages,
        color: COLORS.primary,
      },
      {
        id: 'Other Pages',
        label: 'Other Pages',
        value: otherPages,
        color: COLORS.secondary,
      },
    ];
  }, [widgetUsage?.productPagesCount, widgetUsage?.otherPagesCount]);

  return (
    <div style={cardStyle}>
      <h3 style={sectionTitleStyle}>Widget Usage</h3>

      <div style={{ display: 'flex', gap: `${SPACING.xl}px`, alignItems: 'flex-start', flexWrap: 'wrap' }}>
        {/* Stats Cards */}
        <div style={{ flex: '1 1 200px', display: 'flex', flexDirection: 'column', gap: `${SPACING.md}px` }}>
          {/* Total Widgets */}
          <div
            style={{
              padding: `${SPACING.lg}px`,
              backgroundColor: COLORS.gray50,
              borderRadius: RADIUS.lg,
              borderLeft: `4px solid ${COLORS.primary}`,
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
              Total Widgets
            </p>
            <p
              style={{
                fontSize: '28px',
                fontWeight: 600,
                color: COLORS.textPrimary,
                marginBottom: `${SPACING.sm}px`,
              }}
            >
              {totalWidgets}
            </p>
          </div>

          {/* Average Widgets Per Merchant */}
          <div
            style={{
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
              Avg Widgets/Merchant
            </p>
            <p
              style={{
                fontSize: '24px',
                fontWeight: 600,
                color: COLORS.textPrimary,
              }}
            >
              {widgetUsage.avgWidgetsPerMerchant.toFixed(1)}
            </p>
          </div>

          {/* Average Active Widgets Per Merchant */}
          <div
            style={{
              padding: `${SPACING.lg}px`,
              backgroundColor: COLORS.gray50,
              borderRadius: RADIUS.lg,
              borderLeft: `4px solid ${COLORS.info}`,
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
              Avg Active Widgets/Merchant
            </p>
            <p
              style={{
                fontSize: '24px',
                fontWeight: 600,
                color: COLORS.textPrimary,
              }}
            >
              {widgetUsage.avgActiveWidgetsPerMerchant.toFixed(1)}
            </p>
          </div>
        </div>

        {/* Pie Chart */}
        <div style={{ flex: '2 1 300px', minWidth: '300px' }}>
          <p
            style={{
              fontSize: '13px',
              color: COLORS.textSecondary,
              marginBottom: `${SPACING.sm}px`,
              fontWeight: 500,
            }}
          >
            Widget Types Distribution
          </p>
          {pieData && pieData.length > 0 ? (
            <div style={{ height: '250px', width: '100%' }}>
              <ResponsivePie
                data={pieData}
                margin={{ top: 10, right: 80, bottom: 10, left: 10 }}
                innerRadius={0.5}
                padAngle={2}
                cornerRadius={3}
                colors={(datum) => datum.data.color as string}
                enableArcLabels={false}
                arcLinkLabelsSkipAngle={10}
                arcLinkLabelsTextColor={COLORS.textSecondary}
                arcLinkLabelsThickness={2}
                arcLinkLabelsColor={{ from: 'color' }}
                legends={[
                  {
                    anchor: 'right',
                    direction: 'column',
                    justify: false,
                    translateX: 24,
                    translateY: 0,
                    itemsSpacing: 4,
                    itemWidth: 100,
                    itemHeight: 18,
                    itemTextColor: COLORS.textSecondary,
                    itemOpacity: 0.9,
                    symbolSize: 10,
                    symbolShape: 'circle',
                    effects: [
                      {
                        on: 'hover',
                        style: {
                          itemTextColor: COLORS.textPrimary,
                          itemOpacity: 1,
                        },
                      },
                    ],
                  },
                ]}
              />
            </div>
          ) : (
            <div
              style={{
                height: '250px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: COLORS.textMuted,
                fontSize: '14px',
              }}
            >
              No widget types data available
            </div>
          )}
        </div>
      </div>

      {/* Page Counts Chart */}
      {(widgetUsage?.productPagesCount !== undefined || widgetUsage?.otherPagesCount !== undefined) && 
       pageCountsData.length > 0 && (
        <div style={{ marginTop: `${SPACING.xl}px` }}>
          <h4
            style={{
              fontSize: '14px',
              fontWeight: 600,
              color: COLORS.textPrimary,
              marginBottom: `${SPACING.md}px`,
            }}
          >
            Page Distribution
          </h4>
          <div style={{ display: 'flex', gap: `${SPACING.xl}px`, alignItems: 'flex-start', flexWrap: 'wrap' }}>
            {/* Stats Cards */}
            <div style={{ flex: '1 1 200px', display: 'flex', gap: `${SPACING.md}px` }}>
              <div
                style={{
                  flex: 1,
                  padding: `${SPACING.lg}px`,
                  backgroundColor: COLORS.gray50,
                  borderRadius: RADIUS.lg,
                  borderLeft: `4px solid ${COLORS.primary}`,
                  textAlign: 'center',
                }}
              >
                <p style={{ fontSize: '13px', color: COLORS.textSecondary, marginBottom: `${SPACING.xs}px` }}>
                  Product Pages
                </p>
                <p style={{ fontSize: '24px', fontWeight: 600, color: COLORS.textPrimary }}>
                  {widgetUsage.productPagesCount || 0}
                </p>
              </div>
              <div
                style={{
                  flex: 1,
                  padding: `${SPACING.lg}px`,
                  backgroundColor: COLORS.gray50,
                  borderRadius: RADIUS.lg,
                  borderLeft: `4px solid ${COLORS.secondary}`,
                  textAlign: 'center',
                }}
              >
                <p style={{ fontSize: '13px', color: COLORS.textSecondary, marginBottom: `${SPACING.xs}px` }}>
                  Other Pages
                </p>
                <p style={{ fontSize: '24px', fontWeight: 600, color: COLORS.textPrimary }}>
                  {widgetUsage.otherPagesCount || 0}
                </p>
              </div>
            </div>

          </div>
        </div>
      )}

      {/* CTA Actions */}
      {widgetUsage.ctaActions && widgetUsage.ctaActions.length > 0 && (
        <div style={{ marginTop: `${SPACING.xl}px` }}>
          <p
            style={{
              fontSize: '13px',
              color: COLORS.textSecondary,
              marginBottom: `${SPACING.md}px`,
              fontWeight: 500,
            }}
          >
            CTA Actions
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: `${SPACING.md}px` }}>
            {widgetUsage.ctaActions.map((action, index) => {
              const total = action.count ?? (action.desktop + action.mobile);
              return (
                <div
                  key={index}
                  style={{
                    padding: `${SPACING.md}px ${SPACING.lg}px`,
                    backgroundColor: COLORS.gray50,
                    borderRadius: RADIUS.md,
                    fontSize: '13px',
                  }}
                >
                  <p style={{ color: COLORS.textSecondary, marginBottom: `${SPACING.xs}px`, fontWeight: 500 }}>
                    {action.action}
                  </p>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ display: 'flex', gap: `${SPACING.md}px` }}>
                      <div>
                        <span style={{ fontSize: '11px', color: COLORS.textMuted }}>Desktop: </span>
                        <span style={{ color: COLORS.textPrimary, fontWeight: 600 }}>{action.desktop}</span>
                      </div>
                      <div>
                        <span style={{ fontSize: '11px', color: COLORS.textMuted }}>Mobile: </span>
                        <span style={{ color: COLORS.textPrimary, fontWeight: 600 }}>{action.mobile}</span>
                      </div>
                    </div>
                    <div>
                      <span style={{ fontSize: '12px', color: COLORS.textSecondary, fontWeight: 600 }}>
                        Total: {total}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

