'use client';

import { useState } from 'react';
import { ProtectedRoute } from '@/components/auth/protected-route';
import { usePerStoreMetrics } from '@/hooks/use-per-store-metrics';
import { PerStoreMetrics } from '@/components/dashboard/per-store-metrics';
import { COLORS, SPACING, PERIOD_OPTIONS } from '@/lib/constants';
import { buttonStyle, pageContainerStyle, cardStyle } from '@/lib/styles';
import type { PeriodType } from '@/services/analytics-service';

function PerStoreDashboardContent() {
  const [selectedStoreId, setSelectedStoreId] = useState<string | null>(null);
  const [period, setPeriod] = useState<PeriodType>('THIS_WEEK');

  const { stores, storesLoading, data, loading, error } = usePerStoreMetrics(selectedStoreId, period);

  return (
    <main style={{ backgroundColor: COLORS.background, minHeight: '100vh' }}>
      <div style={pageContainerStyle}>
        {/* Header */}
        <div
          style={{
            ...cardStyle,
            marginBottom: `${SPACING.xl}px`,
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: `${SPACING.lg}px`,
          }}
        >
          <div>
            <h1
              style={{
                fontSize: '24px',
                fontWeight: 600,
                color: COLORS.textPrimary,
                margin: 0,
              }}
            >
              Per Store Metrics
            </h1>
            <p
              style={{
                fontSize: '14px',
                color: COLORS.textMuted,
                marginTop: '4px',
              }}
            >
              View detailed metrics for individual stores
            </p>
          </div>

          {/* Period Selector */}
          <div style={{ display: 'flex', gap: `${SPACING.sm}px`, flexWrap: 'wrap' }}>
            {PERIOD_OPTIONS.map((option) => (
              <button
                key={option.value}
                onClick={() => setPeriod(option.value as PeriodType)}
                style={buttonStyle(period === option.value)}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>

        {/* Per Store Metrics */}
        <PerStoreMetrics
          stores={stores}
          storesLoading={storesLoading}
          data={data}
          selectedStoreId={selectedStoreId}
          onStoreChange={setSelectedStoreId}
          loading={loading}
          error={error}
        />
      </div>
    </main>
  );
}

export default function PerStorePage() {
  return (
    <ProtectedRoute>
      <PerStoreDashboardContent />
    </ProtectedRoute>
  );
}
