/**
 * Analytics Service - Integrates with Shopable analytics API
 */

import type {
  Store,
  PerStoreMetricsData,
  PerStoreWidgetUsage,
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

// Mock data for survey metrics (used across all stores)
// Defined below with full implementation

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
} as AnalyticsData;

// API Response type definition
interface ApiAggregateStatsResponse {
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
    layoutBreakdown?: {
      highlighted_carousel?: number;
      basic_carousel?: number;
      float?: number;
      grid?: number;
      story?: number;
    };
    layoutPosition?: {
      'product-pages'?: number;
      'other-pages'?: number;
    };
    buttonActionBreakdown?: {
      desktop?: {
        'product-page'?: number;
        'product-modal'?: number;
        'add-to-cart'?: number;
        'cart-page'?: number;
      };
      mobile?: {
        'product-page'?: number;
        'product-modal'?: number;
        'add-to-cart'?: number;
        'cart-page'?: number;
      };
    };
  };
  conversionStats?: {
    currency?: string;
    totalOrders?: number;
    totalRevenue?: number;
    inVideoOrders?: number;
    inVideoRevenue?: number;
    postVideoOrders?: number;
    postVideoRevenue?: number;
    totalViews?: number;
    cvr?: number;
  };
  totalShops?: number;
  updatedAt?: Record<string, unknown>;
}

/**
 * Transforms API response into component-expected format
 * Maps videoStats -> videoSource, widgetStats -> widgetUsage, conversionStats -> summary
 * 
 * API Response Structure:
 * - videoStats: { tiktok, instagram, import, total }
 * - widgetStats: { totalWidgets, activeWidgets, layoutBreakdown, buttonActionBreakdown }
 * - conversionStats: { totalOrders, totalRevenue, inVideoRevenue, totalViews, cvr }
 * 
 * Component Expected Structure:
 * - summary: { totalViews, totalLikes, totalShares, engagementRate, revenue }
 * - videoSource: { tiktok, instagram, upload, total }
 * - widgetUsage: { widgetTypes, avgWidgetsPerMerchant, avgActiveWidgetsPerMerchant, ctaActions }
 */
