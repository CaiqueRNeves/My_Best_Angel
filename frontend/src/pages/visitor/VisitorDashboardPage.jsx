import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../services/api';
import VisitorTourCard from '../../components/visitor/VisitorTourCard';
import VisitorBelemMap from '../../components/visitor/VisitorBelemMap';

const VisitorDashboardPage = () => {
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const response = await api.get('/visitor/dashboard');
        setDashboardData(response.data.data);
        setLoading(false);
      } catch (error) {
        console.error('Erro ao carregar dashboard:', error);
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

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
      <div className="d-sm-flex align-items-center justify-content-between mb-4">
        <h1 className="h3 mb-0">Dashboard</h1>
        <Link to="/visitor/available-tours" className="d-none d-sm-inline-block btn btn-primary shadow-sm">
          <i className="fas fa-search fa-sm me-2"></i>
          Explorar Tours
        </Link>
      </div>

      {/* Informações do Guia */}
      <div className="card border-0 shadow-sm mb-4">
        <div className="card-body">
          <div className="row align-items-center">
            <div className="col-md-2 text-center mb-3 mb-md-0">
              <div 
                className="rounded-circle bg-primary bg-opacity-10 d-inline-flex justify-content-center align-items-center"
                style={{ width: 80, height: 80 }}
              >
                <i className="fas fa-user-tie fa-2x text-primary"></i>
              </div>
            </div>
            <div className="col-md-6 mb-3 mb-md-0">
              <h5 className="card-title">Seu Angel</h5>
              <h4 className="mb-1">{dashboardData.visitor.angel_name}</h4>
              <p className="mb-2">
                <i className="fas fa-envelope me-2"></i>
                {dashboardData.visitor.angel_email}
              </p>
              <p className="mb-0">
                <i className="fas fa-phone me-2"></i>
                {dashboardData.visitor.angel_phone || 'Telefone não informado'}
              </p>
            </div>
            <div className="col-md-4 text-md-end">
              <Link to="/visitor/messages" className="btn btn-primary mb-2 mb-md-0 me-2">
                <i className="fas fa-envelope me-2"></i>
                Enviar Mensagem
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Próximos Tours e Atualizações Recentes */}
      <div className="row">
        <div className="col-lg-8">
          {/* Próximos Tours */}
          <div className="dashboard-section mb-4">
            <div className="dashboard-section-header">
              <h2>
                <i className="fas fa-calendar-check me-2"></i>
                Seus Próximos Tours
              </h2>
            </div>
            
            {dashboardData.upcomingTours && dashboardData.upcomingTours.length > 0 ? (
              <div className="row g-3">
                {dashboardData.upcomingTours.map((tour) => (
                  <div className="col-md-6" key={tour.id}>
                    <VisitorTourCard tour={tour} />
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center p-4 bg-light rounded">
                <i className="fas fa-calendar-times fa-3x mb-3 text-muted"></i>
                <h5>Nenhum tour agendado</h5>
                <p className="mb-3">Você não tem tours agendados para os próximos dias.</p>
                <Link to="/visitor/available-tours" className="btn btn-primary">
                  <i className="fas fa-search me-2"></i>Explorar Tours
                </Link>
              </div>
            )}
          </div>
          
          {/* Atualizações Recentes */}
          <div className="dashboard-section">
            <div className="dashboard-section-header">
              <h2>
                <i className="fas fa-bell me-2"></i>
                Atualizações Recentes
              </h2>
            </div>
            
            {dashboardData.recentUpdates && dashboardData.recentUpdates.length > 0 ? (
              <div className="list-group">
                {dashboardData.recentUpdates.map((update, index) => (
                  <div key={index} className="list-group-item list-group-item-action">
                    <div className="d-flex w-100 justify-content-between">
                      <h6 className="mb-1">{update.title}</h6>
                      <small>{update.relativeUpdateDate}</small>
                    </div>
                    <p className="mb-1">
                      <i className="fas fa-map-marker-alt me-1"></i> {update.location}
                    </p>
                    <div className="d-flex justify-content-between align-items-center">
                      <small className="text-muted">
                        <i className="far fa-calendar-alt me-1"></i> {update.formattedDate}
                      </small>
                      <Link to={`/visitor/tour/${update.id}`} className="btn btn-sm btn-outline-primary">
                        Ver Tour
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center p-4">
                <i className="fas fa-bell-slash fa-3x mb-3 text-muted"></i>
                <h5>Nenhuma atualização recente</h5>
                <p>Seu Angel não fez nenhuma atualização recentemente.</p>
              </div>
            )}
          </div>
        </div>
        
        <div className="col-lg-4">
          {/* Mapa de Belém */}
          <VisitorBelemMap />
          
          {/* Mensagens não lidas */}
          <div className="card border-0 shadow-sm mt-4">
            <div className="card-body">
              <div className="d-flex justify-content-between align-items-center mb-3">
                <h5 className="card-title mb-0">
                  <i className="fas fa-envelope me-2"></i>
                  Mensagens
                </h5>
                <span className="badge bg-danger">
                  {dashboardData.unreadMessages || 0} novas
                </span>
              </div>
              
              {dashboardData.unreadMessages > 0 ? (
                <div className="alert alert-info mb-3">
                  <i className="fas fa-info-circle me-2"></i>
                  Você tem {dashboardData.unreadMessages} mensagens não lidas do seu Angel.
                </div>
              ) : (
                <div className="text-center py-3">
                  <i className="far fa-envelope-open fa-2x mb-2 text-muted"></i>
                  <p className="mb-0">Nenhuma mensagem não lida.</p>
                </div>
              )}
              
              <div className="text-center mt-3">
                <Link to="/visitor/messages" className="btn btn-outline-primary">
                  <i className="fas fa-envelope me-1"></i>
                  Ver Mensagens
                </Link>
              </div>
            </div>
          </div>
          
          {/* Eventos da COP-30 */}
          <div className="card border-0 shadow-sm mt-4">
            <div className="card-body">
              <h5 className="card-title mb-3">
                <i className="fas fa-globe-americas me-2"></i>
                Eventos da COP-30
              </h5>
              
              <div className="list-group list-group-flush">
                <a href="#" className="list-group-item list-group-item-action">
                  <div className="d-flex w-100 justify-content-between">
                    <h6 className="mb-1">Abertura Oficial</h6>
                    <small>10/11/2025</small>
                  </div>
                  <p className="mb-1 small">Cerimônia de abertura oficial da COP-30 no Hangar Centro de Convenções.</p>
                </a>
                
                <a href="#" className="list-group-item list-group-item-action">
                  <div className="d-flex w-100 justify-content-between">
                    <h6 className="mb-1">Painel: Amazônia e Clima</h6>
                    <small>12/11/2025</small>
                  </div>
                  <p className="mb-1 small">Discussões sobre o papel da Amazônia na regulação climática global.</p>
                </a>
                
                <a href="#" className="list-group-item list-group-item-action">
                  <div className="d-flex w-100 justify-content-between">
                    <h6 className="mb-1">Feira de Tecnologias Verdes</h6>
                    <small>13-15/11/2025</small>
                  </div>
                  <p className="mb-1 small">Exposição de tecnologias sustentáveis e inovações para combate às mudanças climáticas.</p>
                </a>
              </div>
              
              <div className="text-center mt-3">
                <Link to="/cop30" className="btn btn-outline-success">
                  <i className="fas fa-calendar-alt me-1"></i>
                  Ver Todos os Eventos
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default VisitorDashboardPage;
