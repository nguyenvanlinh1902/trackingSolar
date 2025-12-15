import { Routes, Route, Navigate } from 'react-router-dom'
import { Navigation } from './components/navigation'
import HomePage from './pages/home-page'
import LoginPage from './pages/login-page'
import AnalyticsPage from './pages/dashboard/analytics-page'
import PerStorePage from './pages/dashboard/per-store-page'

function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Navigation variant="dashboard" />
      {children}
    </>
  )
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/dashboard" element={<Navigate to="/dashboard/analytics" replace />} />
      <Route
        path="/dashboard/analytics"
        element={
          <DashboardLayout>
            <AnalyticsPage />
          </DashboardLayout>
        }
      />
      <Route
        path="/dashboard/per-store"
        element={
          <DashboardLayout>
            <PerStorePage />
          </DashboardLayout>
        }
      />
    </Routes>
  )
}
