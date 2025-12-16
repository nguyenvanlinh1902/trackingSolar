'use client';

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ProtectedRoute } from '@/components/auth/protected-route';
import { usePerStoreMetrics } from '@/hooks/use-per-store-metrics';
import { PerStoreMetrics } from '@/components/dashboard/per-store-metrics';
import { StoreSelector } from '@/components/dashboard/per-store';
import { COLORS, SPACING } from '@/lib/constants';
import { pageContainerStyle, cardStyle } from '@/lib/styles';

function PerStoreDashboardContent() {
  const [selectedDomain, setSelectedDomain] = useState<string | null>(null);

  const { data, loading, error, searchByDomain } = usePerStoreMetrics();
  const navigate = useNavigate();

  const handleSearch = async (domain: string) => {
    setSelectedDomain(domain);
    await searchByDomain(domain);
  };

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

          <div style={{ display: 'flex', flexDirection: 'column', gap: `${SPACING.md}px`, alignItems: 'flex-end', minWidth: '300px' }}>
            {/* Page Switcher */}
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', justifyContent: 'flex-end' }}>
              <button
                type="button"
                onClick={() => navigate('/dashboard/analytics')}
                style={{
                  padding: '6px 14px',
                  fontSize: '13px',
                  fontWeight: 500,
                  borderRadius: '999px',
                  border: '1px solid rgba(148,163,184,0.5)',
                  cursor: 'pointer',
                  backgroundColor: COLORS.background,
                  color: COLORS.textPrimary,
                }}
              >
                All Stores
              </button>
              <button
                type="button"
                onClick={() => navigate('/dashboard/per-store')}
                style={{
                  padding: '6px 14px',
                  fontSize: '13px',
                  fontWeight: 600,
                  borderRadius: '999px',
                  border: 'none',
                  cursor: 'pointer',
                  backgroundColor: COLORS.primary,
                  color: '#ffffff',
                }}
              >
                Per Store
              </button>
            </div>

            <StoreSelector
              selectedDomain={selectedDomain}
              onDomainChange={setSelectedDomain}
              loading={loading}
              onSearch={handleSearch}
            />
          </div>
        </div>

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
