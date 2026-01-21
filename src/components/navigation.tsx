import { useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '@/contexts/FirebaseAuthContext'
import { useState, useRef } from 'react'

interface NavigationProps {
  variant?: 'default' | 'home' | 'dashboard'
  totalShops?: number
  selectedDomain?: string | null
  onDomainChange?: (domain: string | null) => void
  onSearch?: (domain: string) => void
  searchLoading?: boolean
}

export function Navigation({
  variant = 'default',
  totalShops,
  selectedDomain,
  onDomainChange,
  onSearch,
  searchLoading = false,
}: NavigationProps) {
  const navigate = useNavigate()
  const location = useLocation()
  const { user, signOut } = useAuth()
  const [searchTerm, setSearchTerm] = useState('')
  const [isSearching, setIsSearching] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  const handleNavigate = (path: string) => {
    navigate(path)
  }

  const handleSignOut = async () => {
    try {
      await signOut()
      navigate('/')
    } catch (error) {
      console.error('Sign out failed:', error)
    }
  }

  const handleSearch = async () => {
    const domain = searchTerm.trim()
    if (!domain || !onSearch) {
      return
    }

    try {
      setIsSearching(true)
      await onSearch(domain)
    } catch (error) {
      console.error('Search failed:', error)
    } finally {
      setIsSearching(false)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSearch()
    }
  }

  const handleClear = () => {
    setSearchTerm('')
    if (onDomainChange) {
      onDomainChange(null)
    }
  }

  if (variant === 'home') {
    return (
      <header className="nav-home">
        <div className="nav-home__logo" onClick={() => handleNavigate('/')}>
          <div className="nav-home__logo-icon">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M9 11l3 3L22 4" />
              <path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11" />
            </svg>
          </div>
          <span className="nav-home__logo-text">TaskFlow</span>
        </div>
        <button className="nav-home__signin-btn" onClick={() => handleNavigate('/login')}>
          Sign In
        </button>
      </header>
    )
  }

  if (variant === 'dashboard') {
    const isAnalyticsPage = location.pathname === '/dashboard/analytics'
    const isPerStorePage = location.pathname === '/dashboard/per-store'

    return (
      <header className="nav-dashboard">
        <div className="nav-dashboard__inner">
          <div className="nav-dashboard__logo" onClick={() => handleNavigate('/dashboard')}>
            <div className="nav-dashboard__logo-icon">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M9 11l3 3L22 4" />
                <path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11" />
              </svg>
            </div>
            <span className="nav-dashboard__logo-text">TaskFlow</span>
          </div>

          {/* Dashboard Navigation Links */}
          <div className="nav-dashboard__links" style={{ display: 'flex', gap: '8px', marginLeft: '24px' }}>
            <button
              onClick={() => handleNavigate('/dashboard/analytics')}
              style={{
                padding: '8px 16px',
                fontSize: '14px',
                fontWeight: 500,
                border: 'none',
                borderRadius: '6px',
                cursor: 'pointer',
                backgroundColor: isAnalyticsPage ? '#667eea' : 'transparent',
                color: isAnalyticsPage ? '#ffffff' : '#6b7280',
                transition: 'all 0.2s',
              }}
            >
              All Stores
            </button>
            <button
              onClick={() => handleNavigate('/dashboard/per-store')}
              style={{
                padding: '8px 16px',
                fontSize: '14px',
                fontWeight: 500,
                border: 'none',
                borderRadius: '6px',
                cursor: 'pointer',
                backgroundColor: isPerStorePage ? '#667eea' : 'transparent',
                color: isPerStorePage ? '#ffffff' : '#6b7280',
                transition: 'all 0.2s',
              }}
            >
              Per Store
            </button>
          </div>

          {/* Total Shops or Search */}
          {isAnalyticsPage && totalShops !== undefined && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginLeft: 'auto' }}>
              <span style={{ fontSize: '12px', color: '#6b7280', fontWeight: 600 }}>Total Shops:</span>
              <span style={{ fontSize: '18px', color: '#1f2937', fontWeight: 800 }}>{totalShops}</span>
            </div>
          )}

          {isPerStorePage && onSearch && (
            <div style={{ display: 'flex', gap: '8px', marginLeft: 'auto', maxWidth: '400px' }}>
              <div style={{ position: 'relative', flex: 1 }}>
                <input
                  ref={inputRef}
                  type="text"
                  placeholder="Search store domain..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  onKeyDown={handleKeyPress}
                  disabled={searchLoading || isSearching}
                  style={{
                    width: '100%',
                    padding: '8px 12px',
                    paddingRight: selectedDomain ? '32px' : '12px',
                    fontSize: '14px',
                    border: '1px solid #d1d5db',
                    borderRadius: '6px',
                    outline: 'none',
                    backgroundColor: searchLoading || isSearching ? '#f9fafb' : '#ffffff',
                    color: '#1f2937',
                  }}
                />

                {selectedDomain && (
                  <button
                    onClick={handleClear}
                    style={{
                      position: 'absolute',
                      right: '6px',
                      top: '50%',
                      transform: 'translateY(-50%)',
                      background: 'none',
                      border: 'none',
                      cursor: 'pointer',
                      color: '#6b7280',
                      fontSize: '18px',
                      padding: '2px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      lineHeight: 1,
                    }}
                    aria-label="Clear selection"
                  >
                    ×
                  </button>
                )}
              </div>

              <button
                onClick={handleSearch}
                disabled={searchLoading || isSearching || !searchTerm.trim()}
                style={{
                  padding: '8px 16px',
                  fontSize: '14px',
                  fontWeight: 600,
                  borderRadius: '6px',
                  border: 'none',
                  cursor: searchLoading || isSearching || !searchTerm.trim() ? 'not-allowed' : 'pointer',
                  backgroundColor: searchLoading || isSearching || !searchTerm.trim() ? '#e5e7eb' : '#667eea',
                  color: searchLoading || isSearching || !searchTerm.trim() ? '#9ca3af' : '#ffffff',
                  whiteSpace: 'nowrap',
                }}
              >
                {isSearching ? 'Searching...' : 'Search'}
              </button>
            </div>
          )}

          <nav className="nav-dashboard__nav">
            {user ? (
              <div className="nav-dashboard__user">
                {user.photoURL ? (
                  <img
                    src={user.photoURL}
                    alt={user.displayName || 'User'}
                    className="nav-dashboard__avatar"
                  />
                ) : (
                  <div className="nav-dashboard__avatar-placeholder">
                    {user.displayName?.charAt(0) || user.email?.charAt(0) || 'U'}
                  </div>
                )}
                <div className="nav-dashboard__user-info">
                  <span className="nav-dashboard__user-name">{user.displayName || 'User'}</span>
                  <span className="nav-dashboard__user-email">{user.email}</span>
                </div>
                <button className="nav-dashboard__signout-btn" onClick={handleSignOut}>
                  Sign Out
                </button>
              </div>
            ) : (
              <button className="nav-dashboard__login-btn" onClick={() => handleNavigate('/login')}>
                Login
              </button>
            )}
          </nav>
        </div>
      </header>
    )
  }

  return null
}
