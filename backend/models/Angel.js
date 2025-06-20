const knex = require('../db');
const bcrypt = require('bcrypt');

class Angel {
  constructor(data = {}) {
    this.id = data.id;
    this.name = data.name;
    this.email = data.email;
    this.password = data.password;
    this.phone = data.phone;
    this.bio = data.bio;
    this.languages = data.languages;
    this.profile_image = data.profile_image;
    this.specialty = data.specialty;
    this.rating = data.rating || 5.0;
    this.reviews_count = data.reviews_count || 0;
    this.created_at = data.created_at;
    this.updated_at = data.updated_at;
  }

  // Encontrar Angel por ID
  static async findById(id) {
    try {
      const angel = await knex('angels').where('id', id).first();
      return angel ? new Angel(angel) : null;
    } catch (error) {
      throw new Error(`Erro ao buscar Angel por ID: ${error.message}`);
    }
  }

  // Encontrar Angel por email
  static async findByEmail(email) {
    try {
      const angel = await knex('angels').where('email', email).first();
      return angel ? new Angel(angel) : null;
    } catch (error) {
      throw new Error(`Erro ao buscar Angel por email: ${error.message}`);
    }
  }

  // Verificar senha
  async verifyPassword(password) {
    if (!this.password) {
      throw new Error('Senha não encontrada');
    }
    try {
      return await bcrypt.compare(password, this.password);
    } catch (error) {
      throw new Error(`Erro ao verificar senha: ${error.message}`);
    }
  }

  // Encontrar Angels disponíveis para afiliação (máximo 3 visitantes)
  static async findAvailableForAffiliation() {
    try {
      const angels = await knex('angels')
        .select([
          'angels.id',
          'angels.name', 
          'angels.specialty', 
          'angels.languages', 
          'angels.bio',
          'angels.rating',
          'angels.reviews_count'
        ])
        .leftJoin('visitors', 'angels.id', 'visitors.angel_id')
        .groupBy('angels.id')
        .havingRaw('COUNT(visitors.id) < 3')
        .orderBy('angels.rating', 'desc');
      
      return angels.map(angel => new Angel(angel));
    } catch (error) {
      throw new Error(`Erro ao buscar Angels disponíveis: ${error.message}`);
    }
  }

  // Buscar Angels em destaque
  static async findFeatured(limit = 4) {
    try {
      const angels = await knex('angels')
        .select([
          'angels.*',
          knex.raw('COUNT(DISTINCT visitors.id) as visitors_count'),
          knex.raw('COUNT(DISTINCT CASE WHEN tours.date > datetime("now") THEN tours.id END) as upcoming_tours_count')
        ])
        .leftJoin('visitors', 'angels.id', 'visitors.angel_id')
        .leftJoin('tours', 'angels.id', 'tours.angel_id')
        .groupBy('angels.id')
        .orderBy('angels.rating', 'desc')
        .orderBy('angels.reviews_count', 'desc')
        .limit(limit);
      
      return angels.map(angel => new Angel(angel));
    } catch (error) {
      throw new Error(`Erro ao buscar Angels em destaque: ${error.message}`);
    }
  }

  // Buscar Angels com filtros e paginação
  static async findWithFilters(filters = {}, options = {}) {
    try {
      let query = knex('angels')
        .select([
          'angels.*',
          knex.raw('COUNT(DISTINCT visitors.id) as visitors_count'),
          knex.raw('COUNT(DISTINCT tours.id) as tours_count')
        ])
        .leftJoin('visitors', 'angels.id', 'visitors.angel_id')
        .leftJoin('tours', 'angels.id', 'tours.angel_id')
        .groupBy('angels.id');

      // Aplicar filtros
      if (filters.name) {
        query = query.where('angels.name', 'like', `%${filters.name}%`);
      }

      if (filters.specialty) {
        query = query.where('angels.specialty', 'like', `%${filters.specialty}%`);
      }

      if (filters.languages) {
        query = query.where('angels.languages', 'like', `%${filters.languages}%`);
      }

      if (filters.minRating) {
        query = query.where('angels.rating', '>=', filters.minRating);
      }

      if (filters.available) {
        query = query.havingRaw('COUNT(DISTINCT visitors.id) < 3');
      }

      // Ordenação
      if (options.orderBy) {
        query = query.orderBy(`angels.${options.orderBy}`, options.orderDirection || 'asc');
      } else {
        query = query.orderBy('angels.rating', 'desc');
      }

      // Paginação
      if (options.limit) {
        query = query.limit(options.limit);
      }
      
      if (options.offset) {
        query = query.offset(options.offset);
      }

      const angels = await query;
      return angels.map(angel => new Angel(angel));
    } catch (error) {
      throw new Error(`Erro ao buscar Angels com filtros: ${error.message}`);
    }
  }

