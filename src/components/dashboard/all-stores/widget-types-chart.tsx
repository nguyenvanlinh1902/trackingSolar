'use client';

import { useMemo } from 'react';
import { ResponsivePie } from '@nivo/pie';
import type { WidgetTypeCount } from '@/types/survey-metrics';
import { COLORS, SPACING } from '@/lib/constants';
import { emptyStateStyle } from './shared-styles';

// Premium vibrant color palette for widget types
const WIDGET_COLORS = [
  '#3B82F6', // Blue
  '#8B5CF6', // Purple
  '#10B981', // Green
  '#F59E0B', // Amber
  '#EC4899', // Pink
  '#06B6D4', // Cyan
  '#F97316', // Orange
  '#14B8A6', // Teal
];

interface WidgetTypesChartProps {
  widgetTypes: WidgetTypeCount[];
}

export function WidgetTypesChart({ widgetTypes }: WidgetTypesChartProps) {
  const pieData = useMemo(() => {
    if (!widgetTypes?.length) return [];
    return widgetTypes.map((item, i) => ({
      id: item.type || 'Unknown',
      label: item.type || 'Unknown',
      value: item.count || 0,
      color: WIDGET_COLORS[i % WIDGET_COLORS.length],
    }));
  }, [widgetTypes]);

  if (!pieData.length) {
    return <div style={emptyStateStyle}>No widget types data</div>;
  }

  return (
    <div style={{ flex: '2 1 320px', minWidth: '320px' }}>
      <p style={{
        fontSize: '14px',
        color: COLORS.textSecondary,
        marginBottom: `${SPACING.md}px`,
        fontWeight: 600,
        letterSpacing: '0.02em',
      }}>
        Widget Types Distribution
      </p>
      <div style={{ height: '280px' }}>
        <ResponsivePie
          data={pieData}
          margin={{ top: 20, right: 90, bottom: 20, left: 20 }}
          innerRadius={0.6}
          padAngle={2}
          cornerRadius={4}
          activeOuterRadiusOffset={8}
          colors={d => d.data.color as string}
          borderWidth={2}
          borderColor={{ from: 'color', modifiers: [['darker', 0.3]] }}
          enableArcLabels={false}
          enableArcLinkLabels={false}
          legends={[{
            anchor: 'right',
            direction: 'column',
            translateX: 28,
            itemsSpacing: 6,
            itemWidth: 100,
            itemHeight: 22,
            symbolSize: 12,
            symbolShape: 'circle',
            itemTextColor: COLORS.textPrimary,
            effects: [{
              on: 'hover',
              style: {
                itemTextColor: COLORS.textPrimary,
                itemBackground: 'rgba(0, 0, 0, 0.05)',
              },
            }],
          }]}
          tooltip={({ datum }) => (
            <div
              style={{
                background: 'rgba(255, 255, 255, 0.95)',
                backdropFilter: 'blur(8px)',
                padding: '12px 16px',
                borderRadius: '8px',
                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
                border: `2px solid ${datum.color}`,
              }}
            >
              <div style={{ fontWeight: 700, color: datum.color, marginBottom: '4px', fontSize: '14px' }}>
                {datum.label}
              </div>
              <div style={{ fontSize: '13px', color: COLORS.textSecondary }}>
                {datum.value.toLocaleString()} widgets
              </div>
            </div>
          )}
        />
      </div>
    </div>
  );
}
