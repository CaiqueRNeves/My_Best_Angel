import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const AngelUpcomingTours = () => {
  const [tours, setTours] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simular carregamento de dados
    setTimeout(() => {
      setTours([
        {
          id: 1,
          title: 'Mercado Ver-o-Peso',
          location: 'Ver-o-Peso, Belém, PA',
          date: '2025-06-25 09:00:00',
          current_participants: 4,
          max_participants: 8
        },
        {
          id: 2,
          title: 'Tour Gastronômico',
          location: 'Centro Histórico, Belém, PA',
          date: '2025-06-26 18:00:00',
          current_participants: 2,
          max_participants: 6
        }
      ]);
      setLoading(false);
    }, 1000);
  }, []);

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

  if (loading) {
    return (
      <div className="text-center p-4">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Carregando...</span>
        </div>
      </div>
    );
  }

  if (tours.length === 0) {
    return (
      <div className="text-center p-4 bg-light rounded">
        <i className="fas fa-calendar-times fa-3x mb-3 text-muted"></i>
        <h5>Nenhum tour agendado</h5>
        <p className="mb-3">Você não tem tours agendados para os próximos dias.</p>
        <Link to="/angel/create-tour" className="btn btn-primary">
          <i className="fas fa-plus-circle me-2"></i>
          Criar Primeiro Tour
        </Link>
      </div>
    );
  }

  return (
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
          {tours.map(tour => (
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
  );
};

export default AngelUpcomingTours;
