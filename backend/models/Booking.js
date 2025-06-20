const knex = require('../db');
const moment = require('moment');

class Booking {
  constructor(data) {
    this.id = data.id;
    this.tour_id = data.tour_id;
    this.visitor_id = data.visitor_id;
    this.status = data.status;
    this.notes = data.notes;
    this.created_at = data.created_at;
    this.updated_at = data.updated_at;
    
    // Propriedades adicionais de joins
    this.tour_title = data.tour_title;
    this.tour_location = data.tour_location;
    this.tour_date = data.tour_date;
    this.tour_price = data.tour_price;
    this.angel_name = data.angel_name;
    this.visitor_name = data.visitor_name;
    this.visitor_email = data.visitor_email;
    this.reviewed = data.reviewed;
  }

  // ADICIONADO: Método para formatar data
  getFormattedDate() {
    return moment(this.tour_date || this.created_at).format('DD/MM/YYYY HH:mm');
  }

  // Encontrar reserva por ID
  static async findById(id) {
    try {
      const booking = await knex('bookings').where('id', id).first();
      return booking ? new Booking(booking) : null;
    } catch (error) {
      throw new Error(`Erro ao buscar booking por ID: ${error.message}`);
    }
  }

  // Encontrar reserva por tour e visitor IDs
  static async findByTourIdAndVisitorId(tourId, visitorId) {
    try {
      const booking = await knex('bookings')
        .where('tour_id', tourId)
        .where('visitor_id', visitorId)
        .first();
      
      return booking ? new Booking(booking) : null;
    } catch (error) {
      throw new Error(`Erro ao buscar booking por tour e visitor: ${error.message}`);
    }
  }

  // Verificar se já existe uma reserva para um tour e visitante
  static async checkExistingBooking(tourId, visitorId) {
    try {
      const booking = await knex('bookings')
        .where('tour_id', tourId)
        .where('visitor_id', visitorId)
        .where('status', 'confirmado')
        .first();
      
      return !!booking;
    } catch (error) {
      throw new Error(`Erro ao verificar booking existente: ${error.message}`);
    }
  }

  // Encontrar reservas para um tour
  static async findByTourId(tourId) {
    try {
      const bookings = await knex('bookings')
        .select(
          'bookings.*',
          'visitors.name as visitor_name',
          'visitors.email as visitor_email'
        )
        .join('visitors', 'bookings.visitor_id', 'visitors.id')
        .where('bookings.tour_id', tourId);
      
      return bookings.map(booking => new Booking(booking));
    } catch (error) {
      throw new Error(`Erro ao buscar bookings por tour: ${error.message}`);
    }
  }

  // CORRIGIDO: Encontrar reservas futuras de um visitante com opções
  static async findUpcomingByVisitorId(visitorId, options = {}) {
    try {
      let query = knex('bookings')
        .select(
          'bookings.*',
          'tours.title as tour_title',
          'tours.location as tour_location',
          'tours.date as tour_date',
          'tours.description',
          'tours.price as tour_price',
          'angels.name as angel_name'
        )
        .join('tours', 'bookings.tour_id', 'tours.id')
        .join('angels', 'tours.angel_id', 'angels.id')
        .where('bookings.visitor_id', visitorId)
        .where('tours.date', '>', knex.fn.now())
        .where('bookings.status', 'confirmado')
        .orderBy('tours.date', 'asc');

      if (options.limit) {
        query = query.limit(options.limit);
      }
      
      if (options.offset) {
        query = query.offset(options.offset);
      }

      const bookings = await query;
      return bookings.map(booking => new Booking(booking));
    } catch (error) {
      throw new Error(`Erro ao buscar reservas futuras: ${error.message}`);
    }
  }

  // ADICIONADO: Contar reservas futuras
  static async countUpcomingByVisitorId(visitorId) {
    try {
      const result = await knex('bookings')
        .join('tours', 'bookings.tour_id', 'tours.id')
        .where('bookings.visitor_id', visitorId)
        .where('tours.date', '>', knex.fn.now())
        .where('bookings.status', 'confirmado')
        .count('* as total')
        .first();

      return parseInt(result.total);
    } catch (error) {
      throw new Error(`Erro ao contar reservas futuras: ${error.message}`);
    }
  }

  // Encontrar histórico de reservas de um visitante
  static async findHistoryByVisitorId(visitorId, limit = null) {
    try {
      let query = knex('bookings')
        .select(
          'bookings.*',
          'tours.id as tour_id',
          'tours.title as tour_title',
          'tours.location as tour_location',
          'tours.date as tour_date',
          'tours.price as tour_price',
          'angels.name as angel_name',
          knex.raw('EXISTS(SELECT 1 FROM reviews WHERE reviews.tour_id = tours.id AND reviews.visitor_id = ?) as reviewed', [visitorId])
        )
        .join('tours', 'bookings.tour_id', 'tours.id')
        .join('angels', 'tours.angel_id', 'angels.id')
        .where('bookings.visitor_id', visitorId)
        .orderBy('tours.date', 'desc');

      if (limit) {
        query = query.limit(limit);
      }
      
      const bookings = await query;
      return bookings.map(booking => new Booking(booking));
    } catch (error) {
      throw new Error(`Erro ao buscar histórico de reservas: ${error.message}`);
    }
  }

