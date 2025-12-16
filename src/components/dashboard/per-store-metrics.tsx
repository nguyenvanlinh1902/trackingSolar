'use client';

import type { PerStoreMetricsData } from '@/types/survey-metrics';
import { COLORS, RADIUS, SPACING } from '@/lib/constants';
import {
  VideoSourceChart,
  WidgetMetrics,
} from './per-store';
import { LoadingSpinner, ErrorMessage, SummaryMetricsGrid } from './shopvid';

interface PerStoreMetricsProps {
  data: PerStoreMetricsData | null;
  selectedStoreId: string | null;
  loading: boolean;
  error: string | null;
}

export function PerStoreMetrics({
  data,
  selectedStoreId,
  loading,
  error,
}: PerStoreMetricsProps) {
  return (
    <div style={{ display: 'grid', gap: `${SPACING.xl}px` }}>
      {/* Empty State - No store selected */}
      {!selectedStoreId && (
        <div
          style={{
            padding: `${SPACING['3xl']}px`,
            textAlign: 'center',
            backgroundColor: COLORS.surface,
            borderRadius: RADIUS.xl,
            border: `1px dashed ${COLORS.border}`,
          }}
        >
          <div
            style={{
              fontSize: '48px',
              marginBottom: `${SPACING.lg}px`,
            }}
          >
            📊
          </div>
          <p
            style={{
              color: COLORS.textSecondary,
              fontSize: '16px',
              marginBottom: `${SPACING.sm}px`,
              fontWeight: 500,
            }}
          >
            Search for a store to view metrics
          </p>
          <p
            style={{
              color: COLORS.textMuted,
              fontSize: '14px',
            }}
          >
            Search by store name, domain, or ID to get started
          </p>
        </div>
      )}

      {/* Loading State */}
      {selectedStoreId && loading && <LoadingSpinner />}

      {/* Error State */}
      {selectedStoreId && !loading && error && <ErrorMessage message={error} />}

      {/* Metrics - Only show when store selected and data available */}
      {selectedStoreId && data && !loading && !error && (
        <>
          {/* Store Name Header */}
          <div
            style={{
              padding: `${SPACING.lg}px ${SPACING.xl}px`,
              backgroundColor: COLORS.primary + '10',
              borderRadius: RADIUS.lg,
              borderLeft: `4px solid ${COLORS.primary}`,
            }}
          >
            <h2
              style={{
                fontSize: '18px',
                fontWeight: 600,
                color: COLORS.textPrimary,
                margin: 0,
              }}
            >
              {data.storeName}
            </h2>
            <p
              style={{
                fontSize: '13px',
                color: COLORS.textMuted,
                marginTop: '4px',
              }}
            >
              Store ID: {data.storeId}
            </p>
          </div>

          {/* Summary Metrics (Total Views, Likes, Shares) */}
          {data.summary && (
            <div style={{ display: 'grid', gap: '24px' }}>
              <SummaryMetricsGrid summary={data.summary as any} />
            </div>
          )}

          {/* Widget Usage */}
          <WidgetMetrics widgetUsage={data.widgetUsage} />

          {/* Video Source Distribution */}
          <VideoSourceChart videoSource={data.videoSource} />
        </>
      )}
    </div>
  );
}
