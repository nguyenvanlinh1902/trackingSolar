# Analytics Service Integration Guide

## Overview

The analytics service (`src/services/analytics-service.ts`) integrates with the Shopable analytics API to fetch video performance metrics.

## Core Functions

### getAnalytics(period?, shopDomain?)

Fetches complete analytics data for a time period.

**Parameters**:
- `period` (PeriodType): `'THIS_WEEK'` | `'LAST_WEEK'` | `'THIS_MONTH'` | `'LAST_MONTH'`
- `shopDomain` (string, optional): Shop domain for API authentication

**Returns**: `Promise<AnalyticsData>`

**Example**:
```typescript
const data = await getAnalytics('THIS_WEEK', 'myshop.shopable.com')

// data.summary -> 5 KPI metrics
// data.chartData -> [{date, views, likes, shares}] for line charts
// data.topVideos -> [{videoId, title, views, ...}] top 5 videos
```

---

### getAnalyticsSummary(shopDomain?)

Fetches only the 5 summary metrics (Views, Likes, Shares, Engagement, Revenue).

**Parameters**:
- `shopDomain` (string, optional): Shop domain for API authentication

**Returns**: `Promise<AnalyticsData['summary']>`

**Endpoint**: `GET /api/analytics/videos-summary`

**Use Case**: Quick metric card updates without full analytics load

---

### getVideosReport(shopDomain?)

Fetches top-performing videos list.

**Parameters**:
- `shopDomain` (string, optional): Shop domain for API authentication

**Returns**: `Promise<VideoAnalytics[]>`

**Endpoint**: `GET /api/analytics/videos-report`

---

## Data Structures

### AnalyticsMetric
```typescript
interface AnalyticsMetric {
  value: number         // Current period value
  previousValue: number // Previous period value for comparison
  change: number        // Absolute change (value - previousValue)
  changePercent: number // Percentage change
}
```

### AnalyticsData
```typescript
interface AnalyticsData {
  summary: {
    totalViews: AnalyticsMetric
    totalLikes: AnalyticsMetric
    totalShares: AnalyticsMetric
    engagementRate: AnalyticsMetric    // Percentage, not count
    revenue: AnalyticsMetric           // Currency value
  }
  chartData: {
    date: string        // ISO format (e.g., '2024-12-09')
    views: number
    likes: number
    shares: number
  }[]
  topVideos: VideoAnalytics[]
  period: PeriodType
}
```

### VideoAnalytics
```typescript
interface VideoAnalytics {
  videoId: string
  title: string
  views: number
  likes: number
  shares: number
  engagement: number    // Engagement rate (percentage)
  thumbnail?: string    // Optional thumbnail URL
}
```

---

## API Configuration

### Environment Variables

```bash
# Required for production
NEXT_PUBLIC_SHOPABLE_API_URL=https://api.shopable.com

# Optional for shop authentication
# Passed as X-Shop-Domain header
```

### Request Headers

```typescript
{
  'Content-Type': 'application/json',
  'X-Shop-Domain': 'myshop.shopable.com'  // Optional
}
```

### Error Handling

- **Network/API Errors**: Falls back to mock data
- **HTTP 4xx/5xx**: Returns mock data and logs error
- **Development Mode**: Uses mock data if `NEXT_PUBLIC_SHOPABLE_API_URL` not set

---

## Mock Data

For local development without API:

```typescript
mockAnalyticsData = {
  summary: {
    totalViews: { value: 12580, previousValue: 10200, change: 2380, changePercent: 23.3 },
    totalLikes: { value: 3240, previousValue: 2800, change: 440, changePercent: 15.7 },
    totalShares: { value: 890, previousValue: 720, change: 170, changePercent: 23.6 },
    engagementRate: { value: 8.5, previousValue: 7.2, change: 1.3, changePercent: 18.1 },
    revenue: { value: 4250, previousValue: 3800, change: 450, changePercent: 11.8 },
  },
  chartData: [
    { date: '2024-12-09', views: 1200, likes: 340, shares: 89 },
    // ... 7 days of data
  ],
  topVideos: [
    { videoId: '1', title: 'Product Demo Video', views: 4580, likes: 1200, shares: 340, engagement: 12.5 },
    // ... 5 videos
  ],
  period: 'THIS_WEEK'
}
```

---

## Usage in Components

### In React Hook

```typescript
// src/hooks/use-analytics.ts
const { analyticsData, loading, error } = useAnalytics('THIS_WEEK')
```

### In Dashboard Page

```tsx
function AnalyticsDashboardContent() {
  const { analyticsData, loading, error } = useAnalytics('THIS_WEEK')

  if (loading) return <LoadingSpinner />
  if (error) return <ErrorMessage message={error} />

  return (
    <>
      <SummaryMetricsGrid summary={analyticsData.summary} />
      <PolarisCharts data={analyticsData} />
      <VideoPerformanceTable videos={analyticsData.topVideos} />
    </>
  )
}
```

---

## Period Types

