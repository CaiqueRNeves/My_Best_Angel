import { useState, useEffect } from 'react';

const AngelDashboardStats = () => {
  const [stats, setStats] = useState({
    totalTours: 0,
    totalVisitors: 0,
    totalBookings: 0,
    averageRating: 5.0
  });

  useEffect(() => {
    // Simular dados - em produção viria da API
    setStats({
      totalTours: 12,
      totalVisitors: 3,
      totalBookings: 28,
      averageRating: 4.8
    });
  }, []);

  return (
    <div className="row g-3 mb-4">
      <div className="col-md-3">
        <div className="card border-0 shadow-sm h-100">
          <div className="card-body d-flex align-items-center">
            <div className="flex-shrink-0 me-3">
              <div className="stat-circle bg-primary bg-opacity-10 text-primary">
                <i className="fas fa-map-marked-alt"></i>
              </div>
            </div>
            <div>
              <h6 className="card-subtitle text-muted">Tours Criados</h6>
              <h2 className="card-title h4 mb-0">{stats.totalTours}</h2>
            </div>
          </div>
        </div>
      </div>
      
      <div className="col-md-3">
        <div className="card border-0 shadow-sm h-100">
          <div className="card-body d-flex align-items-center">
            <div className="flex-shrink-0 me-3">
              <div className="stat-circle bg-success bg-opacity-10 text-success">
                <i className="fas fa-users"></i>
              </div>
            </div>
            <div>
              <h6 className="card-subtitle text-muted">Visitantes</h6>
              <h2 className="card-title h4 mb-0">{stats.totalVisitors}</h2>
            </div>
          </div>
        </div>
      </div>
      
      <div className="col-md-3">
        <div className="card border-0 shadow-sm h-100">
          <div className="card-body d-flex align-items-center">
            <div className="flex-shrink-0 me-3">
              <div className="stat-circle bg-warning bg-opacity-10 text-warning">
                <i className="fas fa-ticket-alt"></i>
              </div>
            </div>
            <div>
              <h6 className="card-subtitle text-muted">Reservas</h6>
              <h2 className="card-title h4 mb-0">{stats.totalBookings}</h2>
            </div>
          </div>
        </div>
      </div>
      
      <div className="col-md-3">
        <div className="card border-0 shadow-sm h-100">
          <div className="card-body d-flex align-items-center">
            <div className="flex-shrink-0 me-3">
              <div className="stat-circle bg-info bg-opacity-10 text-info">
                <i className="fas fa-star"></i>
              </div>
            </div>
            <div>
              <h6 className="card-subtitle text-muted">Avaliação</h6>
              <h2 className="card-title h4 mb-0">{stats.averageRating}</h2>
            </div>
          </div>
        </div>
      </div>
      
      <style jsx>{`
        .stat-circle {
          width: 50px;
          height: 50px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1.2rem;
        }
      `}</style>
    </div>
  );
};

export default AngelDashboardStats;