import { Outlet, Link, useLocation } from 'react-router-dom'
import { Container, Navbar, Nav, NavDropdown } from 'react-bootstrap'
import { useAuth } from '../../context/AuthContext'

const VisitorLayout = () => {
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
      <Navbar bg="success" variant="dark" expand="lg" className="shadow-sm">
        <Container>
          <Navbar.Brand as={Link} to="/visitor/dashboard" className="fw-bold">
            <i className="fas fa-route me-2"></i>
            MyBestAngel - Visitor
          </Navbar.Brand>
          
          <Navbar.Toggle aria-controls="visitor-navbar-nav" />
          <Navbar.Collapse id="visitor-navbar-nav">
            <Nav className="me-auto">
              <Nav.Link as={Link} to="/visitor/dashboard" className={isActive('/visitor/dashboard')}>
                <i className="fas fa-tachometer-alt me-1"></i>
                Dashboard
              </Nav.Link>
              <Nav.Link as={Link} to="/visitor/available-tours" className={isActive('/visitor/available-tours')}>
                <i className="fas fa-search me-1"></i>
                Tours Disponíveis
              </Nav.Link>
              <Nav.Link as={Link} to="/visitor/messages" className={isActive('/visitor/messages')}>
                <i className="fas fa-envelope me-1"></i>
                Mensagens
              </Nav.Link>
              <Nav.Link as={Link} to="/visitor/notifications" className={isActive('/visitor/notifications')}>
                <i className="fas fa-bell me-1"></i>
                Notificações
              </Nav.Link>
            </Nav>
            
            <Nav>
              <NavDropdown 
                title={
                  <span className="text-white">
                    <i className="fas fa-user me-1"></i>
                    {user?.name || 'Visitor'}
                  </span>
                } 
                id="visitor-user-dropdown"
              >
                <NavDropdown.Item as={Link} to="/visitor/profile">
                  <i className="fas fa-user-cog me-2"></i>
                  Meu Perfil
                </NavDropdown.Item>
                <NavDropdown.Divider />
                <NavDropdown.Item as={Link} to="/">
                  <i className="fas fa-home me-2"></i>
                  Página Inicial
                </NavDropdown.Item>
                <NavDropdown.Item as={Link} to="/tour/search">
                  <i className="fas fa-search me-2"></i>
                  Buscar Tours
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

export default VisitorLayout