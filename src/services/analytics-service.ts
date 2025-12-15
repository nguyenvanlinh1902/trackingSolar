/**
 * Analytics Service - Integrates with Shopable analytics API
 */

import type {
  Store,
  PerStoreMetricsData,
  SurveyMetricsData,
  VideoSourceMetrics,
  WidgetUsageMetrics,
  RevenueMetrics,
} from '@/types/survey-metrics';

export type PeriodType = 'THIS_WEEK' | 'LAST_WEEK' | 'THIS_MONTH' | 'LAST_MONTH';

export interface AnalyticsMetric {
  value: number;
  previousValue: number;
  change: number;
  changePercent: number;
}

export interface VideoAnalytics {
  videoId: string;
  title: string;
  views: number;
  likes: number;
  shares: number;
  engagement: number;
  thumbnail?: string;
}

export interface AnalyticsData {
  summary: {
    totalViews: AnalyticsMetric;
    totalLikes: AnalyticsMetric;
    totalShares: AnalyticsMetric;
    engagementRate: AnalyticsMetric;
    revenue: AnalyticsMetric;
  };
  chartData: {
    date: string;
    views: number;
    likes: number;
    shares: number;
  }[];
  topVideos: VideoAnalytics[];
  period: PeriodType;
}

// Mock data for development - Replace with actual API calls
const mockAnalyticsData: AnalyticsData = {
  summary: {
    totalViews: { value: 12580, previousValue: 10200, change: 2380, changePercent: 23.3 },
    totalLikes: { value: 3240, previousValue: 2800, change: 440, changePercent: 15.7 },
    totalShares: { value: 890, previousValue: 720, change: 170, changePercent: 23.6 },
    engagementRate: { value: 8.5, previousValue: 7.2, change: 1.3, changePercent: 18.1 },
    revenue: { value: 4250, previousValue: 3800, change: 450, changePercent: 11.8 },
  },
  chartData: [
    { date: '2024-12-09', views: 1200, likes: 340, shares: 89 },
    { date: '2024-12-10', views: 1850, likes: 520, shares: 145 },
    { date: '2024-12-11', views: 2100, likes: 580, shares: 167 },
    { date: '2024-12-12', views: 1680, likes: 420, shares: 98 },
    { date: '2024-12-13', views: 2450, likes: 680, shares: 189 },
    { date: '2024-12-14', views: 1800, likes: 380, shares: 112 },
    { date: '2024-12-15', views: 1500, likes: 320, shares: 90 },
  ],
  topVideos: [
    { videoId: '1', title: 'Product Demo Video', views: 4580, likes: 1200, shares: 340, engagement: 12.5 },
    { videoId: '2', title: 'How-to Guide', views: 3200, likes: 890, shares: 220, engagement: 10.2 },
    { videoId: '3', title: 'Customer Testimonial', views: 2450, likes: 670, shares: 180, engagement: 9.8 },
    { videoId: '4', title: 'Behind the Scenes', views: 1890, likes: 340, shares: 98, engagement: 7.5 },
    { videoId: '5', title: 'New Collection Reveal', views: 460, likes: 140, shares: 52, engagement: 6.2 },
  ],
  period: 'THIS_WEEK',
};

/**
 * Fetches analytics data from Shopable API
 * @param period - Time period for analytics
 * @param shopDomain - Shop domain (optional, for API auth)
 */
export async function getAnalytics(
  period: PeriodType = 'THIS_WEEK',
  shopDomain?: string
): Promise<AnalyticsData> {
  const baseUrl = import.meta.env.VITE_SHOPABLE_API_URL;

  if (!baseUrl) {
    // Return mock data in development
    console.log('Using mock analytics data (VITE_SHOPABLE_API_URL not set)');
    return { ...mockAnalyticsData, period };
  }

  try {
    const response = await fetch(`${baseUrl}/api/analytics/${period}`, {
      headers: {
        'Content-Type': 'application/json',
        ...(shopDomain && { 'X-Shop-Domain': shopDomain }),
      },
    });

    if (!response.ok) {
      throw new Error(`Analytics API error: ${response.status}`);
    }

    const data = await response.json();
    return { ...data.data, period };
  } catch (error) {
    console.error('Failed to fetch analytics:', error);
    // Fallback to mock data
    return { ...mockAnalyticsData, period };
  }
}

