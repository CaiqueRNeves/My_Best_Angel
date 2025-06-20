// src/components/layouts/AuthLayout.jsx
import { Outlet, Link } from 'react-router-dom'
import { Container, Row, Col } from 'react-bootstrap'
import GuestGuard from '../guards/GuestGuard'

const AuthLayout = () => {
  return (
    <GuestGuard>
      <div className="min-vh-100 bg-light">
        {/* Header */}
        <nav className="navbar navbar-expand-lg navbar-light bg-white shadow-sm">
          <Container>
            <Link className="navbar-brand fw-bold text-primary" to="/">
              <i className="fas fa-route me-2"></i>
              MyBestAngel
            </Link>
            
            <div className="navbar-nav ms-auto">
              <Link className="nav-link" to="/">
                <i className="fas fa-home me-1"></i>
                Voltar ao Início
              </Link>
            </div>
          </Container>
        </nav>

        {/* Main Content */}
        <Container className="py-5">
          <Row className="justify-content-center">
            <Col lg={6} xl={5}>
              <div className="text-center mb-4">
                <div className="mb-4">
                  <i className="fas fa-route fa-4x text-primary mb-3"></i>
                  <h1 className="h2 fw-bold text-dark">MyBestAngel</h1>
                  <p className="text-muted">
                    Conectando visitantes a experiências autênticas em Belém
                  </p>
                </div>
              </div>
              
              <div className="card shadow border-0">
                <div className="card-body p-4 p-md-5">
                  <Outlet />
                </div>
              </div>
              
              <div className="text-center mt-4">
                <p className="text-muted small">
                  © 2025 MyBestAngel. Todos os direitos reservados.
                </p>
              </div>
            </Col>
          </Row>
        </Container>
      </div>
    </GuestGuard>
  )
}

export default AuthLayout