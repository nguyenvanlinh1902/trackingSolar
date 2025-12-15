# TrackingApp Documentation

Complete reference documentation for the TrackingApp video analytics dashboard.

## Quick Links

### Core Documentation

- **[Codebase Summary](./codebase-summary.md)** - Project overview, architecture, and directory structure
- **[System Architecture](./system-architecture.md)** - High-level system design and components (if exists)
- **[Code Standards](./code-standards.md)** - Development standards and best practices (if exists)

### Feature Guides

- **[Analytics Service Guide](./analytics-service-guide.md)** - API integration, data structures, and usage patterns
  - ShopVid analytics functions: `getAnalytics()`, `getAnalyticsSummary()`, `getVideosReport()`
  - Per-store functions: `getStores()`, `getPerStoreMetrics()`

- **[Per-Store Metrics Guide](./per-store-metrics-guide.md)** - Complete per-store dashboard documentation
  - Architecture and conditional fetching pattern
  - 6 component APIs with examples
  - API endpoints and data structures
  - Error handling and troubleshooting

### Component Documentation

- **[Component API](./component-api.md)** - All component interfaces and usage
  - ShopVid components: MetricCard, SummaryMetricsGrid
  - Per-store components: StoreSelector, ConversionMetrics, VideoSourceChart, WidgetMetrics, RevenueCharts

## Documentation Index

| File | Purpose | Lines | Version |
|------|---------|-------|---------|
| codebase-summary.md | Architecture & structure overview | 161 | 1.0.0 |
| analytics-service-guide.md | API functions & data structures | 418 | 1.1.0 |
| component-api.md | Component interfaces & examples | 336 | 1.1.0 |
| per-store-metrics-guide.md | Per-store feature complete guide | 515 | 1.0.0 |

**Total Documentation**: 1,430 lines

## Key Features

### ShopVid Analytics Dashboard
- 5-metric KPI cards (Views, Likes, Shares, Engagement, Revenue)
- Interactive line/bar charts for trends
- Top videos performance table
- Period selector (This Week, Last Week, This Month, Last Month)
- Route: `/dashboard/analytics`

### Per-Store Metrics Dashboard
- Store selector with search (domain/ID/name)
- 4 conversion metric cards (Orders, ATC Mobile, ATC Desktop, CVR)
- Video source distribution (TikTok/Instagram/Upload)
- Active widgets sparkline chart
- Revenue line charts (In-Video vs Post-Video)
- Route: `/dashboard/per-store`

## API Integration

### Shopable API Endpoints

**ShopVid Endpoints** (Public):
- `GET /api/analytics/{period}` - Full analytics with charts
- `GET /api/analytics/videos-summary` - 5 KPI summary
- `GET /api/analytics/videos-report` - Top videos list

**Admin Endpoints** (Per-Store):
- `GET /admin/api/v1/analytics/stores` - Available stores list
- `GET /admin/api/v1/analytics/stats/shop/{storeId}?period={period}` - Per-store metrics

### Environment Variables

```bash
# Shopable API base URL
VITE_SHOPABLE_API_URL=https://api.shopable.com

# Admin API key for per-store endpoints
VITE_ADMIN_API_KEY=your_api_key_here
```

## Development Setup

### Mock Data Mode (No API Required)
```bash
npm run dev
# Uses mock data for all endpoints
```

### With Real API
```bash
VITE_SHOPABLE_API_URL=https://api.shopable.com npm run dev
```

## Architecture Overview

### Technology Stack
- **Frontend**: React 18+ with TypeScript
- **Build**: Vite
- **Styling**: Inline CSS with design tokens
- **Auth**: Firebase Authentication
- **Charts**: Polaris (internal charting library)
- **3D**: Three.js for home page visualizations

### Directory Structure
```
src/
├── components/dashboard/
│   ├── shopvid/              # ShopVid analytics components
│   ├── per-store/            # Per-store metrics sub-components
│   ├── per-store-metrics.tsx # Container
│   └── polaris-charts.tsx    # Chart visualizations
├── pages/dashboard/
│   ├── analytics-page.tsx    # ShopVid dashboard (/dashboard/analytics)
│   └── per-store-page.tsx    # Per-store dashboard (/dashboard/per-store)
├── services/
│   └── analytics-service.ts  # Shopable API integration
├── hooks/
│   ├── use-analytics.ts      # ShopVid data fetching
│   └── use-per-store-metrics.ts  # Per-store data fetching
└── types/
    └── survey-metrics.ts     # Per-store type definitions
```

## Key Patterns

### Conditional Fetching
Per-store metrics hook only fetches data when store is selected:
```typescript
if (!storeId) {
  setData(null)
  return // No API call
}
// Only fetch when storeId is set
```

### Error Handling
Graceful fallback to mock data on API errors:
- Network errors logged to console
- Mock data returned automatically
- No errors thrown to components

### Type-Safe Metrics
All metrics follow consistent structure:
```typescript
interface MetricWithChange {
  value: number
  previousValue: number
  change: number
  changePercent: number
}
```

## Performance Considerations

- Conditional fetching prevents unnecessary API calls
- Time-series data included in all metrics (7-30 days)
- Inline CSS styling (no runtime CSS parsing)
- Responsive design with mobile-first approach

## Testing & Validation

See related test reports in `plans/reports/`:
- Per-store metrics validation report
- ShopVid metrics cards testing
- Firebase authentication review
- Phase verification reports

## Recent Updates

**Phase 05** (2025-12-15):
- Added Per-Store Metrics Dashboard
- Implemented 6 new components
- Added `getStores()` and `getPerStoreMetrics()` API functions
- Created comprehensive per-store metrics guide
- Updated analytics service documentation

**Previous Phases**:
- Phase 01: Firebase authentication setup
- Phase 02-03: ShopVid analytics dashboard
- Phase 04: Summary metrics and charts

## Support & Troubleshooting

### Common Issues

**Stores list not loading**:
- Check API endpoint: `/admin/api/v1/analytics/stores`
- Verify `X-Admin-Api-Key` header
- Check browser console for errors

**Per-store metrics not showing**:
- Ensure store ID is valid
- Verify API endpoint: `/admin/api/v1/analytics/stats/shop/{storeId}`
- Check period parameter (THIS_WEEK, LAST_WEEK, THIS_MONTH, LAST_MONTH)

**Search not filtering stores**:
- Ensure store object has `id`, `name`, and `domain` fields
- Search is case-insensitive across all three fields

## Version History

| Version | Date | Changes |
|---------|------|---------|
| 1.1.0 | 2025-12-15 | Added per-store metrics documentation |
| 1.0.0 | 2025-12-15 | Initial ShopVid analytics documentation |

---

**Last Updated**: 2025-12-15
**Maintainer**: Documentation Manager
**Status**: Current
