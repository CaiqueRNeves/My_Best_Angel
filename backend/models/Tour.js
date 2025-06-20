const knex = require('../db');
const moment = require('moment');

class Tour {
  constructor(data) {
    this.id = data.id;
    this.angel_id = data.angel_id;
    this.title = data.title;
    this.description = data.description;
    this.location = data.location;
    this.date = data.date;
    this.duration = data.duration;
    this.price = data.price;
    this.max_participants = data.max_participants;
    this.current_participants = data.current_participants || 0;
    this.image = data.image;
    this.created_at = data.created_at;
    this.updated_at = data.updated_at;
    
    // Propriedades adicionais de joins
    this.angel_name = data.angel_name;
    this.angel_rating = data.angel_rating;
    this.angel_email = data.angel_email;
    this.angel_phone = data.angel_phone;
    
    // Propriedades adicionais
    this.already_booked = data.already_booked;
  }

  // Formatar data para exibição
  getFormattedDate() {
    return moment(this.date).format('DD/MM/YYYY HH:mm');
  }

  // Obter data relativa (ex: "em 2 dias")
  getRelativeDate() {
    return moment(this.date).fromNow();
  }

  // Verificar se o tour já passou
  isPast() {
    return moment(this.date).isBefore(moment());
  }

  // Verificar se está lotado
  isFullyBooked() {
    return this.current_participants >= this.max_participants;
  }

  // Encontrar tour por ID
  static async findById(id) {
    try {
      const tour = await knex('tours')
        .select(
          'tours.*',
          'angels.name as angel_name',
          'angels.rating as angel_rating',
          'angels.email as angel_email',
          'angels.phone as angel_phone'
        )
        .join('angels', 'tours.angel_id', 'angels.id')
        .where('tours.id', id)
        .first();
      
      return tour ? new Tour(tour) : null;
    } catch (error) {
      throw new Error(`Erro ao buscar Tour por ID: ${error.message}`);
    }
  }

  // Buscar tour por ID e verificar se pertence a um Angel específico
  static async findByIdAndAngelId(id, angelId) {
    try {
      const tour = await knex('tours')
        .select(
          'tours.*',
          'angels.name as angel_name',
          'angels.rating as angel_rating'
        )
        .join('angels', 'tours.angel_id', 'angels.id')
        .where('tours.id', id)
        .where('tours.angel_id', angelId)
        .first();
      
      return tour ? new Tour(tour) : null;
    } catch (error) {
      throw new Error(`Erro ao buscar Tour por ID e Angel ID: ${error.message}`);
    }
  }

  // Encontrar tours futuros de um Angel
  static async findUpcomingByAngelId(angelId, limit = null) {
    try {
      let query = knex('tours')
        .select(
          'tours.*',
          'angels.name as angel_name'
        )
        .join('angels', 'tours.angel_id', 'angels.id')
        .where('tours.angel_id', angelId)
        .where('tours.date', '>', knex.fn.now())
        .orderBy('tours.date', 'asc');
      
      if (limit) {
        query = query.limit(limit);
      }
      
      const tours = await query;
      return tours.map(tour => new Tour(tour));
    } catch (error) {
      throw new Error(`Erro ao buscar tours futuros: ${error.message}`);
    }
  }

  // Encontrar todos os tours de um Angel
  static async findAllByAngelId(angelId) {
    try {
      const tours = await knex('tours')
        .select(
          'tours.*',
          'angels.name as angel_name'
        )
        .join('angels', 'tours.angel_id', 'angels.id')
        .where('tours.angel_id', angelId)
        .orderBy('tours.date', 'desc');
      
      return tours.map(tour => new Tour(tour));
    } catch (error) {
      throw new Error(`Erro ao buscar todos os tours: ${error.message}`);
    }
  }

  // Encontrar tours disponíveis para um Visitor
  static async findAvailableForVisitor(visitorId, angelId, options = {}) {
    try {
      let query = knex('tours')
        .select(
          'tours.*',
          'angels.name as angel_name',
          knex.raw(`(SELECT COUNT(*) FROM bookings WHERE bookings.tour_id = tours.id AND bookings.visitor_id = ? AND bookings.status = 'confirmado') as already_booked`, [visitorId])
        )
        .join('angels', 'tours.angel_id', 'angels.id')
        .where('tours.angel_id', angelId)
        .where('tours.date', '>', knex.fn.now())
        .where('tours.current_participants', '<', knex.raw('tours.max_participants'));

      // Aplicar filtro de busca se fornecido
      if (options.search) {
        query = query.where(function() {
          this.where('tours.title', 'like', `%${options.search}%`)
            .orWhere('tours.description', 'like', `%${options.search}%`)
            .orWhere('tours.location', 'like', `%${options.search}%`);
        });
      }

      // Paginação
      if (options.limit) {
        query = query.limit(options.limit);
      }
      
      if (options.offset) {
        query = query.offset(options.offset);
      }

      query = query.orderBy('tours.date', 'asc');
      
      const tours = await query;
      return tours.map(tour => {
        tour.already_booked = tour.already_booked > 0;
        return new Tour(tour);
      });
    } catch (error) {
      throw new Error(`Erro ao buscar tours disponíveis para visitor: ${error.message}`);
    }
  }

