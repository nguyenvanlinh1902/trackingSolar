'use client';

import { useMemo, CSSProperties, useState } from 'react';
import { COLORS, RADIUS, SPACING } from '@/lib/constants';
import { useAllStoresContext } from '@/contexts/all-stores-context';
import type { AllStoresMetricsData } from '@/types/all-stores-metrics';
import {
  glassCardStyle,
  sectionHeaderStyle,
  iconContainerStyle,
  sectionTitleStyle,
  GRADIENTS,
} from './shared-styles';

interface Metric {
  label: string;
  value: string;
  color: string;
  icon: string;
  gradient: string;
}

// ============= Styles =============
const styles = {
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
    gap: `${SPACING.xl}px`,
  } as CSSProperties,
};

function useMetricsData(loading: boolean, allStoresData: AllStoresMetricsData | null): Metric[] {
  return useMemo(() => {
    // Get total videos from videoSource
    const totalVideos = allStoresData?.videoSource?.total ?? 0;

    // Calculate average file size from totalFileSize / total videos (convert bytes to MB)
    const totalFileSize = allStoresData?.videoStats?.totalFileSize?.total ?? 0;
    const averageFileSize = totalVideos > 0 ? totalFileSize / totalVideos / 1024 / 1024 : 0;

    // Calculate success rate from uploadStats
    const successful = allStoresData?.uploadStats?.successful?.total ?? 0;
    const failed = allStoresData?.uploadStats?.failed?.total ?? 0;
    const totalAttempts = successful + failed;
    const successRate = totalAttempts > 0 ? (successful / totalAttempts) * 100 : 0;
    const failedRate = totalAttempts > 0 ? (failed / totalAttempts) * 100 : 0;

    // Get average upload time
    const averageUploadTime = allStoresData?.uploadStats?.avgUploadTime;

    const format = (value: number | undefined, unit: string) =>
      value != null && !loading ? `${Number(value).toFixed(1)}${unit}` : 'N/A';

    return [
      {
        label: 'Tổng số video được upload',
        value: loading ? '…' : totalVideos.toLocaleString(),
        color: COLORS.primary,
        icon: '📹',
        gradient: GRADIENTS.blue,
      },
      {
        label: 'Kích thước file trung bình',
        value: format(averageFileSize, ' MB'),
        color: COLORS.success,
        icon: '💾',
        gradient: GRADIENTS.green,
      },
      {
        label: 'Tỷ lệ upload thành công/thất bại',
        value: !loading && totalAttempts > 0
          ? `${Number(successRate).toFixed(1)}% / ${Number(failedRate).toFixed(1)}%`
          : 'N/A',
        color: COLORS.warning,
        icon: '✓',
        gradient: GRADIENTS.orange,
      },
      {
        label: 'Thời gian upload trung bình',
        value: format(averageUploadTime, 's'),
        color: COLORS.info,
        icon: '⚡',
        gradient: GRADIENTS.cyan,
      },
    ];
  }, [allStoresData, loading]);
}

interface MetricCardProps {
  metric: Metric;
}

