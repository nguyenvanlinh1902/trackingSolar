'use client';

import { useMemo } from 'react';
import { ResponsiveLine } from '@nivo/line';
import type { VideoTrendMetrics } from '@/types/survey-metrics';
import { COLORS, RADIUS, SPACING, formatDate } from '@/lib/constants';
import { cardStyle } from '@/lib/styles';

interface VideoTrendProps {
  videoTrend: VideoTrendMetrics;
}

// Video trend colors
const VIDEO_TREND_COLORS = {
  views: COLORS.primary,
  likes: COLORS.success,
  shares: COLORS.info,
} as const;

export function VideoTrend({ videoTrend }: VideoTrendProps) {
  const lineChartData = useMemo(() => {
    const parseTimeSeries = (timeSeries: TimeSeriesDataPoint[]) => {
      if (!Array.isArray(timeSeries) || timeSeries.length === 0) return [];
      return timeSeries
        .map((d) => {
          const date = d.date || '';
          const value = typeof d.value === 'number' ? d.value : 0;
          return { x: date, y: value };
        })
        .filter((item) => item.x && typeof item.y === 'number');
    };

    const viewsData = parseTimeSeries(videoTrend?.views || []);
    const likesData = parseTimeSeries(videoTrend?.likes || []);
    const sharesData = parseTimeSeries(videoTrend?.shares || []);

    return [
      {
        id: 'Views',
        data: viewsData,
        color: VIDEO_TREND_COLORS.views,
      },
      {
        id: 'Likes',
        data: likesData,
        color: VIDEO_TREND_COLORS.likes,
      },
      {
        id: 'Shares',
        data: sharesData,
        color: VIDEO_TREND_COLORS.shares,
      },
    ];
  }, [videoTrend]);

  const hasData = lineChartData.some((series) => series.data.length > 0);

  return (
    <div style={cardStyle}>
      <h3
        style={{
          fontSize: '16px',
          fontWeight: 600,
          color: COLORS.textPrimary,
          marginBottom: `${SPACING.lg}px`,
        }}
      >
        Video Trend
      </h3>
      {hasData ? (
        <div style={{ height: '250px' }}>
          <ResponsiveLine
            data={lineChartData.filter((series) => series.data.length > 0)}
            margin={{ top: 20, right: 24, bottom: 40, left: 56 }}
            xScale={{ type: 'point' }}
            yScale={{ type: 'linear', min: 'auto', max: 'auto', stacked: false }}
            axisBottom={{
              tickRotation: -45,
              format: (value) => (value ? formatDate(String(value)) : ''),
            }}
            axisLeft={{
              tickSize: 0,
              tickPadding: 8,
            }}
            colors={(series) => (series.color as string)}
            lineWidth={2}
            pointSize={6}
            pointBorderWidth={2}
            useMesh
            enableGridX={false}
            legends={[
              {
                anchor: 'top-right',
                direction: 'row',
                justify: false,
                translateX: 0,
                translateY: -20,
                itemsSpacing: 20,
                itemDirection: 'left-to-right',
                itemWidth: 80,
                itemHeight: 20,
                itemOpacity: 0.9,
                symbolSize: 10,
                symbolShape: 'circle',
                effects: [
                  {
                    on: 'hover',
                    style: {
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
            backgroundColor: COLORS.gray50,
            borderRadius: RADIUS.md,
          }}
        >
          No video trend data available
        </div>
      )}
    </div>
  );
}

