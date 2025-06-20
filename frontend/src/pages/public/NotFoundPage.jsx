import { Link } from 'react-router-dom';

const NotFoundPage = () => {
  return (
    <div className="container">
      <div className="row justify-content-center py-5">
        <div className="col-lg-8 text-center">
          <div className="mb-4">
            <img src="/images/404.svg" alt="Página não encontrada" className="img-fluid" style={{ maxHeight: '300px' }} />
          </div>
          
          <h1 className="display-4 mb-4">Oops! Página não encontrada</h1>
          
          <p className="lead mb-5">
            A página que você está procurando não existe ou foi movida para outro lugar.
          </p>
          
          <div className="d-flex justify-content-center gap-3">
            <Link to="/" className="btn btn-primary btn-lg">
              <i className="fas fa-home me-2"></i>
              Voltar para Home
            </Link>
            
            <Link to="/tour/search" className="btn btn-outline-primary btn-lg">
              <i className="fas fa-search me-2"></i>
              Explorar Tours
            </Link>
          </div>
          
          <div className="mt-5">
            <h5>Aqui estão algumas páginas populares:</h5>
            <ul className="list-inline">
              <li className="list-inline-item">
                <Link to="/" className="text-decoration-none">Home</Link>
              </li>
              <li className="list-inline-item">•</li>
              <li className="list-inline-item">
                <Link to="/tour/search" className="text-decoration-none">Tours</Link>
              </li>
              <li className="list-inline-item">•</li>
              <li className="list-inline-item">
                <Link to="/about" className="text-decoration-none">Sobre</Link>
              </li>
              <li className="list-inline-item">•</li>
              <li className="list-inline-item">
                <Link to="/cop30" className="text-decoration-none">COP30</Link>
              </li>
              <li className="list-inline-item">•</li>
              <li className="list-inline-item">
                <Link to="/auth/login" className="text-decoration-none">Login</Link>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotFoundPage;