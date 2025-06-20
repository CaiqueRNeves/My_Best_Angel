// src/components/layouts/MainLayout.jsx
import { Outlet, Link } from 'react-router-dom'
import { Container, Navbar, Nav, NavDropdown } from 'react-bootstrap'
import { useAuth } from '../../context/AuthContext'

const MainLayout = () => {
  const { user, isAuthenticated, isAngel, isVisitor, logout } = useAuth()

  const handleLogout = () => {
    logout()
  }

  return (
    <div className="min-vh-100 bg-light">
      {/* Header */}
      <Navbar bg="white" expand="lg" className="shadow-sm sticky-top">
        <Container>
          <Navbar.Brand as={Link} to="/" className="fw-bold text-primary">
            <i className="fas fa-route me-2"></i>
            MyBestAngel
          </Navbar.Brand>
          
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="me-auto">
              <Nav.Link as={Link} to="/">
                <i className="fas fa-home me-1"></i>
                Início
              </Nav.Link>
              <Nav.Link as={Link} to="/tour/search">
                <i className="fas fa-search me-1"></i>
                Tours
              </Nav.Link>
              <Nav.Link as={Link} to="/about">
                <i className="fas fa-info-circle me-1"></i>
                Sobre
              </Nav.Link>
              <Nav.Link as={Link} to="/cop30">
                <i className="fas fa-globe-americas me-1"></i>
                COP30
              </Nav.Link>
              <Nav.Link as={Link} to="/map">
                <i className="fas fa-map-marked-alt me-1"></i>
                Mapa
              </Nav.Link>
            </Nav>
            
            <Nav>
              {isAuthenticated() ? (
                <NavDropdown 
                  title={
                    <span>
                      <i className="fas fa-user me-1"></i>
                      {user?.name || 'Usuário'}
                    </span>
                  } 
                  id="user-dropdown"
                >
                  <NavDropdown.Item 
                    as={Link} 
                    to={isAngel() ? "/angel/dashboard" : "/visitor/dashboard"}
                  >
                    <i className="fas fa-tachometer-alt me-2"></i>
                    Dashboard
                  </NavDropdown.Item>
                  <NavDropdown.Item 
                    as={Link} 
                    to={isAngel() ? "/angel/profile" : "/visitor/profile"}
                  >
                    <i className="fas fa-user-cog me-2"></i>
                    Perfil
                  </NavDropdown.Item>
                  <NavDropdown.Divider />
                  <NavDropdown.Item onClick={handleLogout}>
                    <i className="fas fa-sign-out-alt me-2"></i>
                    Sair
                  </NavDropdown.Item>
                </NavDropdown>
              ) : (
                <>
                  <Nav.Link as={Link} to="/auth/login">
                    <i className="fas fa-sign-in-alt me-1"></i>
                    Entrar
                  </Nav.Link>
                  <Nav.Link as={Link} to="/auth/register" className="btn btn-primary text-white ms-2">
                    <i className="fas fa-user-plus me-1"></i>
                    Cadastrar
                  </Nav.Link>
                </>
              )}
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>

      {/* Main Content */}
      <main>
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="bg-dark text-light py-4 mt-5">
        <Container>
          <div className="row">
            <div className="col-md-6">
              <h5 className="fw-bold">MyBestAngel</h5>
              <p className="mb-0">
                Conectando visitantes a experiências autênticas em Belém durante a COP30.
              </p>
            </div>
            <div className="col-md-6">
              <div className="row">
                <div className="col-6">
                  <h6>Links Úteis</h6>
                  <ul className="list-unstyled">
                    <li><Link to="/emergency" className="text-light">Emergência</Link></li>
                    <li><Link to="/sac" className="text-light">SAC</Link></li>
                    <li><Link to="/about" className="text-light">Sobre</Link></li>
                  </ul>
                </div>
                <div className="col-6">
                  <h6>Suporte</h6>
                  <ul className="list-unstyled">
                    <li><span className="text-light">Tel: (91) 3344-5566</span></li>
                    <li><span className="text-light">Email: suporte@mybestangel.com</span></li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
          <hr className="my-3" />
          <div className="text-center">
            <p className="mb-0">© 2025 MyBestAngel. Todos os direitos reservados.</p>
          </div>
        </Container>
      </footer>
    </div>
  )
}

export default MainLayout