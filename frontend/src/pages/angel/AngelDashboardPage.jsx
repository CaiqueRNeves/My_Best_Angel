// src/pages/angel/AngelDashboardPage.jsx
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../services/api';

const AngelDashboardPage = () => {
  const [dashboardData, setDashboardData] = useState({
    visitors: [],
    upcomingTours: [],
    unreadMessages: 0,
    stats: {
      totalTours: 0,
      totalVisitors: 0,
      totalBookings: 0,
      averageRating: 5.0
    }
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const response = await api.get('/angel/dashboard');
        
        // Verificar se a resposta tem a estrutura esperada
        if (response && response.data) {
          setDashboardData(response.data);
        } else {
          // Fallback para dados mock se a API não responder corretamente
          setDashboardData({
            visitors: [
              {
                id: 1,
                name: 'Maria Silva',
                email: 'maria@email.com',
                nationality: 'Brasil',
                language_preference: 'Português',
                tours_count: 2
              }
            ],
            upcomingTours: [
              {
                id: 1,
                title: 'Mercado Ver-o-Peso',
                location: 'Ver-o-Peso, Belém, PA',
                date: '2025-06-25 09:00:00',
                current_participants: 4,
                max_participants: 8
              }
            ],
            unreadMessages: 2,
            stats: {
              totalTours: 12,
              totalVisitors: 3,
              totalBookings: 28,
              averageRating: 4.8
            }
          });
        }
        setLoading(false);
      } catch (error) {
        console.error('Erro ao carregar dashboard:', error);
        setError('Não foi possível conectar com o servidor. Usando dados de demonstração.');
        
        // Usar dados mockados em caso de erro de conexão
        setDashboardData({
          visitors: [
            {
              id: 1,
              name: 'Maria Silva',
              email: 'maria@email.com',
              nationality: 'Brasil',
              language_preference: 'Português',
              tours_count: 2
            }
          ],
          upcomingTours: [
            {
              id: 1,
              title: 'Mercado Ver-o-Peso',
              location: 'Ver-o-Peso, Belém, PA',
              date: '2025-06-25 09:00:00',
              current_participants: 4,
              max_participants: 8
            }
          ],
          unreadMessages: 2,
          stats: {
            totalTours: 12,
            totalVisitors: 3,
            totalBookings: 28,
            averageRating: 4.8
          }
        });
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const formatDate = (dateString) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('pt-BR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch (error) {
      return 'Data inválida';
    }
  };

  if (loading) {
    return (
      <div className="text-center my-5">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Carregando...</span>
        </div>
        <p className="mt-2">Carregando seu dashboard...</p>
      </div>
    );
  }

  return (
    <>
      {error && (
        <div className="alert alert-warning alert-dismissible fade show mb-4" role="alert">
          <i className="fas fa-exclamation-triangle me-2"></i>
          {error}
          <button type="button" className="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
        </div>
      )}

      <div className="d-sm-flex align-items-center justify-content-between mb-4">
        <h1 className="h3 mb-0">Dashboard</h1>
        <Link to="/angel/create-tour" className="d-none d-sm-inline-block btn btn-primary shadow-sm">
          <i className="fas fa-plus-circle fa-sm me-2"></i>
          Criar Novo Tour
        </Link>
      </div>

      {/* Estatísticas */}
      <div className="row g-3 mb-4">
        <div className="col-md-3">
          <div className="card border-0 shadow-sm h-100">
            <div className="card-body d-flex align-items-center">
              <div className="flex-shrink-0 me-3">
                <div className="stat-circle bg-primary bg-opacity-10 text-primary">
                  <i className="fas fa-map-marked-alt"></i>
                </div>
              </div>
              <div>
                <h6 className="card-subtitle text-muted">Tours Criados</h6>
                <h2 className="card-title h4 mb-0">{dashboardData.stats?.totalTours || 0}</h2>
              </div>
            </div>
          </div>
        </div>
        
        <div className="col-md-3">
          <div className="card border-0 shadow-sm h-100">
            <div className="card-body d-flex align-items-center">
              <div className="flex-shrink-0 me-3">
                <div className="stat-circle bg-success bg-opacity-10 text-success">
                  <i className="fas fa-users"></i>
                </div>
              </div>
              <div>
                <h6 className="card-subtitle text-muted">Visitantes</h6>
                <h2 className="card-title h4 mb-0">{dashboardData.stats?.totalVisitors || 0}</h2>
              </div>
            </div>
          </div>
        </div>
        
        <div className="col-md-3">
          <div className="card border-0 shadow-sm h-100">
            <div className="card-body d-flex align-items-center">
              <div className="flex-shrink-0 me-3">
                <div className="stat-circle bg-warning bg-opacity-10 text-warning">
                  <i className="fas fa-ticket-alt"></i>
                </div>
              </div>
              <div>
                <h6 className="card-subtitle text-muted">Reservas</h6>
                <h2 className="card-title h4 mb-0">{dashboardData.stats?.totalBookings || 0}</h2>
              </div>
            </div>
          </div>
        </div>
        
        <div className="col-md-3">
          <div className="card border-0 shadow-sm h-100">
            <div className="card-body d-flex align-items-center">
              <div className="flex-shrink-0 me-3">
                <div className="stat-circle bg-info bg-opacity-10 text-info">
                  <i className="fas fa-star"></i>
                </div>
              </div>
              <div>
                <h6 className="card-subtitle text-muted">Avaliação</h6>
                <h2 className="card-title h4 mb-0">{dashboardData.stats?.averageRating || 5.0}</h2>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="row">
        <div className="col-lg-8">
          {/* Próximos Tours */}
          <div className="dashboard-section mb-4">
            <div className="dashboard-section-header">
              <h2>
                <i className="fas fa-calendar-alt me-2"></i>
                Próximos Tours
              </h2>
              <Link to="/angel/tours" className="btn btn-sm btn-outline-primary">
                Ver Todos
              </Link>
            </div>
            
            {dashboardData.upcomingTours && dashboardData.upcomingTours.length > 0 ? (
              <div className="table-responsive">
                <table className="table">
                  <thead className="table-light">
                    <tr>
                      <th>Tour</th>
                      <th>Data</th>
                      <th>Participantes</th>
                      <th>Ações</th>
                    </tr>
                  </thead>
                  <tbody>
                    {dashboardData.upcomingTours.map(tour => (
                      <tr key={tour.id}>
                        <td>
                          <div>
                            <h6 className="mb-0">{tour.title}</h6>
                            <small className="text-muted">{tour.location}</small>
                          </div>
                        </td>
                        <td>{formatDate(tour.date)}</td>
                        <td>
                          <span className="badge bg-primary">
                            {tour.current_participants}/{tour.max_participants}
                          </span>
                        </td>
                        <td>
                          <Link 
                            to={`/angel/tour/${tour.id}`} 
                            className="btn btn-sm btn-outline-primary"
                          >
                            <i className="fas fa-eye"></i>
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="text-center p-4 bg-light rounded">
                <i className="fas fa-calendar-times fa-3x mb-3 text-muted"></i>
                <h5>Nenhum tour agendado</h5>
                <p className="mb-3">Você não tem tours agendados para os próximos dias.</p>
                <Link to="/angel/create-tour" className="btn btn-primary">
                  <i className="fas fa-plus-circle me-2"></i>
                  Criar Primeiro Tour
                </Link>
              </div>
            )}
          </div>

          {/* Visitantes Recentes */}
          <div className="dashboard-section">
            <div className="dashboard-section-header">
              <h2>
                <i className="fas fa-users me-2"></i>
                Meus Visitantes
              </h2>
              <Link to="/angel/visitors" className="btn btn-sm btn-outline-primary">
                Ver Todos
              </Link>
            </div>
            
            {dashboardData.visitors && dashboardData.visitors.length > 0 ? (
              <div className="table-responsive">
                <table className="table">
                  <thead className="table-light">
                    <tr>
                      <th>Visitante</th>
                      <th>Nacionalidade</th>
                      <th>Idioma</th>
                      <th>Tours Agendados</th>
                      <th>Ações</th>
                    </tr>
                  </thead>
                  <tbody>
                    {dashboardData.visitors.map((visitor) => (
                      <tr key={visitor.id}>
                        <td>
                          <div className="d-flex align-items-center">
                            <div 
                              className="rounded-circle bg-light d-flex justify-content-center align-items-center me-2"
                              style={{ width: 40, height: 40 }}
                            >
                              <i className="fas fa-user text-primary"></i>
                            </div>
                            <div>
                              <p className="fw-medium mb-0">{visitor.name}</p>
                              <small className="text-muted">{visitor.email}</small>
                            </div>
                          </div>
                        </td>
                        <td>{visitor.nationality || 'Não informado'}</td>
                        <td>{visitor.language_preference || 'Não informado'}</td>
                        <td>
                          <span className="badge bg-info">
                            {visitor.tours_count || 0} tours
                          </span>
                        </td>
                        <td>
                          <button 
                            className="btn btn-sm btn-outline-primary"
                            onClick={() => {
                              // Implementar função para enviar mensagem
                            }}
                          >
                            <i className="fas fa-envelope"></i>
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="text-center p-4">
                <i className="fas fa-users fa-3x mb-3 text-muted"></i>
                <h5>Nenhum visitante afiliado</h5>
                <p>Você ainda não tem visitantes afiliados ao seu perfil.</p>
              </div>
            )}
          </div>
        </div>
        
        <div className="col-lg-4">
          {/* Widget do Clima */}
          <div className="card border-0 shadow-sm mb-4">
            <div className="card-body">
              <h5 className="card-title mb-3">
                <i className="fas fa-cloud me-2"></i>
                Clima em Belém
              </h5>
              
              <div className="text-center mb-3">
                <i className="fas fa-cloud-sun fa-3x text-warning mb-2"></i>
                <h3 className="mb-0">32°C</h3>
                <p className="text-muted">Parcialmente nublado</p>
              </div>
              
              <div className="d-flex justify-content-between">
                <div className="text-center">
                  <i className="fas fa-tint text-info"></i>
                  <div>
                    <small className="d-block text-muted">Umidade</small>
                    <strong>78%</strong>
                  </div>
                </div>
                <div className="text-center">
                  <i className="fas fa-wind text-primary"></i>
                  <div>
                    <small className="d-block text-muted">Vento</small>
                    <strong>12 km/h</strong>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Mensagens Recentes */}
          <div className="card border-0 shadow-sm mt-4">
            <div className="card-body">
              <div className="d-flex justify-content-between align-items-center mb-3">
                <h5 className="card-title mb-0">
                  <i className="fas fa-envelope me-2"></i>
                  Mensagens Recentes
                </h5>
                <span className="badge bg-danger">
                  {dashboardData.unreadMessages || 0} novas
                </span>
              </div>
              
              {dashboardData.unreadMessages > 0 ? (
                <div className="list-group list-group-flush">
                  <a href="#" className="list-group-item list-group-item-action">
                    <div className="d-flex w-100 justify-content-between">
                      <h6 className="mb-1">Maria Silva</h6>
                      <small>3 horas atrás</small>
                    </div>
                    <p className="mb-1 small text-truncate">Olá, gostaria de saber mais detalhes sobre o tour no Ver-o-Peso...</p>
                  </a>
                  <a href="#" className="list-group-item list-group-item-action">
                    <div className="d-flex w-100 justify-content-between">
                      <h6 className="mb-1">João Santos</h6>
                      <small>Ontem</small>
                    </div>
                    <p className="mb-1 small text-truncate">Podemos remarcar o passeio para domingo? Tive um imprevisto...</p>
                  </a>
                </div>
              ) : (
                <div className="text-center py-3">
                  <i className="far fa-envelope-open fa-2x mb-2 text-muted"></i>
                  <p className="mb-0">Nenhuma mensagem não lida.</p>
                </div>
              )}
              
              <div className="text-center mt-3">
                <Link to="/angel/messages" className="btn btn-outline-primary">
                  Ver Todas as Mensagens
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <style jsx>{`
        .stat-circle {
          width: 50px;
          height: 50px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1.2rem;
        }
        
        .dashboard-section {
          background-color: white;
          border-radius: 8px;
          padding: 1.5rem;
          box-shadow: 0 5px 15px rgba(0, 0, 0, 0.05);
        }
        
        .dashboard-section-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 1.5rem;
        }
        
        .dashboard-section-header h2 {
          font-size: 1.3rem;
          font-weight: 600;
          margin-bottom: 0;
        }
      `}</style>
    </>
  );
};

export default AngelDashboardPage;