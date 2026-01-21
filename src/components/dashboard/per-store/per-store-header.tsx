'use client';

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { StoreSelector } from './store-selector';

interface PerStoreHeaderProps {
  selectedDomain: string | null;
  onDomainChange: (domain: string | null) => void;
  loading?: boolean;
  onSearch: (domain: string) => void;
}

export function PerStoreHeader({
  selectedDomain,
  onDomainChange,
  loading = false,
  onSearch,
}: PerStoreHeaderProps) {
  const navigate = useNavigate();

  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: '32px',
        padding: '32px',
        background: 'linear-gradient(135deg, #0F172A 0%, #1E293B 50%, #334155 100%)',
        borderRadius: '20px',
        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.2), 0 2px 8px rgba(0, 0, 0, 0.1)',
        border: '1px solid rgba(255, 255, 255, 0.05)',
        position: 'relative',
        overflow: 'hidden',
        gap: '24px',
        flexWrap: 'wrap',
      }}
    >
      {/* Animated gradient overlay */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.1) 0%, rgba(139, 92, 246, 0.1) 100%)',
          opacity: 0.6,
          pointerEvents: 'none',
        }}
      />

      {/* Title */}
      <div style={{ position: 'relative', zIndex: 1, flex: '0 0 auto' }}>
        <h1 style={{ margin: 0, fontSize: '32px', fontWeight: 800, color: '#FFFFFF', letterSpacing: '-0.02em' }}>
          Per Store Metrics
        </h1>
        <p style={{ margin: '8px 0 0', fontSize: '14px', color: 'rgba(255,255,255,0.6)', fontWeight: 500 }}>
          View detailed metrics for individual stores
        </p>
      </div>

      {/* Right Section: Search + Navigation */}
      <div style={{
        display: 'flex',
        gap: '24px',
        alignItems: 'center',
        position: 'relative',
        zIndex: 1,
        flex: '1 1 auto',
        justifyContent: 'flex-end',
        flexWrap: 'wrap',
      }}>
        {/* Store Search */}
        <div style={{ minWidth: '320px', maxWidth: '400px' }}>
          <StoreSelector
            selectedDomain={selectedDomain}
            onDomainChange={onDomainChange}
            loading={loading}
            onSearch={onSearch}
          />
        </div>

        {/* Navigation Buttons */}
        <NavigationButtons navigate={navigate} />
      </div>
    </div>
  );
}

function NavigationButtons({ navigate }: { navigate: (path: string) => void }) {
  const [hoveredBtn, setHoveredBtn] = useState<string | null>(null);

  return (
    <div style={{ display: 'flex', gap: '12px', flexShrink: 0 }}>
      <button
        type="button"
        onClick={() => navigate('/dashboard/analytics')}
        onMouseEnter={() => setHoveredBtn('all')}
        onMouseLeave={() => setHoveredBtn(null)}
        style={{
          padding: '12px 24px',
          fontSize: '14px',
          fontWeight: 700,
          borderRadius: '999px',
          border: '1px solid rgba(255, 255, 255, 0.2)',
          cursor: 'pointer',
          background: hoveredBtn === 'all'
            ? 'rgba(255, 255, 255, 0.15)'
            : 'rgba(255, 255, 255, 0.08)',
          color: 'rgba(255, 255, 255, 0.95)',
          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          transform: hoveredBtn === 'all' ? 'translateY(-2px)' : 'translateY(0)',
          boxShadow: hoveredBtn === 'all' ? '0 4px 12px rgba(0, 0, 0, 0.15)' : 'none',
        }}
      >
        All Stores
      </button>
      <button
        type="button"
        onClick={() => navigate('/dashboard/per-store')}
        onMouseEnter={() => setHoveredBtn('per')}
        onMouseLeave={() => setHoveredBtn(null)}
        style={{
          padding: '12px 24px',
          fontSize: '14px',
          fontWeight: 700,
          borderRadius: '999px',
          border: 'none',
          cursor: 'pointer',
          background: 'linear-gradient(135deg, #3B82F6 0%, #1D4ED8 100%)',
          color: '#FFFFFF',
          boxShadow: hoveredBtn === 'per'
            ? '0 8px 20px rgba(37, 99, 235, 0.5)'
            : '0 4px 12px rgba(37, 99, 235, 0.4)',
          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          transform: hoveredBtn === 'per' ? 'translateY(-2px)' : 'translateY(0)',
        }}
      >
        Per Store
      </button>
    </div>
  );
}
