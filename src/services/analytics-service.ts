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
  PerStoreWidgetUsage,
  ConversionMetrics,
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
 * Uses /admin/api/v1/analytics/videos/all-stores endpoint
 * Response structure: {
 *   totalViews, totalLikes, totalShares,
 *   topVideos: { byViews: [...], byLikes: [...], byShares: [...] },
 *   platformCounts: { tiktok, instagram, import }
 * }
 * @param period - Time period for analytics (kept for compatibility)
 * @param shopDomain - Shop domain (optional, for API auth)
 */
export async function getAnalytics(
  period: PeriodType = 'THIS_WEEK',
  shopDomain?: string
): Promise<AnalyticsData> {
  const baseUrl = import.meta.env.VITE_SHOPABLE_API_URL;
  const adminApiKey = import.meta.env.VITE_ADMIN_API_KEY || 'avada_admin_!@#123';

  if (!baseUrl) {
    console.log('Using mock analytics data (VITE_SHOPABLE_API_URL not set)');
    return { ...mockAnalyticsData, period };
  }

  try {
    const response = await fetch(
      `${baseUrl}/admin/api/v1/analytics/videos/all-stores`,
      {
        headers: {
          'Content-Type': 'application/json',
          'X-Admin-Api-Key': adminApiKey,
          ...(shopDomain && { 'X-Shop-Domain': shopDomain }),
        },
      }
    );

    if (!response.ok) {
      throw new Error(`Analytics API error: ${response.status}`);
    }

    const data = await response.json();
    
    // Parse response structure
    const totalViews = data.totalViews || 0;
    const totalLikes = data.totalLikes || 0;
    const totalShares = data.totalShares || 0;
    
    // Calculate engagement rate: (likes + shares) / views * 100
    const engagementRate = totalViews > 0 ? ((totalLikes + totalShares) / totalViews) * 100 : 0;
    
    // For now, use current values as previous (no comparison data available)
    // TODO: Fetch previous period data for comparison
    const previousViews = totalViews; // Placeholder
    const previousLikes = totalLikes; // Placeholder
    const previousShares = totalShares; // Placeholder
    const previousEngagementRate = engagementRate; // Placeholder
    
    // Parse top videos from byViews array
    const topVideos: VideoAnalytics[] = (data.topVideos?.byViews || []).slice(0, 5).map((video: any) => ({
      videoId: video.videoId || '',
      title: `Video ${video.videoId?.substring(0, 8) || 'Unknown'}`,
      views: video.views || 0,
      likes: video.likes || 0,
      shares: video.shares || 0,
      engagement: totalViews > 0 ? ((video.likes || 0) + (video.shares || 0)) / totalViews * 100 : 0,
    }));
    
    // Generate chart data (mock for now, as API doesn't provide time series)
    // TODO: Fetch time series data if available
    const chartData = mockAnalyticsData.chartData;
    
    return {
      summary: {
        totalViews: {
          value: totalViews,
          previousValue: previousViews,
          change: 0, // TODO: Calculate from previous period
          changePercent: 0, // TODO: Calculate from previous period
        },
        totalLikes: {
          value: totalLikes,
          previousValue: previousLikes,
          change: 0,
          changePercent: 0,
        },
        totalShares: {
          value: totalShares,
          previousValue: previousShares,
          change: 0,
          changePercent: 0,
        },
        engagementRate: {
          value: engagementRate,
          previousValue: previousEngagementRate,
          change: 0,
          changePercent: 0,
        },
        revenue: mockAnalyticsData.summary.revenue, // Keep mock revenue for now
      },
      chartData,
      topVideos: topVideos.length > 0 ? topVideos : mockAnalyticsData.topVideos,
      period,
    };
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
 * No mock data fallback - requires API to be available
 */
export async function getStores(): Promise<Store[]> {
  const baseUrl = import.meta.env.VITE_SHOPABLE_API_URL;
  const adminApiKey = import.meta.env.VITE_ADMIN_API_KEY || 'avada_admin_!@#123';

  if (!baseUrl) {
    throw new Error('VITE_SHOPABLE_API_URL is not set. Please configure the API URL.');
  }

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
}

/**
 * Search stores by keyword
 * Uses /admin/api/v1/analytics/stores endpoint with search query parameter
 * @param searchTerm - Search keyword (searches by name, domain, or ID)
 */
export async function searchStores(searchTerm: string): Promise<Store[]> {
  const baseUrl = import.meta.env.VITE_SHOPABLE_API_URL;
  const adminApiKey = import.meta.env.VITE_ADMIN_API_KEY || 'avada_admin_!@#123';

  if (!baseUrl) {
    throw new Error('VITE_SHOPABLE_API_URL is not set. Please configure the API URL.');
  }

  // If search term is empty, return all stores
  if (!searchTerm.trim()) {
    return getStores();
  }

  const response = await fetch(
    `${baseUrl}/admin/api/v1/analytics/stores?search=${encodeURIComponent(searchTerm.trim())}`,
    {
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
    throw new Error(`Search stores API error: ${response.status}`);
  }

  const data = await response.json();
  return data.data || data.stores || [];
}

/**
 * Get per store metrics by domain
 * Calls 2 APIs: /analytics/widgets/by-domain and /analytics/videos/by-domain
 */
export async function getPerStoreMetricsByDomain(
  domain: string
): Promise<PerStoreMetricsData> {
  const baseUrl = import.meta.env.VITE_SHOPABLE_API_URL;
  const adminApiKey = import.meta.env.VITE_ADMIN_API_KEY || 'avada_admin_!@#123';

  if (!baseUrl) {
    throw new Error('VITE_SHOPABLE_API_URL is not set. Please configure the API URL.');
  }

  try {
    // Call both APIs in parallel
    const [widgetsResponse, videosResponse] = await Promise.all([
      fetch(`${baseUrl}/admin/api/v1/analytics/widgets/by-domain`, {
        headers: {
          'Content-Type': 'application/json',
          'X-Admin-Api-Key': adminApiKey,
          'X-Shop-Domain': domain,
        },
      }),
      fetch(`${baseUrl}/admin/api/v1/analytics/videos/by-domain`, {
        headers: {
          'Content-Type': 'application/json',
          'X-Admin-Api-Key': adminApiKey,
          'X-Shop-Domain': domain,
        },
      }),
    ]);

    // Check widgets API response
    if (!widgetsResponse.ok) {
      if (widgetsResponse.status === 401) {
        throw new Error('Unauthorized: Invalid API key');
      }
      if (widgetsResponse.status === 404) {
        throw new Error(`Store not found for domain: ${domain}`);
      }
      throw new Error(`Widgets API error: ${widgetsResponse.status}`);
    }

    // Check videos API response
    if (!videosResponse.ok) {
      if (videosResponse.status === 401) {
        throw new Error('Unauthorized: Invalid API key');
      }
      if (videosResponse.status === 404) {
        throw new Error(`Store not found for domain: ${domain}`);
      }
      throw new Error(`Videos API error: ${videosResponse.status}`);
    }

    const widgetsData = await widgetsResponse.json();
    const videosData = await videosResponse.json();

    // Parse widgets data
    const widgetsResult = widgetsData.data || widgetsData;
    
    // Parse videos data
    const videosResult = videosData.data || videosData;

    // Parse summary metrics from videos API
    const totalViews = videosResult.totalViews || 0;
    const totalLikes = videosResult.totalLikes || 0;
    const totalShares = videosResult.totalShares || 0;
    const engagementRate = totalViews > 0 ? ((totalLikes + totalShares) / totalViews) * 100 : 0;
    
    // Calculate previous values (use current as placeholder if not available)
    const previousViews = videosResult.previousViews || videosResult.totalViewsPrevious || totalViews;
    const previousLikes = videosResult.previousLikes || videosResult.totalLikesPrevious || totalLikes;
    const previousShares = videosResult.previousShares || videosResult.totalSharesPrevious || totalShares;
    const previousEngagementRate = videosResult.previousEngagementRate || engagementRate;
    
    // Calculate revenue (sum of inVideo and postVideo)
    const revenueValue = (mockPerStoreMetrics.revenue.inVideo.value || 0) + (mockPerStoreMetrics.revenue.postVideo.value || 0);
    const revenuePrevious = (mockPerStoreMetrics.revenue.inVideo.previousValue || 0) + (mockPerStoreMetrics.revenue.postVideo.previousValue || 0);
    const revenueChange = revenueValue - revenuePrevious;
    const revenueChangePercent = revenuePrevious > 0 ? (revenueChange / revenuePrevious) * 100 : 0;

    const summary = {
      totalViews: {
        value: totalViews,
        previousValue: previousViews,
        change: totalViews - previousViews,
        changePercent: previousViews > 0 ? ((totalViews - previousViews) / previousViews) * 100 : 0,
      },
      totalLikes: {
        value: totalLikes,
        previousValue: previousLikes,
        change: totalLikes - previousLikes,
        changePercent: previousLikes > 0 ? ((totalLikes - previousLikes) / previousLikes) * 100 : 0,
      },
      totalShares: {
        value: totalShares,
        previousValue: previousShares,
        change: totalShares - previousShares,
        changePercent: previousShares > 0 ? ((totalShares - previousShares) / previousShares) * 100 : 0,
      },
      engagementRate: {
        value: engagementRate,
        previousValue: previousEngagementRate,
        change: engagementRate - previousEngagementRate,
        changePercent: previousEngagementRate > 0 ? ((engagementRate - previousEngagementRate) / previousEngagementRate) * 100 : 0,
      },
      revenue: {
        value: revenueValue,
        previousValue: revenuePrevious,
        change: revenueChange,
        changePercent: revenueChangePercent,
      },
    };

    // Parse video source from videos API
    const platformCounts = videosResult.platformCounts || {};
    const videoSource: VideoSourceMetrics = {
      tiktok: platformCounts.tiktok || 0,
      instagram: platformCounts.instagram || 0,
      upload: platformCounts.import || platformCounts.upload || 0,
      total: (platformCounts.tiktok || 0) + (platformCounts.instagram || 0) + (platformCounts.import || platformCounts.upload || 0),
    };

    // Parse widget usage from widgets API - same structure as all stores
    const layoutBreakdown = widgetsResult.layoutBreakdown || {};
    const widgetTypes = [
      { type: 'Basic carousel', count: layoutBreakdown.basic_carousel || 0 },
      { type: 'Highlighted carousel', count: layoutBreakdown.highlighted_carousel || 0 },
      { type: 'Grid', count: layoutBreakdown.grid || 0 },
      { type: 'Float', count: layoutBreakdown.float || 0 },
      { type: 'Story', count: layoutBreakdown.story || 0 },
      { type: 'List', count: layoutBreakdown.list || 0 },
    ].filter(w => w.count > 0);

    const totalWidgets = widgetsResult.totalWidgets || widgetsResult.activeWidgets || 0;
    const activeWidgets = widgetsResult.activeWidgets || totalWidgets;
    // For per-store: totalActiveMerchants = 1 (single store)
    const totalActiveMerchants = 1;
    const avgWidgetsPerMerchant = totalWidgets / totalActiveMerchants;
    const avgActiveWidgetsPerMerchant = activeWidgets / totalActiveMerchants;

    // Parse CTA actions
    const ctaActionsList: Array<{ action: string; desktop: number; mobile: number; count: number }> = [];
    const ctaActions = widgetsResult.ctaActions;
    
    if (ctaActions && ctaActions.desktop && ctaActions.mobile) {
      const actionMap: Record<string, string> = {
        'product-page': 'Open product detail page',
        'product-modal': 'Show product detail within the modal',
        'add-to-cart': 'Add to cart (no page change)',
        'cart-page': 'Add to cart and open cart page',
      };
      
      const allActions = new Set([
        ...Object.keys(ctaActions.desktop),
        ...Object.keys(ctaActions.mobile),
      ]);
      
      allActions.forEach((key) => {
        const desktopCount = ctaActions.desktop[key] || 0;
        const mobileCount = ctaActions.mobile[key] || 0;
        const total = desktopCount + mobileCount;
        
        if (total > 0) {
          ctaActionsList.push({
            action: actionMap[key] || key,
            desktop: desktopCount,
            mobile: mobileCount,
            count: total,
          });
        }
      });
    }

    const widgetUsage: PerStoreWidgetUsage = {
      widgetTypes,
      avgWidgetsPerMerchant,
      avgActiveWidgetsPerMerchant,
      ctaActions: ctaActionsList,
      productPagesCount: widgetsResult.productPagesCount || 0,
      otherPagesCount: widgetsResult.otherPagesCount || 0,
    };

    // Get store info from either API response
    const storeId = widgetsResult.storeId || videosResult.storeId || domain;
    const storeName = widgetsResult.storeName || videosResult.storeName || domain;

    // Parse revenue timeSeries from API if available, otherwise use mock
    const parseTimeSeries = (rawData: any[] | undefined) => {
      if (!Array.isArray(rawData)) return [];
      return rawData.map((item: any) => ({
        date: item.date || item.x || '',
        value: typeof item.value === 'number' ? item.value : (typeof item.y === 'number' ? item.y : 0),
      })).filter((item: any) => item.date && typeof item.value === 'number');
    };

    // For conversion and revenue, use mock data for now or get from another API
    // TODO: Add conversion and revenue APIs if available
    const mockConversion = mockPerStoreMetrics.conversion;
    const mockRevenue = mockPerStoreMetrics.revenue;

    const conversion: ConversionMetrics = {
      ordersFromShopvid: {
        ...mockConversion.ordersFromShopvid,
        timeSeries: parseTimeSeries(videosResult.ordersTimeSeries || widgetsResult.ordersTimeSeries) || mockConversion.ordersFromShopvid.timeSeries,
      },
      atcRateMobile: {
        ...mockConversion.atcRateMobile,
        timeSeries: parseTimeSeries(videosResult.atcRateMobileTimeSeries || widgetsResult.atcRateMobileTimeSeries) || mockConversion.atcRateMobile.timeSeries,
      },
      atcRateDesktop: {
        ...mockConversion.atcRateDesktop,
        timeSeries: parseTimeSeries(videosResult.atcRateDesktopTimeSeries || widgetsResult.atcRateDesktopTimeSeries) || mockConversion.atcRateDesktop.timeSeries,
      },
      cvr: {
        ...mockConversion.cvr,
        timeSeries: parseTimeSeries(videosResult.cvrTimeSeries || widgetsResult.cvrTimeSeries) || mockConversion.cvr.timeSeries,
      },
    };

    const revenue = {
      inVideo: {
        ...mockRevenue.inVideo,
        timeSeries: parseTimeSeries(videosResult.inVideoTimeSeries || widgetsResult.inVideoTimeSeries) || mockRevenue.inVideo.timeSeries,
      },
      postVideo: {
        ...mockRevenue.postVideo,
        timeSeries: parseTimeSeries(videosResult.postVideoTimeSeries || widgetsResult.postVideoTimeSeries) || mockRevenue.postVideo.timeSeries,
      },
    };

    // Parse top videos from videos API
    const topVideos = (videosResult.topVideos?.byViews || videosResult.topVideos || []).slice(0, 5).map((video: any) => ({
      videoId: video.videoId || video.id || '',
      title: video.title || `Video ${(video.videoId || video.id || '').substring(0, 8) || 'Unknown'}`,
      views: video.views || 0,
      likes: video.likes || 0,
      shares: video.shares || 0,
      engagement: totalViews > 0 ? ((video.likes || 0) + (video.shares || 0)) / totalViews * 100 : 0,
      thumbnail: video.thumbnail,
    }));

    return {
      storeId,
      storeName,
      summary,
      videoSource,
      widgetUsage,
      conversion,
      revenue,
      topVideos,
    };
  } catch (error) {
    console.error('Failed to fetch per store metrics by domain:', error);
    throw error;
  }
}

/**
 * Get per store metrics by store ID (kept for backward compatibility)
 */
export async function getPerStoreMetrics(
  storeId: string,
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
      `${baseUrl}/admin/api/v1/analytics/stats/shop/${storeId}`,
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
 * Uses /admin/api/v1/analytics/videos/all-stores endpoint
 * Response structure: { platformCounts: { tiktok, instagram, import } }
 */
export async function getVideoSourceMetrics(
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
      `${baseUrl}/admin/api/v1/analytics/videos/all-stores`,
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
    
    // Parse response structure: { platformCounts: { tiktok, instagram, import } }
    if (data.platformCounts) {
      const { tiktok, instagram, import: upload } = data.platformCounts;
      const total = (tiktok || 0) + (instagram || 0) + (upload || 0);
      
      return {
        tiktok: tiktok || 0,
        instagram: instagram || 0,
        upload: upload || 0,
        total,
      };
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
 * Uses /admin/api/v1/analytics/widgets/all-stores endpoint
 * Response structure: {
 *   totalWidgets, activeWidgets, inactiveWidgets,
 *   layoutBreakdown: { grid, float, basic_carousel, highlighted_carousel, list, story },
 *   ctaActions: { desktop: { product-page, product-modal, add-to-cart, cart-page }, mobile: {...} }
 * }
 */
export async function getWidgetUsageMetrics(
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
      `${baseUrl}/admin/api/v1/analytics/widgets/all-stores`,
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
    
    console.log('Widget usage API response:', data); // Debug log
    
    // Parse response structure - only require layoutBreakdown
    if (data.layoutBreakdown) {
      const { layoutBreakdown, ctaActions, totalWidgets, activeWidgets } = data;
      
      // Map layout breakdown to widget types
      const widgetTypes = [
        { type: 'Basic carousel', count: layoutBreakdown.basic_carousel || 0 },
        { type: 'Highlighted carousel', count: layoutBreakdown.highlighted_carousel || 0 },
        { type: 'Grid', count: layoutBreakdown.grid || 0 },
        { type: 'Float', count: layoutBreakdown.float || 0 },
        { type: 'Story', count: layoutBreakdown.story || 0 },
        { type: 'List', count: layoutBreakdown.list || 0 },
      ].filter(w => w.count > 0); // Only include types with count > 0
      
      console.log('Parsed widgetTypes:', widgetTypes); // Debug log
      
      // Map CTA actions from desktop/mobile structure
      const ctaActionsList: Array<{ action: string; desktop: number; mobile: number; count: number }> = [];
      
      if (ctaActions && ctaActions.desktop && ctaActions.mobile) {
        const actionMap: Record<string, string> = {
          'product-page': 'Open product detail page',
          'product-modal': 'Show product detail within the modal',
          'add-to-cart': 'Add to cart (no page change)',
          'cart-page': 'Add to cart and open cart page',
        };
        
        // Get all unique action keys
        const allActions = new Set([
          ...Object.keys(ctaActions.desktop),
          ...Object.keys(ctaActions.mobile),
        ]);
        
        allActions.forEach((key) => {
          const desktopCount = ctaActions.desktop[key] || 0;
          const mobileCount = ctaActions.mobile[key] || 0;
          const total = desktopCount + mobileCount;
          
          if (total > 0) {
            ctaActionsList.push({
              action: actionMap[key] || key,
              desktop: desktopCount,
              mobile: mobileCount,
              count: total,
            });
          }
        });
      }
      
      // Calculate average widgets per merchant = totalWidgets / totalActiveMerchants
      const totalActiveMerchants = data.totalActiveMerchants || data.activeMerchants || data.merchantCount || 1;
      const avgWidgetsPerMerchant = totalActiveMerchants > 0 ? totalWidgets / totalActiveMerchants : 0;
      const avgActiveWidgetsPerMerchant = totalActiveMerchants > 0 ? activeWidgets / totalActiveMerchants : 0;
      
      // Parse page counts if available
      const productPagesCount = data.productPagesCount || 0;
      const otherPagesCount = data.otherPagesCount || 0;
      
      return {
        widgetTypes,
        avgWidgetsPerMerchant,
        avgActiveWidgetsPerMerchant,
        ctaActions: ctaActionsList,
        productPagesCount,
        otherPagesCount,
      };
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
 * Uses /admin/api/v1/analytics/stats endpoint
 * @param startDate - Start date for revenue metrics (YYYY-MM-DD)
 * @param endDate - End date for revenue metrics (YYYY-MM-DD)
 */
export async function getRevenueMetrics(
  startDate: string,
  endDate: string,
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
      `${baseUrl}/admin/api/v1/analytics/stats?startDate=${startDate}&endDate=${endDate}`,
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