function MetricCard({ metric }: MetricCardProps) {
  const [isHovered, setIsHovered] = useState(false);

  const cardStyle: CSSProperties = {
    padding: `${SPACING.xl}px`,
    background: 'rgba(255, 255, 255, 0.05)',
    backdropFilter: 'blur(12px)',
    WebkitBackdropFilter: 'blur(12px)',
    borderRadius: RADIUS.lg,
    border: `1px solid rgba(255, 255, 255, 0.1)`,
    borderLeft: `4px solid ${metric.color}`,
    boxShadow: isHovered
      ? `0 12px 24px rgba(0, 0, 0, 0.15), 0 0 0 1px ${metric.color}40`
      : '0 4px 16px rgba(0, 0, 0, 0.1)',
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    cursor: 'pointer',
    position: 'relative',
    overflow: 'hidden',
    transform: isHovered ? 'translateY(-4px)' : 'translateY(0)',
  };

  // Icon badge in top-right with gradient
  const iconBadgeStyle: CSSProperties = {
    position: 'absolute',
    top: '12px',
    right: '12px',
    width: '48px',
    height: '48px',
    borderRadius: '10px',
    background: metric.gradient,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '24px',
    opacity: isHovered ? 0.9 : 0.7,
    transition: 'opacity 0.3s ease',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
  };

  const labelStyle: CSSProperties = {
    margin: 0,
    fontSize: '12px',
    color: COLORS.textMuted,
    fontWeight: 700,
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
    marginBottom: `${SPACING.md}px`,
    paddingRight: '60px',
  };

  const valueStyle: CSSProperties = {
    margin: 0,
    fontSize: '40px',
    fontWeight: 800,
    color: COLORS.textPrimary,
    lineHeight: 1,
  };

  const accentLineStyle: CSSProperties = {
    marginTop: '12px',
    width: '48px',
    height: '4px',
    background: metric.gradient,
    borderRadius: '2px',
    transition: 'width 0.3s ease',
    ...(isHovered && { width: '64px' }),
  };

  return (
    <div
      style={cardStyle}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div style={iconBadgeStyle}>{metric.icon}</div>
      <p style={labelStyle}>{metric.label}</p>
      <p style={valueStyle}>{metric.value}</p>
      <div style={accentLineStyle} />
    </div>
  );
}

// Platform breakdown data
interface PlatformMetrics {
  platform: string;
  color: string;
  icon: string;
  totalVideos: number;
  avgFileSize: number;
  successRate: number;
  avgUploadTime: number;
}

function usePlatformMetrics(loading: boolean, allStoresData: AllStoresMetricsData | null): PlatformMetrics[] {
  return useMemo(() => {
    if (loading || !allStoresData) return [];

    const videoStats = allStoresData?.videoStats;
    const uploadStats = allStoresData?.uploadStats;
    const totalImported = videoStats?.totalImported;
    const totalFileSize = videoStats?.totalFileSize;
    const successful = uploadStats?.successful;
    const failed = uploadStats?.failed;
    const avgUploadTimeByType = uploadStats?.avgUploadTimeByType;

    const platforms = [
      { key: 'tiktok', name: 'TikTok', color: '#FF0050', icon: '🎵' },
      { key: 'instagram', name: 'Instagram', color: '#E4405F', icon: '📷' },
      { key: 'import', name: 'Direct Upload', color: COLORS.primary, icon: '📤' },
      { key: 'shopify', name: 'Shopify', color: '#95BF47', icon: '🛍️' },
    ];

    return platforms.map(({ key, name, color, icon }) => {
      const totalVideos = totalImported?.[key as keyof typeof totalImported] || 0;
      const fileSize = totalFileSize?.[key as keyof typeof totalFileSize] || 0;
      const avgFileSize = totalVideos > 0 ? fileSize / totalVideos / 1024 / 1024 : 0;

      const successCount = successful?.[key as keyof typeof successful] || 0;
      const failedCount = failed?.[key as keyof typeof failed] || 0;
      const totalAttempts = successCount + failedCount;
      const successRate = totalAttempts > 0 ? (successCount / totalAttempts) * 100 : 0;

      const avgUploadTime = (avgUploadTimeByType?.[key] as number) || 0;

      return {
        platform: name,
        color,
        icon,
        totalVideos,
        avgFileSize,
        successRate,
        avgUploadTime,
      };
    }).filter(p => p.totalVideos > 0);
  }, [loading, allStoresData]);
}

interface PlatformCardProps {
  metric: PlatformMetrics;
}

