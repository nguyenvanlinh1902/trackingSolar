'use client';

import { ProtectedRoute } from '@/components/auth/protected-route';
import { PolarisCharts } from '@/components/dashboard/polaris-charts';
import {
  PageHeader,
  LoadingSpinner,
  VideoPerformanceTable,
  ErrorMessage,
} from '@/components/dashboard/shopvid';
import { useAnalytics } from '@/hooks/use-analytics';
import { pageContainerStyle } from '@/lib/styles';
import { COLORS } from '@/lib/constants';

function SurveyDashboardContent() {
  const { analyticsData, period, setPeriod, loading, error } = useAnalytics('THIS_WEEK');

  if (loading) {
    return (
      <main style={{ minHeight: '100vh', backgroundColor: COLORS.background }}>
        <LoadingSpinner />
      </main>
    );
  }

  if (error || !analyticsData) {
    return (
      <main style={{ minHeight: '100vh', backgroundColor: COLORS.background }}>
        <ErrorMessage message={error || 'Failed to load analytics data'} />
      </main>
    );
  }

  return (
    <main style={{ minHeight: '100vh', backgroundColor: COLORS.background }}>
      <div style={pageContainerStyle}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          <PolarisCharts data={analyticsData} />
          <VideoPerformanceTable videos={analyticsData.topVideos} />
        </div>
      </div>
    </main>
  );
}

export default function SurveyDashboardPage() {
  return (
    <ProtectedRoute>
      <SurveyDashboardContent />
    </ProtectedRoute>
  );
}