  // ADICIONADO: Buscar tours com filtros
  static async findWithFilters(filters = {}, options = {}) {
    try {
      let query = knex('tours')
        .select('tours.*', 'angels.name as angel_name')
        .join('angels', 'tours.angel_id', 'angels.id');

      // Aplicar filtros
      if (filters.angel_id) {
        query = query.where('tours.angel_id', filters.angel_id);
      }
      
      if (filters.upcoming) {
        query = query.where('tours.date', '>', knex.fn.now());
      }
      
      if (filters.past) {
        query = query.where('tours.date', '<', knex.fn.now());
      }

      // Ordenação
      if (options.orderBy) {
        query = query.orderBy(`tours.${options.orderBy}`, options.orderDirection || 'asc');
      }

      // Paginação
      if (options.limit) {
        query = query.limit(options.limit);
      }
      
      if (options.offset) {
        query = query.offset(options.offset);
      }

      const tours = await query;
      return tours.map(tour => new Tour(tour));
    } catch (error) {
      throw new Error(`Erro ao buscar tours com filtros: ${error.message}`);
    }
  }

  // ADICIONADO: Contar tours com filtros
  static async count(filters = {}) {
    try {
      let query = knex('tours');
      
      Object.keys(filters).forEach(key => {
        if (filters[key] !== undefined && filters[key] !== null) {
          if (key === 'upcoming') {
            query = query.where('date', '>', knex.fn.now());
          } else if (key === 'past') {
            query = query.where('date', '<', knex.fn.now());
          } else {
            query = query.where(key, filters[key]);
          }
        }
      });

      const result = await query.count('* as total').first();
      return parseInt(result.total);
    } catch (error) {
      throw new Error(`Erro ao contar tours: ${error.message}`);
    }
  }

  // ADICIONADO: Contar tours disponíveis para visitante
  static async countAvailableForVisitor(visitorId, angelId, filters = {}) {
    try {
      let query = knex('tours')
        .where('angel_id', angelId)
        .where('date', '>', knex.fn.now())
        .where('current_participants', '<', knex.raw('max_participants'));

      if (filters.search) {
        query = query.where(function() {
          this.where('title', 'like', `%${filters.search}%`)
            .orWhere('description', 'like', `%${filters.search}%`)
            .orWhere('location', 'like', `%${filters.search}%`);
        });
      }

      const result = await query.count('* as total').first();
      return parseInt(result.total);
    } catch (error) {
      throw new Error(`Erro ao contar tours disponíveis: ${error.message}`);
    }
  }

  // Buscar tours em destaque
  static async findFeatured(limit = 6) {
    try {
      const tours = await knex('tours')
        .select(
          'tours.*',
          'angels.name as angel_name',
          'angels.rating as angel_rating'
        )
        .join('angels', 'tours.angel_id', 'angels.id')
        .where('tours.date', '>', knex.fn.now())
        .orderBy('tours.date', 'asc')
        .limit(limit);
      
      return tours.map(tour => new Tour(tour));
    } catch (error) {
      throw new Error(`Erro ao buscar tours em destaque: ${error.message}`);
    }
  }

  // Buscar tours com base em critérios
  static async search(criteria = {}) {
    try {
      let query = knex('tours')
        .select(
          'tours.*',
          'angels.name as angel_name',
          'angels.rating as angel_rating'
        )
        .join('angels', 'tours.angel_id', 'angels.id')
        .where('tours.date', '>', knex.fn.now());
      
      if (criteria.search) {
        query = query.where(function() {
          this.where('tours.title', 'like', `%${criteria.search}%`)
            .orWhere('tours.description', 'like', `%${criteria.search}%`)
            .orWhere('tours.location', 'like', `%${criteria.search}%`);
        });
      }
      
      if (criteria.date) {
        query = query.whereRaw('date(tours.date) = ?', [criteria.date]);
      }
      
      if (criteria.location) {
        query = query.where('tours.location', 'like', `%${criteria.location}%`);
      }
      
      query = query.orderBy('tours.date', 'asc');
      
      const tours = await query;
      return tours.map(tour => new Tour(tour));
    } catch (error) {
      throw new Error(`Erro ao buscar tours: ${error.message}`);
    }
  }