```typescript
type PeriodType = 'THIS_WEEK' | 'LAST_WEEK' | 'THIS_MONTH' | 'LAST_MONTH'
```

**Predefined Options**:
```typescript
const PERIOD_OPTIONS = [
  { value: 'THIS_WEEK', label: 'This Week' },
  { value: 'LAST_WEEK', label: 'Last Week' },
  { value: 'THIS_MONTH', label: 'This Month' },
  { value: 'LAST_MONTH', label: 'Last Month' },
]
```

---

## Number Formatting

Applied automatically in MetricCard:

- **Numbers**: `12580` → `12.6K`, `1200000` → `1.2M`
- **Currency**: `4250` → `$4,250` (USD, no decimals)
- **Percent**: `23.3` → `23.3%`

---

## API Response Contract

**Success Response**:
```json
{
  "data": {
    "summary": { ... },
    "chartData": [ ... ],
    "topVideos": [ ... ],
    "period": "THIS_WEEK"
  }
}
```

**Error Response**:
- Service logs error and returns mock data
- No error thrown to caller (graceful fallback)

---

## Testing & Development

### Enable Mock Data
```bash
# Don't set NEXT_PUBLIC_SHOPABLE_API_URL
npm run dev
```

### Test with Real API
```bash
NEXT_PUBLIC_SHOPABLE_API_URL=https://api.shopable.com npm run dev
```

### Sample Request/Response
```bash
curl -H "X-Shop-Domain: myshop.shopable.com" \
  https://api.shopable.com/api/analytics/THIS_WEEK
```

---

## Per-Store Metrics Functions

### getStores()

Fetches list of stores accessible to the current user.

**Returns**: `Promise<Store[]>`

**Endpoint**: `GET /admin/api/v1/analytics/stores`

**Headers**:
```typescript
{
  'Content-Type': 'application/json',
  'X-Admin-Api-Key': <adminApiKey>
}
```

**Example**:
```typescript
const stores = await getStores()
// Returns: [{id: '1', name: 'Fashion Hub', domain: 'fashion-hub.myshopify.com'}, ...]
```

---

### getPerStoreMetrics(storeId, period?, shopDomain?)

Fetches comprehensive metrics for a specific store.

**Parameters**:
- `storeId` (string, required): Store identifier
- `period` (PeriodType, optional): `'THIS_WEEK'` | `'LAST_WEEK'` | `'THIS_MONTH'` | `'LAST_MONTH'` (default: `'THIS_WEEK'`)
- `shopDomain` (string, optional): Shop domain for authentication

**Returns**: `Promise<PerStoreMetricsData>`

**Endpoint**: `GET /admin/api/v1/analytics/stats/shop/{storeId}?period={period}`

**Example**:
```typescript
const metrics = await getPerStoreMetrics('store-123', 'THIS_WEEK')

// metrics.videoSource: {tiktok, instagram, upload, total}
// metrics.conversion: {ordersFromShopvid, atcRateMobile, atcRateDesktop, cvr}
// metrics.widgetUsage: {activeWidgets, timeSeries}
// metrics.revenue: {inVideo, postVideo}
```

---

## Per-Store Data Structures

### Store
```typescript
interface Store {
  id: string              // Store identifier
  name: string            // Store display name
  domain: string          // Store domain (e.g., 'shop.myshopify.com')
}
```

### PerStoreMetricsData
```typescript
interface PerStoreMetricsData {
  storeId: string                        // Store identifier
  storeName: string                      // Store name
  videoSource: VideoSourceMetrics        // Video distribution by source
  widgetUsage: PerStoreWidgetUsage      // Active widget metrics
  conversion: ConversionMetrics          // Conversion rate metrics
  revenue: {
    inVideo: RevenueMetrics              // Revenue from in-video conversions
    postVideo: RevenueMetrics            // Revenue from post-video conversions
  }
}
```

### VideoSourceMetrics
```typescript
interface VideoSourceMetrics {
  tiktok: number         // TikTok video count
  instagram: number      // Instagram video count
  upload: number         // Uploaded video count
  total: number          // Total videos
}
```

### ConversionMetrics
```typescript
interface ConversionMetrics {
  ordersFromShopvid: MetricWithTimeSeries   // Orders attributed to ShopVid
  atcRateMobile: MetricWithTimeSeries       // Add-to-cart rate (mobile)
  atcRateDesktop: MetricWithTimeSeries      // Add-to-cart rate (desktop)
  cvr: MetricWithTimeSeries                 // Conversion rate
}
```

### MetricWithTimeSeries
```typescript
interface MetricWithTimeSeries extends MetricWithChange {
  timeSeries: TimeSeriesDataPoint[]     // Daily values over period
}
```

### PerStoreWidgetUsage
```typescript
interface PerStoreWidgetUsage {
  activeWidgets: number                    // Current active widgets
  activeWidgetsPrevious: number            // Previous period widgets
  activeWidgetsChange: number              // Absolute change
  activeWidgetsChangePercent: number       // Percentage change
  activeWidgetsTimeSeries: TimeSeriesDataPoint[]  // Daily trend
}
```

