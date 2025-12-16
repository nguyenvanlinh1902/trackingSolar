/**
 * Survey Metrics Types - Per Store and All Stores metrics
 */

// Time series data point
export interface TimeSeriesDataPoint {
  date: string;
  value: number;
}

// Base metric with value and change tracking
export interface MetricWithChange {
  value: number;
  previousValue: number;
  change: number;
  changePercent: number;
}

// Metric with time series data
export interface MetricWithTimeSeries extends MetricWithChange {
  timeSeries: TimeSeriesDataPoint[];
}

// Video source distribution metrics
export interface VideoSourceMetrics {
  tiktok: number;
  instagram: number;
  upload: number;
  total: number;
}

// Revenue metrics with time series and date range
export interface RevenueMetrics extends MetricWithTimeSeries {
  startDate?: string; // Optional date range start
  endDate?: string; // Optional date range end
}

// Engagement Rate metric with date range
export interface EngagementRateMetrics extends MetricWithChange {
  startDate?: string; // Optional date range start
  endDate?: string; // Optional date range end
}

// Conversion metrics for per store
export interface ConversionMetrics {
  ordersFromShopvid: MetricWithTimeSeries;
  atcRateMobile: MetricWithTimeSeries;
  atcRateDesktop: MetricWithTimeSeries;
  cvr: MetricWithTimeSeries;
}

// Widget usage metrics for per store (same structure as all stores)
export interface PerStoreWidgetUsage {
  widgetTypes: WidgetTypeCount[];
  avgWidgetsPerMerchant: number;
  avgActiveWidgetsPerMerchant: number;
  ctaActions: CTAActionCount[];
  productPagesCount?: number;
  otherPagesCount?: number;
  // Legacy fields for backward compatibility
  activeWidgets?: number;
  activeWidgetsPrevious?: number;
  activeWidgetsChange?: number;
  activeWidgetsChangePercent?: number;
  activeWidgetsTimeSeries?: TimeSeriesDataPoint[];
}

// Analytics metric with change tracking
export interface AnalyticsMetric {
  value: number;
  previousValue: number;
  change: number;
  changePercent: number;
}

// Per Store metrics data structure
export interface PerStoreMetricsData {
  storeId: string;
  storeName: string;
  summary?: {
    totalViews: AnalyticsMetric;
    totalLikes: AnalyticsMetric;
    totalShares: AnalyticsMetric;
    engagementRate: AnalyticsMetric;
    revenue: AnalyticsMetric;
  };
  videoSource: VideoSourceMetrics;
  widgetUsage: PerStoreWidgetUsage;
  conversion: ConversionMetrics;
  revenue: {
    inVideo: RevenueMetrics;
    postVideo: RevenueMetrics;
  };
  topVideos?: Array<{
    videoId: string;
    title: string;
    views: number;
    likes: number;
    shares: number;
    engagement: number;
    thumbnail?: string;
  }>;
}

// Store entity
export interface Store {
  id: string;
  name: string;
  domain: string;
}

// ===== ALL STORES METRICS TYPES =====

// Widget type usage count
export interface WidgetTypeCount {
  type: string;
  count: number;
}

// CTA action usage count with desktop/mobile breakdown
export interface CTAActionCount {
  action: string;
  desktop: number;
  mobile: number;
  count?: number; // Total (desktop + mobile), optional for backward compatibility
}

// Widget usage metrics for all stores
export interface WidgetUsageMetrics {
  widgetTypes: WidgetTypeCount[];
  avgWidgetsPerMerchant: number;
  avgActiveWidgetsPerMerchant: number;
  ctaActions: CTAActionCount[];
  productPagesCount?: number;
  otherPagesCount?: number;
}

// All Stores metrics data structure
export interface SurveyMetricsData {
  videoSource: VideoSourceMetrics;
  widgetUsage: WidgetUsageMetrics;
  revenue: {
    inVideo: RevenueMetrics;
    postVideo: RevenueMetrics;
  };
}