function PlatformCard({ metric }: PlatformCardProps) {
  const [isHovered, setIsHovered] = useState(false);

  const cardStyle: CSSProperties = {
    padding: `${SPACING.lg}px`,
    background: 'rgba(255, 255, 255, 0.05)',
    backdropFilter: 'blur(12px)',
    WebkitBackdropFilter: 'blur(12px)',
    borderRadius: RADIUS.lg,
    border: `1px solid rgba(255, 255, 255, 0.1)`,
    borderLeft: `4px solid ${metric.color}`,
    boxShadow: isHovered
      ? `0 12px 24px rgba(0, 0, 0, 0.15), 0 0 0 1px ${metric.color}40`
      : '0 4px 16px rgba(0, 0, 0, 0.1)',
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    transform: isHovered ? 'translateY(-4px)' : 'translateY(0)',
  };

  const headerStyle: CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    gap: `${SPACING.sm}px`,
    marginBottom: `${SPACING.md}px`,
  };

  const iconStyle: CSSProperties = {
    fontSize: '24px',
  };

  const platformNameStyle: CSSProperties = {
    fontSize: '16px',
    fontWeight: 700,
    color: COLORS.textPrimary,
  };

  const statsGridStyle: CSSProperties = {
    display: 'grid',
    gridTemplateColumns: 'repeat(2, 1fr)',
    gap: `${SPACING.md}px`,
  };

  const statItemStyle: CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    gap: '4px',
  };

  const statLabelStyle: CSSProperties = {
    fontSize: '11px',
    color: COLORS.textMuted,
    fontWeight: 600,
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
  };

  const statValueStyle: CSSProperties = {
    fontSize: '18px',
    fontWeight: 700,
    color: COLORS.textPrimary,
  };

  return (
    <div
      style={cardStyle}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div style={headerStyle}>
        <span style={iconStyle}>{metric.icon}</span>
        <span style={platformNameStyle}>{metric.platform}</span>
      </div>
      <div style={statsGridStyle}>
        <div style={statItemStyle}>
          <span style={statLabelStyle}>Videos</span>
          <span style={statValueStyle}>{metric.totalVideos.toLocaleString()}</span>
        </div>
        <div style={statItemStyle}>
          <span style={statLabelStyle}>Avg Size</span>
          <span style={statValueStyle}>{metric.avgFileSize.toFixed(1)} MB</span>
        </div>
        <div style={statItemStyle}>
          <span style={statLabelStyle}>Success Rate</span>
          <span style={statValueStyle}>{metric.successRate.toFixed(1)}%</span>
        </div>
        <div style={statItemStyle}>
          <span style={statLabelStyle}>Avg Time</span>
          <span style={statValueStyle}>{metric.avgUploadTime.toFixed(1)}s</span>
        </div>
      </div>
    </div>
  );
}

export function VideoUploadAnalytics() {
  const ctx = useAllStoresContext();
  const metrics = useMetricsData(ctx.loading, ctx.data);
  const platformMetrics = usePlatformMetrics(ctx.loading, ctx.data);

  return (
    <div style={glassCardStyle}>
      <div style={sectionHeaderStyle}>
        <div style={iconContainerStyle(GRADIENTS.blue)}>📊</div>
        <h3 style={sectionTitleStyle}>Video Upload Analytics</h3>
      </div>

      {/* Overall Metrics */}
      <div style={styles.grid}>
        {metrics.map((metric, idx) => (
          <MetricCard key={idx} metric={metric} />
        ))}
      </div>

      {/* Platform Breakdown */}
      {platformMetrics.length > 0 && (
        <>
          <div style={{ marginTop: `${SPACING['2xl']}px`, marginBottom: `${SPACING.lg}px` }}>
            <h4 style={{
              fontSize: '14px',
              fontWeight: 700,
              color: COLORS.textSecondary,
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
              margin: 0,
            }}>
              Breakdown by Platform
            </h4>
          </div>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: `${SPACING.lg}px`,
          }}>
            {platformMetrics.map((metric, idx) => (
              <PlatformCard key={idx} metric={metric} />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
