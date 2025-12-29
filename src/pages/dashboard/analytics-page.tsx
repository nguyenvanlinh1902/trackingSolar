import { ProtectedRoute } from '@/components/auth/protected-route'
import { useNavigate } from 'react-router-dom'
import { useState } from 'react'
import { useAnalytics } from '@/hooks/use-analytics'
import { useAllStoresMetrics } from '@/hooks/use-all-stores-metrics'
import { useDaybreakAnalytics } from '@/hooks/use-daybreak-analytics'
import { PolarisCharts } from '@/components/dashboard/polaris-charts'
import { ErrorMessage, SummaryMetricsGrid } from '@/components/dashboard/shopvid'
import { AllStoresWidgetUsage, ConversionMetrics, DaybreakChart } from '@/components/dashboard/all-stores'
import { VideoSourceChart } from '@/components/dashboard/per-store'

function AnalyticsDashboardContent() {
  const { analyticsData, loading, error } = useAnalytics()
  const { data: allStoresData, loading: allStoresLoading, error: allStoresError } = useAllStoresMetrics()
  const [dateRange, setDateRange] = useState<{ start: string; end: string }>(() => {
    const today = new Date()
    const sevenDaysAgo = new Date(today)
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7)
    return {
      start: sevenDaysAgo.toISOString().split('T')[0],
      end: today.toISOString().split('T')[0],
    }
  })
  const { data: daybreakData, loading: daybreakLoading, error: daybreakError } = useDaybreakAnalytics(dateRange.start, dateRange.end)
  const navigate = useNavigate()

  const isLoading = loading || allStoresLoading
  const hasError = error || allStoresError

  if (isLoading) {
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

  if (hasError || !analyticsData) {
    return (
      <main className="dashboard">
        <ErrorMessage message={error || allStoresError || 'Failed to load analytics data'} />
      </main>
    )
  }

  return (
    <main className="dashboard">
      <div className="dashboard__container">
        <div
          className="dashboard__header"
          style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
            <div>
              <h1 style={{ margin: 0, fontSize: '20px', fontWeight: 600 }}>All Stores Analytics</h1>
              <p style={{ margin: 0, marginTop: '4px', fontSize: '13px', opacity: 0.8 }}>Overview for all stores</p>
            </div>
            {/* Total Shops Stat Card */}
            {allStoresData?.totalShops && (
              <div
                style={{
                  padding: '12px 16px',
                  backgroundColor: '#f3f4f6',
                  borderRadius: '8px',
                  borderLeft: '3px solid #3b82f6',
                  minWidth: '140px',
                }}
              >
                <p style={{ margin: 0, fontSize: '12px', color: '#6b7280', fontWeight: 500, marginBottom: '4px' }}>
                  Total Shops
                </p>
                <p style={{ margin: 0, fontSize: '24px', fontWeight: 700, color: '#111827' }}>
                  {allStoresData.totalShops}
                </p>
              </div>
            )}
          </div>
          <div style={{ display: 'flex', gap: '8px' }}>
            <button
              type="button"
              onClick={() => navigate('/dashboard/analytics')}
              style={{
                padding: '8px 16px',
                fontSize: '14px',
                fontWeight: 500,
                borderRadius: '999px',
                border: 'none',
                cursor: 'pointer',
                backgroundColor: '#111827',
                color: '#ffffff',
              }}
            >
              All Stores
            </button>
            <button
              type="button"
              onClick={() => navigate('/dashboard/per-store')}
              style={{
                padding: '8px 16px',
                fontSize: '14px',
                fontWeight: 500,
                borderRadius: '999px',
                border: '1px solid rgba(17,24,39,0.2)',
                cursor: 'pointer',
                backgroundColor: '#ffffff',
                color: '#111827',
              }}
            >
              Per Store
            </button>
          </div>
        </div>

        <div className="dashboard__charts" style={{ display: 'grid', gap: '24px' }}>
          <SummaryMetricsGrid summary={analyticsData.summary} />
          <PolarisCharts data={analyticsData} />
          
          {/* Conversion Metrics with Charts */}
          {allStoresData?.conversionData && <ConversionMetrics conversionData={allStoresData.conversionData} />}
          
          {/* Widget Usage for All Stores */}
          {allStoresData && <AllStoresWidgetUsage widgetUsage={allStoresData.widgetUsage} />}
          
          {/* Video Source Distribution for All Stores */}
          {allStoresData && <VideoSourceChart videoSource={allStoresData.videoSource} />}

          {/* Time Series Analysis with Date Filters */}
          <DaybreakChart
            data={daybreakData}
            loading={daybreakLoading}
            onDateRangeChange={(startDate, endDate) => setDateRange({ start: startDate, end: endDate })}
          />
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