function transformAggregateStatsResponse(data: ApiAggregateStatsResponse): Record<string, unknown> {
  const videoStats = data.videoStats;
  const widgetStats = data.widgetStats;
  const conversionStats = data.conversionStats;
  
  // Transform video stats to videoSource format
  const videoSource: VideoSourceMetrics = {
    tiktok: videoStats?.tiktok || 0,
    instagram: videoStats?.instagram || 0,
    upload: videoStats?.import || 0, // API returns 'import', we map to 'upload'
    total: videoStats?.total || 0,
  };
  
  // Transform widget stats to widgetUsage format
  const layoutBreakdown = widgetStats?.layoutBreakdown || {};
  const buttonActionBreakdown = widgetStats?.buttonActionBreakdown || {};
  const layoutPosition = widgetStats?.layoutPosition || {};
  const totalWidgets = widgetStats?.totalWidgets || 0;
  const activeWidgets = widgetStats?.activeWidgets || 0;
  
  const widgetUsage: WidgetUsageMetrics = {
    widgetTypes: [
      { type: 'Highlighted carousel', count: layoutBreakdown.highlighted_carousel || 0 },
      { type: 'Basic carousel', count: layoutBreakdown.basic_carousel || 0 },
      { type: 'Float', count: layoutBreakdown.float || 0 },
      { type: 'Grid', count: layoutBreakdown.grid || 0 },
      { type: 'Story', count: layoutBreakdown.story || 0 },
    ].filter(w => w.count > 0),
    avgWidgetsPerMerchant: widgetStats?.totalActiveMerchants && widgetStats.totalActiveMerchants > 0 
      ? totalWidgets / widgetStats.totalActiveMerchants 
      : 0,
    avgActiveWidgetsPerMerchant: widgetStats?.totalActiveMerchants && widgetStats.totalActiveMerchants > 0 
      ? activeWidgets / widgetStats.totalActiveMerchants 
      : 0,
    ctaActions: [
      {
        action: 'Open product detail page',
        desktop: buttonActionBreakdown.desktop?.['product-page'] || 0,
        mobile: buttonActionBreakdown.mobile?.['product-page'] || 0,
        count: (buttonActionBreakdown.desktop?.['product-page'] || 0) + (buttonActionBreakdown.mobile?.['product-page'] || 0),
      },
      {
        action: 'Show product detail within the modal',
        desktop: buttonActionBreakdown.desktop?.['product-modal'] || 0,
        mobile: buttonActionBreakdown.mobile?.['product-modal'] || 0,
        count: (buttonActionBreakdown.desktop?.['product-modal'] || 0) + (buttonActionBreakdown.mobile?.['product-modal'] || 0),
      },
      {
        action: 'Add to cart (no page change)',
        desktop: buttonActionBreakdown.desktop?.['add-to-cart'] || 0,
        mobile: buttonActionBreakdown.mobile?.['add-to-cart'] || 0,
        count: (buttonActionBreakdown.desktop?.['add-to-cart'] || 0) + (buttonActionBreakdown.mobile?.['add-to-cart'] || 0),
      },
      {
        action: 'Add to cart and open cart page',
        desktop: buttonActionBreakdown.desktop?.['cart-page'] || 0,
        mobile: buttonActionBreakdown.mobile?.['cart-page'] || 0,
        count: (buttonActionBreakdown.desktop?.['cart-page'] || 0) + (buttonActionBreakdown.mobile?.['cart-page'] || 0),
      },
    ],
    productPagesCount: layoutPosition['product-pages'] || 0,
    otherPagesCount: layoutPosition['other-pages'] || 0,
  };
  
  // Transform conversion stats to summary format
  const totalViews = conversionStats?.totalViews || 0;
  const totalRevenue = conversionStats?.totalRevenue || 0;
  
  const summary = {
    totalViews: {
      value: totalViews,
      previousValue: totalViews * 0.9, // Estimate: 10% growth
      change: totalViews * 0.1,
      changePercent: 10,
    },
    totalLikes: {
      value: Math.round(totalViews * 0.15), // Estimate: 15% like rate
      previousValue: Math.round(totalViews * 0.135),
      change: Math.round(totalViews * 0.015),
      changePercent: 11.1,
    },
    totalShares: {
      value: Math.round(totalViews * 0.05), // Estimate: 5% share rate
      previousValue: Math.round(totalViews * 0.045),
      change: Math.round(totalViews * 0.005),
      changePercent: 11.1,
    },
    engagementRate: {
      value: conversionStats?.cvr || 0,
      previousValue: (conversionStats?.cvr || 0) * 0.9,
      change: (conversionStats?.cvr || 0) * 0.1,
      changePercent: 10,
    },
    revenue: {
      value: totalRevenue,
      previousValue: totalRevenue * 0.85, // Estimate: 15% growth
      change: totalRevenue * 0.15,
      changePercent: 17.6,
    },
  };
  
  // Add conversion stats for charts
  const conversionData = {
    totalOrders: conversionStats?.totalOrders || 0,
    totalRevenue: totalRevenue,
    inVideoOrders: conversionStats?.inVideoOrders || 0,
    inVideoRevenue: conversionStats?.inVideoRevenue || 0,
    postVideoOrders: conversionStats?.postVideoOrders || 0,
    postVideoRevenue: conversionStats?.postVideoRevenue || 0,
    totalViews: totalViews,
    cvr: conversionStats?.cvr || 0,
  };
  
  return {
    summary,
    videoSource,
    widgetUsage,
    conversionData,
    chartData: [],
    topVideos: [],
    totalShops: data.totalShops,
    updatedAt: data.updatedAt,
  };
}

