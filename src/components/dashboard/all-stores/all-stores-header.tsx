'use client';

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAllStoresContext } from '@/contexts/all-stores-context';

export function AllStoresHeader() {
  const { data } = useAllStoresContext();
  const navigate = useNavigate();

  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '32px',
        padding: '32px',
        background: 'linear-gradient(135deg, #0F172A 0%, #1E293B 50%, #334155 100%)',
        borderRadius: '20px',
        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.2), 0 2px 8px rgba(0, 0, 0, 0.1)',
        border: '1px solid rgba(255, 255, 255, 0.05)',
        position: 'relative',
        overflow: 'hidden',
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

      {/* Title & Total Shops */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '32px', position: 'relative', zIndex: 1 }}>
        <div>
          <h1 style={{ margin: 0, fontSize: '32px', fontWeight: 800, color: '#FFFFFF', letterSpacing: '-0.02em' }}>
            All Stores Analytics
          </h1>
          <p style={{ margin: '8px 0 0', fontSize: '14px', color: 'rgba(255,255,255,0.6)', fontWeight: 500 }}>
            Comprehensive overview for all stores
          </p>
        </div>

        {data?.totalShops && (
          <TotalShopsCard value={data.totalShops} />
        )}
      </div>

      {/* Navigation Buttons */}
      <NavigationButtons navigate={navigate} />
    </div>
  );
}

function TotalShopsCard({ value }: { value: number }) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      style={{
        padding: '20px 28px',
        background: 'rgba(255, 255, 255, 0.08)',
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
        borderRadius: '16px',
        border: '1px solid rgba(255, 255, 255, 0.15)',
        minWidth: '180px',
        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        transform: isHovered ? 'translateY(-2px)' : 'translateY(0)',
        boxShadow: isHovered
          ? '0 12px 24px rgba(0, 0, 0, 0.2)'
          : '0 4px 12px rgba(0, 0, 0, 0.1)',
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <p style={{
        margin: 0,
        fontSize: '12px',
        color: 'rgba(255,255,255,0.6)',
        fontWeight: 700,
        textTransform: 'uppercase',
        letterSpacing: '0.05em',
      }}>
        Total Shops
      </p>
      <p style={{ margin: '8px 0 0', fontSize: '36px', fontWeight: 800, color: '#FFFFFF', lineHeight: 1 }}>
        {value}
      </p>
    </div>
  );
}

function NavigationButtons({ navigate }: { navigate: (path: string) => void }) {
  const [hoveredBtn, setHoveredBtn] = useState<string | null>(null);

  return (
    <div style={{ display: 'flex', gap: '12px', position: 'relative', zIndex: 1 }}>
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
          border: 'none',
          cursor: 'pointer',
          background: 'linear-gradient(135deg, #3B82F6 0%, #1D4ED8 100%)',
          color: '#FFFFFF',
          boxShadow: hoveredBtn === 'all'
            ? '0 8px 20px rgba(37, 99, 235, 0.5)'
            : '0 4px 12px rgba(37, 99, 235, 0.4)',
          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          transform: hoveredBtn === 'all' ? 'translateY(-2px)' : 'translateY(0)',
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
          border: '1px solid rgba(255, 255, 255, 0.2)',
          cursor: 'pointer',
          background: hoveredBtn === 'per'
            ? 'rgba(255, 255, 255, 0.15)'
            : 'rgba(255, 255, 255, 0.08)',
          color: 'rgba(255, 255, 255, 0.95)',
          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          transform: hoveredBtn === 'per' ? 'translateY(-2px)' : 'translateY(0)',
          boxShadow: hoveredBtn === 'per' ? '0 4px 12px rgba(0, 0, 0, 0.15)' : 'none',
        }}
      >
        Per Store
      </button>
    </div>
  );
}