/**
 * Fetches videos report from Shopable API
 */
export async function getVideosReport(shopDomain?: string): Promise<VideoAnalytics[]> {
  const baseUrl = import.meta.env.VITE_SHOPABLE_API_URL;

  if (!baseUrl) {
    return mockAnalyticsData.topVideos;
  }

  try {
    const response = await fetch(`${baseUrl}/api/analytics/videos-report`, {
      headers: {
        'Content-Type': 'application/json',
        ...(shopDomain && { 'X-Shop-Domain': shopDomain }),
      },
    });

    if (!response.ok) {
      throw new Error(`Videos report API error: ${response.status}`);
    }

    const data = await response.json();
    return data.data;
  } catch (error) {
    console.error('Failed to fetch videos report:', error);
    return mockAnalyticsData.topVideos;
  }
}

/**
 * Fetches analytics summary from Shopable API
 */
export async function getAnalyticsSummary(shopDomain?: string): Promise<AnalyticsData['summary']> {
  const baseUrl = import.meta.env.VITE_SHOPABLE_API_URL;

  if (!baseUrl) {
    return mockAnalyticsData.summary;
  }

  try {
    const response = await fetch(`${baseUrl}/api/analytics/videos-summary`, {
      headers: {
        'Content-Type': 'application/json',
        ...(shopDomain && { 'X-Shop-Domain': shopDomain }),
      },
    });

    if (!response.ok) {
      throw new Error(`Analytics summary API error: ${response.status}`);
    }

    const data = await response.json();
    return data.data;
  } catch (error) {
    console.error('Failed to fetch analytics summary:', error);
    return mockAnalyticsData.summary;
  }
}

// Mock data for stores
const mockStores: Store[] = [
  { id: '1', name: 'Fashion Hub', domain: 'fashion-hub.myshopify.com' },
  { id: '2', name: 'Tech Galaxy', domain: 'tech-galaxy.myshopify.com' },
  { id: '3', name: 'Home Essentials', domain: 'home-essentials.myshopify.com' },
  { id: '4', name: 'Beauty Palace', domain: 'beauty-palace.myshopify.com' },
  { id: '5', name: 'Sports Zone', domain: 'sports-zone.myshopify.com' },
];