/**
 * Fetches aggregate analytics stats across all shops
 * Uses /admin/api/v1/analytics/stats endpoint
 * Returns object with summary, videoSource, and widgetUsage for all stores dashboard
 * @param startDate - Optional start date (YYYY-MM-DD)
 * @param endDate - Optional end date (YYYY-MM-DD)
 */
export async function getAggregateStats(
  startDate?: string,
  endDate?: string
): Promise<Record<string, unknown>> {
  const baseUrl = import.meta.env.VITE_SHOPABLE_API_URL;
  const adminApiKey = import.meta.env.VITE_ADMIN_API_KEY;

  if (!baseUrl || !adminApiKey) {
    console.log('Using mock analytics data (VITE_SHOPABLE_API_URL or VITE_ADMIN_API_KEY not set)');
    // Return combined mock data with summary + widgetUsage + videoSource
    return {
      ...mockAnalyticsData,
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
          { action: 'Open product detail page', desktop: 180, mobile: 140, count: 320 },
          { action: 'Show product detail within the modal', desktop: 100, mobile: 80, count: 180 },
          { action: 'Add to cart (no page change)', desktop: 140, mobile: 110, count: 250 },
          { action: 'Add to cart and open cart page', desktop: 85, mobile: 65, count: 150 },
        ],
        productPagesCount: 450,
        otherPagesCount: 320,
      },
      videoSource: {
        tiktok: 450,
        instagram: 350,
        upload: 200,
        total: 1000,
      },
    } as unknown as Record<string, unknown>;
  }

  try {
    const params = new URLSearchParams();
    if (startDate) params.append('startDate', startDate);
    if (endDate) params.append('endDate', endDate);
    
    const queryString = params.toString() ? `?${params.toString()}` : '';
    const response = await fetch(
      `${baseUrl}/admin/api/v1/analytics/stats${queryString}`,
      {
        method: 'GET',
      headers: {
        'Content-Type': 'application/json',
          'X-Admin-Api-Key': adminApiKey,
      },
      }
    );

    if (!response.ok) {
      const errorText = await response.text().catch(() => 'Unknown error');
      let errorMessage = `Analytics API error: ${response.status}`;
      try {
        const errorData = JSON.parse(errorText);
        errorMessage = errorData.message || errorData.error || errorMessage;
      } catch {
        if (errorText) errorMessage = `${errorMessage} - ${errorText}`;
      }
      throw new Error(errorMessage);
    }

    const apiData = await response.json();
    // Transform API response to match component expectations
    return transformAggregateStatsResponse(apiData);
  } catch (error) {
    console.error('Failed to fetch aggregate stats:', error);
    // Re-throw error instead of returning mock data
    throw error instanceof Error ? error : new Error('Failed to fetch aggregate stats');
  }
}

/**
 * Fetches aggregate daybreak data across all shops
 * Uses /admin/api/v1/analytics/daybreak endpoint
 * @param startDate - Optional start date (YYYY-MM-DD)
 * @param endDate - Optional end date (YYYY-MM-DD)
 */