  // ADICIONADO: Buscar reservas com filtros
  static async findWithFilters(filters = {}, options = {}) {
    try {
      let query = knex('bookings')
        .select(
          'bookings.*',
          'tours.title as tour_title',
          'tours.location as tour_location',
          'tours.date as tour_date',
          'tours.price as tour_price',
          'angels.name as angel_name'
        )
        .join('tours', 'bookings.tour_id', 'tours.id')
        .join('angels', 'tours.angel_id', 'angels.id');

      // Aplicar filtros
      Object.keys(filters).forEach(key => {
        if (filters[key] !== undefined && filters[key] !== null) {
          if (key === 'past') {
            query = query.where('tours.date', '<', knex.fn.now());
          } else {
            query = query.where(`bookings.${key}`, filters[key]);
          }
        }
      });

      // Ordenação
      if (options.orderBy) {
        query = query.orderBy(`bookings.${options.orderBy}`, options.orderDirection || 'asc');
      }

      // Paginação
      if (options.limit) {
        query = query.limit(options.limit);
      }
      
      if (options.offset) {
        query = query.offset(options.offset);
      }

      const bookings = await query;
      return bookings.map(booking => new Booking(booking));
    } catch (error) {
      throw new Error(`Erro ao buscar reservas com filtros: ${error.message}`);
    }
  }

  // ADICIONADO: Contar reservas com filtros
  static async count(filters = {}) {
    try {
      let query = knex('bookings');
      
      if (filters.past) {
        query = query.join('tours', 'bookings.tour_id', 'tours.id')
          .where('tours.date', '<', knex.fn.now());
        delete filters.past;
      }
      
      Object.keys(filters).forEach(key => {
        if (filters[key] !== undefined && filters[key] !== null) {
          query = query.where(`bookings.${key}`, filters[key]);
        }
      });

      const result = await query.count('* as total').first();
      return parseInt(result.total);
    } catch (error) {
      throw new Error(`Erro ao contar reservas: ${error.message}`);
    }
  }

  // Criar reserva (com transação para atualizar número de participantes)
  static async createBookingTransaction(tourId, visitorId, notes) {
    try {
      return await knex.transaction(async trx => {
        // Verificar se o tour existe e tem vagas disponíveis
        const tour = await trx('tours')
          .where('id', tourId)
          .where('date', '>', trx.fn.now())
          .where('current_participants', '<', trx.raw('max_participants'))
          .first();
        
        if (!tour) {
          throw new Error('Tour não disponível ou lotado');
        }
        
        // Verificar se já existe uma reserva
        const existingBooking = await trx('bookings')
          .where('tour_id', tourId)
          .where('visitor_id', visitorId)
          .where('status', 'confirmado')
          .first();
        
        if (existingBooking) {
          throw new Error('Você já reservou este tour');
        }
        
        // Inserir reserva
        const [bookingId] = await trx('bookings').insert({
          tour_id: tourId,
          visitor_id: visitorId,
          notes: notes || '',
          status: 'confirmado'
        });
        
        // Incrementar número de participantes
        await trx('tours')
          .where('id', tourId)
          .increment('current_participants', 1)
          .update({ updated_at: trx.fn.now() });
        
        return bookingId;
      });
    } catch (error) {
      throw error;
    }
  }

  // Cancelar reserva
  static async cancelBooking(bookingId, visitorId) {
    try {
      return await knex.transaction(async trx => {
        // Verificar se a reserva pertence ao visitante e está confirmada
        const booking = await trx('bookings')
          .join('tours', 'bookings.tour_id', 'tours.id')
          .where('bookings.id', bookingId)
          .where('bookings.visitor_id', visitorId)
          .where('bookings.status', 'confirmado')
          .select('bookings.*', 'tours.id as tour_id')
          .first();
        
        if (!booking) {
          throw new Error('Reserva não encontrada ou já cancelada');
        }
        
        // Atualizar status da reserva
        await trx('bookings')
          .where('id', bookingId)
          .update({
            status: 'cancelado',
            updated_at: trx.fn.now()
          });
        
        // Decrementar número de participantes
        await trx('tours')
          .where('id', booking.tour_id)
          .where('current_participants', '>', 0)
          .decrement('current_participants', 1)
          .update({ updated_at: trx.fn.now() });
        
        return true;
      });
    } catch (error) {
      throw error;
    }
  }

  // Atualizar status da reserva
  static async updateStatus(bookingId, status) {
    try {
      const updated = await knex('bookings')
        .where('id', bookingId)
        .update({
          status: status,
          updated_at: knex.fn.now()
        });
      
      return updated > 0;
    } catch (error) {
      throw error;
    }
  }

  // ADICIONADO: Serialização para JSON
  toJSON() {
    const { password, ...data } = this;
    return {
      ...data,
      formattedDate: this.getFormattedDate()
    };
  }
}

module.exports = Booking;