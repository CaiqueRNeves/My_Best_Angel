import { useState, useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';

const TourDetailsPage = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const [tour, setTour] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    const fetchTourDetails = async () => {
      try {
        const response = await api.get(`/tour/details/${id}`);
        setTour(response.data.data.tour);
        setReviews(response.data.data.reviews || []);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching tour details:', error);
        setError('Não foi possível carregar os detalhes do tour.');
        setLoading(false);
      }
    };
    
    fetchTourDetails();
  }, [id]);
  
  const handleBookTour = async () => {
    if (!user) {
      // Redirect to login if not authenticated
      navigate('/auth/login', { state: { from: `/tour/details/${id}` } });
      return;
    }
    
    if (user.userType !== 'visitor') {
      alert('Apenas visitantes podem reservar tours.');
      return;
    }
    
    try {
      // Redirect to visitor booking page
      navigate(`/visitor/tour/${id}`);
    } catch (error) {
      console.error('Error booking tour:', error);
      alert('Erro ao tentar reservar o tour. Tente novamente.');
    }
  };
  
  if (loading) {
    return (
      <div className="container py-5">
        <div className="text-center">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Carregando...</span>
          </div>
          <p className="mt-2">Carregando detalhes do tour...</p>
        </div>
      </div>
    );
  }
  
  if (error || !tour) {
    return (
      <div className="container py-5">
        <div className="alert alert-danger" role="alert">
          <h4 className="alert-heading">Erro!</h4>
          <p>{error || 'Tour não encontrado.'}</p>
          <hr />
          <div className="d-flex">
            <Link to="/tour/search" className="btn btn-outline-danger">
              <i className="fas fa-arrow-left me-2"></i>
              Voltar para Busca
            </Link>
          </div>
        </div>
      </div>
    );
  }
  
  // Format date and time
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };
  
  const formatTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('pt-BR', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };
  
  // Format duration in hours and minutes
  const formatDuration = (minutes) => {
    if (!minutes) return 'Não informado';
    
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    
    if (hours > 0 && mins > 0) {
      return `${hours}h ${mins}min`;
    } else if (hours > 0) {
      return `${hours}h`;
    } else {
      return `${mins}min`;
    }
  };
  
  // Calculate availability percentage
  const availabilityPercentage = tour.max_participants 
    ? Math.round(((tour.max_participants - tour.current_participants) / tour.max_participants) * 100) 
    : 0;
  
  // Check if tour is full
  const isTourFull = tour.current_participants >= tour.max_participants;
  
  // Check if tour date has passed
  const isTourPast = new Date(tour.date) < new Date();
  
  return (
    <>
      {/* Tour Header */}
      <div className="tour-header py-5">
        <div className="container">
          <div className="row align-items-center">
            <div className="col-lg-8">
              <h1 className="display-5 fw-bold text-white mb-2">{tour.title}</h1>
              <p className="lead text-white-75 mb-3">
                <i className="fas fa-map-marker-alt me-2"></i>
                {tour.location}
              </p>
              <div className="d-flex text-white-75 mb-4">
                <div className="me-4">
                  <i className="far fa-calendar-alt me-2"></i>
                  {formatDate(tour.date)}
                </div>
                <div className="me-4">
                  <i className="far fa-clock me-2"></i>
                  {formatTime(tour.date)}
                </div>
                <div>
                  <i className="fas fa-hourglass-half me-2"></i>
                  {formatDuration(tour.duration)}
                </div>
              </div>
              <div className="d-flex align-items-center">
                <Link to="/tour/search" className="btn btn-light me-3">
                  <i className="fas fa-arrow-left me-2"></i>
                  Voltar para Busca
                </Link>
                {!isTourPast && (
                  <button 
                    className="btn btn-primary px-4"
                    onClick={handleBookTour}
                    disabled={isTourFull}
                  >
                    {isTourFull ? (
                      <>
                        <i className="fas fa-ban me-2"></i>
                        Tour Lotado
                      </>
                    ) : (
                      <>
                        <i className="fas fa-ticket-alt me-2"></i>
                        Reservar Tour
                      </>
                    )}
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

{/* Tour Details */}
<section className="py-5">
  <div className="container">
    <div className="row">
      {/* Main Content */}
      <div className="col-lg-8">
        {/* Tour Image */}
        <div className="mb-4">
          {tour.image ? (
            <img 
              src={tour.image} 
              alt={tour.title}
              className="img-fluid rounded shadow-sm w-100"
              style={{ maxHeight: '400px', objectFit: 'cover' }}
            />
          ) : (
            <div 
              className="bg-light rounded d-flex justify-content-center align-items-center shadow-sm"
              style={{ height: '300px' }}
            >
              <i className="fas fa-map-marked-alt fa-5x text-secondary"></i>
            </div>
          )}
        </div>

        {/* Tour Description */}
        <div className="card border-0 shadow-sm mb-4">
          <div className="card-body">
            <h2 className="card-title h4 mb-3">Descrição</h2>
            <p className="card-text">{tour.description || 'Nenhuma descrição disponível para este tour.'}</p>
          </div>
        </div>

        {/* Tour Details */}
        <div className="card border-0 shadow-sm mb-4">
          <div className="card-body">
            <h2 className="card-title h4 mb-3">Detalhes do Tour</h2>
            
            <div className="row g-4">
              <div className="col-md-6">
                <div className="d-flex">
                  <div className="me-3">
                    <div className="feature-icon bg-primary text-white">
                      <i className="fas fa-map-marker-alt"></i>
                    </div>
                  </div>
                  <div>
                    <h5 className="h6">Local</h5>
                    <p className="mb-0">{tour.location}</p>
                  </div>
                </div>
              </div>
              
              <div className="col-md-6">
                <div className="d-flex">
                  <div className="me-3">
                    <div className="feature-icon bg-primary text-white">
                      <i className="far fa-calendar-alt"></i>
                    </div>
                  </div>
                  <div>
                    <h5 className="h6">Data</h5>
                    <p className="mb-0">{formatDate(tour.date)}</p>
                  </div>
                </div>
              </div>
              
              <div className="col-md-6">
                <div className="d-flex">
                  <div className="me-3">
                    <div className="feature-icon bg-primary text-white">
                      <i className="far fa-clock"></i>
                    </div>
                  </div>
                  <div>
                    <h5 className="h6">Horário</h5>
                    <p className="mb-0">{formatTime(tour.date)}</p>
                  </div>
                </div>
              </div>
              
              <div className="col-md-6">
                <div className="d-flex">
                  <div className="me-3">
                    <div className="feature-icon bg-primary text-white">
                      <i className="fas fa-hourglass-half"></i>
                    </div>
                  </div>
                  <div>
                    <h5 className="h6">Duração</h5>
                    <p className="mb-0">{formatDuration(tour.duration)}</p>
                  </div>
                </div>
              </div>
              
              <div className="col-md-6">
                <div className="d-flex">
                  <div className="me-3">
                    <div className="feature-icon bg-primary text-white">
                      <i className="fas fa-users"></i>
                    </div>
                  </div>
                  <div>
                    <h5 className="h6">Tamanho do Grupo</h5>
                    <p className="mb-0">
                      {tour.current_participants}/{tour.max_participants} participantes
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="col-md-6">
                <div className="d-flex">
                  <div className="me-3">
                    <div className="feature-icon bg-primary text-white">
                      <i className="fas fa-tag"></i>
                    </div>
                  </div>
                  <div>
                    <h5 className="h6">Preço</h5>
                    <p className="mb-0">
                      {tour.price ? `R$ ${tour.price.toFixed(2)}` : 'Gratuito'}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Reviews */}
        <div className="card border-0 shadow-sm">
          <div className="card-body">
            <div className="d-flex justify-content-between align-items-center mb-3">
              <h2 className="card-title h4 mb-0">Avaliações</h2>
              <span className="badge bg-primary">
                <i className="fas fa-star me-1"></i>
                {tour.angel_rating || '5.0'}
              </span>
            </div>
            
            {reviews.length > 0 ? (
              <div className="reviews">
                {reviews.map((review, index) => (
                  <div key={index} className="review">
                    <div className="d-flex mb-2">
                      <div 
                        className="rounded-circle bg-light d-flex justify-content-center align-items-center me-3"
                        style={{ width: 50, height: 50 }}
                      >
                        <i className="fas fa-user text-primary"></i>
                      </div>
                      <div>
                        <h6 className="mb-0">{review.visitor_name || 'Visitante'}</h6>
                        <div className="text-warning small">
                          {[...Array(5)].map((_, i) => (
                            <i 
                              key={i} 
                              className={`fas fa-star ${i < review.rating ? '' : 'text-muted'}`}
                            ></i>
                          ))}
                        </div>
                        <small className="text-muted d-block">
                          {formatDate(review.created_at)}
                        </small>
                      </div>
                    </div>
                    <p className="ms-5 ps-3 border-start border-light">
                      {review.comment || 'Sem comentário.'}
                    </p>
                    {index < reviews.length - 1 && <hr />}
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-4">
                <i className="far fa-star fa-2x mb-3 text-muted"></i>
                <p>Este tour ainda não recebeu avaliações.</p>
              </div>
            )}
          </div>
        </div>
      </div>
      
      {/* Sidebar */}
      <div className="col-lg-4">
        {/* Booking Status */}
        <div className="card border-0 shadow-sm mb-4">
          <div className="card-body">
            <h4 className="card-title mb-3">Disponibilidade</h4>
            
            {isTourPast ? (
              <div className="alert alert-secondary mb-0">
                <i className="fas fa-calendar-times me-2"></i>
                Este tour já aconteceu.
              </div>
            ) : isTourFull ? (
              <div className="alert alert-danger mb-3">
                <i className="fas fa-ticket-alt me-2"></i>
                Tour Lotado
              </div>
            ) : (
              <>
                <div className="progress mb-3">
                  <div 
                    className="progress-bar bg-success" 
                    role="progressbar" 
                    style={{ width: `${availabilityPercentage}%` }}
                    aria-valuenow={availabilityPercentage} 
                    aria-valuemin="0" 
                    aria-valuemax="100"
                  >
                    {availabilityPercentage}% disponível
                  </div>
                </div>
                <p className="text-center">
                  <strong>
                    {tour.max_participants - tour.current_participants} vagas restantes
                  </strong> de um total de {tour.max_participants}
                </p>
              </>
            )}
            
            {!isTourPast && !isTourFull && (
              <div className="d-grid mt-3">
                <button 
                  className="btn btn-primary btn-lg"
                  onClick={handleBookTour}
                >
                  <i className="fas fa-ticket-alt me-2"></i>
                  Reservar Tour
                </button>
              </div>
            )}
          </div>
        </div>
        
        {/* Angel Info */}
        <div className="card border-0 shadow-sm mb-4">
          <div className="card-body">
            <h4 className="card-title mb-3">Seu Angel</h4>
            
            <div className="text-center mb-3">
              <div 
                className="rounded-circle bg-primary bg-opacity-10 d-inline-flex justify-content-center align-items-center mx-auto mb-3"
                style={{ width: 100, height: 100 }}
              >
                <i className="fas fa-user-tie fa-3x text-primary"></i>
              </div>
              <h5>{tour.angel_name}</h5>
              <div className="text-warning">
                <i className="fas fa-star"></i>
                <i className="fas fa-star"></i>
                <i className="fas fa-star"></i>
                <i className="fas fa-star"></i>
                <i className="fas fa-star-half-alt"></i>
                <span className="text-dark ms-2">{tour.angel_rating || '5.0'}</span>
              </div>
            </div>
            
            <div className="mb-3">
              <div className="d-flex mb-2">
                <div className="me-2" style={{ width: '24px' }}>
                  <i className="fas fa-envelope text-primary"></i>
                </div>
                <div>
                  <strong>Email:</strong> {tour.angel_email || 'Não disponível'}
                </div>
              </div>
              
              <div className="d-flex mb-2">
                <div className="me-2" style={{ width: '24px' }}>
                  <i className="fas fa-phone text-primary"></i>
                </div>
                <div>
                  <strong>Telefone:</strong> {tour.angel_phone || 'Não disponível'}
                </div>
              </div>
            </div>
            
            <p className="card-text small text-muted">
              Seu Angel irá recebê-lo no ponto de encontro e será seu guia 
              durante todo o passeio, compartilhando conhecimentos locais 
              e garantindo sua segurança.
            </p>
          </div>
        </div>
        
        {/* Location Map */}
        <div className="card border-0 shadow-sm">
          <div className="card-body">
            <h4 className="card-title mb-3">Localização</h4>
            
            <div className="ratio ratio-4x3 mb-3">
              <iframe 
                src={`https://www.google.com/maps/embed/v1/place?key=YOUR_API_KEY&q=${encodeURIComponent(tour.location + ', Belém, Pará, Brasil')}`}
                width="100%" 
                height="100%" 
                style={{ border: 0 }} 
                allowFullScreen 
                loading="lazy" 
                referrerPolicy="no-referrer-when-downgrade"
                title={`Mapa de ${tour.location}`}
              ></iframe>
            </div>
            
            <div className="d-grid">
              <a 
                href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(tour.location + ', Belém, Pará, Brasil')}`}
                className="btn btn-outline-primary"
                target="_blank"
                rel="noopener noreferrer"
              >
                <i className="fas fa-directions me-2"></i>
                Como Chegar
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</section>

{/* Additional CSS */}
<style jsx>{`
  .tour-header {
    background: linear-gradient(to right, var(--primary-color), var(--secondary-color));
    position: relative;
  }
  
  .tour-header::after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
    height: 50px;
    background: linear-gradient(to bottom right, transparent 49%, white 50%);
  }
  
  .text-white-75 {
    color: rgba(255, 255, 255, 0.75);
  }
  
  .feature-icon {
    width: 40px;
    height: 40px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  
  .review {
    padding: 15px 0;
  }
`}</style>
</>
);
};

export default TourDetailsPage;