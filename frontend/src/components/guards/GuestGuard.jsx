import { useAuth } from '../../context/AuthContext'
import { Navigate } from 'react-router-dom'

const GuestGuard = ({ children }) => {
  const { isAuthenticated, isAngel, isVisitor, loading } = useAuth()

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center vh-100">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Carregando...</span>
        </div>
      </div>
    )
  }

  if (isAuthenticated()) {
    if (isAngel()) {
      return <Navigate to="/angel/dashboard" replace />
    }
    if (isVisitor()) {
      return <Navigate to="/visitor/dashboard" replace />
    }
  }

  return children
}

export default GuestGuard