'use client';

import { useMemo } from 'react';
import { ResponsivePie } from '@nivo/pie';
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
    if (!videoSource) {
      return [];
    }
    
    const tiktok = typeof videoSource.tiktok === 'number' ? videoSource.tiktok : 0;
    const instagram = typeof videoSource.instagram === 'number' ? videoSource.instagram : 0;
    const upload = typeof videoSource.upload === 'number' ? videoSource.upload : 0;
    
    const data = [
      {
        key: 'tiktok',
        name: 'TikTok',
        value: tiktok,
        color: VIDEO_SOURCE_COLORS.tiktok,
      },
      {
        key: 'instagram',
        name: 'Instagram',
        value: instagram,
        color: VIDEO_SOURCE_COLORS.instagram,
      },
      {
        key: 'upload',
        name: 'Direct Upload',
        value: upload,
        color: VIDEO_SOURCE_COLORS.upload,
      },
    ].filter(item => item.value > 0); // Only show sources with count > 0
    
    return data;
  }, [videoSource]);

  const totalVideos = useMemo(() => {
    if (!videoSource) return 0;
    return videoSource.total || 
           ((typeof videoSource.tiktok === 'number' ? videoSource.tiktok : 0) +
            (typeof videoSource.instagram === 'number' ? videoSource.instagram : 0) +
            (typeof videoSource.upload === 'number' ? videoSource.upload : 0));
  }, [videoSource]);

  return (
    <div style={cardStyle}>
      <h3 style={sectionTitleStyle}>Video Source Distribution</h3>

      <div style={{ display: 'flex', gap: `${SPACING.xl}px`, alignItems: 'center', flexWrap: 'wrap' }}>
        {/* Donut Chart */}
        {donutData && donutData.length > 0 ? (
          <div style={{ flex: '1 1 200px', minWidth: '200px', height: '200px' }}>
            <ResponsivePie
              data={donutData.map((d) => ({
                id: d.key,
                label: d.name,
                value: d.value,
                color: d.color,
              }))}
              margin={{ top: 10, right: 60, bottom: 10, left: 10 }}
              innerRadius={0.6}
              padAngle={1}
              cornerRadius={3}
              colors={(datum) => (datum.data.color as string)}
              enableArcLabels={false}
              arcLinkLabelsSkipAngle={10}
              legends={[
                {
                  anchor: 'right',
                  direction: 'column',
                  justify: false,
                  translateX: 16,
                  translateY: 0,
                  itemsSpacing: 4,
                  itemWidth: 80,
                  itemHeight: 18,
                  itemTextColor: COLORS.textSecondary,
                  symbolSize: 10,
                  symbolShape: 'circle',
                },
              ]}
            />
          </div>
        ) : (
          <div style={{ flex: '1 1 200px', minWidth: '200px', height: '200px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: COLORS.textMuted }}>
            No video data available
          </div>
        )}

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
              {videoSource && (
                <>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                    <span style={{ color: VIDEO_SOURCE_COLORS.tiktok }}>TikTok</span>
                    <span style={{ color: COLORS.textSecondary }}>{typeof videoSource.tiktok === 'number' ? videoSource.tiktok : 0}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                    <span style={{ color: VIDEO_SOURCE_COLORS.instagram }}>Instagram</span>
                    <span style={{ color: COLORS.textSecondary }}>{typeof videoSource.instagram === 'number' ? videoSource.instagram : 0}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: VIDEO_SOURCE_COLORS.upload }}>Direct Upload</span>
                    <span style={{ color: COLORS.textSecondary }}>{typeof videoSource.upload === 'number' ? videoSource.upload : 0}</span>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
