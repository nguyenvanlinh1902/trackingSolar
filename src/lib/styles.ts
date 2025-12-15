/**
 * Shared style utilities
 * Common CSS-in-JS patterns for consistent UI
 */
import { COLORS, RADIUS, SHADOWS, SPACING, LAYOUT, TRANSITIONS } from './constants';

// Card styles
export const cardStyle: React.CSSProperties = {
  backgroundColor: COLORS.surface,
  borderRadius: RADIUS.xl,
  padding: `${SPACING.xl}px`,
  boxShadow: SHADOWS.sm,
};

// Page container styles
export const pageContainerStyle: React.CSSProperties = {
  maxWidth: LAYOUT.maxWidth,
  margin: '0 auto',
  padding: `${SPACING.xl}px`,
};

// Header styles
export const headerStyle: React.CSSProperties = {
  backgroundColor: COLORS.surface,
  borderBottom: `1px solid ${COLORS.border}`,
  padding: `${SPACING.lg}px ${SPACING.xl}px`,
};

// Button styles factory
export const buttonStyle = (isActive = false): React.CSSProperties => ({
  padding: `${SPACING.sm}px ${SPACING.lg}px`,
  backgroundColor: isActive ? COLORS.primary : COLORS.gray100,
  color: isActive ? COLORS.white : COLORS.gray700,
  border: 'none',
  borderRadius: RADIUS.md,
  cursor: 'pointer',
  fontSize: '14px',
  fontWeight: 500,
  transition: `all ${TRANSITIONS.normal}`,
});

// Primary button styles
export const primaryButtonStyle: React.CSSProperties = {
  padding: `${SPACING.md}px ${SPACING.xl}px`,
  background: `linear-gradient(135deg, ${COLORS.primary} 0%, ${COLORS.primaryDark} 100%)`,
  color: COLORS.white,
  border: 'none',
  borderRadius: RADIUS.lg,
  cursor: 'pointer',
  fontSize: '14px',
  fontWeight: 500,
  transition: `all ${TRANSITIONS.normal}`,
};

// Section title styles
export const sectionTitleStyle: React.CSSProperties = {
  fontSize: '18px',
  fontWeight: 600,
  color: COLORS.textPrimary,
  marginBottom: `${SPACING.lg}px`,
};

// Table styles
export const tableStyle: React.CSSProperties = {
  width: '100%',
  borderCollapse: 'collapse',
};

export const tableHeaderCellStyle: React.CSSProperties = {
  padding: `${SPACING.md}px`,
  color: COLORS.textSecondary,
  fontWeight: 500,
  textAlign: 'left',
};

export const tableRowStyle = (index: number): React.CSSProperties => ({
  borderBottom: `1px solid ${COLORS.borderLight}`,
  backgroundColor: index % 2 === 0 ? COLORS.white : COLORS.gray50,
});

export const tableCellStyle: React.CSSProperties = {
  padding: `${SPACING.md}px`,
};

// Badge/chip styles
export const badgeStyle = (isPositive: boolean): React.CSSProperties => ({
  padding: `${SPACING.xs}px ${SPACING.sm}px`,
  backgroundColor: isPositive ? '#dcfce7' : '#fef3c7',
  color: isPositive ? '#166534' : '#92400e',
  borderRadius: RADIUS.sm,
  fontSize: '13px',
});

// Flex utilities
export const flexCenter: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
};

export const flexBetween: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
};

// Grid styles
export const gridResponsive = (minWidth: string = '350px'): React.CSSProperties => ({
  display: 'grid',
  gridTemplateColumns: `repeat(auto-fit, minmax(${minWidth}, 1fr))`,
  gap: `${SPACING.xl}px`,
});

// Spinner keyframes (injected via style tag)
export const SPINNER_KEYFRAMES = `
  @keyframes spin {
    to { transform: rotate(360deg); }
  }
`;

// Spinner styles
export const spinnerStyle: React.CSSProperties = {
  width: '48px',
  height: '48px',
  border: `3px solid ${COLORS.border}`,
  borderTopColor: COLORS.primary,
  borderRadius: RADIUS.full,
  animation: 'spin 1s linear infinite',
};