// Mock data for per store metrics
const mockPerStoreMetrics: Omit<PerStoreMetricsData, 'storeId' | 'storeName'> = {
  videoSource: {
    tiktok: 150,
    instagram: 120,
    upload: 80,
    total: 350,
  },
  widgetUsage: {
    activeWidgets: 25,
    activeWidgetsPrevious: 22,
    activeWidgetsChange: 3,
    activeWidgetsChangePercent: 13.6,
    activeWidgetsTimeSeries: [
      { date: '2024-12-09', value: 22 },
      { date: '2024-12-10', value: 23 },
      { date: '2024-12-11', value: 24 },
      { date: '2024-12-12', value: 25 },
      { date: '2024-12-13', value: 25 },
      { date: '2024-12-14', value: 25 },
      { date: '2024-12-15', value: 25 },
    ],
  },
  conversion: {
    ordersFromShopvid: {
      value: 15.5,
      previousValue: 12.3,
      change: 3.2,
      changePercent: 26.0,
      timeSeries: [
        { date: '2024-12-09', value: 12.0 },
        { date: '2024-12-10', value: 13.5 },
        { date: '2024-12-11', value: 14.8 },
        { date: '2024-12-12', value: 15.2 },
        { date: '2024-12-13', value: 15.8 },
        { date: '2024-12-14', value: 15.5 },
        { date: '2024-12-15', value: 15.5 },
      ],
    },
    atcRateMobile: {
      value: 8.5,
      previousValue: 7.2,
      change: 1.3,
      changePercent: 18.1,
      timeSeries: [
        { date: '2024-12-09', value: 7.0 },
        { date: '2024-12-10', value: 8.0 },
        { date: '2024-12-11', value: 8.5 },
        { date: '2024-12-12', value: 8.3 },
        { date: '2024-12-13', value: 8.8 },
        { date: '2024-12-14', value: 8.5 },
        { date: '2024-12-15', value: 8.5 },
      ],
    },
    atcRateDesktop: {
      value: 6.2,
      previousValue: 5.8,
      change: 0.4,
      changePercent: 6.9,
      timeSeries: [
        { date: '2024-12-09', value: 5.5 },
        { date: '2024-12-10', value: 6.0 },
        { date: '2024-12-11', value: 6.2 },
        { date: '2024-12-12', value: 6.1 },
        { date: '2024-12-13', value: 6.3 },
        { date: '2024-12-14', value: 6.2 },
        { date: '2024-12-15', value: 6.2 },
      ],
    },
    cvr: {
      value: 3.5,
      previousValue: 2.8,
      change: 0.7,
      changePercent: 25.0,
      timeSeries: [
        { date: '2024-12-09', value: 2.5 },
        { date: '2024-12-10', value: 3.0 },
        { date: '2024-12-11', value: 3.2 },
        { date: '2024-12-12', value: 3.4 },
        { date: '2024-12-13', value: 3.6 },
        { date: '2024-12-14', value: 3.5 },
        { date: '2024-12-15', value: 3.5 },
      ],
    },
  },
  revenue: {
    inVideo: {
      value: 4500,
      previousValue: 3800,
      change: 700,
      changePercent: 18.4,
      timeSeries: [
        { date: '2024-12-09', value: 400 },
        { date: '2024-12-10', value: 650 },
        { date: '2024-12-11', value: 750 },
        { date: '2024-12-12', value: 600 },
        { date: '2024-12-13', value: 900 },
        { date: '2024-12-14', value: 700 },
        { date: '2024-12-15', value: 500 },
      ],
    },
    postVideo: {
      value: 3200,
      previousValue: 2800,
      change: 400,
      changePercent: 14.3,
      timeSeries: [
        { date: '2024-12-09', value: 300 },
        { date: '2024-12-10', value: 450 },
        { date: '2024-12-11', value: 550 },
        { date: '2024-12-12', value: 400 },
        { date: '2024-12-13', value: 650 },
        { date: '2024-12-14', value: 500 },
        { date: '2024-12-15', value: 350 },
      ],
    },
  },
};

/**
 * Get list of stores
 */
export async function getStores(): Promise<Store[]> {
  const baseUrl = import.meta.env.VITE_SHOPABLE_API_URL;
  const adminApiKey = import.meta.env.VITE_ADMIN_API_KEY || 'avada_admin_!@#123';

  if (!baseUrl) {
    console.log('Using mock stores data (VITE_SHOPABLE_API_URL not set)');
    return [...mockStores];
  }

  try {
    const response = await fetch(`${baseUrl}/admin/api/v1/analytics/stores`, {
      headers: {
        'Content-Type': 'application/json',
        'X-Admin-Api-Key': adminApiKey,
      },
    });

    if (!response.ok) {
      if (response.status === 401) {
        throw new Error('Unauthorized: Invalid API key');
      }
      throw new Error(`Stores API error: ${response.status}`);
    }

    const data = await response.json();
    return data.data || data.stores || [];
  } catch (error) {
    console.error('Failed to fetch stores:', error);
    return [...mockStores];
  }
}

/**
 * Get per store metrics
 */
