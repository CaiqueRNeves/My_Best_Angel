import { Link } from 'react-router-dom';

const AngelVisitorCard = ({ visitor, onSendMessage }) => {
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR');
  };

  return (
    <div className="card border-0 shadow-sm mb-3">
      <div className="card-body">
        <div className="row align-items-center">
          <div className="col-md-1 text-center mb-3 mb-md-0">
            <div 
              className="rounded-circle bg-primary bg-opacity-10 d-inline-flex justify-content-center align-items-center"
              style={{ width: 50, height: 50 }}
            >
              <i className="fas fa-user text-primary"></i>
            </div>
          </div>
          
          <div className="col-md-6 mb-3 mb-md-0">
            <h5 className="card-title mb-1">{visitor.name}</h5>
            <p className="text-muted mb-1">
              <i className="fas fa-envelope me-1"></i>
              {visitor.email}
            </p>
            {visitor.nationality && (
              <p className="text-muted mb-1">
                <i className="fas fa-flag me-1"></i>
                {visitor.nationality}
              </p>
            )}
            {visitor.language_preference && (
              <p className="text-muted mb-0">
                <i className="fas fa-language me-1"></i>
                {visitor.language_preference}
              </p>
            )}
          </div>
          
          <div className="col-md-3 mb-3 mb-md-0">
            <div className="text-center">
              <h6 className="mb-1">Tours Agendados</h6>
              <span className="badge bg-primary fs-6">
                {visitor.tours_count || 0}
              </span>
            </div>
            {visitor.created_at && (
              <div className="text-center mt-2">
                <small className="text-muted">
                  Desde {formatDate(visitor.created_at)}
                </small>
              </div>
            )}
          </div>
          
          <div className="col-md-2 text-center">
            <div className="btn-group-vertical">
              <button 
                className="btn btn-sm btn-primary mb-2"
                onClick={() => onSendMessage(visitor)}
                title="Enviar mensagem"
              >
                <i className="fas fa-envelope"></i>
              </button>
              <Link 
                to={`/visitor/profile/${visitor.id}`}
                className="btn btn-sm btn-outline-secondary"
                title="Ver perfil"
              >
                <i className="fas fa-user"></i>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AngelVisitorCard;
