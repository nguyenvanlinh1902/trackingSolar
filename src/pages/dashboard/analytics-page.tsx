import { ProtectedRoute } from '@/components/auth/protected-route';
import { useAllStoresContext } from '@/contexts/all-stores-context';
import { ErrorMessage } from '@/components/dashboard/shopvid';
import {
  VideoUploadAnalytics,
  VideoSourceMetrics,
  WidgetUsageMetrics,
} from '@/components/dashboard/all-stores';

export default function AnalyticsPage() {
  const { loading, error } = useAllStoresContext();

  if (loading) {
    return (
      <ProtectedRoute>
        <main className="dashboard">
          <div className="dashboard-loading">
            <div className="dashboard-loading__spinner">
              <div className="spinner spinner--primary" />
              <p>Loading...</p>
            </div>
          </div>
        </main>
      </ProtectedRoute>
    );
  }

  if (error) {
    return (
      <ProtectedRoute>
        <main className="dashboard">
          <ErrorMessage message={error || 'Failed to load analytics data'} />
        </main>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute>
      <main className="dashboard">
        <div className="dashboard__container">
          {/* Dashboard Sections */}
          <div className="dashboard__charts" style={{ display: 'grid', gap: '24px' }}>
            {/* Video Upload Analytics (standalone - uses mock data) */}
            <VideoUploadAnalytics />

            {/* Video Source Tracking (uses context) */}
            <VideoSourceMetrics />

            {/* Widget Usage (uses context) */}
            <WidgetUsageMetrics />
          </div>
        </div>
      </main>
    </ProtectedRoute>
  );
}
