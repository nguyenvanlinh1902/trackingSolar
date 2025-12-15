'use client';

import { useMemo } from 'react';
import { DonutChart, PolarisVizProvider } from '@shopify/polaris-viz';
import type { VideoSourceMetrics } from '@/types/survey-metrics';
import { COLORS, RADIUS, SPACING } from '@/lib/constants';
import { cardStyle, sectionTitleStyle } from '@/lib/styles';

// Video source colors
const VIDEO_SOURCE_COLORS = {
  tiktok: '#FF0050',
  instagram: '#E4405F',
  upload: COLORS.primary,
} as const;

interface VideoSourceChartProps {
  videoSource: VideoSourceMetrics;
}

export function VideoSourceChart({ videoSource }: VideoSourceChartProps) {
  const donutData = useMemo(() => {
    return [
      {
        name: 'Video Source Distribution',
        data: [
          {
            key: 'tiktok',
            name: 'TikTok',
            value: videoSource.tiktok,
            color: VIDEO_SOURCE_COLORS.tiktok,
          },
          {
            key: 'instagram',
            name: 'Instagram',
            value: videoSource.instagram,
            color: VIDEO_SOURCE_COLORS.instagram,
          },
          {
            key: 'upload',
            name: 'Direct Upload',
            value: videoSource.upload,
            color: VIDEO_SOURCE_COLORS.upload,
          },
        ],
      },
    ];
  }, [videoSource]);

  const totalVideos = videoSource.total || videoSource.tiktok + videoSource.instagram + videoSource.upload;

  return (
    <div style={cardStyle}>
      <h3 style={sectionTitleStyle}>Video Source Distribution</h3>

      <div style={{ display: 'flex', gap: `${SPACING.xl}px`, alignItems: 'center', flexWrap: 'wrap' }}>
        {/* Donut Chart */}
        <div style={{ flex: '1 1 200px', minWidth: '200px', height: '200px' }}>
          <PolarisVizProvider>
            <DonutChart data={donutData} theme="Light" legendPosition="right" />
          </PolarisVizProvider>
        </div>

        {/* Stats summary */}
        <div style={{ flex: '1 1 150px' }}>
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: `${SPACING.md}px`,
            }}
          >
            <div
              style={{
                padding: `${SPACING.md}px`,
                backgroundColor: COLORS.gray50,
                borderRadius: RADIUS.md,
                textAlign: 'center',
              }}
            >
              <p style={{ fontSize: '24px', fontWeight: 600, color: COLORS.textPrimary }}>
                {totalVideos}
              </p>
              <p style={{ fontSize: '12px', color: COLORS.textMuted }}>Total Videos</p>
            </div>

            {/* Breakdown */}
            <div style={{ fontSize: '13px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                <span style={{ color: VIDEO_SOURCE_COLORS.tiktok }}>TikTok</span>
                <span style={{ color: COLORS.textSecondary }}>{videoSource.tiktok}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                <span style={{ color: VIDEO_SOURCE_COLORS.instagram }}>Instagram</span>
                <span style={{ color: COLORS.textSecondary }}>{videoSource.instagram}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: VIDEO_SOURCE_COLORS.upload }}>Direct Upload</span>
                <span style={{ color: COLORS.textSecondary }}>{videoSource.upload}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
