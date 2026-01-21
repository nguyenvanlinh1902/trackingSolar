'use client';

import { useState, useRef } from 'react';

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
    <div style={{ width: '100%' }}>
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
            disabled={loading || isSearching}
            style={{
              width: '100%',
              padding: '10px 16px',
              paddingRight: selectedDomain ? '40px' : '16px',
              fontSize: '14px',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              borderRadius: '12px',
              outline: 'none',
              backgroundColor: loading || isSearching
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
          disabled={loading || isSearching || !searchTerm.trim()}
          style={{
            padding: '10px 20px',
            fontSize: '14px',
            fontWeight: 600,
            borderRadius: '12px',
            border: 'none',
            cursor: loading || isSearching || !searchTerm.trim() ? 'not-allowed' : 'pointer',
            backgroundColor: loading || isSearching || !searchTerm.trim()
              ? 'rgba(255, 255, 255, 0.1)'
              : 'rgba(255, 255, 255, 0.2)',
            color: loading || isSearching || !searchTerm.trim()
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
  );
}
