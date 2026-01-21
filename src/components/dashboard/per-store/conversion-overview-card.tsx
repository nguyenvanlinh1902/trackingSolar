'use client';

import { COLORS, RADIUS, SPACING, formatCurrency } from '@/lib/constants';

interface ConversionOverviewData {
  currency: string;
  totalOrders: number;
  totalRevenue: number;
  inVideoOrders: number;
  inVideoRevenue: number;
  postVideoOrders: number;
  postVideoRevenue: number;
  totalViews: number;
  cvr: number;
}

interface ConversionOverviewCardProps {
  stats: ConversionOverviewData;
}

const styles = {
  card: {
    padding: `${SPACING['2xl']}px`,
    borderRadius: RADIUS.xl,
    background: 'rgba(255, 255, 255, 0.05)',
    backdropFilter: 'blur(12px)',
    WebkitBackdropFilter: 'blur(12px)',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.12), 0 2px 8px rgba(0, 0, 0, 0.08)',
  },
  header: {
    display: 'flex',
    alignItems: 'center',
    gap: `${SPACING.md}px`,
    marginBottom: `${SPACING.xl}px`,
  },
  icon: {
    fontSize: '32px',
    width: '56px',
    height: '56px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: RADIUS.lg,
    background: 'linear-gradient(135deg, #10B981 0%, #059669 100%)',
    boxShadow: '0 4px 12px rgba(16, 185, 129, 0.3)',
  },
  title: {
    fontSize: '20px',
    fontWeight: 700,
    color: COLORS.textPrimary,
    margin: 0,
  },
  subtitle: {
    fontSize: '13px',
    color: COLORS.textMuted,
    marginTop: '4px',
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: `${SPACING.lg}px`,
  },
  metricBox: (gradient: string) => ({
    padding: `${SPACING.lg}px`,
    borderRadius: RADIUS.md,
    background: 'rgba(255, 255, 255, 0.03)',
    border: '1px solid rgba(255, 255, 255, 0.08)',
    position: 'relative' as const,
    overflow: 'hidden' as const,
    '::before': {
      content: '""',
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      height: '3px',
      background: gradient,
    },
  }),
  metricLabel: {
    fontSize: '12px',
    color: COLORS.textMuted,
    textTransform: 'uppercase' as const,
    letterSpacing: '0.05em',
    fontWeight: 600,
    marginBottom: '8px',
  },
  metricValue: {
    fontSize: '28px',
    fontWeight: 800,
    color: COLORS.textPrimary,
    lineHeight: 1,
  },
  metricSubtext: {
    fontSize: '11px',
    color: COLORS.textSecondary,
    marginTop: '6px',
  },
  divider: {
    height: '1px',
    background: 'rgba(255, 255, 255, 0.08)',
    margin: `${SPACING.xl}px 0`,
  },
  breakdownSection: {
    marginTop: `${SPACING.xl}px`,
  },
  breakdownTitle: {
    fontSize: '14px',
    fontWeight: 600,
    color: COLORS.textSecondary,
    marginBottom: `${SPACING.md}px`,
    textTransform: 'uppercase' as const,
    letterSpacing: '0.05em',
  },
  breakdownGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(2, 1fr)',
    gap: `${SPACING.md}px`,
  },
  breakdownItem: (borderColor: string) => ({
    padding: `${SPACING.md}px`,
    borderRadius: RADIUS.md,
    background: 'rgba(255, 255, 255, 0.02)',
    borderLeft: `3px solid ${borderColor}`,
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  }),
  breakdownLabel: {
    fontSize: '13px',
    color: COLORS.textSecondary,
    fontWeight: 500,
  },
  breakdownValue: {
    fontSize: '16px',
    fontWeight: 700,
    color: COLORS.textPrimary,
  },
};

export function ConversionOverviewCard({ stats }: ConversionOverviewCardProps) {
  const inVideoPercentage = stats.totalOrders > 0
    ? ((stats.inVideoOrders / stats.totalOrders) * 100).toFixed(1)
    : '0';

  const postVideoPercentage = stats.totalOrders > 0
    ? ((stats.postVideoOrders / stats.totalOrders) * 100).toFixed(1)
    : '0';

  return (
    <div style={styles.card}>
      {/* Header */}
      <div style={styles.header}>
        <div style={styles.icon}>📊</div>
        <div>
          <h3 style={styles.title}>Conversion Overview</h3>
          <p style={styles.subtitle}>Performance metrics and revenue breakdown</p>
        </div>
      </div>

      {/* Main Metrics */}
      <div style={styles.grid}>
        {/* Total Views */}
        <div style={styles.metricBox('linear-gradient(135deg, #3B82F6 0%, #2563EB 100%)')}>
          <div style={styles.metricLabel}>Total Views</div>
          <div style={styles.metricValue}>{stats.totalViews.toLocaleString()}</div>
          <div style={styles.metricSubtext}>Video impressions</div>
        </div>

        {/* Total Orders */}
        <div style={styles.metricBox('linear-gradient(135deg, #10B981 0%, #059669 100%)')}>
          <div style={styles.metricLabel}>Total Orders</div>
          <div style={styles.metricValue}>{stats.totalOrders}</div>
          <div style={styles.metricSubtext}>Completed purchases</div>
        </div>

        {/* Total Revenue */}
        <div style={styles.metricBox('linear-gradient(135deg, #F59E0B 0%, #D97706 100%)')}>
          <div style={styles.metricLabel}>Total Revenue</div>
          <div style={styles.metricValue}>{formatCurrency(stats.totalRevenue)}</div>
          <div style={styles.metricSubtext}>{stats.currency}</div>
        </div>

        {/* Conversion Rate */}
        <div style={styles.metricBox('linear-gradient(135deg, #EC4899 0%, #DB2777 100%)')}>
          <div style={styles.metricLabel}>Conversion Rate</div>
          <div style={styles.metricValue}>{stats.cvr.toFixed(2)}%</div>
          <div style={styles.metricSubtext}>Views to orders</div>
        </div>
      </div>

      <div style={styles.divider} />

      {/* Revenue Breakdown */}
      <div style={styles.breakdownSection}>
        <div style={styles.breakdownTitle}>Revenue Breakdown</div>
        <div style={styles.breakdownGrid}>
          <div style={styles.breakdownItem('#8B5CF6')}>
            <span style={styles.breakdownLabel}>In-Video Revenue</span>
            <span style={styles.breakdownValue}>{formatCurrency(stats.inVideoRevenue)}</span>
          </div>
          <div style={styles.breakdownItem('#06B6D4')}>
            <span style={styles.breakdownLabel}>Post-Video Revenue</span>
            <span style={styles.breakdownValue}>{formatCurrency(stats.postVideoRevenue)}</span>
          </div>
        </div>
      </div>

      {/* Orders Breakdown */}
      <div style={styles.breakdownSection}>
        <div style={styles.breakdownTitle}>Orders Breakdown</div>
        <div style={styles.breakdownGrid}>
          <div style={styles.breakdownItem('#8B5CF6')}>
            <span style={styles.breakdownLabel}>
              In-Video Orders ({inVideoPercentage}%)
            </span>
            <span style={styles.breakdownValue}>{stats.inVideoOrders}</span>
          </div>
          <div style={styles.breakdownItem('#06B6D4')}>
            <span style={styles.breakdownLabel}>
              Post-Video Orders ({postVideoPercentage}%)
            </span>
            <span style={styles.breakdownValue}>{stats.postVideoOrders}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
