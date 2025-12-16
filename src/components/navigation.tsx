import { useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '@/contexts/FirebaseAuthContext'

interface NavigationProps {
  variant?: 'default' | 'home' | 'dashboard'
}

export function Navigation({ variant = 'default' }: NavigationProps) {
  const navigate = useNavigate()
  const location = useLocation()
  const { user, signOut } = useAuth()

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
                backgroundColor: isAnalyticsPage ? 'rgba(255,255,255,0.2)' : 'transparent',
                color: '#ffffff',
                transition: 'background-color 0.2s',
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
                backgroundColor: isPerStorePage ? 'rgba(255,255,255,0.2)' : 'transparent',
                color: '#ffffff',
                transition: 'background-color 0.2s',
              }}
            >
              Per Store
            </button>
          </div>

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
