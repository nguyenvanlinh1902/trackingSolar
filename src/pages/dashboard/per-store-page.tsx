'use client';

import { ProtectedRoute } from '@/components/auth/protected-route';
import { PerStoreMetrics } from '@/components/dashboard/per-store-metrics';
import { COLORS } from '@/lib/constants';
import { pageContainerStyle } from '@/lib/styles';
import type { PerStoreMetricsData } from '@/types/survey-metrics';

interface PerStorePageProps {
  data?: PerStoreMetricsData | null;
  loading?: boolean;
  error?: string | null;
  selectedStoreId?: string | null;
}

export default function PerStorePage({
  data = null,
  loading = false,
  error = null,
  selectedStoreId = null
}: PerStorePageProps) {
  return (
    <ProtectedRoute>
      <main style={{ backgroundColor: COLORS.background, minHeight: '100vh' }}>
        <div style={pageContainerStyle}>
          {/* Per Store Metrics */}
          <PerStoreMetrics
            data={data}
            selectedStoreId={selectedStoreId}
            loading={loading}
            error={error}
          />
        </div>
      </main>
    </ProtectedRoute>
  );
}
