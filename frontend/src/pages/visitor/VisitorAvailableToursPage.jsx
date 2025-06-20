import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../services/api';
import VisitorTourCard from '../../components/visitor/VisitorTourCard';

const VisitorAvailableToursPage = () => {
  const [tours, setTours] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState('date');
  
  useEffect(() => {
    const fetchTours = async () => {
      try {
        const response = await api.get('/visitor/available-tours');
        setTours(response.data.data || []);
        setLoading(false);
      } catch (error) {
        console.error('Erro ao carregar tours:', error);
        setError('Não foi possível carregar os tours disponíveis. Tente novamente mais tarde.');
        setLoading(false);
      }
    };
    
    fetchTours();
  }, []);
  
  const handleSearchChange = (e) => {
    setSearch(e.target.value);
  };
  
  const handleSortChange = (e) => {
    setSortBy(e.target.value);
  };
  
  // Filter and sort tours
  const filteredAndSortedTours = () => {
    let result = [...tours];
    
    // Apply search filter
    if (search) {
      const searchLower = search.toLowerCase();
      result = result.filter(
        tour => tour.title.toLowerCase().includes(searchLower) || 
               tour.location.toLowerCase().includes(searchLower)
      );
    }
    
    // Apply sorting
    switch (sortBy) {
      case 'price_low':
        return result.sort((a, b) => (a.price || 0) - (b.price || 0));
      case 'price_high':
        return result.sort((a, b) => (b.price || 0) - (a.price || 0));
      case 'duration':
        return result.sort((a, b) => (a.duration || 0) - (b.duration || 0));
      case 'date':
      default:
        return result.sort((a, b) => new Date(a.date) - new Date(b.date));
    }
  };
  
  if (loading) {
    return (
      <div className="text-center my-5">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Carregando...</span>
        </div>
        <p className="mt-2">Carregando tours disponíveis...</p>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="container py-5">
        <div className="alert alert-danger" role="alert">
          <h4 className="alert-heading">Erro!</h4>
          <p>{error}</p>
          <hr />
          <button 
            className="btn btn-outline-danger"
            onClick={() => window.location.reload()}
          >
            <i className="fas fa-sync-alt me-2"></i>
            Tentar Novamente
          </button>
        </div>
      </div>
    );
  }
  
  return (
    <div className="container py-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1 className="h3 mb-0">Tours Disponíveis</h1>
      </div>
      
      {/* Angel Info */}
      <div className="card border-0 shadow-sm mb-4">
        <div className="card-body">
          <div className="row align-items-center">
            <div className="col-md-1 text-center mb-3 mb-md-0">
              <div 
                className="rounded-circle bg-primary bg-opacity-10 d-inline-flex justify-content-center align-items-center"
                style={{ width: 60, height: 60 }}
              >
                <i className="fas fa-user-tie fa-2x text-primary"></i>
              </div>
            </div>
            <div className="col-md-8 mb-3 mb-md-0">
              <h5 className="card-title mb-0">Seu Angel</h5>
              <div className="d-flex align-items-center mt-1">
                <h4 className="mb-0 me-2">{tours[0]?.angel_name || 'Seu Guia'}</h4>
                <div className="text-warning">
                  <i className="fas fa-star"></i>
                  <i className="fas fa-star"></i>
                  <i className="fas fa-star"></i>
                  <i className="fas fa-star"></i>
                  <i className="fas fa-star-half-alt"></i>
                </div>
              </div>
              <p className="text-muted mb-0 mt-1">
                Estes são os tours oferecidos pelo seu Angel. Escolha os que mais lhe interessam!
              </p>
            </div>
            <div className="col-md-3 text-md-end">
              <Link to="/visitor/messages" className="btn btn-outline-primary">
                <i className="fas fa-envelope me-2"></i>
                Enviar Mensagem
              </Link>
            </div>
          </div>
        </div>
      </div>
      
      {/* Filters */}
      <div className="card border-0 shadow-sm mb-4">
        <div className="card-body">
          <div className="row g-3">
            <div className="col-md-6">
              <div className="input-group">
                <span className="input-group-text">
                  <i className="fas fa-search"></i>
                </span>
                <input 
                  type="text" 
                  className="form-control" 
                  placeholder="Buscar por título ou local..." 
                  value={search}
                  onChange={handleSearchChange}
                />
              </div>
            </div>
            <div className="col-md-6">
              <div className="input-group">
                <span className="input-group-text">
                  <i className="fas fa-sort"></i>
                </span>
                <select 
                  className="form-select"
                  value={sortBy}
                  onChange={handleSortChange}
                >
                  <option value="date">Data (mais próxima)</option>
                  <option value="price_low">Preço (menor primeiro)</option>
                  <option value="price_high">Preço (maior primeiro)</option>
                  <option value="duration">Duração (menor primeiro)</option>
                </select>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Tour Listing */}
      {filteredAndSortedTours().length > 0 ? (
        <div className="row g-4">
          {filteredAndSortedTours().map(tour => (
            <div className="col-md-6 col-lg-4" key={tour.id}>
              <VisitorTourCard tour={tour} />
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center p-5 bg-light rounded">
          <i className="fas fa-calendar-times fa-3x mb-3 text-muted"></i>
          <h3>Nenhum tour disponível</h3>
          <p className="mb-0">
            {search ? 'Nenhum tour corresponde à sua busca.' : 'Seu Angel ainda não cadastrou tours.'}
          </p>
        </div>
      )}
      
      {/* Tips */}
      <div className="card border-0 shadow-sm mt-4">
        <div className="card-body">
          <h5 className="card-title">
            <i className="fas fa-lightbulb me-2 text-warning"></i>
            Dicas para Explorar Belém
          </h5>
          <div className="row g-3 mt-2">
            <div className="col-md-4">
              <div className="d-flex">
                <div className="tip-icon me-3">
                  <i className="fas fa-map"></i>
                </div>
                <div>
                  <h6>Planeje Seus Passeios</h6>
                  <p className="small text-muted mb-0">
                    Reserve seus tours com antecedência para garantir sua vaga.
                  </p>
                </div>
              </div>
            </div>
            <div className="col-md-4">
              <div className="d-flex">
                <div className="tip-icon me-3">
                  <i className="fas fa-tint"></i>
                </div>
                <div>
                  <h6>Clima Tropical</h6>
                  <p className="small text-muted mb-0">
                    Belém é quente e úmida. Leve roupas leves e se hidrate sempre.
                  </p>
                </div>
              </div>
            </div>
            <div className="col-md-4">
              <div className="d-flex">
                <div className="tip-icon me-3">
                  <i className="fas fa-utensils"></i>
                </div>
                <div>
                  <h6>Gastronomia Local</h6>
                  <p className="small text-muted mb-0">
                    Experimente a culinária paraense, uma das mais ricas do Brasil.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <style jsx>{`
        .tip-icon {
          width: 40px;
          height: 40px;
          background-color: rgba(22, 160, 133, 0.1);
          color: var(--primary-color);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
        }
      `}</style>
    </div>
  );
};

export default VisitorAvailableToursPage;