'use client';

import { useMemo, CSSProperties, useState } from 'react';
import { COLORS, RADIUS, SPACING } from '@/lib/constants';
import { useAllStoresContext } from '@/contexts/all-stores-context';
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

function useMetricsData(loading: boolean, allStoresData: any): Metric[] {
  return useMemo(() => {
    const totalUploads = allStoresData?.videoSource?.upload ?? allStoresData?.videoSource?.total ?? 0;
    const averageFileSize = allStoresData?.averageFileSize;
    const successRate = allStoresData?.uploadSuccessRate;
    const failedRate = typeof successRate === 'number' ? 100 - successRate : undefined;
    const averageUploadTime = allStoresData?.averageUploadTime;

    const format = (value: number | undefined, unit: string) =>
      value != null && !loading ? `${Number(value).toFixed(1)}${unit}` : 'N/A';

    return [
      {
        label: 'Tổng số video được upload',
        value: loading ? '…' : totalUploads.toLocaleString(),
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
        value: !loading && typeof successRate === 'number'
          ? `${Number(successRate).toFixed(1)}% / ${Number(failedRate ?? 0).toFixed(1)}%`
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

export function VideoUploadAnalytics() {
  const ctx = useAllStoresContext();
  const metrics = useMetricsData(ctx.loading, ctx.data);

  return (
    <div style={glassCardStyle}>
      <div style={sectionHeaderStyle}>
        <div style={iconContainerStyle(GRADIENTS.blue)}>📊</div>
        <h3 style={sectionTitleStyle}>Video Upload Analytics</h3>
      </div>
      <div style={styles.grid}>
        {metrics.map((metric, idx) => (
          <MetricCard key={idx} metric={metric} />
        ))}
      </div>
    </div>
  );
}
