# Per-Store Metrics Dashboard Guide

## Overview

The Per-Store Metrics Dashboard allows viewing detailed performance metrics for individual stores. Located at `/dashboard/per-store`, it provides store selection, conversion analysis, revenue tracking, and widget usage insights.

---

## Architecture

### Data Flow

```
per-store-page.tsx (Page)
  ↓
  ├─→ usePerStoreMetrics hook
  │    ├─→ getStores() - List of available stores
  │    └─→ getPerStoreMetrics(storeId, period) - Metrics for selected store
  ↓
  PerStoreMetrics (Container)
  ├─→ StoreSelector - Store selection with search
  ├─→ ConversionMetrics - 4 metric cards
  ├─→ VideoSourceChart - Donut chart (TikTok/Instagram/Upload)
  ├─→ WidgetMetrics - Sparkline chart
  └─→ RevenueCharts - Line charts (In-Video/Post-Video)
```

### Key Design Pattern: Conditional Fetching

The hook implements conditional fetching to optimize API usage:

```typescript
// No API call when storeId is null
if (!storeId) {
  setData(null)
  return
}

// Only fetch when storeId is explicitly set
const result = await getPerStoreMetrics(storeId, period)
```

This prevents unnecessary API calls and provides a clean empty state UX.

---

## Components

### PerStoreMetrics (Container)

**File**: `src/components/dashboard/per-store-metrics.tsx`

Main container that orchestrates all sub-components and state management.

**Props**:
```typescript
interface PerStoreMetricsProps {
  stores: Store[]                    // Available stores list
  storesLoading: boolean             // Loading state for stores
  data: PerStoreMetricsData | null   // Metrics for selected store
  selectedStoreId: string | null     // Currently selected store ID
  onStoreChange: (storeId: string | null) => void  // Store selection callback
  loading: boolean                   // Loading state for metrics
  error: string | null               // Error message if any
}
```

**Layout**:
1. Empty state when no store selected
2. Loading spinner while fetching
3. Error message if fetch fails
4. Full metrics display when data loaded

---

### StoreSelector

**File**: `src/components/dashboard/per-store/store-selector.tsx`

Dropdown with search capability to select a store.

**Features**:
- Search across domain, store ID, and store name
- Handles loading state
- Shows store domain as secondary text
- Keyboard navigation support

**Search Fields**:
- `store.domain` - Store domain (e.g., 'shop.myshopify.com')
- `store.id` - Store identifier
- `store.name` - Store display name

---

### ConversionMetrics

**File**: `src/components/dashboard/per-store/conversion-metrics.tsx`

Displays 4 key conversion metrics as cards with time-series data.

**Metrics**:
1. **Orders from ShopVid** - Orders attributed to ShopVid
2. **ATC Rate Mobile** - Add-to-cart rate (mobile device)
3. **ATC Rate Desktop** - Add-to-cart rate (desktop device)
4. **CVR** - Conversion rate (overall)

**Card Features**:
- Current value with formatting
- Previous period value
- Change indicator (up/down arrow)
- Change percentage
- Color-coded borders

---

### VideoSourceChart

**File**: `src/components/dashboard/per-store/video-source-chart.tsx`

Donut chart showing video distribution by source.

**Data**:
- **TikTok** - Videos from TikTok
- **Instagram** - Videos from Instagram
- **Upload** - Directly uploaded videos

**Chart Details**:
- Total video count in center
- Proportional segments for each source
- Legend with counts and percentages
- Responsive sizing

---

### WidgetMetrics

**File**: `src/components/dashboard/per-store/widget-metrics.tsx`

Sparkline chart tracking active widget count over time.

**Metrics**:
- Current active widgets count
- Previous period count
- Change and change percentage
- 7-day sparkline trend

**Display**:
- Large metric value at top
- Change indicator with percentage
- Compact sparkline chart below

---

### RevenueCharts

**File**: `src/components/dashboard/per-store/revenue-charts.tsx`

Two line charts showing revenue trends.

**Charts**:
1. **In-Video Revenue** - Revenue from video playback conversions
2. **Post-Video Revenue** - Revenue from post-video conversions

