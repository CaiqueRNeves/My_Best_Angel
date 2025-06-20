import { useState, useEffect } from 'react'
import { Container, Row, Col, Card, Button, Badge } from 'react-bootstrap'
import { Link } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import api from '../../services/api'

const HomePage = () => {
  const { isAuthenticated, isAngel, isVisitor } = useAuth()
  const [featuredTours, setFeaturedTours] = useState([])
  const [featuredAngels, setFeaturedAngels] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchFeaturedContent()
  }, [])

  const fetchFeaturedContent = async () => {
    try {
      const [toursResponse, angelsResponse] = await Promise.all([
        api.get('/tour/featured'),
        api.get('/auth/available-angels')
      ])
      
      setFeaturedTours(toursResponse.data || [])
      setFeaturedAngels(angelsResponse.data?.slice(0, 4) || [])
    } catch (error) {
      console.error('Erro ao buscar conteúdo em destaque:', error)
    } finally {
      setLoading(false)
    }
  }

  const formatPrice = (price) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(price)
  }

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{height: '400px'}}>
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Carregando...</span>
        </div>
      </div>
    )
  }

  return (
    <>
      {/* Hero Section */}
      <section className="hero-section bg-primary text-white py-5">
        <Container>
          <Row className="align-items-center min-vh-50">
            <Col lg={6}>
              <h1 className="display-4 fw-bold mb-4">
                Descubra Belém com os Melhores Guias Locais
              </h1>
              <p className="lead mb-4">
                Durante a COP30 e além, conecte-se com guias turísticos experientes 
                que conhecem cada canto da nossa bela Belém do Pará.
              </p>
              <div className="d-flex flex-column flex-sm-row gap-3">
                {!isAuthenticated() ? (
                  <>
                    <Button 
                      as={Link} 
                      to="/auth/register?type=visitor" 
                      variant="light" 
                      size="lg"
                      className="fw-semibold"
                    >
                      <i className="fas fa-user-plus me-2"></i>
                      Sou Visitante
                    </Button>
                    <Button 
                      as={Link} 
                      to="/auth/register?type=angel" 
                      variant="outline-light" 
                      size="lg"
                      className="fw-semibold"
                    >
                      <i className="fas fa-route me-2"></i>
                      Sou Guia Turístico
                    </Button>
                  </>
                ) : (
                  <Button 
                    as={Link} 
                    to={isAngel() ? "/angel/dashboard" : "/visitor/dashboard"}
                    variant="light" 
                    size="lg"
                    className="fw-semibold"
                  >
                    <i className="fas fa-tachometer-alt me-2"></i>
                    Acessar Dashboard
                  </Button>
                )}
              </div>
            </Col>
            <Col lg={6} className="text-center">
              <div className="hero-image">
                <i className="fas fa-map-marked-alt" style={{fontSize: '200px', opacity: 0.3}}></i>
              </div>
            </Col>
          </Row>
        </Container>
      </section>

      {/* COP30 Section */}
      <section className="py-5 bg-light">
        <Container>
          <Row className="text-center mb-5">
            <Col>
              <h2 className="fw-bold mb-3">
                <i className="fas fa-leaf text-success me-2"></i>
                Preparando Belém para a COP30
              </h2>
              <p className="lead text-muted">
                A maior conferência sobre mudanças climáticas do mundo acontece em Belém. 
                Seja parte dessa experiência histórica!
              </p>
            </Col>
          </Row>
          <Row className="g-4">
            <Col md={4}>
              <Card className="h-100 border-0 shadow-sm">
                <Card.Body className="text-center p-4">
                  <i className="fas fa-globe-americas text-primary fs-1 mb-3"></i>
                  <h5 className="fw-bold">Evento Global</h5>
                  <p className="text-muted">
                    Líderes mundiais se reunirão em Belém para discutir o futuro do planeta.
                  </p>
                </Card.Body>
              </Card>
            </Col>
            <Col md={4}>
              <Card className="h-100 border-0 shadow-sm">
                <Card.Body className="text-center p-4">
                  <i className="fas fa-tree text-success fs-1 mb-3"></i>
                  <h5 className="fw-bold">Coração da Amazônia</h5>
                  <p className="text-muted">
                    Belém é a porta de entrada para a maior floresta tropical do mundo.
                  </p>
                </Card.Body>
              </Card>
            </Col>
            <Col md={4}>
              <Card className="h-100 border-0 shadow-sm">
                <Card.Body className="text-center p-4">
                  <i className="fas fa-users text-warning fs-1 mb-3"></i>
                  <h5 className="fw-bold">Experiência Local</h5>
                  <p className="text-muted">
                    Nossos guias locais oferecerão experiências autênticas e inesquecíveis.
                  </p>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Container>
      </section>

      {/* Tours em Destaque */}
      {featuredTours.length > 0 && (
        <section className="py-5">
          <Container>
            <Row className="mb-5">
              <Col>
                <div className="d-flex justify-content-between align-items-center">
                  <div>
                    <h2 className="fw-bold mb-2">Tours em Destaque</h2>
                    <p className="text-muted mb-0">
                      Descubra os melhores passeios turísticos em Belém
                    </p>
                  </div>
                  <Button 
                    as={Link} 
                    to="/tour/search" 
                    variant="outline-primary"
                  >
                    Ver Todos
                  </Button>
                </div>
              </Col>
            </Row>
            <Row className="g-4">
              {featuredTours.slice(0, 3).map(tour => (
                <Col key={tour.id} lg={4} md={6}>
                  <Card className="h-100 border-0 shadow-sm tour-card">
                    <Card.Body className="p-4">
                      <div className="d-flex justify-content-between align-items-start mb-3">
                        <Badge bg="primary" className="text-white">
                          {tour.angel_name}
                        </Badge>
                        {tour.price > 0 && (
                          <span className="fw-bold text-success">
                            {formatPrice(tour.price)}
                          </span>
                        )}
                      </div>
                      
                      <h5 className="fw-bold mb-2">{tour.title}</h5>
                      <p className="text-muted mb-3" style={{fontSize: '0.9rem'}}>
                        {tour.description?.substring(0, 100)}
                        {tour.description?.length > 100 && '...'}
                      </p>
                      
                      <div className="mb-3">
                        <small className="text-muted">
                          <i className="fas fa-map-marker-alt me-1"></i>
                          {tour.location}
                        </small>
                        <br />
                        <small className="text-muted">
                          <i className="fas fa-calendar me-1"></i>
                          {formatDate(tour.date)}
                        </small>
                        <br />
                        <small className="text-muted">
                          <i className="fas fa-clock me-1"></i>
                          {tour.duration} minutos
                        </small>
                      </div>
                      
                      <div className="d-flex justify-content-between align-items-center">
                        <div>
                          <small className="text-muted">
                            {tour.current_participants}/{tour.max_participants} participantes
                          </small>
                        </div>
                        <Button 
                          as={Link} 
                          to={`/tour/details/${tour.id}`}
                          variant="primary" 
                          size="sm"
                        >
                          Ver Detalhes
                        </Button>
                      </div>
                    </Card.Body>
                  </Card>
                </Col>
              ))}
            </Row>
          </Container>
        </section>
      )}

      {/* Guias em Destaque */}
      {featuredAngels.length > 0 && (
        <section className="py-5 bg-light">
          <Container>
            <Row className="mb-5">
              <Col>
                <div className="text-center">
                  <h2 className="fw-bold mb-2">Nossos Guias Turísticos</h2>
                  <p className="text-muted">
                    Conheça alguns dos melhores guias turísticos de Belém
                  </p>
                </div>
              </Col>
            </Row>
            <Row className="g-4">
              {featuredAngels.map(angel => (
                <Col key={angel.id} lg={3} md={6}>
                  <Card className="h-100 border-0 shadow-sm text-center angel-card">
                    <Card.Body className="p-4">
                      <div className="mb-3">
                        <div 
                          className="rounded-circle bg-primary text-white d-inline-flex align-items-center justify-content-center"
                          style={{width: '80px', height: '80px', fontSize: '2rem'}}
                        >
                          <i className="fas fa-user"></i>
                        </div>
                      </div>
                      
                      <h5 className="fw-bold mb-2">{angel.name}</h5>
                      
                      {angel.specialty && (
                        <Badge bg="secondary" className="mb-3">
                          {angel.specialty}
                        </Badge>
                      )}
                      
                      {angel.bio && (
                        <p className="text-muted mb-3" style={{fontSize: '0.9rem'}}>
                          {angel.bio.substring(0, 80)}
                          {angel.bio.length > 80 && '...'}
                        </p>
                      )}
                      
                      {angel.languages && (
                        <div className="mb-3">
                          <small className="text-muted">
                            <i className="fas fa-language me-1"></i>
                            {angel.languages}
                          </small>
                        </div>
                      )}
                      
                      <div className="d-flex justify-content-center align-items-center">
                        {angel.rating && (
                          <div className="text-warning me-2">
                            {[...Array(5)].map((_, i) => (
                              <i 
                                key={i} 
                                className={
                                  i < Math.floor(angel.rating) 
                                    ? "fas fa-star" 
                                    : "far fa-star"
                                }
                              ></i>
                            ))}
                            <small className="text-muted ms-1">
                              ({angel.reviews_count || 0})
                            </small>
                          </div>
                        )}
                      </div>
                    </Card.Body>
                  </Card>
                </Col>
              ))}
            </Row>
          </Container>
        </section>
      )}

      {/* Call to Action */}
      <section className="py-5 bg-primary text-white">
        <Container>
          <Row className="text-center">
            <Col>
              <h2 className="fw-bold mb-3">Pronto para Começar?</h2>
              <p className="lead mb-4">
                Junte-se à nossa comunidade e descubra o melhor de Belém
              </p>
              {!isAuthenticated() ? (
                <div className="d-flex justify-content-center gap-3">
                  <Button 
                    as={Link} 
                    to="/auth/register?type=visitor" 
                    variant="light" 
                    size="lg"
                  >
                    <i className="fas fa-user-plus me-2"></i>
                    Cadastrar como Visitante
                  </Button>
                  <Button 
                    as={Link} 
                    to="/auth/register?type=angel" 
                    variant="outline-light" 
                    size="lg"
                  >
                    <i className="fas fa-route me-2"></i>
                    Cadastrar como Guia
                  </Button>
                </div>
              ) : (
                <Button 
                  as={Link} 
                  to="/tour/search"
                  variant="light" 
                  size="lg"
                >
                  <i className="fas fa-search me-2"></i>
                  Explorar Tours
                </Button>
              )}
            </Col>
          </Row>
        </Container>
      </section>

      <style jsx>{`
        .min-vh-50 {
          min-height: 50vh;
        }
        
        .tour-card:hover {
          transform: translateY(-5px);
          transition: transform 0.2s ease;
        }
        
        .angel-card:hover {
          transform: translateY(-5px);
          transition: transform 0.2s ease;
        }
        
        .hero-section {
          background: linear-gradient(135deg, var(--bs-primary) 0%, #1abc9c 100%);
        }
      `}</style>
    </>
  )
}

export default HomePage