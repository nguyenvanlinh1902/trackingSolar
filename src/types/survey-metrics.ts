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

// Revenue metrics with time series
export interface RevenueMetrics extends MetricWithTimeSeries {}

// Conversion metrics for per store
export interface ConversionMetrics {
  ordersFromShopvid: MetricWithTimeSeries;
  atcRateMobile: MetricWithTimeSeries;
  atcRateDesktop: MetricWithTimeSeries;
  cvr: MetricWithTimeSeries;
}

// Widget usage metrics for per store
export interface PerStoreWidgetUsage {
  activeWidgets: number;
  activeWidgetsPrevious: number;
  activeWidgetsChange: number;
  activeWidgetsChangePercent: number;
  activeWidgetsTimeSeries: TimeSeriesDataPoint[];
}

// Per Store metrics data structure
export interface PerStoreMetricsData {
  storeId: string;
  storeName: string;
  videoSource: VideoSourceMetrics;
  widgetUsage: PerStoreWidgetUsage;
  conversion: ConversionMetrics;
  revenue: {
    inVideo: RevenueMetrics;
    postVideo: RevenueMetrics;
  };
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

// CTA action usage count
export interface CTAActionCount {
  action: string;
  count: number;
}

// Widget usage metrics for all stores
export interface WidgetUsageMetrics {
  widgetTypes: WidgetTypeCount[];
  avgWidgetsPerMerchant: number;
  avgActiveWidgetsPerMerchant: number;
  ctaActions: CTAActionCount[];
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