export async function getPerStoreMetrics(
  storeId: string,
  period: PeriodType = 'THIS_WEEK',
  shopDomain?: string
): Promise<PerStoreMetricsData> {
  const baseUrl = import.meta.env.VITE_SHOPABLE_API_URL;
  const adminApiKey = import.meta.env.VITE_ADMIN_API_KEY || 'avada_admin_!@#123';

  // Find store name from mock data for fallback
  const store = mockStores.find(s => s.id === storeId);
  const fallbackStoreName = store?.name || `Store ${storeId}`;

  if (!baseUrl) {
    console.log('Using mock per store metrics data (VITE_SHOPABLE_API_URL not set)');
    return { ...mockPerStoreMetrics, storeId, storeName: fallbackStoreName };
  }

  try {
    const response = await fetch(
      `${baseUrl}/admin/api/v1/analytics/stats/shop/${storeId}?period=${period}`,
      {
        headers: {
          'Content-Type': 'application/json',
          'X-Admin-Api-Key': adminApiKey,
          ...(shopDomain && { 'X-Shop-Domain': shopDomain }),
        },
      }
    );

    if (!response.ok) {
      if (response.status === 401) {
        throw new Error('Unauthorized: Invalid API key');
      }
      if (response.status === 404) {
        throw new Error(`Store not found: ${storeId}`);
      }
      throw new Error(`Per store metrics API error: ${response.status}`);
    }

    const data = await response.json();

    // Validate response structure
    if (!data.data || !data.data.videoSource || !data.data.conversion || !data.data.revenue) {
      throw new Error('Invalid per store metrics response structure');
    }

    return {
      ...data.data,
      storeId,
      storeName: data.data.storeName || fallbackStoreName,
    };
  } catch (error) {
    console.error('Failed to fetch per store metrics:', error);
    return { ...mockPerStoreMetrics, storeId, storeName: fallbackStoreName };
  }
}

// ===== ALL STORES SURVEY METRICS =====

// Mock data for All Stores survey metrics
const mockSurveyMetrics: SurveyMetricsData = {
  videoSource: {
    tiktok: 450,
    instagram: 350,
    upload: 200,
    total: 1000,
  },
  widgetUsage: {
    widgetTypes: [
      { type: 'Basic carousel', count: 120 },
      { type: 'Highlighted carousel', count: 85 },
      { type: 'Grid', count: 200 },
      { type: 'Float', count: 150 },
      { type: 'Story', count: 95 },
    ],
    avgWidgetsPerMerchant: 12.5,
    avgActiveWidgetsPerMerchant: 8.2,
    ctaActions: [
      { action: 'Open product detail page', count: 320 },
      { action: 'Show product detail within the modal', count: 180 },
      { action: 'Add to cart (no page change)', count: 250 },
      { action: 'Add to cart and open cart page', count: 150 },
    ],
  },
  revenue: {
    inVideo: {
      value: 12500,
      previousValue: 10200,
      change: 2300,
      changePercent: 22.5,
      timeSeries: [
        { date: '2024-12-09', value: 1200 },
        { date: '2024-12-10', value: 1850 },
        { date: '2024-12-11', value: 2100 },
        { date: '2024-12-12', value: 1680 },
        { date: '2024-12-13', value: 2450 },
        { date: '2024-12-14', value: 1800 },
        { date: '2024-12-15', value: 1500 },
      ],
    },
    postVideo: {
      value: 8500,
      previousValue: 7200,
      change: 1300,
      changePercent: 18.1,
      timeSeries: [
        { date: '2024-12-09', value: 800 },
        { date: '2024-12-10', value: 1200 },
        { date: '2024-12-11', value: 1500 },
        { date: '2024-12-12', value: 1100 },
        { date: '2024-12-13', value: 1800 },
        { date: '2024-12-14', value: 1300 },
        { date: '2024-12-15', value: 1000 },
      ],
    },
  },
};

/**
 * Get video source metrics for all stores
 */
