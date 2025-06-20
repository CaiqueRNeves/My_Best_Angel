import { Outlet, Link, useLocation } from 'react-router-dom'
import { Container, Navbar, Nav, NavDropdown } from 'react-bootstrap'
import { useAuth } from '../../context/AuthContext'

const AngelLayout = () => {
  const { user, logout } = useAuth()
  const location = useLocation()

  const handleLogout = () => {
    logout()
  }

  const isActive = (path) => {
    return location.pathname === path ? 'active' : ''
  }

  return (
    <div className="min-vh-100 bg-light">
      {/* Header */}
      <Navbar bg="primary" variant="dark" expand="lg" className="shadow-sm">
        <Container>
          <Navbar.Brand as={Link} to="/angel/dashboard" className="fw-bold">
            <i className="fas fa-route me-2"></i>
            MyBestAngel - Angel
          </Navbar.Brand>
          
          <Navbar.Toggle aria-controls="angel-navbar-nav" />
          <Navbar.Collapse id="angel-navbar-nav">
            <Nav className="me-auto">
              <Nav.Link as={Link} to="/angel/dashboard" className={isActive('/angel/dashboard')}>
                <i className="fas fa-tachometer-alt me-1"></i>
                Dashboard
              </Nav.Link>
              <Nav.Link as={Link} to="/angel/tours" className={isActive('/angel/tours')}>
                <i className="fas fa-map-marked-alt me-1"></i>
                Meus Tours
              </Nav.Link>
              <Nav.Link as={Link} to="/angel/visitors" className={isActive('/angel/visitors')}>
                <i className="fas fa-users me-1"></i>
                Visitantes
              </Nav.Link>
              <Nav.Link as={Link} to="/angel/messages" className={isActive('/angel/messages')}>
                <i className="fas fa-envelope me-1"></i>
                Mensagens
              </Nav.Link>
              <Nav.Link as={Link} to="/angel/insights" className={isActive('/angel/insights')}>
                <i className="fas fa-chart-line me-1"></i>
                Insights
              </Nav.Link>
            </Nav>
            
            <Nav>
              <NavDropdown 
                title={
                  <span className="text-white">
                    <i className="fas fa-user-tie me-1"></i>
                    {user?.name || 'Angel'}
                  </span>
                } 
                id="angel-user-dropdown"
              >
                <NavDropdown.Item as={Link} to="/angel/profile">
                  <i className="fas fa-user-cog me-2"></i>
                  Meu Perfil
                </NavDropdown.Item>
                <NavDropdown.Item as={Link} to="/angel/create-tour">
                  <i className="fas fa-plus-circle me-2"></i>
                  Criar Tour
                </NavDropdown.Item>
                <NavDropdown.Divider />
                <NavDropdown.Item as={Link} to="/">
                  <i className="fas fa-home me-2"></i>
                  Página Inicial
                </NavDropdown.Item>
                <NavDropdown.Divider />
                <NavDropdown.Item onClick={handleLogout}>
                  <i className="fas fa-sign-out-alt me-2"></i>
                  Sair
                </NavDropdown.Item>
              </NavDropdown>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>

      {/* Main Content */}
      <main className="py-4">
        <Container>
          <Outlet />
        </Container>
      </main>
    </div>
  )
}

export default AngelLayout
