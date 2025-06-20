const knex = require('../db');
const bcrypt = require('bcrypt');

class Visitor {
  constructor(data) {
    this.id = data.id;
    this.angel_id = data.angel_id;
    this.name = data.name;
    this.email = data.email;
    this.password = data.password;
    this.phone = data.phone;
    this.nationality = data.nationality;
    this.language_preference = data.language_preference;
    this.profile_image = data.profile_image;
    this.created_at = data.created_at;
    this.updated_at = data.updated_at;
    
    // Propriedades adicionais de joins
    this.angel_name = data.angel_name;
    this.angel_email = data.angel_email;
    this.angel_phone = data.angel_phone;
  }

  // Encontrar Visitor por ID
  static async findById(id) {
    try {
      const visitor = await knex('visitors').where('id', id).first();
      return visitor ? new Visitor(visitor) : null;
    } catch (error) {
      throw new Error(`Erro ao buscar Visitor por ID: ${error.message}`);
    }
  }

  // Encontrar Visitor por ID com detalhes do Angel
  static async findByIdWithAngelDetails(id) {
    try {
      const visitor = await knex('visitors')
        .select(
          'visitors.*',
          'angels.name as angel_name',
          'angels.email as angel_email',
          'angels.phone as angel_phone'
        )
        .join('angels', 'visitors.angel_id', 'angels.id')
        .where('visitors.id', id)
        .first();
      
      return visitor ? new Visitor(visitor) : null;
    } catch (error) {
      throw new Error(`Erro ao buscar Visitor com detalhes do Angel: ${error.message}`);
    }
  }

  // Encontrar Visitor por email
  static async findByEmail(email) {
    try {
      const visitor = await knex('visitors').where('email', email).first();
      return visitor ? new Visitor(visitor) : null;
    } catch (error) {
      throw new Error(`Erro ao buscar Visitor por email: ${error.message}`);
    }
  }

  // Encontrar todos os Visitors de um Angel
  static async findByAngelId(angelId) {
    try {
      const visitors = await knex('visitors').where('angel_id', angelId);
      return visitors.map(visitor => new Visitor(visitor));
    } catch (error) {
      throw new Error(`Erro ao buscar Visitors por Angel ID: ${error.message}`);
    }
  }

  // ADICIONADO: Buscar visitantes com filtros
  static async findWithFilters(filters = {}, options = {}) {
    try {
      let query = knex('visitors')
        .select('visitors.*')
        .leftJoin('angels', 'visitors.angel_id', 'angels.id');

      // Aplicar filtros
      Object.keys(filters).forEach(key => {
        if (filters[key] !== undefined && filters[key] !== null) {
          query = query.where(`visitors.${key}`, filters[key]);
        }
      });

      // Paginação
      if (options.limit) {
        query = query.limit(options.limit);
      }
      
      if (options.offset) {
        query = query.offset(options.offset);
      }

      // Ordenação
      if (options.orderBy) {
        query = query.orderBy(`visitors.${options.orderBy}`, options.orderDirection || 'asc');
      }

      const visitors = await query;
      return visitors.map(visitor => new Visitor(visitor));
    } catch (error) {
      throw new Error(`Erro ao buscar visitors com filtros: ${error.message}`);
    }
  }

  // ADICIONADO: Contar visitantes
  static async count(filters = {}) {
    try {
      let query = knex('visitors');
      
      Object.keys(filters).forEach(key => {
        if (filters[key] !== undefined && filters[key] !== null) {
          query = query.where(key, filters[key]);
        }
      });

      const result = await query.count('* as total').first();
      return parseInt(result.total);
    } catch (error) {
      throw new Error(`Erro ao contar visitors: ${error.message}`);
    }
  }

