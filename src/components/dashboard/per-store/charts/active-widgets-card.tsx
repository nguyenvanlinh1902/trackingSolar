'use client';

import { CSSProperties } from 'react';
import { COLORS, RADIUS, SPACING } from '@/lib/constants';
import { cardStyle } from '@/lib/styles';

interface ActiveWidgetsCardProps {
  totalWidgets: number;
  activeWidgets: number;
  loading?: boolean;
}

const styles = {
  card: {
    ...cardStyle,
    minHeight: '120px',
  } as CSSProperties,
  title: {
    fontSize: '14px',
    fontWeight: 600,
    color: COLORS.textPrimary,
    marginBottom: `${SPACING.lg}px`,
  } as CSSProperties,
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr)',
    gap: `${SPACING.md}px`,
  } as CSSProperties,
  statCard: (borderColor: string): CSSProperties => ({
    padding: `${SPACING.md}px`,
    backgroundColor: COLORS.gray50,
    borderRadius: RADIUS.md,
    borderLeft: `4px solid ${borderColor}`,
    textAlign: 'center',
  }),
  statValue: {
    fontSize: '28px',
    fontWeight: 700,
    color: COLORS.textPrimary,
    lineHeight: 1.2,
  } as CSSProperties,
  statLabel: {
    fontSize: '12px',
    color: COLORS.textMuted,
    marginTop: '4px',
  } as CSSProperties,
  loading: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    height: '80px',
    color: COLORS.textMuted,
  } as CSSProperties,
};

export function ActiveWidgetsCard({ totalWidgets, activeWidgets, loading }: ActiveWidgetsCardProps) {
  const inactiveWidgets = totalWidgets - activeWidgets;

  if (loading) {
    return (
      <div style={styles.card}>
        <h4 style={styles.title}>Số lượng Widget Active</h4>
        <div style={styles.loading}>Loading...</div>
      </div>
    );
  }

  return (
    <div style={styles.card}>
      <h4 style={styles.title}>Số lượng Widget Active</h4>
      <div style={styles.grid}>
        <div style={styles.statCard(COLORS.primary)}>
          <p style={styles.statValue}>{totalWidgets}</p>
          <p style={styles.statLabel}>Total</p>
        </div>
        <div style={styles.statCard(COLORS.success)}>
          <p style={styles.statValue}>{activeWidgets}</p>
          <p style={styles.statLabel}>Active</p>
        </div>
        <div style={styles.statCard(COLORS.textMuted)}>
          <p style={styles.statValue}>{inactiveWidgets}</p>
          <p style={styles.statLabel}>Inactive</p>
        </div>
      </div>
    </div>
  );
}
