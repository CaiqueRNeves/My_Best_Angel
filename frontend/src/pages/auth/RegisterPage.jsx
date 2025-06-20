import { useState, useEffect } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { Form, Button, Alert, Spinner } from 'react-bootstrap'
import { useAuth } from '../../context/AuthContext'
import api from '../../services/api'

const RegisterPage = () => {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const { register } = useAuth()

  const [userType, setUserType] = useState(searchParams.get('type') || 'visitor')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [availableAngels, setAvailableAngels] = useState([])

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
    // Campos específicos do Angel
    bio: '',
    languages: '',
    specialty: '',
    // Campos específicos do Visitor
    angelId: '',
    nationality: '',
    languagePreference: ''
  })

  // Buscar angels disponíveis quando userType for visitor
  useEffect(() => {
    if (userType === 'visitor') {
      fetchAvailableAngels()
    }
  }, [userType])

  const fetchAvailableAngels = async () => {
    try {
      const response = await api.get('/auth/available-angels')
      setAvailableAngels(response.data || [])
    } catch (error) {
      console.error('Erro ao buscar guias disponíveis:', error)
    }
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleUserTypeChange = (type) => {
    setUserType(type)
    // Limpar campos específicos quando trocar tipo
    setFormData(prev => ({
      ...prev,
      bio: '',
      languages: '',
      specialty: '',
      angelId: '',
      nationality: '',
      languagePreference: ''
    }))
  }

  const validateForm = () => {
    if (!formData.name || formData.name.length < 3) {
      return 'Nome deve ter pelo menos 3 caracteres'
    }
    if (!formData.email || !/\S+@\S+\.\S+/.test(formData.email)) {
      return 'Email inválido'
    }
    if (!formData.password || formData.password.length < 6) {
      return 'Senha deve ter pelo menos 6 caracteres'
    }
    if (formData.password !== formData.confirmPassword) {
      return 'As senhas não coincidem'
    }
    if (!formData.phone) {
      return 'Telefone é obrigatório'
    }
    if (userType === 'visitor' && !formData.angelId) {
      return 'Você deve selecionar um guia turístico'
    }
    return null
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    const validationError = validateForm()
    if (validationError) {
      setError(validationError)
      setLoading(false)
      return
    }

    try {
      const result = await register(formData, userType)
      
      if (result.success) {
        // Redirecionar para o dashboard apropriado
        if (result.userType === 'angel') {
          navigate('/angel/dashboard')
        } else {
          navigate('/visitor/dashboard')
        }
      } else {
        setError(result.message || 'Erro ao criar conta')
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
        <h2 className="fw-bold text-dark">Criar sua conta</h2>
        <p className="text-muted">
          Junte-se à plataforma e descubra Belém durante a COP30
        </p>
      </div>

      {error && (
        <Alert variant="danger" className="mb-4">
          <i className="fas fa-exclamation-triangle me-2"></i>
          {error}
        </Alert>
      )}

      <Form onSubmit={handleSubmit}>
        {/* Seleção do Tipo de Usuário */}
        <Form.Group className="mb-4">
          <Form.Label className="fw-semibold">Eu sou:</Form.Label>
          <div className="row g-2">
            <div className="col-6">
              <div 
                className={`p-3 border rounded text-center cursor-pointer user-type-option ${
                  userType === 'visitor' ? 'selected' : ''
                }`}
                onClick={() => handleUserTypeChange('visitor')}
              >
                <i className="fas fa-user-friends text-primary fs-4 mb-2 d-block"></i>
                <strong>Visitante</strong>
                <small className="d-block text-muted">
                  Quero conhecer Belém
                </small>
              </div>
            </div>
            <div className="col-6">
              <div 
                className={`p-3 border rounded text-center cursor-pointer user-type-option ${
                  userType === 'angel' ? 'selected' : ''
                }`}
                onClick={() => handleUserTypeChange('angel')}
              >
                <i className="fas fa-route text-success fs-4 mb-2 d-block"></i>
                <strong>Guia Turístico</strong>
                <small className="d-block text-muted">
                  Sou guia em Belém
                </small>
              </div>
            </div>
          </div>
        </Form.Group>

        {/* Campos Comuns */}
        <div className="row g-3 mb-3">
          <div className="col-12">
            <Form.Group>
              <Form.Label className="fw-semibold">
                <i className="fas fa-user me-2"></i>
                Nome Completo
              </Form.Label>
              <Form.Control
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Digite seu nome completo"
                required
              />
            </Form.Group>
          </div>
          
          <div className="col-md-6">
            <Form.Group>
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
              />
            </Form.Group>
          </div>
          
          <div className="col-md-6">
            <Form.Group>
              <Form.Label className="fw-semibold">
                <i className="fas fa-phone me-2"></i>
                Telefone
              </Form.Label>
              <Form.Control
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="(91) 99999-9999"
                required
              />
            </Form.Group>
          </div>
        </div>

        <div className="row g-3 mb-4">
          <div className="col-md-6">
            <Form.Group>
              <Form.Label className="fw-semibold">
                <i className="fas fa-lock me-2"></i>
                Senha
              </Form.Label>
              <Form.Control
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Mínimo 6 caracteres"
                required
              />
            </Form.Group>
          </div>
          
          <div className="col-md-6">
            <Form.Group>
              <Form.Label className="fw-semibold">
                <i className="fas fa-lock me-2"></i>
                Confirmar Senha
              </Form.Label>
              <Form.Control
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="Digite a senha novamente"
                required
              />
            </Form.Group>
          </div>
        </div>

        {/* Campos Específicos do Angel */}
        {userType === 'angel' && (
          <>
            <div className="mb-3">
              <Form.Group>
                <Form.Label className="fw-semibold">
                  <i className="fas fa-star me-2"></i>
                  Especialidade
                </Form.Label>
                <Form.Select
                  name="specialty"
                  value={formData.specialty}
                  onChange={handleChange}
                >
                  <option value="">Selecione sua especialidade</option>
                  <option value="Gastronomia e Cultura">Gastronomia e Cultura</option>
                  <option value="História e Patrimônio">História e Patrimônio</option>
                  <option value="Natureza e Ecoturismo">Natureza e Ecoturismo</option>
                  <option value="Aventura e Esportes">Aventura e Esportes</option>
                  <option value="Turismo Religioso">Turismo Religioso</option>
                  <option value="Turismo de Negócios">Turismo de Negócios</option>
                </Form.Select>
              </Form.Group>
            </div>

            <div className="mb-3">
              <Form.Group>
                <Form.Label className="fw-semibold">
                  <i className="fas fa-language me-2"></i>
                  Idiomas
                </Form.Label>
                <Form.Control
                  type="text"
                  name="languages"
                  value={formData.languages}
                  onChange={handleChange}
                  placeholder="Ex: Português, Inglês, Espanhol"
                />
              </Form.Group>
            </div>

            <div className="mb-4">
              <Form.Group>
                <Form.Label className="fw-semibold">
                  <i className="fas fa-info-circle me-2"></i>
                  Sobre Você
                </Form.Label>
                <Form.Control
                  as="textarea"
                  rows={3}
                  name="bio"
                  value={formData.bio}
                  onChange={handleChange}
                  placeholder="Conte um pouco sobre sua experiência como guia turístico..."
                />
              </Form.Group>
            </div>
          </>
        )}

        {/* Campos Específicos do Visitor */}
        {userType === 'visitor' && (
          <>
            <div className="mb-3">
              <Form.Group>
                <Form.Label className="fw-semibold">
                  <i className="fas fa-route me-2"></i>
                  Escolha seu Guia Turístico
                </Form.Label>
                <Form.Select
                  name="angelId"
                  value={formData.angelId}
                  onChange={handleChange}
                  required
                >
                  <option value="">Selecione um guia...</option>
                  {availableAngels.map(angel => (
                    <option key={angel.id} value={angel.id}>
                      {angel.name} - {angel.specialty}
                      {angel.rating && ` (${angel.rating}⭐)`}
                    </option>
                  ))}
                </Form.Select>
                <Form.Text className="text-muted">
                  Você pode visualizar os perfis dos guias na página inicial
                </Form.Text>
              </Form.Group>
            </div>

            <div className="row g-3 mb-4">
              <div className="col-md-6">
                <Form.Group>
                  <Form.Label className="fw-semibold">
                    <i className="fas fa-flag me-2"></i>
                    Nacionalidade
                  </Form.Label>
                  <Form.Control
                    type="text"
                    name="nationality"
                    value={formData.nationality}
                    onChange={handleChange}
                    placeholder="Ex: Brasil, Estados Unidos..."
                  />
                </Form.Group>
              </div>
              
              <div className="col-md-6">
                <Form.Group>
                  <Form.Label className="fw-semibold">
                    <i className="fas fa-language me-2"></i>
                    Idioma Preferido
                  </Form.Label>
                  <Form.Select
                    name="languagePreference"
                    value={formData.languagePreference}
                    onChange={handleChange}
                  >
                    <option value="">Selecione...</option>
                    <option value="Português">Português</option>
                    <option value="English">English</option>
                    <option value="Español">Español</option>
                    <option value="Français">Français</option>
                  </Form.Select>
                </Form.Group>
              </div>
            </div>
          </>
        )}

        {/* Botão de Cadastro */}
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
              Criando conta...
            </>
          ) : (
            <>
              <i className="fas fa-user-plus me-2"></i>
              Criar Conta
            </>
          )}
        </Button>

        {/* Link para Login */}
        <div className="text-center">
          <p className="text-muted mb-0">
            Já tem uma conta?{' '}
            <Link 
              to="/auth/login" 
              className="text-primary fw-semibold text-decoration-none"
            >
              Faça login aqui
            </Link>
          </p>
        </div>
      </Form>

      <style jsx>{`
        .cursor-pointer {
          cursor: pointer;
        }
        
        .user-type-option {
          transition: all 0.2s ease;
        }
        
        .user-type-option:hover {
          border-color: var(--bs-primary) !important;
          transform: translateY(-2px);
          box-shadow: 0 4px 8px rgba(0,0,0,0.1);
        }
        
        .user-type-option.selected {
          border-color: var(--bs-primary) !important;
          background-color: rgba(var(--bs-primary-rgb), 0.1);
        }
      `}</style>
    </>
  )
}

export default RegisterPage