  // Obter localizações disponíveis para filtros
  static async getAvailableLocations() {
    try {
      const locations = await knex('tours')
        .distinct('location')
        .where('date', '>', knex.fn.now())
        .orderBy('location', 'asc');
      
      return locations.map(row => row.location);
    } catch (error) {
      throw new Error(`Erro ao buscar localizações disponíveis: ${error.message}`);
    }
  }

  // Salvar um tour
  async save() {
    try {
      if (!this.id) {
        // Inserir novo tour
        const [id] = await knex('tours').insert({
          angel_id: this.angel_id,
          title: this.title,
          description: this.description || '',
          location: this.location,
          date: this.date,
          duration: this.duration || 60,
          price: this.price || 0,
          max_participants: this.max_participants || 10,
          current_participants: this.current_participants || 0,
          image: this.image
        });
        
        return id;
      } else {
        // Atualizar tour existente
        const updated = await knex('tours')
          .where('id', this.id)
          .where('angel_id', this.angel_id)
          .update({
            title: this.title,
            description: this.description || '',
            location: this.location,
            date: this.date,
            duration: this.duration || 60,
            price: this.price || 0,
            max_participants: this.max_participants || 10,
            image: this.image,
            updated_at: knex.fn.now()
          });
        
        return updated > 0;
      }
    } catch (error) {
      console.error('Erro ao salvar tour:', error);
      throw error;
    }
  }

  // Cancelar tour
  static async cancel(id, angelId) {
    let trx;
    
    try {
      // Iniciar transação
      trx = await knex.transaction();
      
      // Verificar se o tour pertence ao angel
      const tourExists = await trx('tours')
        .where('id', id)
        .where('angel_id', angelId)
        .first();
      
      if (!tourExists) {
        await trx.rollback();
        throw new Error('Tour não encontrado ou não pertence ao guia');
      }
      
      // Atualizar status das reservas
      await trx('bookings')
        .where('tour_id', id)
        .update({
          status: 'cancelado',
          updated_at: trx.fn.now()
        });
      
      // Deletar o tour
      const deleted = await trx('tours')
        .where('id', id)
        .del();
      
      await trx.commit();
      return deleted > 0;
    } catch (error) {
      if (trx) await trx.rollback();
      console.error('Erro ao cancelar tour:', error);
      throw error;
    }
  }

  // Incrementar número de participantes
  static async incrementParticipants(id) {
    try {
      // Verificar se o tour tem espaço antes de incrementar
      const tour = await knex('tours')
        .where('id', id)
        .first();
      
      if (!tour || tour.current_participants >= tour.max_participants) {
        return false;
      }
      
      const updated = await knex('tours')
        .where('id', id)
        .increment('current_participants', 1)
        .update({ updated_at: knex.fn.now() });
      
      return updated > 0;
    } catch (error) {
      console.error('Erro ao incrementar participantes:', error);
      throw error;
    }
  }

  // Decrementar número de participantes
  static async decrementParticipants(id) {
    try {
      const updated = await knex('tours')
        .where('id', id)
        .where('current_participants', '>', 0)
        .decrement('current_participants', 1)
        .update({ updated_at: knex.fn.now() });
      
      return updated > 0;
    } catch (error) {
      console.error('Erro ao decrementar participantes:', error);
      throw error;
    }
  }

  // Serialização para JSON
  toJSON() {
    return {
      id: this.id,
      angel_id: this.angel_id,
      title: this.title,
      description: this.description,
      location: this.location,
      date: this.date,
      duration: this.duration,
      price: this.price,
      max_participants: this.max_participants,
      current_participants: this.current_participants,
      image: this.image,
      created_at: this.created_at,
      updated_at: this.updated_at,
      angel_name: this.angel_name,
      angel_rating: this.angel_rating,
      angel_email: this.angel_email,
      angel_phone: this.angel_phone,
      already_booked: this.already_booked
    };
  }

  // ADICIONADO: Serialização pública
  toPublicJSON() {
    return {
      id: this.id,
      title: this.title,
      description: this.description,
      location: this.location,
      date: this.date,
      duration: this.duration,
      price: this.price,
      max_participants: this.max_participants,
      current_participants: this.current_participants,
      image: this.image,
      angel_name: this.angel_name,
      angel_rating: this.angel_rating
    };
  }
}

module.exports = Tour;