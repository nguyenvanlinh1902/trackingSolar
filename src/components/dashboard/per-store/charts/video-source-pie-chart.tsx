'use client';

import { useMemo, CSSProperties } from 'react';
import { ResponsivePie } from '@nivo/pie';
import type { VideoSourceMetrics } from '@/types/survey-metrics';
import { COLORS, RADIUS, SPACING } from '@/lib/constants';
import { cardStyle, sectionTitleStyle } from '@/lib/styles';

const VIDEO_SOURCE_COLORS = {
  tiktok: '#FF0050',
  instagram: '#E4405F',
  upload: COLORS.primary,
} as const;

interface VideoSourcePieChartProps {
  data: VideoSourceMetrics | null;
  loading?: boolean;
}

const styles = {
  card: cardStyle as CSSProperties,
  title: sectionTitleStyle as CSSProperties,
  container: {
    display: 'flex',
    gap: `${SPACING.xl}px`,
    alignItems: 'center',
    flexWrap: 'wrap',
  } as CSSProperties,
  chartWrapper: {
    flex: '1 1 200px',
    minWidth: '200px',
    height: '200px',
  } as CSSProperties,
  emptyState: {
    flex: '1 1 200px',
    minWidth: '200px',
    height: '200px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: COLORS.textMuted,
  } as CSSProperties,
  statsContainer: {
    flex: '1 1 150px',
    display: 'flex',
    flexDirection: 'column',
    gap: `${SPACING.md}px`,
  } as CSSProperties,
  totalCard: {
    padding: `${SPACING.md}px`,
    backgroundColor: COLORS.gray50,
    borderRadius: RADIUS.md,
    textAlign: 'center',
  } as CSSProperties,
  totalValue: {
    fontSize: '24px',
    fontWeight: 600,
    color: COLORS.textPrimary,
  } as CSSProperties,
  totalLabel: {
    fontSize: '12px',
    color: COLORS.textMuted,
  } as CSSProperties,
};

function useChartData(data: VideoSourceMetrics | null) {
  return useMemo(() => {
    if (!data) return { pieData: [], total: 0 };

    const tiktok = data.tiktok ?? 0;
    const instagram = data.instagram ?? 0;
    const upload = data.upload ?? 0;
    const total = data.total ?? tiktok + instagram + upload;

    const pieData = [
      { key: 'tiktok', name: 'TikTok', value: tiktok, color: VIDEO_SOURCE_COLORS.tiktok },
      { key: 'instagram', name: 'Instagram', value: instagram, color: VIDEO_SOURCE_COLORS.instagram },
      { key: 'upload', name: 'Direct Upload', value: upload, color: VIDEO_SOURCE_COLORS.upload },
    ].filter((item) => item.value > 0);

    return { pieData, total };
  }, [data]);
}

interface StatRowProps {
  label: string;
  value: number;
  color: string;
}

function StatRow({ label, value, color }: StatRowProps) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
      <span style={{ color }}>{label}</span>
      <span style={{ color: COLORS.textSecondary }}>{value}</span>
    </div>
  );
}

export function VideoSourcePieChart({ data, loading }: VideoSourcePieChartProps) {
  const { pieData, total } = useChartData(data);

  if (loading) {
    return (
      <div style={styles.card}>
        <h3 style={styles.title}>Tỷ lệ Video theo nguồn</h3>
        <div style={styles.emptyState}>Loading...</div>
      </div>
    );
  }

  return (
    <div style={styles.card}>
      <h3 style={styles.title}>Tỷ lệ Video theo nguồn</h3>

      <div style={styles.container}>
        {pieData.length > 0 ? (
          <div style={styles.chartWrapper}>
            <ResponsivePie
              data={pieData.map((d) => ({
                id: d.key,
                label: d.name,
                value: d.value,
                color: d.color,
              }))}
              margin={{ top: 10, right: 60, bottom: 10, left: 10 }}
              innerRadius={0.6}
              padAngle={1}
              cornerRadius={3}
              colors={(datum) => datum.data.color as string}
              enableArcLabels={false}
              arcLinkLabelsSkipAngle={10}
              legends={[
                {
                  anchor: 'right',
                  direction: 'column',
                  translateX: 16,
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
          <div style={styles.emptyState}>No video data</div>
        )}

        <div style={styles.statsContainer as CSSProperties}>
          <div style={styles.totalCard as CSSProperties}>
            <p style={styles.totalValue}>{total}</p>
            <p style={styles.totalLabel}>Total Videos</p>
          </div>
          <div style={{ fontSize: '13px' }}>
            <StatRow label="TikTok" value={data?.tiktok ?? 0} color={VIDEO_SOURCE_COLORS.tiktok} />
            <StatRow label="Instagram" value={data?.instagram ?? 0} color={VIDEO_SOURCE_COLORS.instagram} />
            <StatRow label="Direct Upload" value={data?.upload ?? 0} color={VIDEO_SOURCE_COLORS.upload} />
          </div>
        </div>
      </div>
    </div>
  );
}
