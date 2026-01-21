/**
 * All Stores Metrics Types
 * Defines data structures for All Stores analytics dashboard
 */

import type { VideoSourceMetrics, WidgetUsageMetrics } from './survey-metrics';

// API Response from /admin/api/v1/analytics/stats
export interface AllStoresApiResponse {
  videoStats?: {
    tiktok: number;
    instagram: number;
    import: number;
    total: number;
  };
  widgetStats?: {
    totalWidgets: number;
    activeWidgets: number;
    inactiveWidgets: number;
    totalActiveMerchants?: number;
    layoutBreakdown?: LayoutBreakdown;
    layoutPosition?: LayoutPosition;
    buttonActionBreakdown?: ButtonActionBreakdown;
  };
  totalShops?: number;
  updatedAt?: Record<string, unknown>;
}

export interface LayoutBreakdown {
  highlighted_carousel?: number;
  basic_carousel?: number;
  float?: number;
  grid?: number;
  story?: number;
}

export interface LayoutPosition {
  'product-pages'?: number;
  'other-pages'?: number;
}

export interface ButtonActionBreakdown {
  desktop?: ButtonActions;
  mobile?: ButtonActions;
}

export interface ButtonActions {
  'product-page'?: number;
  'product-modal'?: number;
  'add-to-cart'?: number;
  'cart-page'?: number;
}

// Transformed data for components
export interface AllStoresMetricsData {
  videoSource: VideoSourceMetrics;
  widgetUsage: WidgetUsageMetrics;
  totalShops: number;
  updatedAt?: Record<string, unknown>;
}

// Context state
export interface AllStoresContextState {
  data: AllStoresMetricsData | null;
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}
