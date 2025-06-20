import { useState } from 'react';

const VisitorReviewForm = ({ tourId, onSubmit, onCancel }) => {
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    
    try {
      await onSubmit({ rating, comment });
      setRating(5);
      setComment('');
    } catch (error) {
      console.error('Erro ao enviar avaliação:', error);
    } finally {
      setSubmitting(false);
    }
  };

  const handleStarClick = (value) => {
    setRating(value);
  };

  return (
    <div className="card border-0 shadow-sm">
      <div className="card-body">
        <h5 className="card-title mb-3">
          <i className="fas fa-star me-2 text-warning"></i>
          Avaliar Tour
        </h5>
        
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label">Sua Avaliação</label>
            <div className="d-flex gap-1 mb-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  className="btn btn-link p-0"
                  onClick={() => handleStarClick(star)}
                >
                  <i 
                    className={`fas fa-star fs-4 ${
                      star <= rating ? 'text-warning' : 'text-muted'
                    }`}
                  ></i>
                </button>
              ))}
            </div>
            <small className="text-muted">
              {rating === 1 && 'Muito ruim'}
              {rating === 2 && 'Ruim'}
              {rating === 3 && 'Regular'}
              {rating === 4 && 'Bom'}
              {rating === 5 && 'Excelente'}
            </small>
          </div>
          
          <div className="mb-3">
            <label htmlFor="comment" className="form-label">
              Comentário (opcional)
            </label>
            <textarea
              id="comment"
              className="form-control"
              rows="4"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Conte como foi sua experiência neste tour..."
            ></textarea>
          </div>
          
          <div className="d-flex gap-2">
            <button 
              type="submit" 
              className="btn btn-primary"
              disabled={submitting}
            >
              {submitting ? (
                <>
                  <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                  Enviando...
                </>
              ) : (
                <>
                  <i className="fas fa-paper-plane me-2"></i>
                  Enviar Avaliação
                </>
              )}
            </button>
            
            <button 
              type="button" 
              className="btn btn-secondary"
              onClick={onCancel}
              disabled={submitting}
            >
              Cancelar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default VisitorReviewForm;
