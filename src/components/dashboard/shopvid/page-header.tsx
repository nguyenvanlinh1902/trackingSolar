'use client';

import { headerStyle, flexBetween, buttonStyle } from '@/lib/styles';
import { COLORS, LAYOUT, PERIOD_OPTIONS } from '@/lib/constants';
import type { PeriodType } from '@/services/analytics-service';

interface PageHeaderProps {
  title: string;
  period?: PeriodType;
  onPeriodChange?: (period: PeriodType) => void;
  children?: React.ReactNode;
}

export function PageHeader({ title, period, onPeriodChange, children }: PageHeaderProps) {
  return (
    <div style={headerStyle}>
      <div style={{ ...flexBetween, maxWidth: LAYOUT.maxWidth, margin: '0 auto' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <h1 style={{ fontSize: '20px', fontWeight: 600, color: COLORS.textPrimary }}>{title}</h1>
          {children}
        </div>

        {period && onPeriodChange && (
          <div style={{ display: 'flex', gap: '8px' }}>
            {PERIOD_OPTIONS.map((p) => (
              <button
                key={p.value}
                onClick={() => onPeriodChange(p.value as PeriodType)}
                style={buttonStyle(period === p.value)}
              >
                {p.label}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
