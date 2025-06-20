const WeatherData = require('../models/WeatherData');
const axios = require('axios');

class WeatherService {
  static async getWeatherForCity(city) {
    try {
      // Tentar obter dados do cache
      const cachedData = await WeatherData.getRecentForCity(city);
      if (cachedData) {
        return cachedData;
      }
      
      // Se não tem no cache, buscar da API externa
      const apiKey = process.env.OPENWEATHER_API_KEY;
      const url = `https://api.openweathermap.org/data/2.5/weather?q=${city},BR&units=metric&appid=${apiKey}`;
      
      const response = await axios.get(url);
      const weatherData = response.data;
      
      // Formatar dados
      const data = {
        city: city,
        temperature: weatherData.main.temp,
        min_temperature: weatherData.main.temp_min,
        max_temperature: weatherData.main.temp_max,
        humidity: weatherData.main.humidity,
        wind_speed: weatherData.wind.speed,
        condition: weatherData.weather[0].description,
        icon: weatherData.weather[0].icon
      };
      
      // Salvar no banco
      await WeatherData.saveWeatherData(data);
      
      return data;
    } catch (error) {
      console.error('Erro ao buscar dados meteorológicos:', error);
      throw error;
    }
  }
}

module.exports = WeatherService;