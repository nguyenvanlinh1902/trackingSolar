import { ProtectedRoute } from '@/components/auth/protected-route'
import { useAnalytics } from '@/hooks/use-analytics'
import { PolarisCharts } from '@/components/dashboard/polaris-charts'
import { VideoPerformanceTable, ErrorMessage, SummaryMetricsGrid } from '@/components/dashboard/shopvid'

function AnalyticsDashboardContent() {
  const { analyticsData, loading, error } = useAnalytics('THIS_WEEK')

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
    )
  }

  if (error || !analyticsData) {
    return (
      <main className="dashboard">
        <ErrorMessage message={error || 'Failed to load analytics data'} />
      </main>
    )
  }

  return (
    <main className="dashboard">
      <div className="dashboard__container">
        <div className="dashboard__charts" style={{ display: 'grid', gap: '24px' }}>
          <SummaryMetricsGrid summary={analyticsData.summary} />
          <PolarisCharts data={analyticsData} />
          <VideoPerformanceTable videos={analyticsData.topVideos} />
        </div>
      </div>
    </main>
  )
}

export default function AnalyticsPage() {
  return (
    <ProtectedRoute>
      <AnalyticsDashboardContent />
    </ProtectedRoute>
  )
}
