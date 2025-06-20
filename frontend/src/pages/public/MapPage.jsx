import { useState } from 'react';
import { Link } from 'react-router-dom';

const MapPage = () => {
  const [activeFilter, setActiveFilter] = useState('all');
  const [showSidebar, setShowSidebar] = useState(true);
  
  const filters = [
    { id: 'all', name: 'Todos', icon: 'fas fa-map-marker-alt' },
    { id: 'attractions', name: 'Atrações', icon: 'fas fa-monument' },
    { id: 'restaurants', name: 'Restaurantes', icon: 'fas fa-utensils' },
    { id: 'hotels', name: 'Hotéis', icon: 'fas fa-hotel' },
    { id: 'parks', name: 'Parques', icon: 'fas fa-tree' },
    { id: 'museums', name: 'Museus', icon: 'fas fa-landmark' },
    { id: 'cop30', name: 'Locais da COP30', icon: 'fas fa-globe-americas' }
  ];
  
  const handleFilterChange = (filterId) => {
    setActiveFilter(filterId);
  };
  
  const toggleSidebar = () => {
    setShowSidebar(!showSidebar);
  };
  
  return (
    <div className="map-page-container">
      {/* Map Sidebar */}
      <div className={`map-sidebar ${showSidebar ? 'show' : 'hide'}`}>
        <div className="sidebar-header">
          <h2>Mapa de Belém</h2>
          <button className="btn-toggle" onClick={toggleSidebar}>
            <i className="fas fa-chevron-left"></i>
          </button>
        </div>
        
        <div className="sidebar-filters">
          <h5>Filtros</h5>
          <div className="filter-buttons">
            {filters.map(filter => (
              <button
                key={filter.id}
                className={`filter-btn ${activeFilter === filter.id ? 'active' : ''}`}
                onClick={() => handleFilterChange(filter.id)}
              >
                <i className={filter.icon}></i>
                <span>{filter.name}</span>
              </button>
            ))}
          </div>
        </div>
        
        <div className="sidebar-content">
          <h5>Pontos de Interesse</h5>
          
          <div className="place-list">
            <div className="place-item">
              <div className="place-icon">
                <i className="fas fa-landmark"></i>
              </div>
              <div className="place-info">
                <h6>Mercado Ver-o-Peso</h6>
                <p className="text-muted small">Mercado tradicional</p>
                <div className="place-actions">
                  <button className="btn btn-sm btn-outline-primary">
                    <i className="fas fa-directions"></i> Direções
                  </button>
                  <Link to="/tour/search?location=Ver-o-Peso" className="btn btn-sm btn-outline-success">
                    <i className="fas fa-search"></i> Tours
                  </Link>
                </div>
              </div>
            </div>
            
            <div className="place-item">
              <div className="place-icon">
                <i className="fas fa-monument"></i>
              </div>
              <div className="place-info">
                <h6>Estação das Docas</h6>
                <p className="text-muted small">Complexo turístico</p>
                <div className="place-actions">
                  <button className="btn btn-sm btn-outline-primary">
                    <i className="fas fa-directions"></i> Direções
                  </button>
                  <Link to="/tour/search?location=Estação das Docas" className="btn btn-sm btn-outline-success">
                    <i className="fas fa-search"></i> Tours
                  </Link>
                </div>
              </div>
            </div>
            
            <div className="place-item">
              <div className="place-icon">
                <i className="fas fa-landmark"></i>
              </div>
              <div className="place-info">
                <h6>Basílica de Nazaré</h6>
                <p className="text-muted small">Igreja histórica</p>
                <div className="place-actions">
                  <button className="btn btn-sm btn-outline-primary">
                    <i className="fas fa-directions"></i> Direções
                  </button>
                  <Link to="/tour/search?location=Basílica de Nazaré" className="btn btn-sm btn-outline-success">
                    <i className="fas fa-search"></i> Tours
                  </Link>
                </div>
              </div>
            </div>
            
            <div className="place-item">
              <div className="place-icon">
                <i className="fas fa-tree"></i>
              </div>
              <div className="place-info">
                <h6>Mangal das Garças</h6>
                <p className="text-muted small">Parque ecológico</p>
                <div className="place-actions">
                  <button className="btn btn-sm btn-outline-primary">
                    <i className="fas fa-directions"></i> Direções
                  </button>
                  <Link to="/tour/search?location=Mangal das Garças" className="btn btn-sm btn-outline-success">
                    <i className="fas fa-search"></i> Tours
                  </Link>
                </div>
              </div>
            </div>
            
            <div className="place-item">
              <div className="place-icon">
                <i className="fas fa-landmark"></i>
              </div>
              <div className="place-info">
                <h6>Museu Emílio Goeldi</h6>
                <p className="text-muted small">Museu de história natural</p>
                <div className="place-actions">
                  <button className="btn btn-sm btn-outline-primary">
                    <i className="fas fa-directions"></i> Direções
                  </button>
                  <Link to="/tour/search?location=Museu Emílio Goeldi" className="btn btn-sm btn-outline-success">
                    <i className="fas fa-search"></i> Tours
                  </Link>
                </div>
              </div>
            </div>
            
            <div className="place-item">
              <div className="place-icon">
                <i className="fas fa-globe-americas"></i>
              </div>
              <div className="place-info">
                <h6>Hangar - Centro de Convenções</h6>
                <p className="text-muted small">Local principal da COP30</p>
                <div className="place-actions">
                  <button className="btn btn-sm btn-outline-primary">
                    <i className="fas fa-directions"></i> Direções
                  </button>
                  <Link to="/cop30" className="btn btn-sm btn-outline-success">
                    <i className="fas fa-info-circle"></i> Eventos
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="sidebar-footer">
          <Link to="/tour/search" className="btn btn-primary w-100">
            <i className="fas fa-map-marked-alt me-2"></i>
            Explorar Tours em Belém
          </Link>
        </div>
      </div>
      
      {/* Toggle Button (visible when sidebar is hidden) */}
      {!showSidebar && (
        <button className="sidebar-toggle-btn" onClick={toggleSidebar}>
          <i className="fas fa-chevron-right"></i>
        </button>
      )}
      
      {/* Map Container */}
      <div className="map-container">
        {/* Embedded Google Map */}
        <iframe 
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d127671.14043778034!2d-48.54200087444646!3d-1.4378376428728236!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x92a46669f5986e5f%3A0xe36afd50b57e077b!2sBel%C3%A9m%2C%20PA!5e0!3m2!1spt-BR!2sbr!4v1668796267185!5m2!1spt-BR!2sbr" 
          width="100%" 
          height="100%" 
          style={{ border: 0 }} 
          allowFullScreen 
          loading="lazy" 
          referrerPolicy="no-referrer-when-downgrade"
          title="Mapa de Belém"
        ></iframe>
      </div>
      
      {/* Additional CSS */}
      <style jsx>{`
        .map-page-container {
          display: flex;
          height: calc(100vh - var(--header-height) - 56px); /* Adjust height based on header and footer */
          position: relative;
        }
        
        .map-sidebar {
          width: 350px;
          background: white;
          box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
          z-index: 10;
          display: flex;
          flex-direction: column;
          transition: transform 0.3s ease-in-out;
        }
        
        .map-sidebar.hide {
          transform: translateX(-100%);
        }
        
        .sidebar-header {
          padding: 1rem;
          border-bottom: 1px solid #eee;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        
        .sidebar-header h2 {
          margin: 0;
          font-size: 1.5rem;
        }
        
        .btn-toggle {
          background: none;
          border: none;
          font-size: 1.2rem;
          cursor: pointer;
          color: var(--dark-color);
        }
        
        .sidebar-filters {
          padding: 1rem;
          border-bottom: 1px solid #eee;
        }
        
        .filter-buttons {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
        }
        
        .filter-btn {
          background: #f8f9fa;
          border: 1px solid #eee;
          border-radius: 20px;
          padding: 0.4rem 0.8rem;
          font-size: 0.9rem;
          display: flex;
          align-items: center;
          cursor: pointer;
          transition: all 0.2s ease;
        }
        
        .filter-btn i {
          margin-right: 5px;
        }
        
        .filter-btn.active {
          background: var(--primary-color);
          color: white;
          border-color: var(--primary-color);
        }
        
        .sidebar-content {
          padding: 1rem;
          flex: 1;
          overflow-y: auto;
        }
        
        .place-list {
          margin-top: 1rem;
        }
        
        .place-item {
          display: flex;
          margin-bottom: 1rem;
          padding-bottom: 1rem;
          border-bottom: 1px solid #eee;
        }
        
        .place-icon {
          width: 40px;
          height: 40px;
          background: rgba(22, 160, 133, 0.1);
          color: var(--primary-color);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-right: 1rem;
          flex-shrink: 0;
        }
        
        .place-info {
          flex: 1;
        }
        
        .place-info h6 {
          margin-bottom: 0.2rem;
        }
        
        .place-actions {
          display: flex;
          gap: 0.5rem;
          margin-top: 0.5rem;
        }
        
        .sidebar-footer {
          padding: 1rem;
          border-top: 1px solid #eee;
        }
        
        .sidebar-toggle-btn {
          position: absolute;
          top: 15px;
          left: 15px;
          z-index: 5;
          width: 40px;
          height: 40px;
          background: white;
          border: none;
          border-radius: 50%;
          box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
        }
        
        .map-container {
          flex: 1;
          position: relative;
        }
        
        /* Responsive adjustments */
        @media (max-width: 768px) {
          .map-sidebar {
            position: absolute;
            height: 100%;
            width: 280px;
          }
          
          .filter-btn span {
            display: none;
          }
          
          .filter-btn i {
            margin-right: 0;
          }
        }
      `}</style>
    </div>
  );
};

export default MapPage;