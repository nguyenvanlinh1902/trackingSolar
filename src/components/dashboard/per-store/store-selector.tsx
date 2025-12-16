'use client';

import { useState, useRef } from 'react';
import { COLORS, RADIUS, SPACING, TRANSITIONS } from '@/lib/constants';

interface StoreSelectorProps {
  selectedDomain: string | null;
  onDomainChange: (domain: string | null) => void;
  loading?: boolean;
  onSearch: (domain: string) => void;
}

export function StoreSelector({
  selectedDomain,
  onDomainChange,
  loading = false,
  onSearch,
}: StoreSelectorProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleSearch = async () => {
    const domain = searchTerm.trim();
    if (!domain) {
      return;
    }

    try {
      setIsSearching(true);
      await onSearch(domain);
      // Keep search term after successful search
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
    onDomainChange(null);
  };

  return (
    <div style={{ width: '100%', maxWidth: '400px' }}>
      <label
        style={{
          display: 'block',
          fontSize: '14px',
          fontWeight: 500,
          color: COLORS.textSecondary,
          marginBottom: `${SPACING.sm}px`,
        }}
      >
        Search Store
      </label>

      {/* Input field with Search button */}
      <div style={{ display: 'flex', gap: `${SPACING.sm}px` }}>
        <div style={{ position: 'relative', flex: 1 }}>
          <input
            ref={inputRef}
            type="text"
            placeholder="Enter store domain (e.g., store.myshopify.com)"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyPress={handleKeyPress}
            disabled={loading || isSearching}
            style={{
              width: '100%',
              padding: `${SPACING.md}px ${SPACING.lg}px`,
              paddingRight: selectedDomain ? '80px' : `${SPACING.lg}px`,
              fontSize: '14px',
              border: `1px solid ${COLORS.border}`,
              borderRadius: RADIUS.lg,
              outline: 'none',
              backgroundColor: loading || isSearching ? COLORS.gray100 : COLORS.white,
              color: COLORS.textPrimary,
              transition: `all ${TRANSITIONS.normal}`,
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
                color: COLORS.textMuted,
                fontSize: '18px',
                padding: '4px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
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
          disabled={loading || isSearching || !searchTerm.trim()}
          style={{
            padding: `${SPACING.md}px ${SPACING.lg}px`,
            fontSize: '14px',
            fontWeight: 500,
            borderRadius: RADIUS.lg,
            border: 'none',
            cursor: loading || isSearching || !searchTerm.trim() ? 'not-allowed' : 'pointer',
            backgroundColor: loading || isSearching || !searchTerm.trim() ? COLORS.gray300 : COLORS.primary,
            color: '#ffffff',
            transition: `all ${TRANSITIONS.normal}`,
            whiteSpace: 'nowrap',
          }}
        >
          {isSearching ? 'Searching...' : 'Search'}
        </button>
      </div>

      {/* Selected domain badge */}
      {selectedDomain && (
        <div
          style={{
            marginTop: `${SPACING.sm}px`,
            padding: `${SPACING.sm}px ${SPACING.md}px`,
            backgroundColor: COLORS.primaryLight + '15',
            borderRadius: RADIUS.md,
            fontSize: '13px',
            color: COLORS.primary,
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
          }}
        >
          <span style={{ fontWeight: 500 }}>{selectedDomain}</span>
        </div>
      )}
    </div>
  );
}