**Features**:
- Daily data points over selected period
- Separate trend for each revenue type
- Side-by-side or stacked layout
- Interactive tooltips with dates

---

## Data Types

### PerStoreMetricsData
```typescript
interface PerStoreMetricsData {
  storeId: string
  storeName: string
  videoSource: VideoSourceMetrics         // Video distribution
  widgetUsage: PerStoreWidgetUsage       // Widget metrics
  conversion: ConversionMetrics           // Conversion rates
  revenue: {
    inVideo: RevenueMetrics              // In-video revenue
    postVideo: RevenueMetrics            // Post-video revenue
  }
}
```

### Store
```typescript
interface Store {
  id: string              // Unique store identifier
  name: string            // Display name
  domain: string          // Shop domain
}
```

---

## Hook: usePerStoreMetrics

**File**: `src/hooks/use-per-store-metrics.ts`

Custom React hook managing per-store metrics data fetching.

**Parameters**:
- `storeId: string | null` - Selected store ID (null = no store selected)
- `period?: PeriodType` - Time period (default: 'THIS_WEEK')

**Returns**:
```typescript
{
  stores: Store[]                    // All available stores
  storesLoading: boolean             // Loading state for stores list
  data: PerStoreMetricsData | null   // Metrics for selected store
  loading: boolean                   // Loading state for metrics
  error: string | null               // Error message if any
}
```

**Behavior**:
- Fetches stores list on component mount
- Only fetches metrics when storeId is not null
- Re-fetches when storeId or period changes
- Implements graceful error handling with fallback to mock data

---

## API Integration

### getStores()

Fetches list of available stores.

**Endpoint**: `GET /admin/api/v1/analytics/stores`

**Headers**:
```
X-Admin-Api-Key: <adminApiKey>
```

**Response**:
```json
{
  "data": [
    {"id": "1", "name": "Store 1", "domain": "store1.myshopify.com"},
    {"id": "2", "name": "Store 2", "domain": "store2.myshopify.com"}
  ]
}
```

### getPerStoreMetrics(storeId, period?)

Fetches metrics for specific store.

**Endpoint**: `GET /admin/api/v1/analytics/stats/shop/{storeId}?period={period}`

**Parameters**:
- `storeId` - Store identifier
- `period` - THIS_WEEK | LAST_WEEK | THIS_MONTH | LAST_MONTH

**Headers**:
```
X-Admin-Api-Key: <adminApiKey>
```

**Response Structure**:
```json
{
  "data": {
    "storeId": "1",
    "storeName": "Store 1",
    "videoSource": {"tiktok": 150, "instagram": 120, "upload": 80, "total": 350},
    "widgetUsage": {
      "activeWidgets": 25,
      "activeWidgetsPrevious": 22,
      "activeWidgetsChange": 3,
      "activeWidgetsChangePercent": 13.6,
      "activeWidgetsTimeSeries": [
        {"date": "2024-12-09", "value": 22},
        ...
      ]
    },
    "conversion": {
      "ordersFromShopvid": {...},
      "atcRateMobile": {...},
      "atcRateDesktop": {...},
      "cvr": {...}
    },
    "revenue": {
      "inVideo": {...},
      "postVideo": {...}
    }
  }
}
```

---

## Error Handling

### Fallback Behavior

If API calls fail, the service returns mock data:

```typescript
// Mock stores list
const mockStores: Store[] = [
  { id: '1', name: 'Fashion Hub', domain: 'fashion-hub.myshopify.com' },
  { id: '2', name: 'Tech Galaxy', domain: 'tech-galaxy.myshopify.com' },
  ...
]

// Mock per-store metrics with realistic data
const mockPerStoreMetrics: PerStoreMetricsData = {
  videoSource: {tiktok: 150, instagram: 120, upload: 80, total: 350},
  conversion: {...},
  revenue: {...}
}
```

### Error States

**In UI**:
- Empty state while loading
- Error message displayed if fetch fails
- User can retry by changing store selection

**In Console**:
- Error logged with full error details
- Graceful fallback used (no error thrown)

---

## Usage Example

### In Dashboard Page

