import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../services/api';

const AngelInsightsPage = () => {
  const [insightsData, setInsightsData] = useState({
    tourStats: {
      totalTours: 0,
      upcomingTours: 0,
      pastTours: 0,
      uniqueLocations: 0
    },
    popularLocations: [],
    reviewStats: {
      averageRating: '5.0',
      totalReviews: 0
    },
    bookingStats: {
      totalBookings: 0,
      confirmedBookings: 0,
      canceledBookings: 0,
      completedBookings: 0
    },
    popularTours: [
      {
        title: 'Mercado Ver-o-Peso',
        description: 'O famoso mercado Ver-o-Peso é o maior mercado a céu aberto da América Latina e um símbolo de Belém.',
        image: '/images/ver-o-peso.jpg'
      },
      {
        title: 'Estação das Docas',
        description: 'Um complexo turístico à beira do rio com restaurantes, bares e lojas em antigos galpões portuários.',
        image: '/images/estacao-docas.jpg'
      },
      {
        title: 'Museu Emílio Goeldi',
        description: 'Um dos mais importantes museus de história natural e etnografia da Amazônia.',
        image: '/images/museu-goeldi.jpg'
      }
    ],
    typicalDishes: [
      {
        name: 'Pato no Tucupi',
        description: 'Pato assado servido com molho de tucupi (líquido extraído da mandioca) e jambu (erva típica).',
        image: '/images/pato-tucupi.jpg'
      },
      {
        name: 'Tacacá',
        description: 'Caldo quente feito com tucupi, jambu, camarão seco e goma de tapioca.',
        image: '/images/tacaca.jpg'
      },
      {
        name: 'Maniçoba',
        description: 'Prato feito com folhas de mandioca moídas e cozidas por dias, servido com carnes variadas.',
        image: '/images/manicoba.jpg'
      }
    ]
  });
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('tours');

  useEffect(() => {
    const fetchInsights = async () => {
      try {
        const response = await api.get('/angel/insights');
        setInsightsData(response.data.data);
        setLoading(false);
      } catch (error) {
        console.error('Erro ao carregar insights:', error);
        // Use dados mockados em caso de erro
        setLoading(false);
      }
    };

    fetchInsights();
  }, []);

  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };

  if (loading) {
    return (
      <div className="text-center my-5">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Carregando...</span>
        </div>
        <p className="mt-2">Carregando insights...</p>
      </div>
    );
  }

  return (
    <div className="container py-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1 className="h3 mb-0">Insights e Estatísticas</h1>
        <Link to="/angel/dashboard" className="btn btn-outline-secondary">
          <i className="fas fa-arrow-left me-2"></i>
          Voltar para Dashboard
        </Link>
      </div>

      {/* Stats Cards */}
      <div className="row g-3 mb-4">
        <div className="col-md-3">
          <div className="card border-0 shadow-sm h-100">
            <div className="card-body text-center">
              <div className="display-4 text-primary mb-2">{insightsData.tourStats.totalTours}</div>
              <h5 className="card-title">Tours Totais</h5>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card border-0 shadow-sm h-100">
            <div className="card-body text-center">
              <div className="display-4 text-success mb-2">{insightsData.bookingStats.totalBookings}</div>
              <h5 className="card-title">Reservas Totais</h5>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card border-0 shadow-sm h-100">
            <div className="card-body text-center">
              <div className="display-4 text-warning mb-2">{insightsData.reviewStats.averageRating}</div>
              <h5 className="card-title">Avaliação Média</h5>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card border-0 shadow-sm h-100">
            <div className="card-body text-center">
              <div className="display-4 text-info mb-2">{insightsData.tourStats.uniqueLocations}</div>
              <h5 className="card-title">Locais Únicos</h5>
            </div>
          </div>
        </div>
      </div>

      {/* Simple Chart Section */}
      <div className="card border-0 shadow-sm mb-4">
        <div className="card-body">
          <ul className="nav nav-tabs mb-4">
            <li className="nav-item">
              <button 
                className={`nav-link ${activeTab === 'tours' ? 'active' : ''}`}
                onClick={() => handleTabChange('tours')}
              >
                <i className="fas fa-map-marker-alt me-2"></i>
                Locais
              </button>
            </li>
            <li className="nav-item">
              <button 
                className={`nav-link ${activeTab === 'bookings' ? 'active' : ''}`}
                onClick={() => handleTabChange('bookings')}
              >
                <i className="fas fa-ticket-alt me-2"></i>
                Reservas
              </button>
            </li>
          </ul>
          
          <div className="row">
            {activeTab === 'tours' && (
              <div className="col-12">
                <h5>Locais Mais Populares</h5>
                {insightsData.popularLocations.length > 0 ? (
                  <div className="table-responsive">
                    <table className="table">
                      <thead>
                        <tr>
                          <th>Local</th>
                          <th>Número de Tours</th>
                          <th>Popularidade</th>
                        </tr>
                      </thead>
                      <tbody>
                        {insightsData.popularLocations.map((location, index) => (
                          <tr key={index}>
                            <td>{location.location}</td>
                            <td>{location.count}</td>
                            <td>
                              <div className="progress">
                                <div 
                                  className="progress-bar bg-primary" 
                                  role="progressbar" 
                                  style={{ width: `${(location.count / Math.max(...insightsData.popularLocations.map(l => l.count))) * 100}%` }}
                                >
                                  {Math.round((location.count / Math.max(...insightsData.popularLocations.map(l => l.count))) * 100)}%
                                </div>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <p className="text-muted">Nenhum dado de localização disponível.</p>
                )}
              </div>
            )}
            
            {activeTab === 'bookings' && (
              <div className="col-12">
                <h5>Status das Reservas</h5>
                <div className="row g-3">
                  <div className="col-md-4">
                    <div className="card text-center">
                      <div className="card-body">
                        <h3 className="text-success">{insightsData.bookingStats.confirmedBookings}</h3>
                        <p className="card-text">Confirmadas</p>
                      </div>
                    </div>
                  </div>
                  <div className="col-md-4">
                    <div className="card text-center">
                      <div className="card-body">
                        <h3 className="text-danger">{insightsData.bookingStats.canceledBookings}</h3>
                        <p className="card-text">Canceladas</p>
                      </div>
                    </div>
                  </div>
                  <div className="col-md-4">
                    <div className="card text-center">
                      <div className="card-body">
                        <h3 className="text-info">{insightsData.bookingStats.completedBookings}</h3>
                        <p className="card-text">Realizadas</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Popular Tours Suggestions */}
      <div className="card border-0 shadow-sm mb-4">
        <div className="card-body">
          <h4 className="card-title mb-3">
            <i className="fas fa-lightbulb me-2 text-warning"></i>
            Tours Populares em Belém
          </h4>
          
          <div className="row">
            {insightsData.popularTours.map((tour, index) => (
              <div className="col-md-4" key={index}>
                <div className="card mb-3">
                  {tour.image ? (
                    <img src={tour.image} className="card-img-top" alt={tour.title} style={{ height: '160px', objectFit: 'cover' }} />
                  ) : (
                    <div className="bg-light text-center py-5">
                      <i className="fas fa-map-marker-alt fa-3x text-secondary"></i>
                    </div>
                  )}
                  <div className="card-body">
                    <h5 className="card-title">{tour.title}</h5>
                    <p className="card-text small">{tour.description}</p>
                    <Link to="/angel/create-tour" className="btn btn-sm btn-outline-primary">
                      Criar Tour Similar
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Typical Dishes */}
      <div className="card border-0 shadow-sm">
        <div className="card-body">
          <h4 className="card-title mb-3">
            <i className="fas fa-utensils me-2 text-danger"></i>
            Gastronomia Paraense
          </h4>
          
          <p className="mb-4">
            Inclua estes pratos típicos nos seus tours gastronômicos para enriquecer 
            a experiência dos visitantes com a autêntica culinária paraense.
          </p>
          
          <div className="row">
            {insightsData.typicalDishes.map((dish, index) => (
              <div className="col-md-6 col-lg-4 mb-3" key={index}>
                <div className="d-flex">
                  {dish.image ? (
                    <img 
                      src={dish.image} 
                      alt={dish.name}
                      className="rounded me-3"
                      style={{ width: '80px', height: '80px', objectFit: 'cover' }}
                    />
                  ) : (
                    <div 
                      className="bg-light rounded d-flex justify-content-center align-items-center me-3"
                      style={{ width: '80px', height: '80px' }}
                    >
                      <i className="fas fa-utensils text-secondary"></i>
                    </div>
                  )}
                  <div>
                    <h5 className="h6 mb-1">{dish.name}</h5>
                    <p className="mb-0 small text-muted">{dish.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AngelInsightsPage;