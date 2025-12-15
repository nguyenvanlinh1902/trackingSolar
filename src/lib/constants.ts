/**
 * Application-wide constants
 * Design System based on UI/UX Pro Max recommendations
 * Style: Glassmorphism + Dark Mode | Typography: Poppins + Open Sans
 */

// Color palette - SaaS Dashboard Design System
export const COLORS = {
  // Primary brand colors (Trust Blue)
  primary: '#2563EB',
  primaryLight: '#3B82F6',
  primaryDark: '#1D4ED8',

  // Secondary / Accent
  secondary: '#8B5CF6',
  secondaryLight: '#A78BFA',

  // CTA (Call to Action - Orange)
  cta: '#F97316',
  ctaHover: '#EA580C',

  // Success / Error / Warning
  success: '#10B981',
  successLight: '#34D399',
  error: '#EF4444',
  errorLight: '#F87171',
  warning: '#F59E0B',
  warningLight: '#FBBF24',
  info: '#06B6D4',

  // Neutrals (Light mode)
  white: '#FFFFFF',
  gray50: '#F8FAFC',
  gray100: '#F1F5F9',
  gray200: '#E2E8F0',
  gray300: '#CBD5E1',
  gray400: '#94A3B8',
  gray500: '#64748B',
  gray600: '#475569',
  gray700: '#334155',
  gray800: '#1E293B',
  gray900: '#0F172A',

  // Dark mode colors
  dark: {
    bg: '#0F172A',
    surface: '#1E293B',
    surfaceHover: '#334155',
    border: '#334155',
  },

  // Semantic colors
  textPrimary: '#0F172A',
  textSecondary: '#475569',
  textMuted: '#64748B',
  border: '#E2E8F0',
  borderLight: '#F1F5F9',
  background: '#F8FAFC',
  surface: '#FFFFFF',

  // Glassmorphism
  glass: {
    bg: 'rgba(255, 255, 255, 0.8)',
    bgDark: 'rgba(15, 23, 42, 0.8)',
    border: 'rgba(255, 255, 255, 0.2)',
    borderDark: 'rgba(255, 255, 255, 0.1)',
  },
} as const;

// Chart colors for consistent visualization
export const CHART_COLORS = {
  views: COLORS.primary,
  likes: '#EC4899',
  shares: COLORS.success,
  engagement: COLORS.warning,
  revenue: COLORS.info,
  // Video source colors
  tiktok: '#FF0050',
  instagram: '#E4405F',
  upload: COLORS.primary,
  // Revenue colors
  inVideoRevenue: COLORS.success,
  postVideoRevenue: COLORS.warning,
  // Per store conversion colors
  ordersFromShopvid: COLORS.secondary,
  atcRateMobile: COLORS.info,
  atcRateDesktop: COLORS.primaryLight,
  cvr: '#EC4899',
} as const;

// Gradients
export const GRADIENTS = {
  primary: 'linear-gradient(135deg, #2563EB 0%, #7C3AED 100%)',
  secondary: 'linear-gradient(135deg, #8B5CF6 0%, #EC4899 100%)',
  success: 'linear-gradient(135deg, #10B981 0%, #06B6D4 100%)',
  dark: 'linear-gradient(135deg, #0F172A 0%, #1E293B 100%)',
  hero: 'linear-gradient(135deg, #1E40AF 0%, #7C3AED 50%, #EC4899 100%)',
  glass: 'linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.05) 100%)',
} as const;

// Spacing scale (in pixels)
export const SPACING = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  '2xl': 32,
  '3xl': 48,
  '4xl': 64,
} as const;

// Border radius
export const RADIUS = {
  sm: '6px',
  md: '8px',
  lg: '12px',
  xl: '16px',
  '2xl': '24px',
  full: '9999px',
} as const;

// Box shadows
export const SHADOWS = {
  sm: '0 1px 2px rgba(0, 0, 0, 0.05)',
  md: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
  lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
  xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
  '2xl': '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
  glow: '0 0 20px rgba(37, 99, 235, 0.3)',
  glowSuccess: '0 0 20px rgba(16, 185, 129, 0.3)',
} as const;

// Animation durations
export const TRANSITIONS = {
  fast: '150ms',
  normal: '200ms',
  slow: '300ms',
  slower: '500ms',
} as const;

// Layout constraints
export const LAYOUT = {
  maxWidth: '1400px',
  maxWidthNarrow: '1200px',
  headerHeight: '72px',
  sidebarWidth: '280px',
} as const;

// Period options for analytics
export const PERIOD_OPTIONS = [
  { value: 'THIS_WEEK', label: 'This Week' },
  { value: 'LAST_WEEK', label: 'Last Week' },
  { value: 'THIS_MONTH', label: 'This Month' },
  { value: 'LAST_MONTH', label: 'Last Month' },
] as const;

// Number formatting
export function formatNumber(num: number): string {
  if (num >= 1_000_000) return `${(num / 1_000_000).toFixed(1)}M`;
  if (num >= 1_000) return `${(num / 1_000).toFixed(1)}K`;
  return num.toString();
}

// Percentage formatting
export function formatPercent(value: number, decimals = 1): string {
  return `${value.toFixed(decimals)}%`;
}

// Currency formatting
export function formatCurrency(value: number, currency = 'USD'): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
}

// Date formatting
export function formatDate(date: string | Date, options?: Intl.DateTimeFormatOptions): string {
  const defaultOptions: Intl.DateTimeFormatOptions = {
    month: 'short',
    day: 'numeric',
  };
  return new Date(date).toLocaleDateString('en-US', options || defaultOptions);
}
