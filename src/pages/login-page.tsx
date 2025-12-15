import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '@/contexts/FirebaseAuthContext'
import { GoogleSignInButton } from '@/components/auth/google-sign-in-button'

// SVG Icons
const LogoIcon = () => (
  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 2L2 7l10 5 10-5-10-5z" />
    <path d="M2 17l10 5 10-5" />
    <path d="M2 12l10 5 10-5" />
  </svg>
)

const ChartIcon = () => (
  <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 3v18h18" />
    <path d="M18 17V9" />
    <path d="M13 17V5" />
    <path d="M8 17v-3" />
  </svg>
)

const ShieldIcon = () => (
  <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    <path d="m9 12 2 2 4-4" />
  </svg>
)

const BoltIcon = () => (
  <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
  </svg>
)

const CheckIcon = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#10B981" strokeWidth="2">
    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
    <polyline points="22 4 12 14.01 9 11.01" />
  </svg>
)

export default function LoginPage() {
  const { user, loading, error } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    if (!loading && user) {
      navigate('/dashboard')
    }
  }, [user, loading, navigate])

  if (loading) {
    return (
      <div className="login-loading">
        <div className="spinner" />
      </div>
    )
  }

  if (user) return null

  const features = [
    { icon: <ChartIcon />, title: 'Real-time Analytics', desc: 'Live data visualization' },
    { icon: <ShieldIcon />, title: 'Secure & Private', desc: 'Enterprise-grade security' },
    { icon: <BoltIcon />, title: 'Lightning Fast', desc: 'Optimized performance' },
  ]

  const badges = ['256-bit SSL', 'GDPR Ready', 'SOC 2']

  return (
    <main className="login">
      <div className="login__decoration login__decoration--top" />
      <div className="login__decoration login__decoration--bottom" />

      {/* Left side - Branding */}
      <div className="login__branding">
        <div className="login__branding-content">
          <div className="login__brand-logo">
            <div className="login__brand-icon">
              <LogoIcon />
            </div>
            <span className="login__brand-name">TrackingApp</span>
          </div>

          <h1 className="login__brand-title">
            Analytics that drive <br />
            <span style={{ opacity: 0.9 }}>real results</span>
          </h1>
          <p className="login__brand-subtitle">
            Get real-time insights, beautiful visualizations, and actionable data
            to grow your business faster.
          </p>

          <div className="login__features">
            {features.map((feature, i) => (
              <div key={i} className="login__feature">
                <div className="login__feature-icon">{feature.icon}</div>
                <div>
                  <div className="login__feature-title">{feature.title}</div>
                  <div className="login__feature-desc">{feature.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right side - Form */}
      <div className="login__form-section">
        <div className="login__card">
          <div className="login__logo-wrapper">
            <div className="login__logo-box">
              <LogoIcon />
            </div>
          </div>

          <div className="login__header">
            <h2 className="login__title">Welcome back</h2>
            <p className="login__subtitle-text">Sign in to access your dashboard</p>
          </div>

          {error && (
            <div className="login__error">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10" />
                <line x1="12" y1="8" x2="12" y2="12" />
                <line x1="12" y1="16" x2="12.01" y2="16" />
              </svg>
              {error}
            </div>
          )}

          <GoogleSignInButton />

          <div className="login__divider">
            <div className="login__divider-line" />
            <span className="login__divider-text">Secure login</span>
            <div className="login__divider-line" />
          </div>

          <div className="login__badges">
            {badges.map((badge, i) => (
              <div key={i} className="login__badge">
                <CheckIcon />
                {badge}
              </div>
            ))}
          </div>

          <p className="login__terms">
            By continuing, you agree to our{' '}
            <span className="login__link">Terms of Service</span>
            {' '}and{' '}
            <span className="login__link">Privacy Policy</span>
          </p>
        </div>
      </div>
    </main>
  )
}
