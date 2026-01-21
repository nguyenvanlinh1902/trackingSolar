'use client';

import { useState } from 'react';
import type { PerStoreMetricsData } from '@/types/survey-metrics';
import { COLORS, RADIUS, SPACING } from '@/lib/constants';
import {
  VideoSourceChart,
  WidgetMetrics,
  ConversionOverviewCard,
} from './per-store';
import { LoadingSpinner, ErrorMessage } from './shopvid';
import { DaybreakChart } from '@/components/dashboard/all-stores';
import { usePerStoreDaybreak } from '@/hooks/use-per-store-daybreak';

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
  const [dateRange, setDateRange] = useState<{ start?: string; end?: string }>({});

  const {
    data: daybreakData,
    loading: daybreakLoading,
    error: daybreakError,
  } = usePerStoreDaybreak(selectedStoreId, dateRange.start, dateRange.end);

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

          {/* Conversion Overview (Raw API Data) */}
          {data.conversionData && (
            <ConversionOverviewCard stats={data.conversionData} />
          )}

          {/* Widget Usage */}
          <WidgetMetrics widgetUsage={data.widgetUsage} />

          {/* Video Source Distribution */}
          <VideoSourceChart videoSource={data.videoSource} />

          {/* Time Series Analysis for this store */}
          <DaybreakChart
            data={daybreakData}
            loading={daybreakLoading}
            onDateRangeChange={(startDate: string, endDate: string) =>
              setDateRange({ start: startDate, end: endDate })
            }
          />

          {/* Optional: show daybreak error below the chart */}
          {daybreakError && (
            <ErrorMessage message={daybreakError} />
          )}
        </>
      )}
    </div>
  );
}
