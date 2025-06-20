import { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import api from '../../services/api';

const TourSearchPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [tours, setTours] = useState([]);
  const [locations, setLocations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    search: searchParams.get('search') || '',
    location: searchParams.get('location') || '',
    date: searchParams.get('date') || '',
    minPrice: '',
    maxPrice: '',
    sortBy: 'date'
  });
  
  useEffect(() => {
    const fetchTours = async () => {
      try {
        // Prepare query parameters
        const params = new URLSearchParams();
        if (filters.search) params.append('search', filters.search);
        if (filters.location) params.append('location', filters.location);
        if (filters.date) params.append('date', filters.date);
        
        const response = await api.get(`/tour/search?${params.toString()}`);
        
        setTours(response.data.data.tours || []);
        setLocations(response.data.data.locations || []);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching tours:', error);
        setLoading(false);
      }
    };
    
    fetchTours();
  }, [filters.search, filters.location, filters.date]);
  
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    
    setFilters({
      ...filters,
      [name]: value
    });
    
    // Update URL params for main filters
    if (['search', 'location', 'date'].includes(name)) {
      const newSearchParams = new URLSearchParams(searchParams);
      
      if (value) {
        newSearchParams.set(name, value);
      } else {
        newSearchParams.delete(name);
      }
      
      setSearchParams(newSearchParams);
    }
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    // The search is already triggered by the useEffect when filters change
  };
  
  const filteredAndSortedTours = () => {
    // Filter by price if set
    let result = [...tours];
    
    if (filters.minPrice) {
      result = result.filter(tour => tour.price >= parseFloat(filters.minPrice));
    }
    
    if (filters.maxPrice) {
      result = result.filter(tour => tour.price <= parseFloat(filters.maxPrice));
    }
    
    // Sort
    switch (filters.sortBy) {
      case 'price_low':
        return result.sort((a, b) => (a.price || 0) - (b.price || 0));
      case 'price_high':
        return result.sort((a, b) => (b.price || 0) - (a.price || 0));
      case 'rating':
        return result.sort((a, b) => (b.angel_rating || 5) - (a.angel_rating || 5));
      case 'date':
      default:
        return result.sort((a, b) => new Date(a.date) - new Date(b.date));
    }
  };
  
  return (
    <>
      {/* Banner with Search */}
      <div className="search-banner py-5">
        <div className="container">
          <div className="row">
            <div className="col-lg-10 mx-auto">
              <h1 className="text-center text-white mb-4">Encontre Tours em Belém</h1>
              
              <div className="card border-0 shadow-lg">
                <div className="card-body p-4">
                  <form onSubmit={handleSubmit}>
                    <div className="row g-3">
                      <div className="col-md-4">
                        <div className="form-floating">
                          <input
                            type="text"
                            className="form-control"
                            id="search"
                            name="search"
                            placeholder="Buscar tours..."
                            value={filters.search}
                            onChange={handleInputChange}
                          />
                          <label htmlFor="search">Buscar</label>
                        </div>
                      </div>
                      
                      <div className="col-md-4">
                        <div className="form-floating">
                          <select
                            className="form-select"
                            id="location"
                            name="location"
                            value={filters.location}
                            onChange={handleInputChange}
                          >
                            <option value="">Todos os locais</option>
                            {locations.map((location, index) => (
                              <option key={index} value={location}>
                                {location}
                              </option>
                            ))}
                          </select>
                          <label htmlFor="location">Local</label>
                        </div>
                      </div>
                      
                      <div className="col-md-4">
                        <div className="form-floating">
                          <input
                            type="date"
                            className="form-control"
                            id="date"
                            name="date"
                            value={filters.date}
                            onChange={handleInputChange}
                          />
                          <label htmlFor="date">Data</label>
                        </div>
                      </div>
                      
                      <div className="col-12 text-center">
                        <button type="submit" className="btn btn-primary px-5">
                          <i className="fas fa-search me-2"></i>
                          Buscar Tours
                        </button>
                      </div>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Search Results */}
      <section className="py-5">
        <div className="container">
          <div className="row">
            {/* Filters Sidebar */}
            <div className="col-lg-3 mb-4 mb-lg-0">
              <div className="card border-0 shadow-sm sticky-lg-top" style={{ top: '2rem' }}>
                <div className="card-body">
                  <h5 className="card-title mb-4">Filtros</h5>
                  
                  <div className="mb-4">
                    <label className="form-label fw-bold">Preço</label>
                    <div className="row g-2">
                      <div className="col-6">
                        <div className="input-group">
                          <span className="input-group-text">R$</span>
                          <input
                            type="number"
                            className="form-control"
                            placeholder="Min"
                            name="minPrice"
                            value={filters.minPrice}
                            onChange={handleInputChange}
                          />
                        </div>
                      </div>
                      <div className="col-6">
                        <div className="input-group">
                          <span className="input-group-text">R$</span>
                          <input
                            type="number"
                            className="form-control"
                            placeholder="Max"
                            name="maxPrice"
                            value={filters.maxPrice}
                            onChange={handleInputChange}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="mb-4">
                    <label className="form-label fw-bold">Ordenar por</label>
                    <select
                      className="form-select"
                      name="sortBy"
                      value={filters.sortBy}
                      onChange={handleInputChange}
                    >
                      <option value="date">Data (mais próxima)</option>
                      <option value="price_low">Preço (menor primeiro)</option>
                      <option value="price_high">Preço (maior primeiro)</option>
                      <option value="rating">Avaliação (melhor primeiro)</option>
                    </select>
                  </div>
                  
                  <div className="d-grid">
                    <button
                      className="btn btn-outline-secondary"
                      onClick={() => {
                        setFilters({
                          search: '',
                          location: '',
                          date: '',
                          minPrice: '',
                          maxPrice: '',
                          sortBy: 'date'
                        });
                        setSearchParams({});
                      }}
                    >
                      <i className="fas fa-times me-2"></i>
                      Limpar Filtros
                    </button>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Search Results */}
            <div className="col-lg-9">
              <div className="d-flex justify-content-between align-items-center mb-4">
                <h2 className="h4 mb-0">
                  {loading ? (
                    'Buscando tours...'
                  ) : tours.length > 0 ? (
                    `${tours.length} ${tours.length === 1 ? 'tour encontrado' : 'tours encontrados'}`
                  ) : (
                    'Nenhum tour encontrado'
                  )}
                </h2>
                <div className="text-muted small">
                  {filters.search && <span className="badge bg-light text-dark me-2">Busca: {filters.search}</span>}
                  {filters.location && <span className="badge bg-light text-dark me-2">Local: {filters.location}</span>}
                  {filters.date && <span className="badge bg-light text-dark me-2">Data: {filters.date}</span>}
                </div>
              </div>
              
              {loading ? (
                <div className="text-center py-5">
                  <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Carregando...</span>
                  </div>
                  <p className="mt-2">Buscando tours disponíveis...</p>
                </div>
              ) : filteredAndSortedTours().length > 0 ? (
                <div className="row g-4">
                  {filteredAndSortedTours().map(tour => (
                    <div className="col-md-6 col-lg-4" key={tour.id}>
                      <div className="card h-100 border-0 shadow-sm tour-card">
                        <div className="position-relative">
                          {tour.image ? (
                            <img 
                              src={tour.image} 
                              className="card-img-top" 
                              alt={tour.title}
                              style={{ height: '180px', objectFit: 'cover' }}
                            />
                          ) : (
                            <div 
                              className="bg-light d-flex justify-content-center align-items-center"
                              style={{ height: '180px' }}
                            >
                              <i className="fas fa-map-marked-alt fa-3x text-secondary"></i>
                            </div>
                          )}
                          
                          <div className="tour-price">
                            {tour.price ? `R$ ${tour.price.toFixed(2)}` : 'Gratuito'}
                          </div>
                        </div>
                        
                        <div className="card-body">
                          <h5 className="card-title">{tour.title}</h5>
                          <p className="card-text text-muted mb-1">
                            <i className="fas fa-map-marker-alt me-1"></i> {tour.location}
                          </p>
                          <p className="card-text mb-2">
                            <i className="far fa-calendar-alt me-1"></i> {new Date(tour.date).toLocaleDateString('pt-BR')}
                          </p>
                          
                          <div className="d-flex justify-content-between align-items-center mb-2">
                            <div className="d-flex align-items-center">
                              <div 
                                className="rounded-circle bg-light d-flex justify-content-center align-items-center me-2"
                                style={{ width: 30, height: 30 }}
                              >
                                <i className="fas fa-user text-primary"></i>
                              </div>
                              <span className="small text-muted">{tour.angel_name}</span>
                            </div>
                            <div>
                              <i className="fas fa-star text-warning me-1"></i>
                              <span>{tour.angel_rating || '5.0'}</span>
                            </div>
                          </div>
                          
                          <div className="d-flex justify-content-between align-items-center">
                            <span className="badge bg-light text-dark">
                              <i className="fas fa-users me-1"></i> 
                              {tour.current_participants}/{tour.max_participants} vagas
                            </span>
                            <Link to={`/tour/details/${tour.id}`} className="btn btn-sm btn-primary">
                              Ver Detalhes
                            </Link>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-5 bg-light rounded">
                  <i className="fas fa-search fa-3x mb-3 text-muted"></i>
                  <h3>Nenhum tour encontrado</h3>
                  <p className="mb-4">Tente ajustar seus filtros de busca.</p>
                  <button 
                    className="btn btn-primary"
                    onClick={() => {
                      setFilters({
                        search: '',
                        location: '',
                        date: '',
                        minPrice: '',
                        maxPrice: '',
                        sortBy: 'date'
                      });
                      setSearchParams({});
                    }}
                  >
                    <i className="fas fa-sync me-2"></i>
                    Limpar Filtros
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
      
      {/* Additional CSS */}
      <style jsx>{`
        .search-banner {
          background: linear-gradient(to right, var(--primary-color), var(--secondary-color));
          padding: 3rem 0;
        }
        
        .tour-card {
          transition: transform 0.3s ease, box-shadow 0.3s ease;
        }
        
        .tour-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1) !important;
        }
        
        .tour-price {
          position: absolute;
          top: 10px;
          right: 10px;
          background-color: var(--primary-color);
          color: white;
          padding: 5px 10px;
          border-radius: 20px;
          font-weight: bold;
        }
        
        @media (min-width: 992px) {
          .sticky-lg-top {
            position: sticky;
            top: 2rem;
          }
        }
      `}</style>
    </>
  );
};

export default TourSearchPage;