  // Contar Angels com filtros
  static async count(filters = {}) {
    try {
      let query = knex('angels');
      
      Object.keys(filters).forEach(key => {
        if (filters[key] !== undefined && filters[key] !== null) {
          if (key === 'name' || key === 'specialty' || key === 'languages') {
            query = query.where(`angels.${key}`, 'like', `%${filters[key]}%`);
          } else {
            query = query.where(`angels.${key}`, filters[key]);
          }
        }
      });

      const result = await query.count('* as total').first();
      return parseInt(result.total);
    } catch (error) {
      throw new Error(`Erro ao contar Angels: ${error.message}`);
    }
  }

  // Salvar (criar/atualizar) Angel
  async save() {
    try {
      // Validar dados antes de salvar
      this.validate();

      if (!this.id) {
        // Inserir novo Angel
        if (this.password) {
          this.password = await bcrypt.hash(this.password, 10);
        }
        
        const [id] = await knex('angels').insert({
          name: this.name,
          email: this.email,
          password: this.password,
          phone: this.phone || '',
          bio: this.bio || '',
          languages: this.languages || '',
          specialty: this.specialty || '',
          profile_image: this.profile_image
        });
        
        this.id = id;
        return id;
      } else {
        // Atualizar Angel existente
        const updated = await knex('angels')
          .where('id', this.id)
          .update({
            name: this.name,
            phone: this.phone || '',
            bio: this.bio || '',
            languages: this.languages || '',
            specialty: this.specialty || '',
            profile_image: this.profile_image,
            updated_at: knex.fn.now()
          });
        
        return updated > 0;
      }
    } catch (error) {
      throw new Error(`Erro ao salvar Angel: ${error.message}`);
    }
  }

  // Atualizar rating do Angel baseado nas avaliações
  static async updateRating(angelId) {
    try {
      const result = await knex('reviews')
        .where('angel_id', angelId)
        .avg('rating as average')
        .count('id as count')
        .first();

      if (result && result.average) {
        await knex('angels')
          .where('id', angelId)
          .update({
            rating: parseFloat(result.average).toFixed(1),
            reviews_count: result.count,
            updated_at: knex.fn.now()
          });

        return {
          rating: parseFloat(result.average).toFixed(1),
          count: result.count
        };
      }

      // Se não há avaliações, manter rating padrão
      return { rating: 5.0, count: 0 };
    } catch (error) {
      throw new Error(`Erro ao atualizar rating: ${error.message}`);
    }
  }

