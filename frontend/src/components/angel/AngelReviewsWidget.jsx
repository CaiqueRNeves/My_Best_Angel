import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../services/api';
import RatingStars from '../shared/RatingStars';

const AngelReviewsWidget = () => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    const fetchReviews = async () => {
      try {
        // Aqui, podemos simular uma chamada à API que retornaria as avaliações do Angel
        // Normalmente, teríamos algo como:
        // const response = await api.get('/angel/reviews');
        // setReviews(response.data.data);
        
        // Por enquanto, vamos usar dados simulados
        const simulatedReviews = [
          {
            id: 1,
            rating: 5,
            comment: 'Excelente guia! Conhece muito bem a cidade e nos apresentou lugares incríveis. Recomendo fortemente!',
            created_at: '2025-04-15T14:30:00',
            visitor_name: 'Maria Silva',
            tour_title: 'Mercado Ver-o-Peso'
          },
          {
            id: 2,
            rating: 4,
            comment: 'Ótimo passeio pela cidade, o guia foi muito atencioso e conhece bastante a história local.',
            created_at: '2025-04-10T16:45:00',
            visitor_name: 'João Santos',
            tour_title: 'Centro Histórico de Belém'
          },
          {
            id: 3,
            rating: 5,
            comment: 'Experiência incrível! Conhecemos a culinária paraense com um guia que entende muito do assunto.',
            created_at: '2025-04-05T19:20:00',
            visitor_name: 'Carlos Oliveira',
            tour_title: 'Tour Gastronômico'
          }
        ];
        
        setReviews(simulatedReviews);
        setLoading(false);
      } catch (error) {
        console.error('Erro ao carregar avaliações:', error);
        setError('Não foi possível carregar as avaliações. Tente novamente mais tarde.');
        setLoading(false);
      }
    };
    
    fetchReviews();
  }, []);
  
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };
  
  if (loading) {
    return (
      <div className="text-center p-4">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Carregando...</span>
        </div>
        <p className="mt-2">Carregando avaliações...</p>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="alert alert-danger" role="alert">
        {error}
      </div>
    );
  }
  
  if (reviews.length === 0) {
    return (
      <div className="text-center p-4">
        <i className="far fa-star fa-3x mb-3 text-muted"></i>
        <h5>Nenhuma avaliação ainda</h5>
        <p className="text-muted mb-0">
          Suas avaliações aparecerão aqui quando os visitantes avaliarem seus tours.
        </p>
      </div>
    );
  }
  
  return (
    <div className="reviews-widget">
      <h5 className="widget-title mb-3">
        <i className="fas fa-star me-2 text-warning"></i>
        Avaliações Recentes
      </h5>
      
      <div className="reviews-list">
        {reviews.map((review) => (
          <div key={review.id} className="review-item">
            <div className="review-header d-flex justify-content-between align-items-start">
              <h6>{review.visitor_name}</h6>
              <small className="text-muted">{formatDate(review.created_at)}</small>
            </div>
            
            <div className="review-tour mb-2">
              <small className="text-muted">
                Tour: <Link to={`/angel/tour/${review.tour_id}`} className="text-decoration-none">{review.tour_title}</Link>
              </small>
            </div>
            
            <div className="review-rating mb-2">
              <RatingStars value={review.rating} readOnly size="sm" />
            </div>
            
            <p className="review-comment mb-0">
              {review.comment}
            </p>
          </div>
        ))}
      </div>
      
      <div className="text-center mt-3">
        <Link to="/angel/reviews" className="btn btn-sm btn-outline-primary">
          Ver Todas as Avaliações
        </Link>
      </div>
      
      <style jsx>{`
        .reviews-widget {
          margin-bottom: 20px;
        }
        
        .widget-title {
          position: relative;
          padding-bottom: 10px;
        }
        
        .widget-title:after {
          content: '';
          position: absolute;
          bottom: 0;
          left: 0;
          width: 40px;
          height: 2px;
          background-color: var(--primary-color);
        }
        
        .reviews-list {
          max-height: 400px;
          overflow-y: auto;
        }
        
        .review-item {
          padding: 15px 0;
          border-bottom: 1px solid #f1f1f1;
        }
        
        .review-item:last-child {
          border-bottom: none;
        }
      `}</style>
    </div>
  );
};

export default AngelReviewsWidget;