import { useState, useEffect } from 'react';

const WeatherWidget = () => {
  const [weather, setWeather] = useState({
    temperature: 32,
    condition: 'Parcialmente nublado',
    humidity: 78,
    icon: 'fas fa-cloud-sun'
  });

  useEffect(() => {
    // Simular dados do clima - em produção viria de uma API de clima
    const weatherData = {
      temperature: Math.floor(Math.random() * 10) + 28, // 28-37°C
      condition: 'Parcialmente nublado',
      humidity: Math.floor(Math.random() * 20) + 70, // 70-90%
      icon: 'fas fa-cloud-sun'
    };
    setWeather(weatherData);
  }, []);

  return (
    <div className="card border-0 shadow-sm">
      <div className="card-body">
        <h5 className="card-title mb-3">
          <i className="fas fa-cloud me-2"></i>
          Clima em Belém
        </h5>
        
        <div className="text-center mb-3">
          <i className={`${weather.icon} fa-3x text-warning mb-2`}></i>
          <h3 className="mb-0">{weather.temperature}°C</h3>
          <p className="text-muted">{weather.condition}</p>
        </div>
        
        <div className="d-flex justify-content-between">
          <div className="text-center">
            <i className="fas fa-tint text-info"></i>
            <div>
              <small className="d-block text-muted">Umidade</small>
              <strong>{weather.humidity}%</strong>
            </div>
          </div>
          <div className="text-center">
            <i className="fas fa-wind text-primary"></i>
            <div>
              <small className="d-block text-muted">Vento</small>
              <strong>12 km/h</strong>
            </div>
          </div>
        </div>
        
        <hr className="my-3" />
        
        <div className="alert alert-info py-2 mb-0">
          <small>
            <i className="fas fa-info-circle me-1"></i>
            Leve roupas leves e hidrate-se bem!
          </small>
        </div>
      </div>
    </div>
  );
};

export default WeatherWidget;