---

## Usage Pattern

### In React Hook

```typescript
// src/hooks/use-per-store-metrics.ts
const { stores, storesLoading, data, loading, error } = usePerStoreMetrics(selectedStoreId, 'THIS_WEEK')

// Key feature: Conditional fetching
// - On mount: Fetches stores list
// - When storeId is null: No API call, data is null
// - When storeId is set: Fetches metrics for that store
```

### In Dashboard Page

```tsx
function PerStoreDashboardContent() {
  const [selectedStoreId, setSelectedStoreId] = useState<string | null>(null)
  const [period, setPeriod] = useState<PeriodType>('THIS_WEEK')

  const { stores, storesLoading, data, loading, error } = usePerStoreMetrics(selectedStoreId, period)

  return (
    <PerStoreMetrics
      stores={stores}
      storesLoading={storesLoading}
      data={data}
      selectedStoreId={selectedStoreId}
      onStoreChange={setSelectedStoreId}
      loading={loading}
      error={error}
    />
  )
}
```

---

## All Stores Metrics Functions

### getVideoSourceMetrics(period?, shopDomain?)

Fetches video source distribution for all stores combined.

**Parameters**:
- `period` (PeriodType, optional): `'THIS_WEEK'` | `'LAST_WEEK'` | `'THIS_MONTH'` | `'LAST_MONTH'` (default: `'THIS_WEEK'`)
- `shopDomain` (string, optional): Shop domain for authentication

**Returns**: `Promise<VideoSourceMetrics>`

**Endpoint**: `GET /admin/api/v1/analytics/stats/video-source?period={period}`

**Example**:
```typescript
const videoMetrics = await getVideoSourceMetrics('THIS_WEEK')
// Returns: { tiktok: 450, instagram: 350, upload: 200, total: 1000 }
```

---

### getWidgetUsageMetrics(period?, shopDomain?)

Fetches widget usage aggregated across all stores.

**Parameters**:
- `period` (PeriodType, optional): Time period for analytics (default: `'THIS_WEEK'`)
- `shopDomain` (string, optional): Shop domain for authentication

**Returns**: `Promise<WidgetUsageMetrics>`

**Endpoint**: `GET /admin/api/v1/analytics/stats/widget-usage?period={period}`

**Example**:
```typescript
const widgetMetrics = await getWidgetUsageMetrics('THIS_WEEK')
// Returns widget types, avg metrics, and CTA actions
```

---

### getRevenueMetrics(period?, shopDomain?)

Fetches revenue metrics for all stores (in-video and post-video).

**Parameters**:
- `period` (PeriodType, optional): Time period for analytics (default: `'THIS_WEEK'`)
- `shopDomain` (string, optional): Shop domain for authentication

**Returns**: `Promise<{ inVideo: RevenueMetrics; postVideo: RevenueMetrics }>`

**Endpoint**: `GET /admin/api/v1/analytics/stats/revenue?period={period}`

---

### getAllStoresMetrics(period?, shopDomain?)

Fetches combined all-stores metrics (video source, widget usage, revenue) in parallel.

**Parameters**:
- `period` (PeriodType, optional): Time period for analytics (default: `'THIS_WEEK'`)
- `shopDomain` (string, optional): Shop domain for authentication

**Returns**: `Promise<SurveyMetricsData>`

**Example**:
```typescript
const allMetrics = await getAllStoresMetrics('THIS_WEEK')

// allMetrics.videoSource -> Distribution across sources
// allMetrics.widgetUsage -> Widget types, CTA actions, avg metrics
// allMetrics.revenue -> In-video and post-video revenue with time series
```

---

## All Stores Data Structures

### WidgetTypeCount
```typescript
interface WidgetTypeCount {
  type: string;       // e.g., "Basic carousel", "Grid", "Float"
  count: number;      // Widget count of this type
}
```

### CTAActionCount
```typescript
interface CTAActionCount {
  action: string;     // e.g., "Open product detail page"
  count: number;      // Number of this CTA type in use
}
```

### WidgetUsageMetrics
```typescript
interface WidgetUsageMetrics {
  widgetTypes: WidgetTypeCount[];              // Distribution of widget types
  avgWidgetsPerMerchant: number;               // Average widgets per store
  avgActiveWidgetsPerMerchant: number;         // Average active widgets per store
  ctaActions: CTAActionCount[];                // CTA action distribution
}
```

### SurveyMetricsData
```typescript
interface SurveyMetricsData {
  videoSource: VideoSourceMetrics;             // Video distribution
  widgetUsage: WidgetUsageMetrics;             // Widget metrics
  revenue: {
    inVideo: RevenueMetrics;                   // In-video revenue with time series
    postVideo: RevenueMetrics;                 // Post-video revenue with time series
  };
}
```

---

**Version**: 1.2.0
**Last Updated**: 2025-12-15
