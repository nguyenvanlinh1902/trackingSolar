import { Routes, Route, Navigate } from 'react-router-dom'
import { Navigation } from './components/navigation'
import HomePage from './pages/home-page'
import LoginPage from './pages/login-page'
import AnalyticsPage from './pages/dashboard/analytics-page'
import PerStorePage from './pages/dashboard/per-store-page'
import { useState } from 'react'
import { AllStoresProvider, useAllStoresContext } from './contexts/all-stores-context'
import { usePerStoreMetrics } from './hooks/use-per-store-metrics'

function AnalyticsLayout({ children }: { children: React.ReactNode }) {
  const { data } = useAllStoresContext()

  return (
    <>
      <Navigation
        variant="dashboard"
        totalShops={data?.totalShops}
      />
      {children}
    </>
  )
}

function PerStoreLayout({ children }: { children: React.ReactNode }) {
  const [selectedDomain, setSelectedDomain] = useState<string | null>(null)
  const { searchByDomain, loading } = usePerStoreMetrics()

  const handleSearch = async (domain: string) => {
    setSelectedDomain(domain)
    await searchByDomain(domain)
  }

  return (
    <>
      <Navigation
        variant="dashboard"
        selectedDomain={selectedDomain}
        onDomainChange={setSelectedDomain}
        onSearch={handleSearch}
        searchLoading={loading}
      />
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
          <AllStoresProvider>
            <AnalyticsLayout>
              <AnalyticsPage />
            </AnalyticsLayout>
          </AllStoresProvider>
        }
      />
      <Route
        path="/dashboard/per-store"
        element={
          <PerStoreLayout>
            <PerStorePage />
          </PerStoreLayout>
        }
      />
    </Routes>
  )
}
