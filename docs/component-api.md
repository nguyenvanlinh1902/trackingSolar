# ShopVid Component API Documentation

## MetricCard

Displays a single KPI metric with value, change indicator, and visual styling.

**File**: `src/components/dashboard/shopvid/metric-card.tsx`

### Props

```typescript
interface MetricCardProps {
  label: string                           // Metric label (e.g., "Total Views")
  metric: AnalyticsMetric                 // Metric data object
  type?: 'number' | 'currency' | 'percent'  // Value formatting type (default: 'number')
  color?: string                          // Border color (hex or CSS color)
}
```

### AnalyticsMetric Type

```typescript
interface AnalyticsMetric {
  value: number         // Current period value
  previousValue: number // Previous period value
  change: number        // Absolute change
  changePercent: number // Percentage change
}
```

### Example Usage

```tsx
<MetricCard
  label="Total Views"
  metric={{
    value: 12580,
    previousValue: 10200,
    change: 2380,
    changePercent: 23.3
  }}
  type="number"
  color="#2563EB"
/>
```

### Rendering Details

- **Value Display**: Formatted based on `type` prop
  - `'number'`: Uses `formatNumber()` (M/K abbreviations)
  - `'currency'`: USD format with `formatCurrency()`
  - `'percent'`: 1 decimal place with `formatPercent()`
- **Change Badge**: Shows up/down arrow with percentage
  - Green badge for positive change
  - Red badge for negative change
- **Border**: 4px left border with provided color

---

## SummaryMetricsGrid

Responsive grid displaying 5 key metrics: Views, Likes, Shares, Engagement Rate, Revenue.

**File**: `src/components/dashboard/shopvid/summary-metrics-grid.tsx`

### Props

```typescript
interface SummaryMetricsGridProps {
  summary: AnalyticsData['summary']  // Analytics summary object
}
```

### Summary Structure

```typescript
summary: {
  totalViews: AnalyticsMetric        // Number format
  totalLikes: AnalyticsMetric        // Number format
  totalShares: AnalyticsMetric       // Number format
  engagementRate: AnalyticsMetric    // Percent format
  revenue: AnalyticsMetric           // Currency format
}
```

### Example Usage

```tsx
<SummaryMetricsGrid summary={analyticsData.summary} />
```

### Metrics Configuration

| Metric | Label | Type | Color |
|--------|-------|------|-------|
| totalViews | Total Views | number | #2563EB (Blue) |
| totalLikes | Total Likes | number | #EC4899 (Pink) |
| totalShares | Total Shares | number | #10B981 (Green) |
| engagementRate | Engagement Rate | percent | #F59E0B (Orange) |
| revenue | Revenue | currency | #06B6D4 (Cyan) |

### Layout

- **Responsive Grid**: Auto-columns with 220px minimum width
- **Mobile**: Stacks to 1-2 columns
- **Desktop**: 5 columns
- **Gap**: 24px spacing

---

## Data Integration

### Consuming from Analytics Page

```tsx
function AnalyticsDashboardContent() {
  const { analyticsData, loading, error } = useAnalytics('THIS_WEEK')

  return (
    <SummaryMetricsGrid summary={analyticsData.summary} />
  )
}
```

### Fetching Analytics Data

```typescript
// From analytics-service.ts
export async function getAnalyticsSummary(
  shopDomain?: string
): Promise<AnalyticsData['summary']>
```

---

## Styling Customization

### Inline Styles Used

- `cardStyle`: Base card styling with padding, border-radius, shadow
- `badgeStyle(isPositive)`: Dynamic badge styling (green/red background)
- `gridResponsive(minWidth)`: Responsive grid container

### Theme Integration

Uses design system constants from `src/lib/constants.ts`:
- **COLORS**: Text colors (textPrimary, textSecondary, textMuted)
- **CHART_COLORS**: Metric-specific colors (views, likes, shares, engagement, revenue)
- **SHADOWS**: Card shadow effects

---

## Accessibility

- **Badge ARIA Label**: `aria-label={`${isPositive ? 'Increased' : 'Decreased'} by ${Math.abs(metric.changePercent).toFixed(1)}%`}`
- **Semantic HTML**: Proper heading levels and section structure
- **Color Contrast**: All text meets WCAG AA standards

---

## Per-Store Metrics Components

### PerStoreMetrics (Container)

**File**: `src/components/dashboard/per-store-metrics.tsx`

Main container for per-store metrics dashboard.

**Props**:
```typescript
interface PerStoreMetricsProps {
  stores: Store[]
  storesLoading: boolean
  data: PerStoreMetricsData | null
  selectedStoreId: string | null
  onStoreChange: (storeId: string | null) => void
  loading: boolean
  error: string | null
}
```

**Usage**:
```tsx
<PerStoreMetrics
  stores={stores}
  storesLoading={storesLoading}
  data={data}
  selectedStoreId={selectedStoreId}
  onStoreChange={setSelectedStoreId}
  loading={loading}
  error={error}
/>
```

---

### StoreSelector

**File**: `src/components/dashboard/per-store/store-selector.tsx`

Dropdown selector with search filtering for stores.

**Props**:
```typescript
interface StoreSelectorProps {
  stores: Store[]
  selectedStoreId: string | null
  onStoreChange: (storeId: string | null) => void
  loading?: boolean
}
```

**Features**:
- Search across domain, ID, and name
- Keyboard navigation
- Loading state
- Clear selection button

**Example**:
```tsx
<StoreSelector
  stores={stores}
  selectedStoreId={selectedStoreId}
  onStoreChange={setSelectedStoreId}
  loading={storesLoading}
/>
```

---

### ConversionMetrics

**File**: `src/components/dashboard/per-store/conversion-metrics.tsx`

Grid of 4 conversion metric cards.

**Props**:
```typescript
interface ConversionMetricsProps {
  data: ConversionMetrics
}
```

**Metrics Displayed**:
1. Orders from ShopVid - number format
2. ATC Rate Mobile - percent format
3. ATC Rate Desktop - percent format
4. CVR - percent format

**Example**:
```tsx
<ConversionMetrics data={perStoreData.conversion} />
```

---

### VideoSourceChart

**File**: `src/components/dashboard/per-store/video-source-chart.tsx`

Donut chart showing video source distribution.

**Props**:
```typescript
interface VideoSourceChartProps {
  data: VideoSourceMetrics
}
```

**Chart Data**:
- TikTok segment
- Instagram segment
- Upload segment
- Total in center

**Example**:
```tsx
<VideoSourceChart data={perStoreData.videoSource} />
```

---

### WidgetMetrics

**File**: `src/components/dashboard/per-store/widget-metrics.tsx`

Metric card with sparkline showing active widgets trend.

**Props**:
```typescript
interface WidgetMetricsProps {
  data: PerStoreWidgetUsage
}
```

**Display**:
- Active widgets count
- Change percentage
- 7-day sparkline

**Example**:
```tsx
<WidgetMetrics data={perStoreData.widgetUsage} />
```

---

### RevenueCharts

**File**: `src/components/dashboard/per-store/revenue-charts.tsx`

Two line charts for In-Video and Post-Video revenue.

**Props**:
```typescript
interface RevenueChartsProps {
  data: {
    inVideo: RevenueMetrics
    postVideo: RevenueMetrics
  }
}
```

**Charts**:
- In-Video Revenue (line chart)
- Post-Video Revenue (line chart)

**Example**:
```tsx
<RevenueCharts data={perStoreData.revenue} />
```

---

**Version**: 1.1.0
**Last Updated**: 2025-12-15