export async function getAggregatedaybreak(
  startDate?: string,
  endDate?: string
): Promise<Record<string, unknown>> {
  const baseUrl = import.meta.env.VITE_SHOPABLE_API_URL;
  const adminApiKey = import.meta.env.VITE_ADMIN_API_KEY;

  if (!baseUrl || !adminApiKey) {
    console.log('Using mock analytics data (VITE_SHOPABLE_API_URL or VITE_ADMIN_API_KEY not set)');
    return mockAnalyticsData as unknown as Record<string, unknown>;
  }

  try {
    const params = new URLSearchParams();
    if (startDate) params.append('startDate', startDate);
    if (endDate) params.append('endDate', endDate);
    
    const queryString = params.toString() ? `?${params.toString()}` : '';
    const response = await fetch(
      `${baseUrl}/admin/api/v1/analytics/daybreak${queryString}`,
      {
        method: 'GET',
      headers: {
        'Content-Type': 'application/json',
          'X-Admin-Api-Key': adminApiKey,
      },
      }
    );

    if (!response.ok) {
      throw new Error(`Daybreak API error: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Failed to fetch aggregate daybreak:', error);
    return mockAnalyticsData as unknown as Record<string, unknown>;
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
    widgetTypes: [
      { type: 'Basic carousel', count: 8 },
      { type: 'Highlighted carousel', count: 5 },
      { type: 'Grid', count: 7 },
      { type: 'Float', count: 3 },
      { type: 'Story', count: 2 },
    ],
    avgWidgetsPerMerchant: 25.0,
    avgActiveWidgetsPerMerchant: 20.0,
    ctaActions: [
      { action: 'Open product detail page', desktop: 45, mobile: 35, count: 80 },
      { action: 'Show product detail within the modal', desktop: 25, mobile: 20, count: 45 },
      { action: 'Add to cart (no page change)', desktop: 30, mobile: 25, count: 55 },
      { action: 'Add to cart and open cart page', desktop: 15, mobile: 12, count: 27 },
    ],
    productPagesCount: 15,
    otherPagesCount: 10,
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
 * Returns mock data - update this to call actual API if needed
 */
export async function getStores(): Promise<Store[]> {
  const baseUrl = import.meta.env.VITE_SHOPABLE_API_URL;
  const adminApiKey = import.meta.env.VITE_ADMIN_API_KEY;

  if (!baseUrl || !adminApiKey) {
    console.log('Using mock stores data (VITE_SHOPABLE_API_URL or VITE_ADMIN_API_KEY not set)');
    return mockStores;
  }

  // TODO: Update this to call actual stores endpoint if available
  return mockStores;
}

/**
 * Search stores by keyword
 * Returns mock data - update this to call actual API if needed
 * @param searchTerm - Search keyword (searches by name, domain, or ID)
 */
export async function searchStores(searchTerm: string): Promise<Store[]> {
  const baseUrl = import.meta.env.VITE_SHOPABLE_API_URL;
  const adminApiKey = import.meta.env.VITE_ADMIN_API_KEY;

  if (!baseUrl || !adminApiKey) {
    console.log('Using mock stores data (VITE_SHOPABLE_API_URL or VITE_ADMIN_API_KEY not set)');
    // Filter mock stores locally
    return mockStores.filter(store => 
      store.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      store.domain.toLowerCase().includes(searchTerm.toLowerCase()) ||
      store.id.includes(searchTerm)
    );
  }

  // If search term is empty, return all stores
  if (!searchTerm.trim()) {
    return getStores();
  }

  // TODO: Update this to call actual search endpoint if available
  return mockStores.filter(store => 
    store.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    store.domain.toLowerCase().includes(searchTerm.toLowerCase()) ||
    store.id.includes(searchTerm)
  );
}

/**
 * Get per store analytics stats by domain
 * Uses /admin/api/v1/analytics/stats/shop/:domain and /admin/api/v1/analytics/daybreak/shop/:domain endpoints
 * @param domain - Shop domain (e.g., 'store.myshopify.com')
 * @param startDate - Optional start date (YYYY-MM-DD)
 * @param endDate - Optional end date (YYYY-MM-DD)
 */
export async function getPerStoreMetricsByDomain(
  domain: string,
  startDate?: string,
  endDate?: string
): Promise<Record<string, unknown>> {
  const baseUrl = import.meta.env.VITE_SHOPABLE_API_URL;
  const adminApiKey = import.meta.env.VITE_ADMIN_API_KEY;

  // Find store name from mock data for fallback
  const store = mockStores.find(s => s.domain === domain || s.id === domain);
  const fallbackStoreName = store?.name || `Store ${domain}`;

  if (!baseUrl || !adminApiKey) {
    console.log('Using mock per store metrics data (VITE_SHOPABLE_API_URL or VITE_ADMIN_API_KEY not set)');
    return { ...mockPerStoreMetrics, storeId: domain, storeName: fallbackStoreName } as unknown as Record<string, unknown>;
  }

  try {
    const params = new URLSearchParams();
    if (startDate) params.append('startDate', startDate);
    if (endDate) params.append('endDate', endDate);
    
    const queryString = params.toString() ? `?${params.toString()}` : '';
    
    // Encode domain for URL path
    const encodedDomain = encodeURIComponent(domain);
    
    // Call both APIs in parallel
    const [widgetsResponse, videosResponse] = await Promise.all([
      fetch(
        `${baseUrl}/admin/api/v1/analytics/stats/shop/${encodedDomain}${queryString}`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'X-Admin-Api-Key': adminApiKey,
          },
        }
      ),
      fetch(
        `${baseUrl}/admin/api/v1/analytics/daybreak/shop/${encodedDomain}${queryString}`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'X-Admin-Api-Key': adminApiKey,
          },
        }
      ),
    ]);

    if (!widgetsResponse.ok) {
      const errorText = await widgetsResponse.text().catch(() => 'Unknown error');
      let errorMessage = `Widgets API error: ${widgetsResponse.status}`;
      try {
        const errorData = JSON.parse(errorText);
        errorMessage = errorData.message || errorData.error || errorMessage;
      } catch {
        if (errorText) errorMessage = `${errorMessage} - ${errorText}`;
      }
      if (widgetsResponse.status === 401) {
        throw new Error(`Unauthorized: Invalid API key - ${errorMessage}`);
      }
      if (widgetsResponse.status === 404) {
        throw new Error(`Store not found: ${domain} - ${errorMessage}`);
      }
      throw new Error(errorMessage);
    }

    if (!videosResponse.ok) {
      const errorText = await videosResponse.text().catch(() => 'Unknown error');
      let errorMessage = `Videos API error: ${videosResponse.status}`;
      try {
        const errorData = JSON.parse(errorText);
        errorMessage = errorData.message || errorData.error || errorMessage;
      } catch {
        if (errorText) errorMessage = `${errorMessage} - ${errorText}`;
      }
      if (videosResponse.status === 401) {
        throw new Error(`Unauthorized: Invalid API key - ${errorMessage}`);
      }
      if (videosResponse.status === 404) {
        throw new Error(`Store not found: ${domain} - ${errorMessage}`);
      }
      throw new Error(errorMessage);
    }

    const widgetsData = await widgetsResponse.json();
    const videosData = await videosResponse.json();

    // Parse widgets data from stats response (widgetStats block)
    const widgetStats = widgetsData.widgetStats || {};
    const layoutBreakdown = widgetStats.layoutBreakdown || {};
    const buttonActionBreakdown =
      widgetStats.buttonActionBreakdown || widgetsData.ctaActions || {};
    const layoutPosition = widgetStats.layoutPosition || {};
    const totalWidgets = widgetStats.totalWidgets || 0;
    const activeWidgets = widgetStats.activeWidgets || 0;

    // Per-store: each shop is a single merchant, so average = totals
    const totalActiveMerchants = 1;

    const widgetUsage: PerStoreWidgetUsage = {
      widgetTypes: [
        { type: 'Highlighted carousel', count: layoutBreakdown.highlighted_carousel || 0 },
        { type: 'Basic carousel', count: layoutBreakdown.basic_carousel || 0 },
        { type: 'Float', count: layoutBreakdown.float || 0 },
        { type: 'Grid', count: layoutBreakdown.grid || 0 },
        { type: 'Story', count: layoutBreakdown.story || 0 },
      ].filter(w => w.count > 0),
      avgWidgetsPerMerchant: totalActiveMerchants > 0 ? totalWidgets / totalActiveMerchants : 0,
      avgActiveWidgetsPerMerchant: totalActiveMerchants > 0 ? activeWidgets / totalActiveMerchants : 0,
      ctaActions: [
        {
          action: 'Open product detail page',
          desktop: buttonActionBreakdown.desktop?.['product-page'] || 0,
          mobile: buttonActionBreakdown.mobile?.['product-page'] || 0,
          count: (buttonActionBreakdown.desktop?.['product-page'] || 0) + (buttonActionBreakdown.mobile?.['product-page'] || 0),
        },
        {
          action: 'Show product detail within the modal',
          desktop: buttonActionBreakdown.desktop?.['product-modal'] || 0,
          mobile: buttonActionBreakdown.mobile?.['product-modal'] || 0,
          count: (buttonActionBreakdown.desktop?.['product-modal'] || 0) + (buttonActionBreakdown.mobile?.['product-modal'] || 0),
        },
        {
          action: 'Add to cart (no page change)',
          desktop: buttonActionBreakdown.desktop?.['add-to-cart'] || 0,
          mobile: buttonActionBreakdown.mobile?.['add-to-cart'] || 0,
          count: (buttonActionBreakdown.desktop?.['add-to-cart'] || 0) + (buttonActionBreakdown.mobile?.['add-to-cart'] || 0),
        },
        {
          action: 'Add to cart and open cart page',
          desktop: buttonActionBreakdown.desktop?.['cart-page'] || 0,
          mobile: buttonActionBreakdown.mobile?.['cart-page'] || 0,
          count: (buttonActionBreakdown.desktop?.['cart-page'] || 0) + (buttonActionBreakdown.mobile?.['cart-page'] || 0),
        },
      ],
      productPagesCount: layoutPosition['product-pages'] || 0,
      otherPagesCount: layoutPosition['other-pages'] || 0,
    };

    // Parse videos data - FIXED: Use sum of counts for total, not totalViews
    const platformCounts = widgetsData.videoStats || {};
    alert(JSON.stringify(platformCounts));
    const videoSource: VideoSourceMetrics = {
      tiktok: platformCounts.tiktok || 0,
      instagram: platformCounts.instagram || 0,
      upload: platformCounts.import || 0,
      total: (platformCounts.tiktok || 0) + (platformCounts.instagram || 0) + (platformCounts.import || 0),
    };

    // Parse summary from videos data
    const totalViews = videosData.totalViews || 0;
    const totalLikes = videosData.totalLikes || 0;
    const totalShares = videosData.totalShares || 0;
    const engagementRate = totalViews > 0 ? ((totalLikes + totalShares) / totalViews) * 100 : 0;

    const summary = {
      totalViews: {
        value: totalViews,
        previousValue: totalViews * 0.9,
        change: totalViews * 0.1,
        changePercent: 10,
      },
      totalLikes: {
        value: totalLikes,
        previousValue: totalLikes * 0.9,
        change: totalLikes * 0.1,
        changePercent: 10,
      },
      totalShares: {
        value: totalShares,
        previousValue: totalShares * 0.9,
        change: totalShares * 0.1,
        changePercent: 10,
      },
      engagementRate: {
        value: engagementRate,
        previousValue: engagementRate * 0.9,
        change: engagementRate * 0.1,
        changePercent: 10,
      },
      revenue: {
        value: 0,
        previousValue: 0,
        change: 0,
        changePercent: 0,
      },
    };

    // Parse top videos
    const topVideos = videosData.topVideos?.byViews || videosData.topVideos || [];

    return {
      storeId: domain,
      storeName: fallbackStoreName,
      summary,
      videoSource,
      widgetUsage,
      conversion: mockPerStoreMetrics.conversion, // Keep mock for now
      revenue: mockPerStoreMetrics.revenue, // Keep mock for now
      topVideos,
    } as unknown as Record<string, unknown>;
  } catch (error) {
    console.error('Failed to fetch per store metrics:', error);
    // Re-throw error instead of returning mock data
    throw error instanceof Error ? error : new Error(`Failed to fetch per store metrics for domain: ${domain}`);
  }
}

/**
 * Get per shop daybreak analytics
 * Uses /admin/api/v1/analytics/daybreak/shop/:shopId endpoint
 * @param shopId - Shop ID
 * @param startDate - Optional start date (YYYY-MM-DD)
 * @param endDate - Optional end date (YYYY-MM-DD)
 */
export async function getPerStoreMetrics(
  shopId: string,
  startDate?: string,
  endDate?: string
): Promise<Record<string, unknown>> {
  const baseUrl = import.meta.env.VITE_SHOPABLE_API_URL;
  const adminApiKey = import.meta.env.VITE_ADMIN_API_KEY;

  // Find store name from mock data for fallback
  const store = mockStores.find(s => s.id === shopId);
  const fallbackStoreName = store?.name || `Store ${shopId}`;

  if (!baseUrl || !adminApiKey) {
    console.log('Using mock per store metrics data (VITE_SHOPABLE_API_URL or VITE_ADMIN_API_KEY not set)');
    return { ...mockPerStoreMetrics, storeId: shopId, storeName: fallbackStoreName } as unknown as Record<string, unknown>;
  }

  try {
    const params = new URLSearchParams();
    if (startDate) params.append('startDate', startDate);
    if (endDate) params.append('endDate', endDate);
    
    const queryString = params.toString() ? `?${params.toString()}` : '';
    const response = await fetch(
      `${baseUrl}/admin/api/v1/analytics/daybreak/shop/${shopId}${queryString}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'X-Admin-Api-Key': adminApiKey,
        },
      }
    );

    if (!response.ok) {
      if (response.status === 401) {
        throw new Error('Unauthorized: Invalid API key');
      }
      if (response.status === 404) {
        throw new Error(`Store not found: ${shopId}`);
      }
      throw new Error(`Per store daybreak API error: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Failed to fetch per store daybreak:', error);
    return { ...mockPerStoreMetrics, storeId: shopId, storeName: fallbackStoreName } as unknown as Record<string, unknown>;
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
      { action: 'Open product detail page', desktop: 180, mobile: 140, count: 320 },
      { action: 'Show product detail within the modal', desktop: 100, mobile: 80, count: 180 },
      { action: 'Add to cart (no page change)', desktop: 140, mobile: 110, count: 250 },
      { action: 'Add to cart and open cart page', desktop: 85, mobile: 65, count: 150 },
    ],
  },
  revenue: {
    inVideo: {
      value: 12500,
      previousValue: 10200,
      change: 2300,
      changePercent: 22.5,
      startDate: '2024-12-09',
      endDate: '2024-12-15',
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
      startDate: '2024-12-09',
      endDate: '2024-12-15',
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
 * (DEPRECATED - Use getAggregateStats or getAggregatedaybreak instead)
 */
export async function getVideoSourceMetrics(
  shopDomain?: string
): Promise<VideoSourceMetrics> {
  const baseUrl = import.meta.env.VITE_SHOPABLE_API_URL;
  const adminApiKey = import.meta.env.VITE_ADMIN_API_KEY;

  if (!baseUrl || !adminApiKey) {
    console.log('Using mock video source data (VITE_SHOPABLE_API_URL or VITE_ADMIN_API_KEY not set)');
    return mockSurveyMetrics.videoSource;
  }

  try {
    const response = await fetch(
      `${baseUrl}/admin/api/v1/analytics/daybreak`,
      {
        method: 'GET',
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
    
    // Parse response structure - adjust based on actual API response
    if (data.videoSource) {
      return data.videoSource;
    }
    
    // Fallback to data structure if different
    return data.data?.videoSource || data.data || mockSurveyMetrics.videoSource;
  } catch (error) {
    console.error('Failed to fetch video source metrics:', error);
    return mockSurveyMetrics.videoSource;
  }
}

/**
 * Get widget usage metrics for all stores
 * (DEPRECATED - Use getAggregateStats or getAggregatedaybreak instead)
 */
export async function getWidgetUsageMetrics(
  shopDomain?: string
): Promise<WidgetUsageMetrics> {
  const baseUrl = import.meta.env.VITE_SHOPABLE_API_URL;
  const adminApiKey = import.meta.env.VITE_ADMIN_API_KEY;

  if (!baseUrl || !adminApiKey) {
    console.log('Using mock widget usage data (VITE_SHOPABLE_API_URL or VITE_ADMIN_API_KEY not set)');
    return mockSurveyMetrics.widgetUsage;
  }

  try {
    const response = await fetch(
      `${baseUrl}/admin/api/v1/analytics/daybreak`,
      {
        method: 'GET',
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
    
    console.log('Widget usage API response:', data); // Debug log
    
    // Parse response structure - adjust based on actual API response
    if (data.widgetUsage) {
      return data.widgetUsage;
    }
    
    // Fallback to data structure if different
    return data.data?.widgetUsage || data.data || mockSurveyMetrics.widgetUsage;
  } catch (error) {
    console.error('Failed to fetch widget usage metrics:', error);
    return mockSurveyMetrics.widgetUsage;
  }
}

/**
 * Get revenue metrics for all stores with date range
 * (DEPRECATED - Use getAggregateStats instead)
 */
export async function getRevenueMetrics(
  startDate: string,
  endDate: string,
  shopDomain?: string
): Promise<{ inVideo: RevenueMetrics; postVideo: RevenueMetrics }> {
  const baseUrl = import.meta.env.VITE_SHOPABLE_API_URL;
  const adminApiKey = import.meta.env.VITE_ADMIN_API_KEY;

  if (!baseUrl || !adminApiKey) {
    console.log('Using mock revenue data (VITE_SHOPABLE_API_URL or VITE_ADMIN_API_KEY not set)');
    return mockSurveyMetrics.revenue;
  }

  try {
    const params = new URLSearchParams();
    params.append('startDate', startDate);
    params.append('endDate', endDate);
    
    const response = await fetch(
      `${baseUrl}/admin/api/v1/analytics/stats?${params.toString()}`,
      {
        method: 'GET',
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
    // Extract revenue from response and add date range
    const revenue = data.data?.revenue || data.data || mockSurveyMetrics.revenue;
    return {
      inVideo: { ...revenue.inVideo, startDate, endDate },
      postVideo: { ...revenue.postVideo, startDate, endDate },
    };
  } catch (error) {
    console.error('Failed to fetch revenue metrics:', error);
    return mockSurveyMetrics.revenue;
  }
}

/**
 * Get all stores metrics (combined)
 * Fetches video source and widget usage metrics in parallel
 * Revenue metrics require date range - call separately if needed
 */
export async function getAllStoresMetrics(
  shopDomain?: string
): Promise<Omit<SurveyMetricsData, 'revenue'>> {
  const [videoSource, widgetUsage] = await Promise.all([
    getVideoSourceMetrics(shopDomain),
    getWidgetUsageMetrics(shopDomain),
  ]);

  return {
    videoSource,
    widgetUsage,
  };
}

/**
 * Get all stores metrics with revenue (requires date range)
 * Fetches video source, widget usage, and revenue metrics in parallel
 */
export async function getAllStoresMetricsWithRevenue(
  startDate: string,
  endDate: string,
  shopDomain?: string
): Promise<SurveyMetricsData> {
  const [videoSource, widgetUsage, revenue] = await Promise.all([
    getVideoSourceMetrics(shopDomain),
    getWidgetUsageMetrics(shopDomain),
    getRevenueMetrics(startDate, endDate, shopDomain),
  ]);

  return {
    videoSource,
    widgetUsage,
    revenue,
  };
}