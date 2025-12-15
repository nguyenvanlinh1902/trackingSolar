'use client';

import { useState, useMemo, useRef, useEffect } from 'react';
import type { Store } from '@/types/survey-metrics';
import { COLORS, RADIUS, SHADOWS, SPACING, TRANSITIONS } from '@/lib/constants';

interface StoreSelectorProps {
  stores: Store[];
  selectedStoreId: string | null;
  onStoreChange: (storeId: string | null) => void;
  loading?: boolean;
}

export function StoreSelector({
  stores,
  selectedStoreId,
  onStoreChange,
  loading = false,
}: StoreSelectorProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Filter stores by domain, ID, or name
  const filteredStores = useMemo(() => {
    if (!searchTerm.trim()) return stores;

    const term = searchTerm.toLowerCase();
    return stores.filter(
      (store) =>
        store.domain.toLowerCase().includes(term) ||
        store.id.toLowerCase().includes(term) ||
        store.name.toLowerCase().includes(term)
    );
  }, [stores, searchTerm]);

  // Get selected store
  const selectedStore = useMemo(
    () => stores.find((s) => s.id === selectedStoreId),
    [stores, selectedStoreId]
  );

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = (storeId: string) => {
    onStoreChange(storeId);
    setSearchTerm('');
    setIsOpen(false);
  };

  const handleClear = () => {
    onStoreChange(null);
    setSearchTerm('');
  };

  return (
    <div ref={containerRef} style={{ position: 'relative', width: '100%', maxWidth: '400px' }}>
      <label
        style={{
          display: 'block',
          fontSize: '14px',
          fontWeight: 500,
          color: COLORS.textSecondary,
          marginBottom: `${SPACING.sm}px`,
        }}
      >
        Select Store
      </label>

      {/* Input field */}
      <div style={{ position: 'relative' }}>
        <input
          type="text"
          placeholder={selectedStore ? selectedStore.name : 'Search by name, domain, or ID...'}
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setIsOpen(true);
          }}
          onFocus={() => setIsOpen(true)}
          disabled={loading}
          style={{
            width: '100%',
            padding: `${SPACING.md}px ${SPACING.lg}px`,
            paddingRight: selectedStoreId ? '80px' : '40px',
            fontSize: '14px',
            border: `1px solid ${isOpen ? COLORS.primary : COLORS.border}`,
            borderRadius: RADIUS.lg,
            outline: 'none',
            backgroundColor: loading ? COLORS.gray100 : COLORS.white,
            color: COLORS.textPrimary,
            transition: `all ${TRANSITIONS.normal}`,
          }}
        />

        {/* Clear button */}
        {selectedStoreId && (
          <button
            onClick={handleClear}
            style={{
              position: 'absolute',
              right: '40px',
              top: '50%',
              transform: 'translateY(-50%)',
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              color: COLORS.textMuted,
              fontSize: '18px',
              padding: '4px',
            }}
            aria-label="Clear selection"
          >
            ×
          </button>
        )}

        {/* Dropdown icon */}
        <span
          style={{
            position: 'absolute',
            right: '12px',
            top: '50%',
            transform: `translateY(-50%) rotate(${isOpen ? 180 : 0}deg)`,
            color: COLORS.textMuted,
            transition: `transform ${TRANSITIONS.normal}`,
            pointerEvents: 'none',
          }}
        >
          ▼
        </span>
      </div>

      {/* Selected store badge */}
      {selectedStore && !isOpen && (
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
          <span style={{ fontWeight: 500 }}>{selectedStore.name}</span>
          <span style={{ color: COLORS.textMuted }}>({selectedStore.domain})</span>
        </div>
      )}

      {/* Dropdown list */}
      {isOpen && (
        <div
          style={{
            position: 'absolute',
            top: '100%',
            left: 0,
            right: 0,
            marginTop: `${SPACING.xs}px`,
            backgroundColor: COLORS.white,
            border: `1px solid ${COLORS.border}`,
            borderRadius: RADIUS.lg,
            boxShadow: SHADOWS.lg,
            maxHeight: '280px',
            overflowY: 'auto',
            zIndex: 100,
          }}
        >
          {loading ? (
            <div
              style={{
                padding: `${SPACING.lg}px`,
                textAlign: 'center',
                color: COLORS.textMuted,
              }}
            >
              Loading stores...
            </div>
          ) : filteredStores.length === 0 ? (
            <div
              style={{
                padding: `${SPACING.lg}px`,
                textAlign: 'center',
                color: COLORS.textMuted,
              }}
            >
              {searchTerm ? 'No stores found' : 'No stores available'}
            </div>
          ) : (
            filteredStores.map((store) => (
              <button
                key={store.id}
                onClick={() => handleSelect(store.id)}
                style={{
                  width: '100%',
                  padding: `${SPACING.md}px ${SPACING.lg}px`,
                  textAlign: 'left',
                  border: 'none',
                  backgroundColor:
                    store.id === selectedStoreId ? COLORS.primaryLight + '15' : 'transparent',
                  cursor: 'pointer',
                  transition: `background-color ${TRANSITIONS.fast}`,
                  borderBottom: `1px solid ${COLORS.borderLight}`,
                }}
                onMouseEnter={(e) => {
                  if (store.id !== selectedStoreId) {
                    e.currentTarget.style.backgroundColor = COLORS.gray50;
                  }
                }}
                onMouseLeave={(e) => {
                  if (store.id !== selectedStoreId) {
                    e.currentTarget.style.backgroundColor = 'transparent';
                  }
                }}
              >
                <div style={{ fontWeight: 500, color: COLORS.textPrimary, marginBottom: '2px' }}>
                  {store.name}
                </div>
                <div style={{ fontSize: '12px', color: COLORS.textMuted }}>
                  {store.domain} • ID: {store.id}
                </div>
              </button>
            ))
          )}
        </div>
      )}
    </div>
  );
}
