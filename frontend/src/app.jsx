import { Routes, Route } from 'react-router-dom'
import { useAuth } from './context/AuthContext'

// Layout Components
import MainLayout from './components/layouts/MainLayout'
import AuthLayout from './components/layouts/AuthLayout'
import AngelLayout from './components/layouts/AngelLayout'
import VisitorLayout from './components/layouts/VisitorLayout'

// Public Pages
import HomePage from './pages/public/HomePage'
import AboutPage from './pages/public/AboutPage'
import EmergencyPage from './pages/public/EmergencyPage'
import MapPage from './pages/public/MapPage'
import SacPage from './pages/public/SacPage'
import TourSearchPage from './pages/public/TourSearchPage'
import TourDetailsPage from './pages/public/TourDetailsPage'
import COP30Page from './pages/public/COP30Page'
import NotFoundPage from './pages/public/NotFoundPage'

// Auth Pages
import LoginPage from './pages/auth/LoginPage'
import RegisterPage from './pages/auth/RegisterPage'

// Angel Pages
import AngelDashboardPage from './pages/angel/AngelDashboardPage'
import AngelProfilePage from './pages/angel/AngelProfilePage'
import AngelToursPage from './pages/angel/AngelToursPage'
import AngelTourDetailsPage from './pages/angel/AngelTourDetailsPage'
import AngelCreateTourPage from './pages/angel/AngelCreateTourPage'
import AngelEditTourPage from './pages/angel/AngelEditTourPage'
import AngelVisitorsPage from './pages/angel/AngelVisitorsPage'
import AngelMessagesPage from './pages/angel/AngelMessagesPage'
import AngelInsightsPage from './pages/angel/AngelInsightsPage'

// Visitor Pages
import VisitorDashboardPage from './pages/visitor/VisitorDashboardPage'
import VisitorProfilePage from './pages/visitor/VisitorProfilePage'
import VisitorAvailableToursPage from './pages/visitor/VisitorAvailableToursPage'
import VisitorTourDetailsPage from './pages/visitor/VisitorTourDetailsPage'
import VisitorMessagesPage from './pages/visitor/VisitorMessagesPage'
import VisitorNotificationsPage from './pages/visitor/VisitorNotificationsPage' // Adicione esta linha

// Guards
import AuthGuard from './components/guards/AuthGuard'
import AngelGuard from './components/guards/AngelGuard'
import VisitorGuard from './components/guards/VisitorGuard'

function App() {
  const { loading } = useAuth()

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center vh-100">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Carregando...</span>
        </div>
      </div>
    )
  }

  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<MainLayout />}>
        <Route index element={<HomePage />} />
        <Route path="about" element={<AboutPage />} />
        <Route path="emergency" element={<EmergencyPage />} />
        <Route path="map" element={<MapPage />} />
        <Route path="sac" element={<SacPage />} />
        <Route path="cop30" element={<COP30Page />} />
        <Route path="tour/search" element={<TourSearchPage />} />
        <Route path="tour/details/:id" element={<TourDetailsPage />} />
      </Route>

      {/* Auth Routes */}
      <Route path="/auth" element={<AuthLayout />}>
        <Route path="login" element={<LoginPage />} />
        <Route path="register" element={<RegisterPage />} />
      </Route>

      {/* Angel Routes */}
      <Route
        path="/angel"
        element={
          <AuthGuard>
            <AngelGuard>
              <AngelLayout />
            </AngelGuard>
          </AuthGuard>
        }
      >
        <Route path="dashboard" element={<AngelDashboardPage />} />
        <Route path="profile" element={<AngelProfilePage />} />
        <Route path="tours" element={<AngelToursPage />} />
        <Route path="tour/:id" element={<AngelTourDetailsPage />} />
        <Route path="create-tour" element={<AngelCreateTourPage />} />
        <Route path="edit-tour/:id" element={<AngelEditTourPage />} />
        <Route path="visitors" element={<AngelVisitorsPage />} />
        <Route path="messages" element={<AngelMessagesPage />} />
        <Route path="insights" element={<AngelInsightsPage />} />
      </Route>

      {/* Visitor Routes */}
      <Route
        path="/visitor"
        element={
          <AuthGuard>
            <VisitorGuard>
              <VisitorLayout />
            </VisitorGuard>
          </AuthGuard>
        }
      >
        <Route path="dashboard" element={<VisitorDashboardPage />} />
        <Route path="profile" element={<VisitorProfilePage />} />
        <Route path="available-tours" element={<VisitorAvailableToursPage />} />
        <Route path="tour/:id" element={<VisitorTourDetailsPage />} />
        <Route path="messages" element={<VisitorMessagesPage />} />
        <Route path="notifications" element={<VisitorNotificationsPage />} />
      </Route>

      {/* 404 Not Found */}
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  )
}

export default App