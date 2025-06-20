import { Link } from 'react-router-dom';

const VisitorTourCard = ({ tour }) => {
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

  return (
    <div className="card border-0 shadow-sm h-100">
      <div className="card-body">
        <div className="d-flex justify-content-between align-items-start mb-2">
          <h5 className="card-title mb-0">{tour.title}</h5>
          {tour.price && (
            <span className="badge bg-primary">
              R$ {tour.price.toFixed(2)}
            </span>
          )}
        </div>
        
        <p className="card-text text-muted mb-2">
          <i className="fas fa-map-marker-alt me-1"></i> {tour.location}
        </p>
        
        <p className="card-text text-muted mb-2">
          <i className="far fa-calendar-alt me-1"></i> {formatDate(tour.date)}
        </p>
        
        {tour.duration && (
          <p className="card-text text-muted mb-3">
            <i className="fas fa-clock me-1"></i> {tour.duration} minutos
          </p>
        )}
        
        <div className="d-flex justify-content-between align-items-center">
          <small className="text-muted">
            {tour.current_participants}/{tour.max_participants} participantes
          </small>
          <Link to={`/visitor/tour/${tour.id}`} className="btn btn-sm btn-primary">
            Ver Detalhes
          </Link>
        </div>
      </div>
    </div>
  );
};

export default VisitorTourCard;