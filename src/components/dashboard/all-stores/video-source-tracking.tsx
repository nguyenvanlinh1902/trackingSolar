'use client';

import { useMemo, useState } from 'react';
import { ResponsivePie } from '@nivo/pie';
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
  emptyStateStyle,
  GRADIENTS,
} from './shared-styles';

const VIDEO_COLORS = {
  tiktok: '#FF0050',
  instagram: '#E4405F',
  upload: COLORS.primary,
} as const;

export function VideoSourceMetrics() {
  const { data } = useAllStoresContext();
  const videoSource = data?.videoSource;
  const { pieData, percentages } = useMemo(() => {
    if (!videoSource) return { pieData: [], percentages: { tiktok: 0, instagram: 0, upload: 0 } };

    const total = videoSource.total || (videoSource.tiktok + videoSource.instagram + videoSource.upload);

    const pie = [
      { key: 'tiktok', name: 'TikTok sync', value: videoSource.tiktok || 0, color: VIDEO_COLORS.tiktok },
      { key: 'instagram', name: 'Instagram sync', value: videoSource.instagram || 0, color: VIDEO_COLORS.instagram },
      { key: 'upload', name: 'Direct Upload', value: videoSource.upload || 0, color: VIDEO_COLORS.upload },
    ].filter(item => item.value > 0);

    const pct = {
      tiktok: total > 0 ? (videoSource.tiktok / total) * 100 : 0,
      instagram: total > 0 ? (videoSource.instagram / total) * 100 : 0,
      upload: total > 0 ? (videoSource.upload / total) * 100 : 0,
    };

    return { pieData: pie, percentages: pct };
  }, [videoSource]);

  if (!videoSource) return null;

  return (
    <div style={glassCardStyle}>
      <div style={sectionHeaderStyle}>
        <div style={iconContainerStyle(GRADIENTS.purple)}>🎯</div>
        <h3 style={sectionTitleStyle}>Video Source Tracking</h3>
      </div>

      <div style={{ display: 'flex', gap: `${SPACING.xl}px`, flexWrap: 'wrap' }}>
        {/* Premium donut chart */}
        {pieData.length > 0 ? (
          <div style={{ flex: '1 1 280px', minWidth: '280px', height: '280px' }}>
            <ResponsivePie
              data={pieData.map(d => ({ id: d.key, label: d.name, value: d.value, color: d.color }))}
              margin={{ top: 30, right: 90, bottom: 30, left: 20 }}
              innerRadius={0.65}
              padAngle={2}
              cornerRadius={4}
              activeOuterRadiusOffset={8}
              colors={d => d.data.color as string}
              borderWidth={2}
              borderColor={{ from: 'color', modifiers: [['darker', 0.3]] }}
              enableArcLabels={false}
              enableArcLinkLabels={false}
              arcLinkLabelsTextColor={COLORS.textPrimary}
              arcLinkLabelsThickness={2}
              arcLinkLabelsColor={{ from: 'color' }}
              legends={[{
                anchor: 'right',
                direction: 'column',
                translateX: 24,
                itemsSpacing: 8,
                itemWidth: 100,
                itemHeight: 24,
                symbolSize: 14,
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
                    {datum.value.toLocaleString()} videos ({datum.data.value}%)
                  </div>
                </div>
              )}
            />
          </div>
        ) : (
          <div style={{ ...emptyStateStyle, flex: '1 1 280px' }}>No video data</div>
        )}

        {/* Premium metric cards */}
        <div style={{ flex: '1 1 320px', display: 'flex', flexDirection: 'column', gap: `${SPACING.lg}px` }}>
          <SourceMetricCard
            label="TikTok sync"
            percentage={percentages.tiktok}
            count={videoSource.tiktok}
            color={VIDEO_COLORS.tiktok}
          />
          <SourceMetricCard
            label="Instagram sync"
            percentage={percentages.instagram}
            count={videoSource.instagram}
            color={VIDEO_COLORS.instagram}
          />
          <SourceMetricCard
            label="Direct Upload"
            percentage={percentages.upload}
            count={videoSource.upload}
            color={VIDEO_COLORS.upload}
          />
        </div>
      </div>
    </div>
  );
}

interface SourceMetricCardProps {
  label: string;
  percentage: number;
  count: number;
  color: string;
}

function SourceMetricCard({ label, percentage, count, color }: SourceMetricCardProps) {
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
      <p style={metricValueStyle}>{percentage.toFixed(1)}%</p>
      <p style={{
        margin: '12px 0 0',
        fontSize: '14px',
        color: COLORS.textSecondary,
        fontWeight: 500,
      }}>
        {count.toLocaleString()} videos
      </p>
      {/* Progress bar */}
      <div style={{
        marginTop: '12px',
        width: '100%',
        height: '4px',
        background: 'rgba(0, 0, 0, 0.1)',
        borderRadius: '2px',
        overflow: 'hidden',
      }}>
        <div style={{
          width: `${percentage}%`,
          height: '100%',
          background: `linear-gradient(90deg, ${color}, ${color}dd)`,
          transition: 'width 0.5s ease',
        }} />
      </div>
    </div>
  );
}
