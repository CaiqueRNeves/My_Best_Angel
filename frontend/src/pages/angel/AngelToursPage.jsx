import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../services/api';

const AngelToursPage = () => {
  const [tours, setTours] = useState({
    upcomingTours: [],
    pastTours: []
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('upcoming');
  const [filter, setFilter] = useState('');
  
  useEffect(() => {
    const fetchTours = async () => {
      try {
        const response = await api.get('/angel/tours');
        setTours(response.data.data);
        setLoading(false);
      } catch (error) {
        console.error('Erro ao carregar tours:', error);
        setError('Não foi possível carregar os tours. Tente novamente mais tarde.');
        setLoading(false);
      }
    };
    
    fetchTours();
  }, []);
  
  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };
  
  const handleFilterChange = (e) => {
    setFilter(e.target.value);
  };
  
  const handleCancelTour = async (tourId) => {
    if (!window.confirm('Tem certeza que deseja cancelar este tour?')) {
      return;
    }
    
    try {
      await api.delete(`/angel/tours/${tourId}`);
      
      // Update the tours list by removing the canceled tour
      setTours(prevTours => ({
        upcomingTours: prevTours.upcomingTours.filter(tour => tour.id !== tourId),
        pastTours: prevTours.pastTours
      }));
    } catch (error) {
      console.error('Erro ao cancelar tour:', error);
      alert('Não foi possível cancelar o tour. Tente novamente mais tarde.');
    }
  };
  
  // Filter tours based on the search input
  const filterTours = (toursList) => {
    if (!filter) {
      return toursList;
    }
    
    const filterLower = filter.toLowerCase();
    return toursList.filter(tour => 
      tour.title.toLowerCase().includes(filterLower) || 
      tour.location.toLowerCase().includes(filterLower)
    );
  };
  
  // Format date for display
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };
  
  if (loading) {
    return (
      <div className="container py-5">
        <div className="text-center">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Carregando...</span>
          </div>
          <p className="mt-2">Carregando seus tours...</p>
        </div>
      </div>
    );
  }
  
  return (
    <div className="container py-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1 className="h3 mb-0">Meus Tours</h1>
        <Link to="/angel/create-tour" className="btn btn-primary">
          <i className="fas fa-plus-circle me-2"></i>
          Criar Novo Tour
        </Link>
      </div>
      
      {error && (
        <div className="alert alert-danger" role="alert">
          {error}
        </div>
      )}
      
      <div className="card border-0 shadow-sm">
        <div className="card-header bg-white">
          <div className="row g-3 align-items-center">
            <div className="col-md-6">
              <ul className="nav nav-tabs card-header-tabs">
                <li className="nav-item">
                  <button 
                    className={`nav-link ${activeTab === 'upcoming' ? 'active' : ''}`} 
                    onClick={() => handleTabChange('upcoming')}
                  >
                    <i className="fas fa-calendar-alt me-2"></i>
                    Tours Futuros
                    {tours.upcomingTours.length > 0 && (
                      <span className="badge bg-primary ms-2">{tours.upcomingTours.length}</span>
                    )}
                  </button>
                </li>
                <li className="nav-item">
                  <button 
                    className={`nav-link ${activeTab === 'past' ? 'active' : ''}`} 
                    onClick={() => handleTabChange('past')}
                  >
                    <i className="fas fa-history me-2"></i>
                    Tours Passados
                    {tours.pastTours.length > 0 && (
                      <span className="badge bg-secondary ms-2">{tours.pastTours.length}</span>
                    )}
                  </button>
                </li>
              </ul>
            </div>
            <div className="col-md-6">
              <div className="input-group">
                <span className="input-group-text">
                  <i className="fas fa-search"></i>
                </span>
                <input 
                  type="text" 
                  className="form-control" 
                  placeholder="Buscar por título ou local..." 
                  value={filter}
                  onChange={handleFilterChange}
                />
              </div>
            </div>
          </div>
        </div>
        
        <div className="card-body p-0">
          {activeTab === 'upcoming' && (
            <>
              {filterTours(tours.upcomingTours).length > 0 ? (
                <div className="table-responsive">
                  <table className="table table-hover mb-0">
                    <thead className="table-light">
                      <tr>
                        <th>Tour</th>
                        <th>Data</th>
                        <th>Duração</th>
                        <th>Participantes</th>
                        <th>Preço</th>
                        <th>Ações</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filterTours(tours.upcomingTours).map(tour => (
                        <tr key={tour.id}>
                          <td>
                            <div className="d-flex align-items-center">
                              {tour.image ? (
                                <img 
                                  src={tour.image} 
                                  alt={tour.title}
                                  className="rounded"
                                  width="40" 
                                  height="40"
                                  style={{ objectFit: 'cover' }}
                                />
                              ) : (
                                <div 
                                  className="bg-light rounded d-flex justify-content-center align-items-center"
                                  style={{ width: 40, height: 40 }}
                                >
                                  <i className="fas fa-map-marker-alt text-primary"></i>
                                </div>
                              )}
                              <div className="ms-3">
                                <Link to={`/angel/tour/${tour.id}`} className="text-decoration-none">
                                  <h6 className="mb-0">{tour.title}</h6>
                                </Link>
                                <small className="text-muted">{tour.location}</small>
                              </div>
                            </div>
                          </td>
                          <td>{formatDate(tour.date)}</td>
                          <td>{tour.duration} min</td>
                          <td>
                            <span className="badge bg-primary">
                              {tour.current_participants}/{tour.max_participants}
                            </span>
                          </td>
                          <td>
                            {tour.price ? `R$ ${tour.price.toFixed(2)}` : 'Gratuito'}
                          </td>
                          <td>
                            <div className="btn-group">
                              <Link 
                                to={`/angel/tour/${tour.id}`} 
                                className="btn btn-sm btn-outline-primary"
                                title="Ver detalhes"
                              >
                                <i className="fas fa-eye"></i>
                              </Link>
                              <Link 
                                to={`/angel/edit-tour/${tour.id}`} 
                                className="btn btn-sm btn-outline-secondary"
                                title="Editar tour"
                              >
                                <i className="fas fa-edit"></i>
                              </Link>
                              <button 
                                className="btn btn-sm btn-outline-danger"
                                title="Cancelar tour"
                                onClick={() => handleCancelTour(tour.id)}
                              >
                                <i className="fas fa-trash"></i>
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="text-center p-5">
                  <i className="fas fa-calendar-times fa-3x mb-3 text-muted"></i>
                  <h4>Nenhum tour futuro</h4>
                  <p className="text-muted mb-4">
                    Você não tem tours agendados para os próximos dias.
                  </p>
                  <Link to="/angel/create-tour" className="btn btn-primary">
                    <i className="fas fa-plus-circle me-2"></i>
                    Criar Novo Tour
                  </Link>
                </div>
              )}
            </>
          )}
          
          {activeTab === 'past' && (
            <>
              {filterTours(tours.pastTours).length > 0 ? (
                <div className="table-responsive">
                  <table className="table table-hover mb-0">
                    <thead className="table-light">
                      <tr>
                        <th>Tour</th>
                        <th>Data</th>
                        <th>Participantes</th>
                        <th>Preço</th>
                        <th>Avaliações</th>
                        <th>Ações</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filterTours(tours.pastTours).map(tour => (
                        <tr key={tour.id}>
                          <td>
                            <div className="d-flex align-items-center">
                              {tour.image ? (
                                <img 
                                  src={tour.image} 
                                  alt={tour.title}
                                  className="rounded"
                                  width="40" 
                                  height="40"
                                  style={{ objectFit: 'cover' }}
                                />
                              ) : (
                                <div 
                                  className="bg-light rounded d-flex justify-content-center align-items-center"
                                  style={{ width: 40, height: 40 }}
                                >
                                  <i className="fas fa-map-marker-alt text-primary"></i>
                                </div>
                              )}
                              <div className="ms-3">
                                <Link to={`/angel/tour/${tour.id}`} className="text-decoration-none">
                                  <h6 className="mb-0">{tour.title}</h6>
                                </Link>
                                <small className="text-muted">{tour.location}</small>
                              </div>
                            </div>
                          </td>
                          <td>{formatDate(tour.date)}</td>
                          <td>
                            <span className="badge bg-secondary">
                              {tour.current_participants}/{tour.max_participants}
                            </span>
                          </td>
                          <td>
                            {tour.price ? `R$ ${tour.price.toFixed(2)}` : 'Gratuito'}
                          </td>
                          <td>
                            <div className="text-warning">
                              <i className="fas fa-star"></i>
                              <i className="fas fa-star"></i>
                              <i className="fas fa-star"></i>
                              <i className="fas fa-star"></i>
                              <i className="fas fa-star-half-alt"></i>
                              <span className="text-dark ms-2">4.5 (12)</span>
                            </div>
                          </td>
                          <td>
                            <div className="btn-group">
                              <Link 
                                to={`/angel/tour/${tour.id}`} 
                                className="btn btn-sm btn-outline-primary"
                                title="Ver detalhes"
                              >
                                <i className="fas fa-eye"></i>
                              </Link>
                              <button 
                                className="btn btn-sm btn-outline-success"
                                title="Ver avaliações"
                              >
                                <i className="fas fa-star"></i>
                              </button>
                              <button 
                                className="btn btn-sm btn-outline-info"
                                title="Duplicar tour"
                              >
                                <i className="fas fa-copy"></i>
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="text-center p-5">
                  <i className="fas fa-history fa-3x mb-3 text-muted"></i>
                  <h4>Nenhum tour passado</h4>
                  <p className="text-muted">
                    Você ainda não realizou nenhum tour.
                  </p>
                </div>
              )}
            </>
          )}
        </div>
      </div>
      
      {/* Tour Statistics Card */}
      <div className="card border-0 shadow-sm mt-4">
        <div className="card-body">
          <h5 className="card-title">
            <i className="fas fa-chart-line me-2"></i>
            Estatísticas dos Tours
          </h5>
          <div className="row text-center mt-3">
            <div className="col-md-3 mb-3 mb-md-0">
              <h2 className="h4 mb-0">{tours.upcomingTours.length + tours.pastTours.length}</h2>
              <small className="text-muted">Tours Totais</small>
            </div>
            <div className="col-md-3 mb-3 mb-md-0">
              <h2 className="h4 mb-0">{tours.upcomingTours.length}</h2>
              <small className="text-muted">Tours Agendados</small>
            </div>
            <div className="col-md-3 mb-3 mb-md-0">
              <h2 className="h4 mb-0">
                {tours.upcomingTours.reduce((total, tour) => total + tour.current_participants, 0)}
              </h2>
              <small className="text-muted">Reservas Futuras</small>
            </div>
            <div className="col-md-3">
              <h2 className="h4 mb-0">
                {tours.pastTours.reduce((total, tour) => total + tour.current_participants, 0)}
              </h2>
              <small className="text-muted">Visitantes Atendidos</small>
            </div>
          </div>
          <div className="text-center mt-3">
            <Link to="/angel/insights" className="btn btn-outline-primary">
              <i className="fas fa-chart-pie me-2"></i>
              Ver Análises Detalhadas
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AngelToursPage;