  // ADICIONADO: Buscar estatísticas do visitante
  static async getVisitorStats(visitorId) {
    try {
      const stats = await knex('visitors')
        .select([
          knex.raw('COUNT(DISTINCT bookings.id) as total_bookings'),
          knex.raw('COUNT(DISTINCT CASE WHEN bookings.status = "confirmado" THEN bookings.id END) as confirmed_bookings'),
          knex.raw('COUNT(DISTINCT CASE WHEN bookings.status = "realizado" THEN bookings.id END) as completed_bookings'),
          knex.raw('COUNT(DISTINCT reviews.id) as total_reviews'),
          knex.raw('AVG(reviews.rating) as average_given_rating')
        ])
        .leftJoin('bookings', 'visitors.id', 'bookings.visitor_id')
        .leftJoin('reviews', 'visitors.id', 'reviews.visitor_id')
        .where('visitors.id', visitorId)
        .first();

      return {
        bookings: {
          total: parseInt(stats.total_bookings) || 0,
          confirmed: parseInt(stats.confirmed_bookings) || 0,
          completed: parseInt(stats.completed_bookings) || 0
        },
        reviews: {
          total: parseInt(stats.total_reviews) || 0,
          averageRating: parseFloat(stats.average_given_rating) || 0
        }
      };
    } catch (error) {
      throw new Error(`Erro ao buscar estatísticas do visitante: ${error.message}`);
    }
  }

  // Verificar senha
  async verifyPassword(password) {
    try {
      if (!this.password) {
        throw new Error('Senha não encontrada');
      }
      return await bcrypt.compare(password, this.password);
    } catch (error) {
      throw new Error(`Erro ao verificar senha: ${error.message}`);
    }
  }

  // Salvar (criar/atualizar) Visitor
  async save() {
    try {
      // Validar dados antes de salvar
      this.validate();

      if (!this.id) {
        // Inserir novo Visitor
        if (this.password) {
          this.password = await bcrypt.hash(this.password, 10);
        }
        
        const [id] = await knex('visitors').insert({
          angel_id: this.angel_id,
          name: this.name,
          email: this.email,
          password: this.password,
          phone: this.phone || '',
          nationality: this.nationality || '',
          language_preference: this.language_preference || '',
          profile_image: this.profile_image
        });
        
        this.id = id;
        return id;
      } else {
        // Atualizar Visitor existente
        const updated = await knex('visitors')
          .where('id', this.id)
          .update({
            name: this.name,
            phone: this.phone || '',
            nationality: this.nationality || '',
            language_preference: this.language_preference || '',
            profile_image: this.profile_image,
            updated_at: knex.fn.now()
          });
        
        return updated > 0;
      }
    } catch (error) {
      throw new Error(`Erro ao salvar Visitor: ${error.message}`);
    }
  }

  // ADICIONADO: Validação dos dados do Visitor
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

    if (!this.angel_id) {
      errors.push('Visitor deve estar associado a um Angel');
    }

    if (errors.length > 0) {
      throw new Error(`Erro de validação: ${errors.join(', ')}`);
    }

    return true;
  }

  // Serialização para JSON (remove campos sensíveis)
  toJSON() {
    const { password, ...data } = this;
    return data;
  }

  // ADICIONADO: Serialização pública (menos detalhes)
  toPublicJSON() {
    return {
      id: this.id,
      name: this.name,
      nationality: this.nationality,
      language_preference: this.language_preference,
      profile_image: this.profile_image
    };
  }

  // Deletar Visitor
  async delete() {
    try {
      if (!this.id) {
        throw new Error('Não é possível deletar Visitor sem ID');
      }

      // Verificar se tem reservas ativas
      const hasActiveBookings = await knex('bookings')
        .join('tours', 'bookings.tour_id', 'tours.id')
        .where('bookings.visitor_id', this.id)
        .where('tours.date', '>', knex.fn.now())
        .where('bookings.status', 'confirmado')
        .first();

      if (hasActiveBookings) {
        throw new Error('Não é possível deletar Visitor que possui reservas ativas');
      }

      const deleted = await knex('visitors').where('id', this.id).del();
      return deleted > 0;
    } catch (error) {
      throw new Error(`Erro ao deletar Visitor: ${error.message}`);
    }
  }
}

module.exports = Visitor;