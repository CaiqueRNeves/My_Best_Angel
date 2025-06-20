const knex = require('../db');

class WeatherData {
  constructor(data) {
    this.id = data.id;
    this.city = data.city;
    this.temperature = data.temperature;
    this.min_temperature = data.min_temperature;
    this.max_temperature = data.max_temperature;
    this.humidity = data.humidity;
    this.wind_speed = data.wind_speed;
    this.condition = data.condition;
    this.icon = data.icon;
    this.created_at = data.created_at;
    this.valid_until = data.valid_until;
  }

  // Obter dados recentes de clima para uma cidade
  static async getRecentForCity(city) {
    const data = await knex('weather_data')
      .where('city', city)
      .where('valid_until', '>', knex.fn.now())
      .first();
    
    return data ? new WeatherData(data) : null;
  }

  // Salvar dados meteorológicos
  static async saveWeatherData(data) {
    // Criar um horário de validade (2 horas a partir de agora)
    const validUntil = new Date();
    validUntil.setHours(validUntil.getHours() + 2);
    
    const [id] = await knex('weather_data').insert({
      city: data.city,
      temperature: data.temperature,
      min_temperature: data.min_temperature,
      max_temperature: data.max_temperature,
      humidity: data.humidity,
      wind_speed: data.wind_speed,
      condition: data.condition,
      icon: data.icon,
      valid_until: validUntil
    });
    
    return id;
  }
}

module.exports = WeatherData;