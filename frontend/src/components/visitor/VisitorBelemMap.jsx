import { Link } from 'react-router-dom';

const VisitorBelemMap = () => {
  const popularPlaces = [
    {
      name: 'Mercado Ver-o-Peso',
      location: 'Ver-o-Peso, Belém, PA',
      description: 'Tradicional mercado a céu aberto'
    },
    {
      name: 'Estação das Docas',
      location: 'Estação das Docas, Belém, PA',
      description: 'Complexo turístico à beira do rio'
    },
    {
      name: 'Museu Emílio Goeldi',
      location: 'Av. Magalhães Barata, Belém, PA',
      description: 'Centro de pesquisa da biodiversidade amazônica'
    },
    {
      name: 'Basílica de Nazaré',
      location: 'Nazaré, Belém, PA',
      description: 'Importante santuário religioso'
    }
  ];

  return (
    <div className="card border-0 shadow-sm mb-4">
      <div className="card-body">
        <h5 className="card-title mb-3">
          <i className="fas fa-map-marked-alt me-2 text-primary"></i>
          Mapa de Belém
        </h5>
        
        <div className="ratio ratio-16x9 mb-3">
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
        
        <h6 className="mb-3">Pontos Turísticos Populares</h6>
        <div className="list-group list-group-flush">
          {popularPlaces.map((place, index) => (
            <div key={index} className="list-group-item px-0 py-2">
              <h6 className="mb-1">{place.name}</h6>
              <p className="mb-1 small text-muted">{place.description}</p>
              <small className="text-muted">
                <i className="fas fa-map-marker-alt me-1"></i>
                {place.location}
              </small>
            </div>
          ))}
        </div>
        
        <div className="text-center mt-3">
          <Link to="/map" className="btn btn-outline-primary">
            <i className="fas fa-map me-2"></i>
            Ver Mapa Completo
          </Link>
        </div>
      </div>
    </div>
  );
};

export default VisitorBelemMap;