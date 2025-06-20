import { useState, useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import api from '../../services/api';
import VisitorReviewForm from '../../components/visitor/VisitorReviewForm';

const VisitorTourDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [tour, setTour] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [bookingNotes, setBookingNotes] = useState('');
  const [isBooking, setIsBooking] = useState(false);
  const [success, setSuccess] = useState(false);
  
  useEffect(() => {
    const fetchTourDetails = async () => {
      try {
        const response = await api.get(`/visitor/tours/${id}`);
        setTour(response.data.data);
        setLoading(false);
      } catch (error) {
        console.error('Erro ao carregar detalhes do tour:', error);
        setError('Não foi possível carregar os detalhes do tour. Tente novamente mais tarde.');
        setLoading(false);
      }
    };
    
    fetchTourDetails();
  }, [id]);
  
  const handleBookingNotesChange = (e) => {
    setBookingNotes(e.target.value);
  };
  
  const handleBookTour = async () => {
    try {
      setIsBooking(true);
      
      await api.post(`/visitor/book-tour/${id}`, { notes: bookingNotes });
      
      setSuccess(true);
      
      // Redirect after a delay
      setTimeout(() => {
        navigate('/visitor/dashboard');
      }, 3000);
    } catch (error) {
      console.error('Erro ao reservar tour:', error);
      setError(error.response?.data?.message || 'Erro ao reservar tour. Tente novamente.');
      setIsBooking(false);
    }
  };
  
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
  
  if (error && !tour) {
    return (
      <div className="container py-5">
        <div className="alert alert-danger" role="alert">
          <h4 className="alert-heading">Erro!</h4>
          <p>{error}</p>
          <hr />
          <div className="d-flex">
            <Link to="/visitor/available-tours" className="btn btn-outline-danger">
              <i className="fas fa-arrow-left me-2"></i>
              Voltar para Tours Disponíveis
            </Link>
          </div>
        </div>
      </div>
    );
  }
  
  // Check if tour date has passed
  const isTourPast = new Date(tour.date) < new Date();
  
  return (
    <div className="container py-4">
      {success && (
        <div className="alert alert-success alert-dismissible fade show mb-4" role="alert">
          <strong>Reserva confirmada!</strong> Seu tour foi reservado com sucesso. Redirecionando para o dashboard...
          <button type="button" className="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
        </div>
      )}
      
      {error && !loading && (
        <div className="alert alert-danger alert-dismissible fade show mb-4" role="alert">
          <strong>Erro!</strong> {error}
          <button type="button" className="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
        </div>
      )}
      
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1 className="h3 mb-0">Detalhes do Tour</h1>
        <Link to="/visitor/available-tours" className="btn btn-outline-secondary">
          <i className="fas fa-arrow-left me-2"></i>
          Voltar para Tours
        </Link>
      </div>
      
      <div className="row">
        <div className="col-lg-8">
          {/* Tour Details */}
          <div className="card border-0 shadow-sm mb-4">
            <div className="card-body p-4">
              <div className="d-flex justify-content-between align-items-start mb-3">
                <h2 className="card-title h4 mb-0">{tour.title}</h2>
                <span className="badge bg-primary">
                  {tour.price ? `R$ ${tour.price.toFixed(2)}` : 'Gratuito'}
                </span>
              </div>
              
              <div className="d-flex flex-wrap text-muted mb-4">
                <div className="me-4 mb-2">
                  <i className="fas fa-map-marker-alt me-2"></i>
                  {tour.location}
                </div>
                <div className="me-4 mb-2">
                  <i className="far fa-calendar-alt me-2"></i>
                  {formatDate(tour.date)}
                </div>
                <div className="me-4 mb-2">
                  <i className="far fa-clock me-2"></i>
                  {formatTime(tour.date)}
                </div>
                <div className="mb-2">
                  <i className="fas fa-hourglass-half me-2"></i>
                  {formatDuration(tour.duration)}
                </div>
              </div>
              
              {tour.image ? (
                <img 
                  src={tour.image} 
                  alt={tour.title} 
                  className="img-fluid rounded mb-4"
                  style={{ maxHeight: '400px', width: '100%', objectFit: 'cover' }}
                />
              ) : (
                <div 
                  className="bg-light rounded d-flex justify-content-center align-items-center mb-4"
                  style={{ height: '250px' }}
                >
                  <i className="fas fa-map-marked-alt fa-5x text-secondary"></i>
                </div>
              )}
              
              <h5>Descrição</h5>
              <p>{tour.description || 'Nenhuma descrição disponível para este tour.'}</p>
              
              <hr className="my-4" />
              
              <div className="row g-4">
                <div className="col-md-6">
                  <div className="d-flex">
                    <div className="me-3">
                      <div className="feature-icon bg-primary text-white">
                        <i className="fas fa-users"></i>
                      </div>
                    </div>
                    <div>
                      <h6>Participantes</h6>
                      <p className="mb-0">
                        {tour.current_participants}/{tour.max_participants} pessoas
                      </p>
                    </div>
                  </div>
                </div>
                
                <div className="col-md-6">
                  <div className="d-flex">
                    <div className="me-3">
                      <div className="feature-icon bg-primary text-white">
                        <i className="fas fa-user-tie"></i>
                      </div>
                    </div>
                    <div>
                      <h6>Seu Angel</h6>
                      <p className="mb-0">{tour.angel_name}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Location Map */}
          <div className="card border-0 shadow-sm mb-4">
            <div className="card-body p-4">
              <h4 className="card-title mb-3">Localização</h4>
              <div className="ratio ratio-16x9 mb-3">
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
            </div>
          </div>
        </div>
        
        <div className="col-lg-4">
          {/* Booking Card */}
          <div className="card border-0 shadow-sm mb-4 sticky-lg-top" style={{ top: '2rem', zIndex: 100 }}>
            <div className="card-body p-4">
              <h4 className="card-title mb-3">Reservar Este Tour</h4>
              
              {isTourPast ? (
                <div className="alert alert-secondary mb-0">
                  <i className="fas fa-calendar-times me-2"></i>
                  Este tour já aconteceu.
                </div>
              ) : tour.already_booked ? (
                <div className="alert alert-success mb-3">
                <i className="fas fa-check-circle me-2"></i>
                Você já reservou este tour!
              </div>
            ) : (
              <>
                <div className="mb-3">
                  <div className="progress mb-2">
                    <div 
                      className="progress-bar bg-success" 
                      role="progressbar" 
                      style={{ width: `${((tour.max_participants - tour.current_participants) / tour.max_participants) * 100}%` }}
                      aria-valuenow={tour.max_participants - tour.current_participants} 
                      aria-valuemin="0" 
                      aria-valuemax={tour.max_participants}
                    >
                      {tour.max_participants - tour.current_participants} vagas disponíveis
                    </div>
                  </div>
                  <small className="text-muted">
                    {tour.current_participants} de {tour.max_participants} vagas preenchidas
                  </small>
                </div>
                
                <div className="mb-3">
                  <label htmlFor="bookingNotes" className="form-label">Observações para o Angel</label>
                  <textarea
                    className="form-control"
                    id="bookingNotes"
                    rows="3"
                    placeholder="Restrições alimentares, necessidades especiais, etc."
                    value={bookingNotes}
                    onChange={handleBookingNotesChange}
                  ></textarea>
                </div>
                
                <div className="d-grid">
                  <button 
                    className="btn btn-primary btn-lg"
                    onClick={handleBookTour}
                    disabled={isBooking}
                  >
                    {isBooking ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                        Reservando...
                      </>
                    ) : (
                      <>
                        <i className="fas fa-ticket-alt me-2"></i>
                        Reservar Tour
                      </>
                    )}
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
        
        {/* Angel Info */}
        <div className="card border-0 shadow-sm mb-4">
          <div className="card-body p-4">
            <h4 className="card-title mb-3">Seu Angel</h4>
            
            <div className="text-center mb-3">
              <div 
                className="rounded-circle bg-primary bg-opacity-10 d-inline-flex justify-content-center align-items-center mb-3"
                style={{ width: 80, height: 80 }}
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
              </div>
            </div>
            
            <div className="mb-3">
              <div className="d-flex mb-2">
                <i className="fas fa-envelope text-primary me-2 mt-1" style={{ width: '20px' }}></i>
                <div>
                  <strong>Email:</strong><br />
                  {tour.angel_email || 'Email não disponível'}
                </div>
              </div>
              
              <div className="d-flex mb-2">
                <i className="fas fa-phone text-primary me-2 mt-1" style={{ width: '20px' }}></i>
                <div>
                  <strong>Telefone:</strong><br />
                  {tour.angel_phone || 'Telefone não disponível'}
                </div>
              </div>
            </div>
            
            <div className="d-grid">
              <Link to="/visitor/messages" className="btn btn-outline-primary">
                <i className="fas fa-envelope me-2"></i>
                Enviar Mensagem
              </Link>
            </div>
          </div>
        </div>
        
        {/* Travel Tips */}
        <div className="card border-0 shadow-sm">
          <div className="card-body p-4">
            <h4 className="card-title mb-3">
              <i className="fas fa-lightbulb text-warning me-2"></i>
              Dicas para o Tour
            </h4>
            
            <ul className="list-group list-group-flush">
              <li className="list-group-item px-0">
                <div className="d-flex">
                  <div className="me-3">
                    <div className="tip-icon">
                      <i className="fas fa-tshirt"></i>
                    </div>
                  </div>
                  <div>
                    <h6>Vestimenta</h6>
                    <p className="small text-muted mb-0">
                      Use roupas leves e confortáveis. Não esqueça protetor solar e chapéu.
                    </p>
                  </div>
                </div>
              </li>
              <li className="list-group-item px-0">
                <div className="d-flex">
                  <div className="me-3">
                    <div className="tip-icon">
                      <i className="fas fa-tint"></i>
                    </div>
                  </div>
                  <div>
                    <h6>Hidratação</h6>
                    <p className="small text-muted mb-0">
                      Leve uma garrafa de água. O clima de Belém é quente e úmido.
                    </p>
                  </div>
                </div>
              </li>
              <li className="list-group-item px-0">
                <div className="d-flex">
                  <div className="me-3">
                    <div className="tip-icon">
                      <i className="fas fa-camera"></i>
                    </div>
                  </div>
                  <div>
                    <h6>Câmera</h6>
                    <p className="small text-muted mb-0">
                      Traga sua câmera para registrar os momentos especiais deste tour.
                    </p>
                  </div>
                </div>
              </li>
              <li className="list-group-item px-0">
                <div className="d-flex">
                  <div className="me-3">
                    <div className="tip-icon">
                      <i className="fas fa-clock"></i>
                    </div>
                  </div>
                  <div>
                    <h6>Pontualidade</h6>
                    <p className="small text-muted mb-0">
                      Chegue com 15 minutos de antecedência ao ponto de encontro.
                    </p>
                  </div>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
    
    <style jsx>{`
      .feature-icon {
        width: 40px;
        height: 40px;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
      }
      
      .tip-icon {
        width: 36px;
        height: 36px;
        background-color: rgba(22, 160, 133, 0.1);
        color: var(--primary-color);
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
      }
      
      @media (min-width: 992px) {
        .sticky-lg-top {
          position: sticky;
          top: 2rem;
        }
      }
    `}</style>
  </div>
);
};

export default VisitorTourDetailsPage;