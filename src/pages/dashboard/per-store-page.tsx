'use client';

import { ProtectedRoute } from '@/components/auth/protected-route';
import { usePerStoreMetrics } from '@/hooks/use-per-store-metrics';
import { PerStoreMetrics } from '@/components/dashboard/per-store-metrics';
import { COLORS } from '@/lib/constants';
import { pageContainerStyle } from '@/lib/styles';

export default function PerStorePage() {
  const { data, loading, error } = usePerStoreMetrics();

  return (
    <ProtectedRoute>
      <main style={{ backgroundColor: COLORS.background, minHeight: '100vh' }}>
        <div style={pageContainerStyle}>
          {/* Per Store Metrics */}
          <PerStoreMetrics
            data={data}
            selectedStoreId={null}
            loading={loading}
            error={error}
          />
        </div>
      </main>
    </ProtectedRoute>
  );
}
