/**
 * Shared styles for All Stores dashboard components
 * Premium Dark OLED Luxury + Glassmorphism Design System
 * Award-winning $50k+ agency dashboard aesthetics
 */

import { COLORS, RADIUS, SPACING } from '@/lib/constants';
import type { CSSProperties } from 'react';

// Premium glassmorphism card with dark OLED luxury aesthetic
export const glassCardStyle: CSSProperties = {
  padding: `${SPACING['2xl']}px`,
  borderRadius: RADIUS.xl,
  background: 'rgba(255, 255, 255, 0.05)',
  backdropFilter: 'blur(12px)',
  WebkitBackdropFilter: 'blur(12px)',
  border: '1px solid rgba(255, 255, 255, 0.1)',
  boxShadow: '0 8px 32px rgba(0, 0, 0, 0.12), 0 2px 8px rgba(0, 0, 0, 0.08)',
  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
};

// Section header with premium icon badge
export const sectionHeaderStyle: CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: '16px',
  marginBottom: `${SPACING.xl}px`,
};

// Premium icon container with gradient and glow
export const iconContainerStyle = (gradient: string): CSSProperties => ({
  width: '48px',
  height: '48px',
  borderRadius: '12px',
  background: gradient,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  fontSize: '24px',
  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
});

// Premium section title with enhanced typography
export const sectionTitleStyle: CSSProperties = {
  fontSize: '24px',
  fontWeight: 800,
  letterSpacing: '-0.02em',
  color: COLORS.textPrimary,
  margin: 0,
  lineHeight: 1.2,
};

// Premium metric card with hover effects
export const metricCardStyle = (borderColor: string): CSSProperties => ({
  padding: `${SPACING.xl}px`,
  background: 'rgba(255, 255, 255, 0.05)',
  backdropFilter: 'blur(12px)',
  WebkitBackdropFilter: 'blur(12px)',
  borderRadius: RADIUS.lg,
  border: `1px solid rgba(255, 255, 255, 0.1)`,
  borderLeft: `4px solid ${borderColor}`,
  boxShadow: '0 4px 16px rgba(0, 0, 0, 0.1)',
  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
  cursor: 'pointer',
  position: 'relative',
  overflow: 'hidden',
});

// Premium metric label with uppercase styling
export const metricLabelStyle: CSSProperties = {
  fontSize: '12px',
  color: COLORS.textMuted,
  marginBottom: '12px',
  fontWeight: 700,
  textTransform: 'uppercase',
  letterSpacing: '0.05em',
};

// Premium metric value with enhanced typography
export const metricValueStyle: CSSProperties = {
  fontSize: '40px',
  fontWeight: 800,
  color: COLORS.textPrimary,
  lineHeight: 1,
  margin: 0,
};

// Empty state with refined styling
export const emptyStateStyle: CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  color: COLORS.textMuted,
  fontSize: '14px',
  height: '200px',
  fontWeight: 500,
};

// Premium gradient definitions with vibrant colors
export const GRADIENTS = {
  blue: 'linear-gradient(135deg, #3B82F6 0%, #1D4ED8 100%)',
  purple: 'linear-gradient(135deg, #8B5CF6 0%, #6D28D9 100%)',
  green: 'linear-gradient(135deg, #10B981 0%, #059669 100%)',
  orange: 'linear-gradient(135deg, #F59E0B 0%, #D97706 100%)',
  pink: 'linear-gradient(135deg, #EC4899 0%, #DB2777 100%)',
  cyan: 'linear-gradient(135deg, #06B6D4 0%, #0891B2 100%)',
} as const;

// Hover state generator for metric cards
export const getMetricCardHoverStyle = (borderColor: string): CSSProperties => ({
  transform: 'translateY(-4px)',
  boxShadow: `0 12px 24px rgba(0, 0, 0, 0.15), 0 0 0 1px ${borderColor}40`,
  borderColor: `${borderColor}80`,
});
