const knex = require('../db');
const moment = require('moment');
const Angel = require('./Angel');

class Review {
  constructor(data) {
    this.id = data.id;
    this.tour_id = data.tour_id;
    this.visitor_id = data.visitor_id;
    this.angel_id = data.angel_id;
    this.rating = data.rating;
    this.comment = data.comment;
    this.created_at = data.created_at;
    
    // Propriedades adicionais de joins
    this.visitor_name = data.visitor_name;
    this.tour_title = data.tour_title;
  }

  // Formatar data para exibição
  getFormattedDate() {
    return moment(this.created_at).format('DD/MM/YYYY HH:mm');
  }

  // Buscar reviews de um Angel
  static async findByAngelId(angelId, limit = null) {
    let query = knex('reviews')
      .select(
        'reviews.*',
        'visitors.name as visitor_name',
        'tours.title as tour_title'
      )
      .join('visitors', 'reviews.visitor_id', 'visitors.id')
      .join('tours', 'reviews.tour_id', 'tours.id')
      .where('reviews.angel_id', angelId)
      .orderBy('reviews.created_at', 'desc');
    
    if (limit) {
      query = query.limit(limit);
    }
    
    const reviews = await query;
    return reviews.map(review => new Review(review));
  }

  // Buscar reviews de um Tour
  static async findByTourId(tourId, limit = null) {
    let query = knex('reviews')
      .select(
        'reviews.*',
        'visitors.name as visitor_name'
      )
      .join('visitors', 'reviews.visitor_id', 'visitors.id')
      .where('reviews.tour_id', tourId)
      .orderBy('reviews.created_at', 'desc');
    
    if (limit) {
      query = query.limit(limit);
    }
    
    const reviews = await query;
    return reviews.map(review => new Review(review));
  }

  // Verificar se um visitante já avaliou um tour
  static async hasReviewed(tourId, visitorId) {
    const review = await knex('reviews')
      .where('tour_id', tourId)
      .where('visitor_id', visitorId)
      .first();
    
    return !!review;
  }

  // Criar uma nova avaliação (com atualização do rating do Angel)
  static async create(tourId, visitorId, angelId, rating, comment) {
    try {
      return await knex.transaction(async trx => {
        // Verificar se já avaliou este tour
        const existingReview = await trx('reviews')
          .where('tour_id', tourId)
          .where('visitor_id', visitorId)
          .first();
        
        if (existingReview) {
          throw new Error('Você já avaliou este tour');
        }
        
        // Inserir avaliação
        const [reviewId] = await trx('reviews')
          .insert({
            tour_id: tourId,
            visitor_id: visitorId,
            angel_id: angelId,
            rating: rating,
            comment: comment || ''
          });
        
        // Atualizar status da reserva para 'realizado'
        await trx('bookings')
          .where('tour_id', tourId)
          .where('visitor_id', visitorId)
          .update({
            status: 'realizado',
            updated_at: trx.fn.now()
          });
        
        // Atualizar avaliação média do Angel
        await Angel.updateRating(angelId);
        
        return reviewId;
      });
    } catch (error) {
      throw error;
    }
  }
}

module.exports = Review;