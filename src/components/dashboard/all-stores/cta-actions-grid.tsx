'use client';

import { useState } from 'react';
import type { CTAActionCount } from '@/types/survey-metrics';
import { COLORS, RADIUS, SPACING } from '@/lib/constants';

interface CtaActionsGridProps {
  ctaActions: CTAActionCount[];
}

export function CtaActionsGrid({ ctaActions }: CtaActionsGridProps) {
  if (!ctaActions?.length) return null;

  return (
    <div style={{ marginTop: `${SPACING['2xl']}px` }}>
      <p style={{
        fontSize: '16px',
        color: COLORS.textPrimary,
        marginBottom: `${SPACING.lg}px`,
        fontWeight: 700,
        letterSpacing: '0.01em',
      }}>
        CTA Actions
      </p>
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
        gap: `${SPACING.lg}px`,
      }}>
        {ctaActions.map((action, i) => (
          <CtaActionCard key={i} action={action} />
        ))}
      </div>
    </div>
  );
}

function CtaActionCard({ action }: { action: CTAActionCount }) {
  const [isHovered, setIsHovered] = useState(false);
  const total = action.count ?? (action.desktop + action.mobile);
  const mobilePercentage = total > 0 ? (action.mobile / total) * 100 : 0;
  const desktopPercentage = total > 0 ? (action.desktop / total) * 100 : 0;

  return (
    <div
      style={{
        padding: `${SPACING.lg}px ${SPACING.xl}px`,
        background: 'rgba(255, 255, 255, 0.05)',
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
        borderRadius: RADIUS.lg,
        border: '1px solid rgba(255, 255, 255, 0.1)',
        fontSize: '13px',
        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        transform: isHovered ? 'translateY(-2px)' : 'translateY(0)',
        boxShadow: isHovered
          ? '0 8px 20px rgba(0, 0, 0, 0.12)'
          : '0 2px 8px rgba(0, 0, 0, 0.08)',
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <p style={{
        color: COLORS.textPrimary,
        marginBottom: `${SPACING.md}px`,
        fontWeight: 700,
        fontSize: '14px',
      }}>
        {action.action}
      </p>

      {/* Device breakdown */}
      <div style={{ display: 'flex', gap: `${SPACING.lg}px`, marginBottom: `${SPACING.md}px` }}>
        <div style={{ flex: 1 }}>
          <span style={{ fontSize: '11px', color: COLORS.textMuted, fontWeight: 600, textTransform: 'uppercase' }}>
            Desktop
          </span>
          <div style={{ marginTop: '4px' }}>
            <strong style={{ fontSize: '18px', fontWeight: 700, color: COLORS.textPrimary }}>
              {action.desktop}
            </strong>
            <span style={{ fontSize: '12px', color: COLORS.textMuted, marginLeft: '6px' }}>
              ({desktopPercentage.toFixed(0)}%)
            </span>
          </div>
        </div>
        <div style={{ flex: 1 }}>
          <span style={{ fontSize: '11px', color: COLORS.textMuted, fontWeight: 600, textTransform: 'uppercase' }}>
            Mobile
          </span>
          <div style={{ marginTop: '4px' }}>
            <strong style={{ fontSize: '18px', fontWeight: 700, color: COLORS.textPrimary }}>
              {action.mobile}
            </strong>
            <span style={{ fontSize: '12px', color: COLORS.textMuted, marginLeft: '6px' }}>
              ({mobilePercentage.toFixed(0)}%)
            </span>
          </div>
        </div>
      </div>

      {/* Total with visual separator */}
      <div style={{
        borderTop: '1px solid rgba(255, 255, 255, 0.1)',
        paddingTop: `${SPACING.md}px`,
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
      }}>
        <span style={{ fontSize: '12px', color: COLORS.textMuted, fontWeight: 600 }}>Total</span>
        <span style={{
          fontSize: '20px',
          color: COLORS.textPrimary,
          fontWeight: 800,
        }}>
          {total.toLocaleString()}
        </span>
      </div>

      {/* Progress bar visualization */}
      <div style={{ marginTop: `${SPACING.md}px`, display: 'flex', gap: '2px', height: '4px', borderRadius: '2px', overflow: 'hidden' }}>
        <div style={{
          width: `${desktopPercentage}%`,
          background: 'linear-gradient(90deg, #3B82F6, #2563EB)',
          transition: 'width 0.5s ease',
        }} />
        <div style={{
          width: `${mobilePercentage}%`,
          background: 'linear-gradient(90deg, #8B5CF6, #7C3AED)',
          transition: 'width 0.5s ease',
        }} />
      </div>
    </div>
  );
}
