import { useAuth } from '../../context/AuthContext'
import { Navigate } from 'react-router-dom'

const AngelGuard = ({ children }) => {
  const { isAngel, loading } = useAuth()

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center vh-100">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Carregando...</span>
        </div>
      </div>
    )
  }

  if (!isAngel()) {
    return <Navigate to="/visitor/dashboard" replace />
  }

  return children
}

export default AngelGuard