```tsx
import { usePerStoreMetrics } from '@/hooks/use-per-store-metrics'
import { PerStoreMetrics } from '@/components/dashboard/per-store-metrics'

function PerStoreDashboardContent() {
  const [selectedStoreId, setSelectedStoreId] = useState<string | null>(null)
  const [period, setPeriod] = useState<PeriodType>('THIS_WEEK')

  const { stores, storesLoading, data, loading, error } = usePerStoreMetrics(selectedStoreId, period)

  return (
    <main>
      <header>
        <h1>Per Store Metrics</h1>
        <div>
          {PERIOD_OPTIONS.map(option => (
            <button
              key={option.value}
              onClick={() => setPeriod(option.value)}
              style={buttonStyle(period === option.value)}
            >
              {option.label}
            </button>
          ))}
        </div>
      </header>

      <PerStoreMetrics
        stores={stores}
        storesLoading={storesLoading}
        data={data}
        selectedStoreId={selectedStoreId}
        onStoreChange={setSelectedStoreId}
        loading={loading}
        error={error}
      />
    </main>
  )
}
```

---

## Environment Variables

Required for production:

```bash
# Shopable API base URL
VITE_SHOPABLE_API_URL=https://api.shopable.com

# Admin API key for store endpoints
VITE_ADMIN_API_KEY=your_api_key_here
```

Default fallback values:
- `VITE_ADMIN_API_KEY`: `'avada_admin_!@#123'` (for demo/mock mode)

---

## Styling

All components use inline CSS with design tokens from `lib/constants.ts`:

**Colors**:
- `COLORS.textPrimary` - Main text
- `COLORS.textMuted` - Secondary text
- `COLORS.surface` - Card background
- `COLORS.background` - Page background

**Spacing**:
- `SPACING.sm` - Small gaps
- `SPACING.lg` - Large gaps
- `SPACING.xl` - Extra large gaps

**Borders**:
- `RADIUS.lg` - Large border radius
- `RADIUS.xl` - Extra large border radius

---

## Testing & Development

### Mock Data Mode

Run without API:
```bash
npm run dev
# Uses mock stores and metrics data
```

### With Real API

Set environment variables:
```bash
VITE_SHOPABLE_API_URL=https://api.shopable.com \
VITE_ADMIN_API_KEY=your_key \
npm run dev
```

### Store Selection UX Flow

1. Page loads → Fetches stores list (loading state)
2. User clicks selector → Dropdown shows filtered list
3. User selects store → Fetches metrics (loading state)
4. Metrics display → All components render with data
5. User changes period → Re-fetches metrics with new period

### Search Examples

- Type "fashion" → Filters by store name
- Type ".myshopify" → Filters by domain
- Type "2" → Filters by store ID

---

## Performance Considerations

### Conditional Fetching Pattern

Prevents unnecessary API calls:
- Only fetches metrics when `storeId` is not null
- No API call during empty state
- Reduces bandwidth and load times

### Time-Series Data

Each metric includes daily data points:
- 7 days for weekly periods
- Up to 30 days for monthly periods
- Used for trend visualization in charts

### Data Caching

Currently no caching implemented. Future optimization:
- Cache store list for session duration
- Cache metrics for 5-10 minutes per store+period
- Implement cache invalidation on user action

---

## Troubleshooting

### Stores List Not Loading

**Check**:
1. API endpoint accessible: `/admin/api/v1/analytics/stores`
2. Admin API key valid: `X-Admin-Api-Key` header
3. Browser console for error messages

**Fallback**: Mock stores data shown if API unavailable

### Metrics Not Loading After Store Selection

**Check**:
1. Store ID is valid
2. API endpoint: `/admin/api/v1/analytics/stats/shop/{storeId}`
3. Admin API key valid
4. Period parameter valid (THIS_WEEK, LAST_WEEK, etc.)

**Debug**: Check network tab, verify response structure matches `PerStoreMetricsData`

### Search Not Filtering Stores

Ensure store object has required fields:
- `store.id` - Must be string
- `store.name` - Must be string
- `store.domain` - Must be string

Search is case-insensitive and searches all three fields.

---

**Version**: 1.0.0
**Last Updated**: 2025-12-15
**Route**: `/dashboard/per-store`
**Protected**: Yes (requires Firebase authentication)
