'use client';

import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

interface DashboardHeaderProps {
  title: string;
  subtitle: string;
  currentPage: 'all-stores' | 'per-store';
  totalShops?: number;
  // Per Store search props
  selectedDomain?: string | null;
  onDomainChange?: (domain: string | null) => void;
  onSearch?: (domain: string) => void;
  searchLoading?: boolean;
}

export function DashboardHeader({
  title,
  subtitle,
  currentPage,
  totalShops,
  selectedDomain,
  onDomainChange,
  onSearch,
  searchLoading = false,
}: DashboardHeaderProps) {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleSearch = async () => {
    const domain = searchTerm.trim();
    if (!domain || !onSearch) {
      return;
    }

    try {
      setIsSearching(true);
      await onSearch(domain);
    } catch (error) {
      console.error('Search failed:', error);
    } finally {
      setIsSearching(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const handleClear = () => {
    setSearchTerm('');
    if (onDomainChange) {
      onDomainChange(null);
    }
  };

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

      {/* Left Section: Title + Total Shops (All Stores only) */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '32px', position: 'relative', zIndex: 1 }}>
        <div>
          <h1 style={{ margin: 0, fontSize: '32px', fontWeight: 800, color: '#FFFFFF', letterSpacing: '-0.02em' }}>
            {title}
          </h1>
          <p style={{ margin: '8px 0 0', fontSize: '14px', color: 'rgba(255,255,255,0.6)', fontWeight: 500 }}>
            {subtitle}
          </p>
        </div>

        {/* Total Shops Card - All Stores only */}
        {currentPage === 'all-stores' && totalShops !== undefined && (
          <TotalShopsCard value={totalShops} />
        )}
      </div>

      {/* Right Section: Search (Per Store only) + Navigation */}
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
        {/* Store Search - Per Store only */}
        {currentPage === 'per-store' && onSearch && (
          <div style={{ minWidth: '320px', maxWidth: '400px', width: '100%' }}>
            {/* Input field with Search button */}
            <div style={{ display: 'flex', gap: '8px' }}>
              <div style={{ position: 'relative', flex: 1 }}>
                <input
                  ref={inputRef}
                  type="text"
                  placeholder="Search store domain..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  onKeyDown={handleKeyPress}
                  disabled={searchLoading || isSearching}
                  style={{
                    width: '100%',
                    padding: '10px 16px',
                    paddingRight: selectedDomain ? '40px' : '16px',
                    fontSize: '14px',
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                    borderRadius: '12px',
                    outline: 'none',
                    backgroundColor: searchLoading || isSearching
                      ? 'rgba(255, 255, 255, 0.05)'
                      : 'rgba(255, 255, 255, 0.1)',
                    color: '#FFFFFF',
                    transition: 'all 0.2s ease',
                    backdropFilter: 'blur(8px)',
                    WebkitBackdropFilter: 'blur(8px)',
                  }}
                />

                {/* Clear button */}
                {selectedDomain && (
                  <button
                    onClick={handleClear}
                    style={{
                      position: 'absolute',
                      right: '8px',
                      top: '50%',
                      transform: 'translateY(-50%)',
                      background: 'none',
                      border: 'none',
                      cursor: 'pointer',
                      color: 'rgba(255, 255, 255, 0.6)',
                      fontSize: '20px',
                      padding: '4px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      lineHeight: 1,
                    }}
                    aria-label="Clear selection"
                  >
                    ×
                  </button>
                )}
              </div>

              {/* Search button */}
              <button
                onClick={handleSearch}
                disabled={searchLoading || isSearching || !searchTerm.trim()}
                style={{
                  padding: '10px 20px',
                  fontSize: '14px',
                  fontWeight: 600,
                  borderRadius: '12px',
                  border: 'none',
                  cursor: searchLoading || isSearching || !searchTerm.trim() ? 'not-allowed' : 'pointer',
                  backgroundColor: searchLoading || isSearching || !searchTerm.trim()
                    ? 'rgba(255, 255, 255, 0.1)'
                    : 'rgba(255, 255, 255, 0.2)',
                  color: searchLoading || isSearching || !searchTerm.trim()
                    ? 'rgba(255, 255, 255, 0.4)'
                    : '#FFFFFF',
                  transition: 'all 0.2s ease',
                  whiteSpace: 'nowrap',
                  backdropFilter: 'blur(8px)',
                  WebkitBackdropFilter: 'blur(8px)',
                }}
              >
                {isSearching ? 'Searching...' : 'Search'}
              </button>
            </div>

            {/* Selected domain badge */}
            {selectedDomain && (
              <div
                style={{
                  marginTop: '8px',
                  padding: '6px 12px',
                  backgroundColor: 'rgba(59, 130, 246, 0.2)',
                  borderRadius: '8px',
                  fontSize: '12px',
                  color: 'rgba(255, 255, 255, 0.9)',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  border: '1px solid rgba(59, 130, 246, 0.3)',
                }}
              >
                <span style={{ fontWeight: 600 }}>📍 {selectedDomain}</span>
              </div>
            )}
          </div>
        )}

        {/* Navigation Buttons */}
        <NavigationButtons navigate={navigate} currentPage={currentPage} />
      </div>
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

function NavigationButtons({ navigate, currentPage }: { navigate: (path: string) => void; currentPage: string }) {
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
          border: currentPage === 'all-stores' ? 'none' : '1px solid rgba(255, 255, 255, 0.2)',
          cursor: 'pointer',
          background: currentPage === 'all-stores'
            ? 'linear-gradient(135deg, #3B82F6 0%, #1D4ED8 100%)'
            : hoveredBtn === 'all'
            ? 'rgba(255, 255, 255, 0.15)'
            : 'rgba(255, 255, 255, 0.08)',
          color: 'rgba(255, 255, 255, 0.95)',
          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          transform: hoveredBtn === 'all' ? 'translateY(-2px)' : 'translateY(0)',
          boxShadow: currentPage === 'all-stores'
            ? '0 8px 20px rgba(37, 99, 235, 0.5)'
            : hoveredBtn === 'all'
            ? '0 4px 12px rgba(0, 0, 0, 0.15)'
            : 'none',
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
          border: currentPage === 'per-store' ? 'none' : '1px solid rgba(255, 255, 255, 0.2)',
          cursor: 'pointer',
          background: currentPage === 'per-store'
            ? 'linear-gradient(135deg, #3B82F6 0%, #1D4ED8 100%)'
            : hoveredBtn === 'per'
            ? 'rgba(255, 255, 255, 0.15)'
            : 'rgba(255, 255, 255, 0.08)',
          color: 'rgba(255, 255, 255, 0.95)',
          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          transform: hoveredBtn === 'per' ? 'translateY(-2px)' : 'translateY(0)',
          boxShadow: currentPage === 'per-store'
            ? '0 8px 20px rgba(37, 99, 235, 0.5)'
            : hoveredBtn === 'per'
            ? '0 4px 12px rgba(0, 0, 0, 0.15)'
            : 'none',
        }}
      >
        Per Store
      </button>
    </div>
  );
}
