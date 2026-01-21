'use client';

import { useState } from 'react';
import { ProtectedRoute } from '@/components/auth/protected-route';
import { usePerStoreMetrics } from '@/hooks/use-per-store-metrics';
import { PerStoreMetrics } from '@/components/dashboard/per-store-metrics';
import { DashboardHeader } from '@/components/dashboard/dashboard-header';
import { COLORS } from '@/lib/constants';
import { pageContainerStyle } from '@/lib/styles';

function PerStoreDashboardContent() {
  const [selectedDomain, setSelectedDomain] = useState<string | null>(null);

  const { data, loading, error, searchByDomain } = usePerStoreMetrics();

  const handleSearch = async (domain: string) => {
    setSelectedDomain(domain);
    await searchByDomain(domain);
  };

  return (
    <main style={{ backgroundColor: COLORS.background, minHeight: '100vh' }}>
      <div style={pageContainerStyle}>
        {/* Header with Search */}
        <DashboardHeader
          currentPage="per-store"
          selectedDomain={selectedDomain}
          onDomainChange={setSelectedDomain}
          onSearch={handleSearch}
          searchLoading={loading}
        />

        {/* Per Store Metrics */}
        <PerStoreMetrics
          data={data}
          selectedStoreId={selectedDomain}
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
