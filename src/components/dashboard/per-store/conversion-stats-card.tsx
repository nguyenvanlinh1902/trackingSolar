'use client';

import { COLORS, RADIUS, SPACING, formatCurrency } from '@/lib/constants';
import { cardStyle } from '@/lib/styles';

interface ConversionStatsData {
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

interface ConversionStatsCardProps {
  stats: ConversionStatsData;
}

const styles = {
  gridContainer: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
    gap: `${SPACING.lg}px`,
    marginTop: `${SPACING.lg}px`,
  },
  statCard: (borderColor: string) => ({
    padding: `${SPACING.lg}px`,
    background: 'rgba(255, 255, 255, 0.05)',
    backdropFilter: 'blur(8px)',
    WebkitBackdropFilter: 'blur(8px)',
    borderRadius: RADIUS.md,
    borderLeft: `4px solid ${borderColor}`,
    transition: 'transform 0.2s ease',
  }),
  statValue: {
    fontSize: '24px',
    fontWeight: 700,
    color: COLORS.textPrimary,
    marginBottom: '4px',
  },
  statLabel: {
    fontSize: '12px',
    color: COLORS.textMuted,
    textTransform: 'uppercase' as const,
    letterSpacing: '0.05em',
    fontWeight: 600,
  },
  sectionTitle: {
    fontSize: '16px',
    fontWeight: 600,
    color: COLORS.textPrimary,
    marginBottom: `${SPACING.md}px`,
  },
};

export function ConversionStatsCard({ stats }: ConversionStatsCardProps) {
  return (
    <div style={cardStyle}>
      <h3 style={styles.sectionTitle}>Conversion Statistics</h3>

      <div style={styles.gridContainer}>
        {/* Total Views */}
        <div style={styles.statCard('#3B82F6')}>
          <div style={styles.statValue}>{stats.totalViews.toLocaleString()}</div>
          <div style={styles.statLabel}>Total Views</div>
        </div>

        {/* Total Orders */}
        <div style={styles.statCard('#10B981')}>
          <div style={styles.statValue}>{stats.totalOrders}</div>
          <div style={styles.statLabel}>Total Orders</div>
        </div>

        {/* Total Revenue */}
        <div style={styles.statCard('#F59E0B')}>
          <div style={styles.statValue}>{formatCurrency(stats.totalRevenue)}</div>
          <div style={styles.statLabel}>Total Revenue ({stats.currency})</div>
        </div>

        {/* CVR */}
        <div style={styles.statCard('#EC4899')}>
          <div style={styles.statValue}>{stats.cvr.toFixed(2)}%</div>
          <div style={styles.statLabel}>Conversion Rate</div>
        </div>

        {/* In-Video Orders */}
        <div style={styles.statCard('#8B5CF6')}>
          <div style={styles.statValue}>{stats.inVideoOrders}</div>
          <div style={styles.statLabel}>In-Video Orders</div>
        </div>

        {/* In-Video Revenue */}
        <div style={styles.statCard('#06B6D4')}>
          <div style={styles.statValue}>{formatCurrency(stats.inVideoRevenue)}</div>
          <div style={styles.statLabel}>In-Video Revenue</div>
        </div>

        {/* Post-Video Orders */}
        <div style={styles.statCard('#EF4444')}>
          <div style={styles.statValue}>{stats.postVideoOrders}</div>
          <div style={styles.statLabel}>Post-Video Orders</div>
        </div>

        {/* Post-Video Revenue */}
        <div style={styles.statCard('#F97316')}>
          <div style={styles.statValue}>{formatCurrency(stats.postVideoRevenue)}</div>
          <div style={styles.statLabel}>Post-Video Revenue</div>
        </div>
      </div>
    </div>
  );
}
