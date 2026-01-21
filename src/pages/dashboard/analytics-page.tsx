import { ProtectedRoute } from '@/components/auth/protected-route';
import { AllStoresProvider, useAllStoresContext } from '@/contexts/all-stores-context';
import { ErrorMessage } from '@/components/dashboard/shopvid';
import { DashboardHeader } from '@/components/dashboard/dashboard-header';
import {
  VideoUploadAnalytics,
  VideoSourceMetrics,
  WidgetUsageMetrics,
} from '@/components/dashboard/all-stores';

function AnalyticsDashboardContent() {
  const { loading, error, data } = useAllStoresContext();

  if (loading) {
    return (
      <main className="dashboard">
        <div className="dashboard-loading">
          <div className="dashboard-loading__spinner">
            <div className="spinner spinner--primary" />
            <p>Loading...</p>
          </div>
        </div>
      </main>
    );
  }

  if (error || !data) {
    return (
      <main className="dashboard">
        <ErrorMessage message={error || 'Failed to load analytics data'} />
      </main>
    );
  }

  return (
    <main className="dashboard">
      <div className="dashboard__container">
        {/* Header with Total Shops */}
        <DashboardHeader
          currentPage="all-stores"
          totalShops={data.totalShops}
        />

        {/* Dashboard Sections */}
        <div className="dashboard__charts" style={{ display: 'grid', gap: '24px' }}>
          {/* Video Upload Analytics (standalone - uses mock data) */}
          <VideoUploadAnalytics />

          {/* Video Source Tracking (uses context) */}
          <VideoSourceMetrics />

          {/* Widget Usage (uses context) */}
          <WidgetUsageMetrics />

          {/* ConversionMetrics REMOVED */}
        </div>
      </div>
    </main>
  );
}

export default function AnalyticsPage() {
  return (
    <ProtectedRoute>
      <AllStoresProvider>
        <AnalyticsDashboardContent />
      </AllStoresProvider>
    </ProtectedRoute>
  );
}
