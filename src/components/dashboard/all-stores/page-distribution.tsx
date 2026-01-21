'use client';

import { useState } from 'react';
import { COLORS, RADIUS, SPACING } from '@/lib/constants';

interface PageDistributionProps {
  productPagesCount: number;
  otherPagesCount: number;
}

export function PageDistribution({ productPagesCount, otherPagesCount }: PageDistributionProps) {
  if (productPagesCount === 0 && otherPagesCount === 0) return null;

  const total = productPagesCount + otherPagesCount;
  const productPercentage = total > 0 ? (productPagesCount / total) * 100 : 0;
  const otherPercentage = total > 0 ? (otherPagesCount / total) * 100 : 0;

  return (
    <div style={{ marginTop: `${SPACING['2xl']}px` }}>
      <h4 style={{
        fontSize: '16px',
        fontWeight: 700,
        color: COLORS.textPrimary,
        marginBottom: `${SPACING.lg}px`,
        letterSpacing: '0.01em',
      }}>
        Page Distribution
      </h4>
      <div style={{ display: 'flex', gap: `${SPACING.lg}px` }}>
        <PageCountCard
          label="Product Pages"
          count={productPagesCount}
          percentage={productPercentage}
          color={COLORS.primary}
          gradient="linear-gradient(135deg, #3B82F6, #2563EB)"
        />
        <PageCountCard
          label="Other Pages"
          count={otherPagesCount}
          percentage={otherPercentage}
          color={COLORS.secondary}
          gradient="linear-gradient(135deg, #8B5CF6, #7C3AED)"
        />
      </div>
    </div>
  );
}

interface PageCountCardProps {
  label: string;
  count: number;
  percentage: number;
  color: string;
  gradient: string;
}

function PageCountCard({ label, count, percentage, color, gradient }: PageCountCardProps) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      style={{
        flex: 1,
        padding: `${SPACING.xl}px`,
        background: 'rgba(255, 255, 255, 0.05)',
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
        borderRadius: RADIUS.lg,
        borderLeft: `4px solid ${color}`,
        border: '1px solid rgba(255, 255, 255, 0.1)',
        borderLeftWidth: '4px',
        borderLeftColor: color,
        textAlign: 'center',
        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        transform: isHovered ? 'translateY(-4px)' : 'translateY(0)',
        boxShadow: isHovered
          ? `0 12px 24px rgba(0, 0, 0, 0.15), 0 0 0 1px ${color}40`
          : '0 4px 16px rgba(0, 0, 0, 0.1)',
        cursor: 'pointer',
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <p style={{
        fontSize: '12px',
        color: COLORS.textMuted,
        marginBottom: `${SPACING.md}px`,
        fontWeight: 700,
        textTransform: 'uppercase',
        letterSpacing: '0.05em',
      }}>
        {label}
      </p>
      <p style={{
        fontSize: '40px',
        fontWeight: 800,
        color: COLORS.textPrimary,
        margin: 0,
        lineHeight: 1,
      }}>
        {count}
      </p>
      <p style={{
        fontSize: '14px',
        color: COLORS.textSecondary,
        marginTop: `${SPACING.sm}px`,
        fontWeight: 600,
      }}>
        {percentage.toFixed(1)}% of total
      </p>
      {/* Progress indicator */}
      <div style={{
        marginTop: `${SPACING.md}px`,
        width: '100%',
        height: '4px',
        background: 'rgba(0, 0, 0, 0.1)',
        borderRadius: '2px',
        overflow: 'hidden',
      }}>
        <div style={{
          width: `${percentage}%`,
          height: '100%',
          background: gradient,
          transition: 'width 0.5s ease',
        }} />
      </div>
    </div>
  );
}
