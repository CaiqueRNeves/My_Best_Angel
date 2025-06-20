import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import api from '../../services/api';

const AngelTourDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [tour, setTour] = useState(null);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [cancelModalOpen, setCancelModalOpen] = useState(false);
  const [messageModalOpen, setMessageModalOpen] = useState(false);
  const [selectedVisitor, setSelectedVisitor] = useState(null);
  const [messageText, setMessageText] = useState('');
  const [sendingMessage, setSendingMessage] = useState(false);
  
  useEffect(() => {
    const fetchTourDetails = async () => {
      try {
        const response = await api.get(`/angel/tour/${id}`);
        setTour(response.data.data.tour);
        setBookings(response.data.data.bookings || []);
        setLoading(false);
      } catch (error) {
        console.error('Erro ao carregar detalhes do tour:', error);
        setError('Não foi possível carregar os detalhes do tour. Tente novamente mais tarde.');
        setLoading(false);
      }
    };
    
    fetchTourDetails();
  }, [id]);
  
  const handleCancelTour = async () => {
    try {
      await api.delete(`/angel/tours/${id}`);
      
      // Show success message and redirect
      alert('Tour cancelado com sucesso!');
      navigate('/angel/tours');
    } catch (error) {
      console.error('Erro ao cancelar tour:', error);
      alert('Não foi possível cancelar o tour. Tente novamente mais tarde.');
    } finally {
      setCancelModalOpen(false);
    }
  };
  
  const handleOpenMessageModal = (visitor) => {
    setSelectedVisitor(visitor);
    setMessageModalOpen(true);
  };
  
  const handleCloseMessageModal = () => {
    setSelectedVisitor(null);
    setMessageText('');
    setMessageModalOpen(false);
  };
  
  const handleSendMessage = async () => {
    if (!messageText.trim() || !selectedVisitor) {
      return;
    }
    
    try {
      setSendingMessage(true);
      
      await api.post('/angel/messages', {
        visitorId: selectedVisitor.visitor_id,
        content: messageText
      });
      
      alert('Mensagem enviada com sucesso!');
      handleCloseMessageModal();
    } catch (error) {
      console.error('Erro ao enviar mensagem:', error);
      alert('Não foi possível enviar a mensagem. Tente novamente mais tarde.');
    } finally {
      setSendingMessage(false);
    }
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
  
  // Check if the tour date has passed
  const isTourPast = () => {
    if (!tour) return false;
    return new Date(tour.date) < new Date();
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
            <Link to="/angel/tours" className="btn btn-outline-danger">
              <i className="fas fa-arrow-left me-2"></i>
              Voltar para Tours
            </Link>
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="container py-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1 className="h3 mb-0">Detalhes do Tour</h1>
        <div>
          <Link to="/angel/tours" className="btn btn-outline-secondary me-2">
            <i className="fas fa-arrow-left me-2"></i>
            Voltar para Tours
          </Link>
          {!isTourPast() && (
            <Link to={`/angel/edit-tour/${id}`} className="btn btn-primary">
              <i className="fas fa-edit me-2"></i>
              Editar Tour
            </Link>
          )}
        </div>
      </div>
      
      {/* Tour Header Card */}
      <div className="card border-0 shadow-sm mb-4">
        <div className="card-body">
          <div className="row">
            <div className="col-md-8">
              <h2 className="card-title h4 mb-1">{tour.title}</h2>
              <p className="text-muted mb-3">
                <i className="fas fa-map-marker-alt me-2"></i>
                {tour.location}
              </p>
              
              <div className="row gx-4 mb-3">
                <div className="col-auto">
                  <div className="d-flex align-items-center">
                    <span className="badge bg-primary me-2 p-2">
                      <i className="far fa-calendar-alt"></i>
                    </span>
                    <div>
                      <small className="text-muted d-block">Data</small>
                      <strong>{formatDate(tour.date)}</strong>
                    </div>
                  </div>
                </div>
                
                <div className="col-auto">
                  <div className="d-flex align-items-center">
                    <span className="badge bg-info me-2 p-2">
                      <i className="fas fa-hourglass-half"></i>
                    </span>
                    <div>
                      <small className="text-muted d-block">Duração</small>
                      <strong>{formatDuration(tour.duration)}</strong>
                    </div>
                  </div>
                </div>
                
                <div className="col-auto">
                  <div className="d-flex align-items-center">
                    <span className="badge bg-success me-2 p-2">
                      <i className="fas fa-dollar-sign"></i>
                    </span>
                    <div>
                      <small className="text-muted d-block">Preço</small>
                      <strong>{tour.price ? `R$ ${tour.price.toFixed(2)}` : 'Gratuito'}</strong>
                    </div>
                  </div>
                </div>
              </div>
              
              <p className="card-text mb-0">
                {tour.description || 'Nenhuma descrição disponível.'}
              </p>
            </div>
            
            <div className="col-md-4">
              <div className="d-flex flex-column h-100">
                <div className="status-card p-3 mb-3 rounded">
                  <div className="d-flex justify-content-between align-items-center mb-3">
                    <h5 className="m-0">Status</h5>
                    <span className={`badge ${isTourPast() ? 'bg-secondary' : 'bg-success'}`}>
                      {isTourPast() ? 'Realizado' : 'Agendado'}
                    </span>
                  </div>
                  
                  <div className="mb-3">
                    <p className="mb-1 fw-bold">Participantes</p>
                    <div className="progress mb-2">
                      <div 
                        className="progress-bar bg-primary" 
                        role="progressbar" 
                        style={{ width: `${(tour.current_participants / tour.max_participants) * 100}%` }}
                        aria-valuenow={tour.current_participants} 
                        aria-valuemin="0" 
                        aria-valuemax={tour.max_participants}
                      >
                        {tour.current_participants}/{tour.max_participants}
                      </div>
                    </div>
                    <small className="text-muted">
                      {tour.max_participants - tour.current_participants} vagas disponíveis
                    </small>
                  </div>
                  
                  {!isTourPast() && (
                    <div className="d-grid gap-2">
                      <button
                        className="btn btn-danger"
                        onClick={() => setCancelModalOpen(true)}
                      >
                        <i className="fas fa-ban me-2"></i>
                        Cancelar Tour
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Tour Image and Map */}
      <div className="row mb-4">
        <div className="col-md-6">
          <div className="card border-0 shadow-sm h-100">
            <div className="card-body">
              <h5 className="card-title mb-3">
                <i className="fas fa-image me-2"></i>
                Imagem do Tour
              </h5>
              
              {tour.image ? (
                <img 
                  src={tour.image} 
                  alt={tour.title} 
                  className="img-fluid rounded"
                  style={{ maxHeight: '300px', width: '100%', objectFit: 'cover' }}
                />
              ) : (
                <div 
                  className="bg-light rounded d-flex justify-content-center align-items-center"
                  style={{ height: '300px' }}
                >
                  <div className="text-center">
                    <i className="fas fa-image fa-3x text-secondary mb-3"></i>
                    <p className="text-muted">Nenhuma imagem disponível</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
        
        <div className="col-md-6">
          <div className="card border-0 shadow-sm h-100">
            <div className="card-body">
              <h5 className="card-title mb-3">
                <i className="fas fa-map-marked-alt me-2"></i>
                Localização
              </h5>
              
              <div className="ratio ratio-16x9">
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
      </div>
      
      {/* Bookings */}
      <div className="card border-0 shadow-sm mb-4">
        <div className="card-body">
          <h5 className="card-title mb-3">
            <i className="fas fa-users me-2"></i>
            Participantes ({bookings.length}/{tour.max_participants})
          </h5>
          
          {bookings.length > 0 ? (
            <div className="table-responsive">
              <table className="table">
                <thead className="table-light">
                  <tr>
                    <th>Visitante</th>
                    <th>Data da Reserva</th>
                    <th>Status</th>
                    <th>Observações</th>
                    <th>Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {bookings.map((booking) => (
                    <tr key={booking.id}>
                      <td>
                        <div className="d-flex align-items-center">
                          <div 
                            className="rounded-circle bg-light d-flex justify-content-center align-items-center me-2"
                            style={{ width: 40, height: 40 }}
                          >
                            <i className="fas fa-user text-primary"></i>
                          </div>
                          <div>
                            <p className="fw-bold mb-0">{booking.visitor_name}</p>
                            <small className="text-muted">{booking.visitor_email}</small>
                          </div>
                        </div>
                      </td>
                      <td>{formatDate(booking.created_at)}</td>
                      <td>
                        <span className={`badge ${
                          booking.status === 'confirmado' ? 'bg-success' : 
                          booking.status === 'cancelado' ? 'bg-danger' : 
                          booking.status === 'realizado' ? 'bg-info' : 'bg-secondary'
                        }`}>
                          {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                        </span>
                      </td>
                      <td>
                        <p className="mb-0 small text-muted">
                          {booking.notes || 'Nenhuma observação.'}
                        </p>
                      </td>
                      <td>
                        <div className="btn-group">
                          <button 
                            className="btn btn-sm btn-outline-primary"
                            title="Enviar Mensagem"
                            onClick={() => handleOpenMessageModal(booking)}
                          >
                            <i className="fas fa-envelope"></i>
                          </button>
                          {!isTourPast() && booking.status === 'confirmado' && (
                            <button 
                              className="btn btn-sm btn-outline-danger"
                              title="Cancelar Reserva"
                            >
                              <i className="fas fa-times"></i>
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center p-4">
              <i className="fas fa-users fa-3x mb-3 text-muted"></i>
              <h5>Nenhum participante</h5>
              <p className="text-muted">
                Ainda não há reservas para este tour.
              </p>
            </div>
          )}
        </div>
      </div>
      
      {/* Cancel Tour Modal */}
      {cancelModalOpen && (
        <div className="modal-backdrop show">
          <div className="modal show d-block" tabIndex="-1">
            <div className="modal-dialog">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title">Cancelar Tour</h5>
                  <button 
                    type="button" 
                    className="btn-close" 
                    onClick={() => setCancelModalOpen(false)}
                  ></button>
                </div>
                <div className="modal-body">
                  <p>Tem certeza que deseja cancelar este tour?</p>
                  <p><strong>Atenção:</strong> Esta ação não pode ser desfeita e todas as reservas serão canceladas automaticamente.</p>
                </div>
                <div className="modal-footer">
                  <button 
                    type="button" 
                    className="btn btn-secondary" 
                    onClick={() => setCancelModalOpen(false)}
                  >
                    Cancelar
                  </button>
                  <button 
                    type="button" 
                    className="btn btn-danger"
                    onClick={handleCancelTour}
                  >
                    Sim, Cancelar Tour
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* Send Message Modal */}
      {messageModalOpen && (
        <div className="modal-backdrop show">
          <div className="modal show d-block" tabIndex="-1">
            <div className="modal-dialog">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title">Enviar Mensagem</h5>
                  <button 
                    type="button" 
                    className="btn-close" 
                    onClick={handleCloseMessageModal}
                  ></button>
                </div>
                <div className="modal-body">
                  <p>
                    Enviar mensagem para <strong>{selectedVisitor?.visitor_name}</strong>
                  </p>
                  <div className="mb-3">
                    <label htmlFor="messageText" className="form-label">Mensagem</label>
                    <textarea
                      className="form-control"
                      id="messageText"
                      rows="4"
                      value={messageText}
                      onChange={(e) => setMessageText(e.target.value)}
                      placeholder="Digite sua mensagem aqui..."
                    ></textarea>
                  </div>
                </div>
                <div className="modal-footer">
                  <button 
                    type="button" 
                    className="btn btn-secondary" 
                    onClick={handleCloseMessageModal}
                  >
                    Cancelar
                  </button>
                  <button 
                    type="button" 
                    className="btn btn-primary"
                    onClick={handleSendMessage}
                    disabled={!messageText.trim() || sendingMessage}
                  >
                    {sendingMessage ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                        Enviando...
                      </>
                    ) : (
                      'Enviar Mensagem'
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      
      <style jsx>{`
        .status-card {
          background-color: #f8f9fa;
        }
        
        .modal-backdrop {
          background-color: rgba(0, 0, 0, 0.5);
        }
        
        @media (min-width: 576px) {
          .modal-dialog {
            max-width: 500px;
            margin: 1.75rem auto;
          }
        }
      `}</style>
    </div>
  );
};

export default AngelTourDetailsPage;