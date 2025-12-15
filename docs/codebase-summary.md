# TrackingApp - Codebase Summary

## Project Overview
TrackingApp is a video analytics dashboard for ShopVid integration, built with React/TypeScript, Vite, and Firebase. Tracks video performance metrics (views, likes, shares, engagement rate, revenue) with interactive charts and performance tables.

## Architecture

### Frontend Stack
- **Framework**: React 18+ with TypeScript
- **Build Tool**: Vite
- **Styling**: Inline styles with CSS-in-JS, glassmorphism design system
- **Auth**: Firebase Authentication
- **API Integration**: Shopable Analytics API

### Directory Structure
```
src/
├── components/
│   ├── auth/              # Authentication components
│   ├── dashboard/
│   │   ├── shopvid/       # ShopVid analytics components
│   │   │   ├── metric-card.tsx              # KPI metric display card
│   │   │   ├── summary-metrics-grid.tsx     # 5-column metric grid
│   │   │   ├── video-performance-table.tsx  # Top videos table
│   │   │   ├── page-header.tsx
│   │   │   ├── loading-spinner.tsx
│   │   │   ├── error-message.tsx
│   │   │   └── index.ts
│   │   └── polaris-charts.tsx  # Chart visualizations
│   ├── navigation.tsx
│   ├── providers.tsx
│   └── three/             # 3D scene components
├── pages/
│   └── dashboard/
│       └── analytics-page.tsx   # Main analytics dashboard
├── services/
│   └── analytics-service.ts     # Shopable API integration
├── hooks/
│   └── use-analytics.ts         # Analytics data fetching hook
├── lib/
│   ├── constants.ts       # Design system & formatting functions
│   ├── styles.ts          # Reusable style objects
│   └── types.ts
├── contexts/
│   └── FirebaseAuthContext.tsx
├── main.tsx
├── App.tsx
└── vite-env.d.ts
```

## Key Components

### Metric Cards
**Files**: `metric-card.tsx`, `summary-metrics-grid.tsx`

Displays KPI metrics with:
- Metric value (formatted: number/currency/percent)
- Previous period value
- Change indicator (up/down arrow)
- Change percentage
- Color-coded border (blue/pink/green/orange/cyan)

**Usage**:
```tsx
<SummaryMetricsGrid summary={analyticsData.summary} />
```

### Analytics Service
**File**: `analytics-service.ts`

- `getAnalytics(period)` - Fetches full analytics data with charts
- `getAnalyticsSummary()` - Fetches 5-metric summary
- `getVideosReport()` - Fetches top videos list
- Fallback to mock data if API unavailable

**Data Shape**:
```typescript
AnalyticsData {
  summary: {
    totalViews, totalLikes, totalShares, engagementRate, revenue
  }
  chartData: [{date, views, likes, shares}]
  topVideos: [{videoId, title, views, likes, shares, engagement}]
  period: PeriodType
}
```

### Dashboard Page
**File**: `analytics-page.tsx`

Main layout renders:
1. SummaryMetricsGrid - 5 KPI cards
2. PolarisCharts - Line/bar charts
3. VideoPerformanceTable - Top videos table

## Design System

### Colors
- **Views**: Primary Blue (#2563EB)
- **Likes**: Pink (#EC4899)
- **Shares**: Green (#10B981)
- **Engagement**: Warning Orange (#F59E0B)
- **Revenue**: Info Cyan (#06B6D4)

### Styling Approach
- Inline CSS with design tokens from `constants.ts`
- Responsive grid: `gridResponsive('220px')` for 5-column layout
- Glassmorphism effects with shadows
- Dark mode ready colors

## API Integration

**Base URL**: `process.env.NEXT_PUBLIC_SHOPABLE_API_URL`

**Endpoints**:
- `GET /api/analytics/{period}` - Full analytics
- `GET /api/analytics/videos-summary` - Summary metrics
- `GET /api/analytics/videos-report` - Top videos

**Headers**:
- `X-Shop-Domain` (optional) - Shop domain for API auth

## Development Notes

- Mock data available in `analytics-service.ts` for local development
- All metric values include `previousValue` and `changePercent` for comparison
- Period types: `THIS_WEEK`, `LAST_WEEK`, `THIS_MONTH`, `LAST_MONTH`
- Number formatting: M for millions, K for thousands
- Percentage formatting: 1 decimal place
- Currency: USD with no decimals

---
**Last Updated**: 2025-12-15
**Version**: 1.0.0
