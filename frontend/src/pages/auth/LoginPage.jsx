import { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { Form, Button, Alert, Spinner } from 'react-bootstrap'
import { useAuth } from '../../context/AuthContext'

const LoginPage = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const { login } = useAuth()

  const [formData, setFormData] = useState({
    email: '',
    password: '',
    userType: 'visitor'
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  // URL para redirecionamento após login
  const from = location.state?.from?.pathname || '/'

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const result = await login(formData.email, formData.password, formData.userType)
      
      if (result.success) {
        // Redirecionar para o dashboard apropriado ou página anterior
        if (result.userType === 'angel') {
          navigate('/angel/dashboard')
        } else if (result.userType === 'visitor') {
          navigate('/visitor/dashboard')
        } else {
          navigate(from, { replace: true })
        }
      } else {
        setError(result.message || 'Erro ao fazer login')
      }
    } catch (err) {
      setError('Erro inesperado. Tente novamente.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <div className="text-center mb-4">
        <h2 className="fw-bold text-dark">Entrar na sua conta</h2>
        <p className="text-muted">
          Entre para acessar seu dashboard e gerenciar seus tours
        </p>
      </div>

      {error && (
        <Alert variant="danger" className="mb-4">
          <i className="fas fa-exclamation-triangle me-2"></i>
          {error}
        </Alert>
      )}

      <Form onSubmit={handleSubmit}>
        {/* Tipo de Usuário */}
        <Form.Group className="mb-4">
          <Form.Label className="fw-semibold">Eu sou:</Form.Label>
          <div className="row g-2">
            <div className="col-6">
              <Form.Check
                type="radio"
                name="userType"
                id="visitor"
                value="visitor"
                label={
                  <div className="p-3 border rounded text-center h-100">
                    <i className="fas fa-user-friends text-primary fs-4 mb-2 d-block"></i>
                    <strong>Visitante</strong>
                    <small className="d-block text-muted">
                      Quero conhecer Belém
                    </small>
                  </div>
                }
                checked={formData.userType === 'visitor'}
                onChange={handleChange}
                className="user-type-radio"
              />
            </div>
            <div className="col-6">
              <Form.Check
                type="radio"
                name="userType"
                id="angel"
                value="angel"
                label={
                  <div className="p-3 border rounded text-center h-100">
                    <i className="fas fa-route text-success fs-4 mb-2 d-block"></i>
                    <strong>Guia Turístico</strong>
                    <small className="d-block text-muted">
                      Sou guia em Belém
                    </small>
                  </div>
                }
                checked={formData.userType === 'angel'}
                onChange={handleChange}
                className="user-type-radio"
              />
            </div>
          </div>
        </Form.Group>

        {/* Email */}
        <Form.Group className="mb-3">
          <Form.Label className="fw-semibold">
            <i className="fas fa-envelope me-2"></i>
            Email
          </Form.Label>
          <Form.Control
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Digite seu email"
            required
            size="lg"
          />
        </Form.Group>

        {/* Senha */}
        <Form.Group className="mb-4">
          <Form.Label className="fw-semibold">
            <i className="fas fa-lock me-2"></i>
            Senha
          </Form.Label>
          <Form.Control
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="Digite sua senha"
            required
            size="lg"
          />
        </Form.Group>

        {/* Botão de Login */}
        <Button
          type="submit"
          variant="primary"
          size="lg"
          className="w-100 mb-3"
          disabled={loading}
        >
          {loading ? (
            <>
              <Spinner animation="border" size="sm" className="me-2" />
              Entrando...
            </>
          ) : (
            <>
              <i className="fas fa-sign-in-alt me-2"></i>
              Entrar
            </>
          )}
        </Button>

        {/* Link para Cadastro */}
        <div className="text-center">
          <p className="text-muted mb-0">
            Não tem uma conta?{' '}
            <Link 
              to="/auth/register" 
              className="text-primary fw-semibold text-decoration-none"
            >
              Cadastre-se aqui
            </Link>
          </p>
        </div>
      </Form>

      {/* Contas Demo */}
      <div className="mt-4 p-3 bg-light rounded">
        <h6 className="fw-bold mb-3 text-center">
          <i className="fas fa-info-circle me-2"></i>
          Contas de Demonstração
        </h6>
        <div className="row g-2">
          <div className="col-6">
            <div className="small">
              <strong>Guia:</strong><br />
              guia@mybestangel.com<br />
              admin123
            </div>
          </div>
          <div className="col-6">
            <div className="small">
              <strong>Visitante:</strong><br />
              visitante@mybestangel.com<br />
              visitor123
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .user-type-radio input[type="radio"] {
          display: none;
        }
        
        .user-type-radio input[type="radio"]:checked + label {
          border-color: var(--bs-primary) !important;
          background-color: rgba(var(--bs-primary-rgb), 0.1);
        }
        
        .user-type-radio label {
          cursor: pointer;
          transition: all 0.2s ease;
        }
        
        .user-type-radio label:hover {
          border-color: var(--bs-primary) !important;
          transform: translateY(-2px);
          box-shadow: 0 4px 8px rgba(0,0,0,0.1);
        }
      `}</style>
    </>
  )
}

export default LoginPage