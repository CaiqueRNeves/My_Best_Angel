import { useState, useEffect, useRef } from 'react';

const TourLocationPicker = ({ location, onChange, apiKey = 'YOUR_API_KEY' }) => {
  const [mapLoaded, setMapLoaded] = useState(false);
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [coordinates, setCoordinates] = useState(null);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [belemCoordinates] = useState({
    lat: -1.4557,
    lng: -48.5022
  }); // Coordenadas de Belém do Pará
  
  const suggestionListRef = useRef(null);
  const inputRef = useRef(null);
  
  // Locais populares em Belém para sugestões rápidas
  const popularPlaces = [
    {
      name: 'Mercado Ver-o-Peso',
      full: 'Mercado Ver-o-Peso, Belém, PA',
      coordinates: { lat: -1.4545, lng: -48.5020 }
    },
    {
      name: 'Estação das Docas',
      full: 'Estação das Docas, Belém, PA',
      coordinates: { lat: -1.4493, lng: -48.5018 }
    },
    {
      name: 'Museu Emílio Goeldi',
      full: 'Museu Emílio Goeldi, Belém, PA',
      coordinates: { lat: -1.4528, lng: -48.4740 }
    },
    {
      name: 'Basílica de Nazaré',
      full: 'Basílica de Nazaré, Belém, PA',
      coordinates: { lat: -1.4494, lng: -48.4888 }
    },
    {
      name: 'Mangal das Garças',
      full: 'Mangal das Garças, Belém, PA',
      coordinates: { lat: -1.4654, lng: -48.5030 }
    },
    {
      name: 'Teatro da Paz',
      full: 'Teatro da Paz, Belém, PA',
      coordinates: { lat: -1.4562, lng: -48.5024 }
    },
    {
      name: 'Forte do Presépio',
      full: 'Forte do Presépio, Belém, PA',
      coordinates: { lat: -1.4557, lng: -48.5055 }
    },
    {
      name: 'Parque Zoobotânico',
      full: 'Parque Zoobotânico, Belém, PA',
      coordinates: { lat: -1.4528, lng: -48.4738 }
    }
  ];
  
  // Fechar sugestões quando clicar fora
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (suggestionListRef.current && !suggestionListRef.current.contains(event.target) && 
          inputRef.current && !inputRef.current.contains(event.target)) {
        setShowSuggestions(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);
  
  useEffect(() => {
    // Inicializar o mapa
    setMapLoaded(true);
    
    // Buscar coordenadas se tiver localização
    if (location) {
      const existingPlace = popularPlaces.find(place => 
        place.full.toLowerCase() === location.toLowerCase() || 
        place.name.toLowerCase() === location.toLowerCase()
      );
      
      if (existingPlace) {
        setCoordinates(existingPlace.coordinates);
      } else {
        geocodeLocation(location);
      }
    }
  }, [location]);
  
  const geocodeLocation = async (address) => {
    if (!address) return;
    
    setLoading(true);
    
    try {
      // Aqui você implementaria a chamada real à API do Google Geocoding
      // Como exemplo, simularemos criando coordenadas levemente aleatórias ao redor de Belém
      
      // Simulação de resposta de geocodificação
      setTimeout(() => {
        const randomLat = belemCoordinates.lat + (Math.random() - 0.5) * 0.02;
        const randomLng = belemCoordinates.lng + (Math.random() - 0.5) * 0.02;
        
        setCoordinates({
          lat: randomLat,
          lng: randomLng
        });
        
        setLoading(false);
      }, 500);
    } catch (error) {
      console.error('Erro ao geocodificar endereço:', error);
      setLoading(false);
    }
  };
  
  const handleInputFocus = () => {
    if (location) {
      searchSuggestions(location);
    }
    setShowSuggestions(true);
  };
  
  const handleInputChange = (e) => {
    const value = e.target.value;
    onChange(value);
    
    if (value.length > 2) {
      searchSuggestions(value);
    } else {
      setSuggestions([]);
    }
  };
  
  const searchSuggestions = (query) => {
    setLoading(true);
    
    // Filtra os locais populares
    const filteredPlaces = popularPlaces.filter(
      place => place.name.toLowerCase().includes(query.toLowerCase()) || 
               place.full.toLowerCase().includes(query.toLowerCase())
    );
    
    // Simula uma chamada à API de Places
    setTimeout(() => {
      setSuggestions(filteredPlaces.slice(0, 5));
      setShowSuggestions(true);
      setLoading(false);
    }, 300);
  };
  
  const handleSuggestionClick = (suggestion) => {
    onChange(suggestion.full);
    setCoordinates(suggestion.coordinates);
    setSuggestions([]);
    setShowSuggestions(false);
  };
  
  const handlePopularPlaceClick = (place) => {
    onChange(place.full);
    setCoordinates(place.coordinates);
    setSuggestions([]);
  };
  
  // Determine o src do iframe usando as coordenadas se disponíveis
  const getMapSrc = () => {
    if (coordinates) {
      return `https://www.google.com/maps/embed/v1/place?key=${apiKey}&q=${coordinates.lat},${coordinates.lng}&zoom=15`;
    }
    return `https://www.google.com/maps/embed/v1/place?key=${apiKey}&q=${encodeURIComponent(location || 'Belém, Pará, Brasil')}`;
  };
  
  return (
    <div className="tour-location-picker">
      <h5 className="card-title mb-3">
        <i className="fas fa-map-marker-alt me-2 text-primary"></i>
        Selecionar Localização
      </h5>
      
      <div className="mb-3 position-relative">
        <div className="input-group">
          <span className="input-group-text">
            <i className="fas fa-map-marker-alt"></i>
          </span>
          <input
            type="text"
            className="form-control"
            placeholder="Digite o local do tour..."
            value={location || ''}
            onChange={handleInputChange}
            onFocus={handleInputFocus}
            ref={inputRef}
            autoComplete="off"
          />
          {loading && (
            <span className="input-group-text">
              <div className="spinner-border spinner-border-sm" role="status">
                <span className="visually-hidden">Carregando...</span>
              </div>
            </span>
          )}
        </div>
        
        {showSuggestions && suggestions.length > 0 && (
          <div className="suggestions-dropdown" ref={suggestionListRef}>
            {suggestions.map((suggestion, index) => (
              <div 
                key={index}
                className="suggestion-item"
                onClick={() => handleSuggestionClick(suggestion)}
              >
                <i className="fas fa-map-marker-alt me-2 text-primary"></i>
                <div>
                  <div className="suggestion-name">{suggestion.name}</div>
                  <div className="suggestion-address">{suggestion.full}</div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      
      <div className="popular-places mb-3">
        <p className="fw-bold mb-2 small">Locais Populares em Belém:</p>
        <div className="d-flex flex-wrap gap-2">
          {popularPlaces.slice(0, 6).map((place, index) => (
            <button
              key={index}
              type="button"
              className={`btn btn-sm ${location === place.full ? 'btn-primary' : 'btn-outline-primary'}`}
              onClick={() => handlePopularPlaceClick(place)}
            >
              {place.name}
            </button>
          ))}
        </div>
      </div>
      
      <div className="map-container">
        <div className="ratio ratio-16x9">
          <iframe 
            src={getMapSrc()}
            width="100%" 
            height="100%" 
            style={{ border: 0 }} 
            allowFullScreen 
            loading="lazy" 
            referrerPolicy="no-referrer-when-downgrade"
            title={`Localização do Tour${location ? `: ${location}` : ''}`}
          ></iframe>
        </div>
        <div className="map-actions mt-2">
          <div className="d-flex align-items-center justify-content-between">
            <small className="text-muted">
              <i className="fas fa-info-circle me-1"></i>
              {coordinates 
                ? 'Localização mapeada com precisão.' 
                : 'Digite um endereço mais específico para maior precisão.'}
            </small>
            {coordinates && (
              <button 
                className="btn btn-sm btn-outline-secondary"
                onClick={() => window.open(`https://www.google.com/maps/search/?api=1&query=${coordinates.lat},${coordinates.lng}`, '_blank')}
              >
                <i className="fas fa-external-link-alt me-1"></i>
                Abrir no Google Maps
              </button>
            )}
          </div>
        </div>
      </div>
      
      <style jsx="true">{`
        .tour-location-picker {
          margin-bottom: 20px;
        }
        
        .suggestions-dropdown {
          position: absolute;
          top: 100%;
          left: 0;
          right: 0;
          z-index: 1000;
          background: white;
          border: 1px solid #dee2e6;
          border-radius: 0 0 4px 4px;
          max-height: 300px;
          overflow-y: auto;
          box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
        }
        
        .suggestion-item {
          padding: 10px 15px;
          cursor: pointer;
          display: flex;
          align-items: flex-start;
          border-bottom: 1px solid #f1f1f1;
          transition: background-color 0.2s;
        }
        
        .suggestion-item:hover {
          background-color: #f8f9fa;
        }
        
        .suggestion-name {
          font-weight: 500;
        }
        
        .suggestion-address {
          font-size: 0.8rem;
          color: #6c757d;
        }
        
        .map-container {
          border: 1px solid #dee2e6;
          border-radius: 4px;
          overflow: hidden;
        }
        
        .popular-places {
          padding: 10px;
          background-color: #f8f9fa;
          border-radius: 4px;
        }
      `}</style>
    </div>
  );
};

export default TourLocationPicker;