export async function getVideoSourceMetrics(
  period: PeriodType = 'THIS_WEEK',
  shopDomain?: string
): Promise<VideoSourceMetrics> {
  const baseUrl = import.meta.env.VITE_SHOPABLE_API_URL;
  const adminApiKey = import.meta.env.VITE_ADMIN_API_KEY || 'avada_admin_!@#123';

  if (!baseUrl) {
    console.log('Using mock video source data (VITE_SHOPABLE_API_URL not set)');
    return mockSurveyMetrics.videoSource;
  }

  try {
    const response = await fetch(
      `${baseUrl}/admin/api/v1/analytics/stats/video-source?period=${period}`,
      {
        headers: {
          'Content-Type': 'application/json',
          'X-Admin-Api-Key': adminApiKey,
          ...(shopDomain && { 'X-Shop-Domain': shopDomain }),
        },
      }
    );

    if (!response.ok) {
      throw new Error(`Video source API error: ${response.status}`);
    }

    const data = await response.json();
    return data.data;
  } catch (error) {
    console.error('Failed to fetch video source metrics:', error);
    return mockSurveyMetrics.videoSource;
  }
}

/**
 * Get widget usage metrics for all stores
 */
export async function getWidgetUsageMetrics(
  period: PeriodType = 'THIS_WEEK',
  shopDomain?: string
): Promise<WidgetUsageMetrics> {
  const baseUrl = import.meta.env.VITE_SHOPABLE_API_URL;
  const adminApiKey = import.meta.env.VITE_ADMIN_API_KEY || 'avada_admin_!@#123';

  if (!baseUrl) {
    console.log('Using mock widget usage data (VITE_SHOPABLE_API_URL not set)');
    return mockSurveyMetrics.widgetUsage;
  }

  try {
    const response = await fetch(
      `${baseUrl}/admin/api/v1/analytics/stats/widget-usage?period=${period}`,
      {
        headers: {
          'Content-Type': 'application/json',
          'X-Admin-Api-Key': adminApiKey,
          ...(shopDomain && { 'X-Shop-Domain': shopDomain }),
        },
      }
    );

    if (!response.ok) {
      throw new Error(`Widget usage API error: ${response.status}`);
    }

    const data = await response.json();
    return data.data;
  } catch (error) {
    console.error('Failed to fetch widget usage metrics:', error);
    return mockSurveyMetrics.widgetUsage;
  }
}

/**
 * Get revenue metrics for all stores
 */
export async function getRevenueMetrics(
  period: PeriodType = 'THIS_WEEK',
  shopDomain?: string
): Promise<{ inVideo: RevenueMetrics; postVideo: RevenueMetrics }> {
  const baseUrl = import.meta.env.VITE_SHOPABLE_API_URL;
  const adminApiKey = import.meta.env.VITE_ADMIN_API_KEY || 'avada_admin_!@#123';

  if (!baseUrl) {
    console.log('Using mock revenue data (VITE_SHOPABLE_API_URL not set)');
    return mockSurveyMetrics.revenue;
  }

  try {
    const response = await fetch(
      `${baseUrl}/admin/api/v1/analytics/stats/revenue?period=${period}`,
      {
        headers: {
          'Content-Type': 'application/json',
          'X-Admin-Api-Key': adminApiKey,
          ...(shopDomain && { 'X-Shop-Domain': shopDomain }),
        },
      }
    );

    if (!response.ok) {
      throw new Error(`Revenue API error: ${response.status}`);
    }

    const data = await response.json();
    return data.data;
  } catch (error) {
    console.error('Failed to fetch revenue metrics:', error);
    return mockSurveyMetrics.revenue;
  }
}

/**
 * Get all stores metrics (combined)
 * Fetches video source, widget usage, and revenue metrics in parallel
 */
export async function getAllStoresMetrics(
  period: PeriodType = 'THIS_WEEK',
  shopDomain?: string
): Promise<SurveyMetricsData> {
  const [videoSource, widgetUsage, revenue] = await Promise.all([
    getVideoSourceMetrics(period, shopDomain),
    getWidgetUsageMetrics(period, shopDomain),
    getRevenueMetrics(period, shopDomain),
  ]);

  return {
    videoSource,
    widgetUsage,
    revenue,
  };
}
