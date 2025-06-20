import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-dark text-light py-5">
      <div className="container">
        <div className="row">
          <div className="col-md-4 mb-4 mb-md-0">
            <h5 className="mb-3">MyBestAngel</h5>
            <p className="mb-3">Seu guia turístico personalizado para conhecer Belém durante a COP30. Conectamos visitantes e guias locais para criar experiências inesquecíveis.</p>
            <div className="social-links">
              <a href="#" className="me-3 text-light"><i className="fab fa-facebook-f"></i></a>
              <a href="#" className="me-3 text-light"><i className="fab fa-instagram"></i></a>
              <a href="#" className="me-3 text-light"><i className="fab fa-twitter"></i></a>
              <a href="#" className="text-light"><i className="fab fa-whatsapp"></i></a>
            </div>
          </div>
          
          <div className="col-md-2 mb-4 mb-md-0">
            <h5 className="mb-3">Navegação</h5>
            <ul className="list-unstyled">
              <li className="mb-2"><Link to="/" className="text-light text-decoration-none">Home</Link></li>
              <li className="mb-2"><Link to="/about" className="text-light text-decoration-none">Sobre</Link></li>
              <li className="mb-2"><Link to="/tour/search" className="text-light text-decoration-none">Passeios</Link></li>
              <li className="mb-2"><Link to="/cop30" className="text-light text-decoration-none">COP30</Link></li>
              <li className="mb-2"><Link to="/map" className="text-light text-decoration-none">Mapa</Link></li>
            </ul>
          </div>
          
          <div className="col-md-3 mb-4 mb-md-0">
            <h5 className="mb-3">Para Guias</h5>
            <ul className="list-unstyled">
              <li className="mb-2"><Link to="/auth/register" className="text-light text-decoration-none">Torne-se um Angel</Link></li>
              <li className="mb-2"><Link to="/angel/dashboard" className="text-light text-decoration-none">Dashboard de Angel</Link></li>
              <li className="mb-2"><Link to="/angel/insights" className="text-light text-decoration-none">Estatísticas</Link></li>
            </ul>
          </div>
          
          <div className="col-md-3">
            <h5 className="mb-3">Contato</h5>
            <p className="mb-2"><i className="fas fa-map-marker-alt me-2"></i> Belém, Pará, Brasil</p>
            <p className="mb-2"><i className="fas fa-phone me-2"></i> (91) 99999-9999</p>
            <p className="mb-2"><i className="fas fa-envelope me-2"></i> contato@mybestangel.com</p>
            <Link to="/sac" className="btn btn-outline-light mt-2">SAC</Link>
          </div>
        </div>
        
        <div className="border-top border-secondary pt-4 mt-4 text-center">
          <p className="mb-0">&copy; {new Date().getFullYear()} MyBestAngel. Todos os direitos reservados.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;