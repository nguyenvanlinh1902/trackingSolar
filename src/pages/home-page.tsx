import { useNavigate } from 'react-router-dom'
import { Navigation } from '@/components/navigation'
import { HomeScene } from '@/components/three/home-scene'

export default function HomePage() {
  const navigate = useNavigate()

  return (
    <main className="home">
      <div className="home__scene">
        <HomeScene />
      </div>

      <div className="home__content">
        <Navigation variant="home" />

        <div className="home__hero">
          <h1 className="home__title">Quản lý công việc hiệu quả</h1>
          <p className="home__subtitle">
            Tổ chức công việc, tăng năng suất và đạt được mục tiêu của bạn với giải pháp quản lý trực quan.
          </p>
          <div className="home__actions">
            <button className="home__btn-primary" onClick={() => navigate('/login')}>
              Bắt đầu miễn phí
            </button>
            <button className="home__btn-secondary" onClick={() => navigate('/dashboard')}>
              Xem Dashboard
            </button>
          </div>
        </div>

        <footer className="home__footer">
          <p>&copy; 2025 TaskFlow. All rights reserved.</p>
        </footer>
      </div>
    </main>
  )
}
