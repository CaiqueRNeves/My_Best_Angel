const knex = require('../db');
const bcrypt = require('bcrypt');

class BaseModel {
  constructor(data = {}) {
    Object.assign(this, data);
  }

  // Métodos estáticos comuns
  static get tableName() {
    throw new Error('tableName deve ser implementado pela classe filha');
  }

  static async findById(id) {
    try {
      const record = await knex(this.tableName).where('id', id).first();
      return record ? new this(record) : null;
    } catch (error) {
      throw new Error(`Erro ao buscar registro por ID: ${error.message}`);
    }
  }

  static async findByEmail(email) {
    try {
      const record = await knex(this.tableName).where('email', email).first();
      return record ? new this(record) : null;
    } catch (error) {
      throw new Error(`Erro ao buscar registro por email: ${error.message}`);
    }
  }

  static async findAll(filters = {}, options = {}) {
    try {
      let query = knex(this.tableName);
      
      // Aplicar filtros
      Object.keys(filters).forEach(key => {
        if (filters[key] !== undefined && filters[key] !== null) {
          query = query.where(key, filters[key]);
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
        query = query.orderBy(options.orderBy, options.orderDirection || 'asc');
      }

      const records = await query;
      return records.map(record => new this(record));
    } catch (error) {
      throw new Error(`Erro ao buscar registros: ${error.message}`);
    }
  }

  static async count(filters = {}) {
    try {
      let query = knex(this.tableName);
      
      Object.keys(filters).forEach(key => {
        if (filters[key] !== undefined && filters[key] !== null) {
          query = query.where(key, filters[key]);
        }
      });

      const result = await query.count('* as total').first();
      return parseInt(result.total);
    } catch (error) {
      throw new Error(`Erro ao contar registros: ${error.message}`);
    }
  }

  static async create(data) {
    try {
      // Hash da senha se existir
      if (data.password) {
        data.password = await bcrypt.hash(data.password, 10);
      }

      const [id] = await knex(this.tableName).insert(data);
      return await this.findById(id);
    } catch (error) {
      throw new Error(`Erro ao criar registro: ${error.message}`);
    }
  }

  static async updateById(id, data) {
    try {
      // Remove campos que não devem ser atualizados
      const { id: _, created_at, ...updateData } = data;
      
      // Adiciona updated_at
      updateData.updated_at = knex.fn.now();

      const updated = await knex(this.constructor.tableName)
        .where('id', id)
        .update(updateData);

      if (updated === 0) {
        throw new Error('Registro não encontrado');
      }

      return await this.constructor.findById(id);
    } catch (error) {
      throw new Error(`Erro ao atualizar registro: ${error.message}`);
    }
  }

  static async deleteById(id) {
    try {
      const deleted = await knex(this.tableName).where('id', id).del();
      return deleted > 0;
    } catch (error) {
      throw new Error(`Erro ao deletar registro: ${error.message}`);
    }
  }

  // Métodos de instância
  async save() {
    try {
      if (this.id) {
        return await this.constructor.updateById(this.id, this);
      } else {
        const created = await this.constructor.create(this);
        Object.assign(this, created);
        return this;
      }
    } catch (error) {
      throw new Error(`Erro ao salvar registro: ${error.message}`);
    }
  }

  async delete() {
    try {
      if (!this.id) {
        throw new Error('Não é possível deletar registro sem ID');
      }
      return await this.constructor.deleteById(this.id);
    } catch (error) {
      throw new Error(`Erro ao deletar registro: ${error.message}`);
    }
  }

  async verifyPassword(password) {
    if (!this.password) {
      throw new Error('Senha não encontrada');
    }
    return await bcrypt.compare(password, this.password);
  }

  // Serialização para JSON (remove campos sensíveis)
  toJSON() {
    const { password, ...data } = this;
    return data;
  }

  // Validação básica
  validate() {
    const errors = [];
    
    if (this.constructor.requiredFields) {
      this.constructor.requiredFields.forEach(field => {
        if (!this[field]) {
          errors.push(`${field} é obrigatório`);
        }
      });
    }

    if (errors.length > 0) {
      throw new Error(`Erro de validação: ${errors.join(', ')}`);
    }

    return true;
  }
}

module.exports = BaseModel;