  // Buscar estatísticas do Angel
  async getStats() {
    try {
      const stats = await knex('angels')
        .select([
          knex.raw('COUNT(DISTINCT visitors.id) as total_visitors'),
          knex.raw('COUNT(DISTINCT tours.id) as total_tours'),
          knex.raw('COUNT(DISTINCT CASE WHEN tours.date > datetime("now") THEN tours.id END) as upcoming_tours'),
          knex.raw('COUNT(DISTINCT CASE WHEN tours.date < datetime("now") THEN tours.id END) as past_tours'),
          knex.raw('COUNT(DISTINCT bookings.id) as total_bookings'),
          knex.raw('COUNT(DISTINCT CASE WHEN bookings.status = "confirmado" THEN bookings.id END) as confirmed_bookings'),
          knex.raw('COUNT(DISTINCT reviews.id) as total_reviews'),
          knex.raw('AVG(reviews.rating) as average_rating')
        ])
        .leftJoin('visitors', 'angels.id', 'visitors.angel_id')
        .leftJoin('tours', 'angels.id', 'tours.angel_id')
        .leftJoin('bookings', 'tours.id', 'bookings.tour_id')
        .leftJoin('reviews', 'angels.id', 'reviews.angel_id')
        .where('angels.id', this.id)
        .first();

      return {
        visitors: parseInt(stats.total_visitors) || 0,
        tours: {
          total: parseInt(stats.total_tours) || 0,
          upcoming: parseInt(stats.upcoming_tours) || 0,
          past: parseInt(stats.past_tours) || 0
        },
        bookings: {
          total: parseInt(stats.total_bookings) || 0,
          confirmed: parseInt(stats.confirmed_bookings) || 0
        },
        reviews: {
          total: parseInt(stats.total_reviews) || 0,
          averageRating: parseFloat(stats.average_rating) || 5.0
        }
      };
    } catch (error) {
      throw new Error(`Erro ao buscar estatísticas: ${error.message}`);
    }
  }

  // Verificar se pode aceitar novos visitantes
  async canAcceptNewVisitors() {
    try {
      const count = await knex('visitors')
        .where('angel_id', this.id)
        .count('id as total')
        .first();

      return parseInt(count.total) < 3;
    } catch (error) {
      throw new Error(`Erro ao verificar disponibilidade: ${error.message}`);
    }
  }

  // Validação dos dados do Angel
  validate() {
    const errors = [];

    if (!this.name || this.name.length < 3) {
      errors.push('Nome deve ter pelo menos 3 caracteres');
    }

    if (!this.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(this.email)) {
      errors.push('Email inválido');
    }

    if (!this.id && (!this.password || this.password.length < 6)) {
      errors.push('Senha deve ter pelo menos 6 caracteres');
    }

    if (this.phone && !/^\(\d{2}\)\s\d{4,5}-\d{4}$/.test(this.phone)) {
      errors.push('Telefone deve estar no formato (XX) XXXXX-XXXX');
    }

    if (this.rating && (this.rating < 0 || this.rating > 5)) {
      errors.push('Rating deve estar entre 0 e 5');
    }

    if (errors.length > 0) {
      throw new Error(`Erro de validação: ${errors.join(', ')}`);
    }

    return true;
  }

  // Serialização para JSON (remove campos sensíveis)
  toJSON() {
    const { password, ...data } = this;
    return {
      ...data,
      rating: parseFloat(this.rating),
      reviews_count: parseInt(this.reviews_count) || 0
    };
  }

  // Serialização pública (menos detalhes)
  toPublicJSON() {
    return {
      id: this.id,
      name: this.name,
      bio: this.bio,
      languages: this.languages,
      specialty: this.specialty,
      rating: parseFloat(this.rating),
      reviews_count: parseInt(this.reviews_count) || 0,
      profile_image: this.profile_image
    };
  }

  // Deletar Angel (soft delete ou hard delete)
  async delete() {
    try {
      if (!this.id) {
        throw new Error('Não é possível deletar Angel sem ID');
      }

      // Verificar se tem visitantes ou tours ativos
      const hasVisitors = await knex('visitors').where('angel_id', this.id).first();
      const hasActiveTours = await knex('tours')
        .where('angel_id', this.id)
        .where('date', '>', knex.fn.now())
        .first();

      if (hasVisitors) {
        throw new Error('Não é possível deletar Angel que possui visitantes');
      }

      if (hasActiveTours) {
        throw new Error('Não é possível deletar Angel que possui tours ativos');
      }

      const deleted = await knex('angels').where('id', this.id).del();
      return deleted > 0;
    } catch (error) {
      throw new Error(`Erro ao deletar Angel: ${error.message}`);
    }
  }
}

module.exports = Angel;