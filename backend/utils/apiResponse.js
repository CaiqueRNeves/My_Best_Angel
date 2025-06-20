// Classe simples para padronização de respostas
class ApiResponse {
  constructor(success, message, data = null, errors = null, meta = null) {
    this.success = success;
    this.message = message;
    this.timestamp = new Date().toISOString();
    
    if (data !== null) {
      this.data = data;
    }
    
    if (errors !== null) {
      this.errors = errors;
    }
    
    if (meta !== null) {
      this.meta = meta;
    }
  }

  // Métodos estáticos para respostas de sucesso
  static success(res, data = null, message = 'Operação realizada com sucesso', statusCode = 200) {
    const response = new ApiResponse(true, message, data);
    return res.status(statusCode).json(response);
  }

  static created(res, data = null, message = 'Recurso criado com sucesso') {
    return this.success(res, data, message, 201);
  }

  static updated(res, data = null, message = 'Recurso atualizado com sucesso') {
    return this.success(res, data, message, 200);
  }

  static deleted(res, message = 'Recurso removido com sucesso') {
    return this.success(res, null, message, 200);
  }

  // Resposta com paginação
  static paginated(res, data, pagination, message = 'Dados recuperados com sucesso') {
    const response = new ApiResponse(true, message, data, null, { pagination });
    return res.status(200).json(response);
  }

  // Métodos estáticos para respostas de erro
  static error(res, message = 'Erro interno do servidor', statusCode = 500, errors = null) {
    const response = new ApiResponse(false, message, null, errors);
    return res.status(statusCode).json(response);
  }

  static badRequest(res, message = 'Requisição inválida', errors = null) {
    return this.error(res, message, 400, errors);
  }

  static unauthorized(res, message = 'Não autorizado') {
    return this.error(res, message, 401);
  }

  static forbidden(res, message = 'Acesso negado') {
    return this.error(res, message, 403);
  }

  static notFound(res, message = 'Recurso não encontrado') {
    return this.error(res, message, 404);
  }

  static conflict(res, message = 'Conflito de dados') {
    return this.error(res, message, 409);
  }

  static validationError(res, errors, message = 'Erro de validação') {
    return this.error(res, message, 422, errors);
  }

  static internalError(res, message = 'Erro interno do servidor') {
    return this.error(res, message, 500);
  }

  // Método para converter erros de validação do express-validator
  static fromValidationErrors(res, validationErrors) {
    const errors = validationErrors.array().map(error => ({
      field: error.path || error.param,
      message: error.msg,
      value: error.value
    }));

    return this.validationError(res, errors);
  }
}

// Utility para criar meta informações de paginação
const createPaginationMeta = (page, limit, total) => {
  const totalPages = Math.ceil(total / limit);
  
  return {
    page: parseInt(page),
    limit: parseInt(limit),
    total: parseInt(total),
    totalPages,
    hasNextPage: page < totalPages,
    hasPrevPage: page > 1,
    nextPage: page < totalPages ? page + 1 : null,
    prevPage: page > 1 ? page - 1 : null
  };
};

module.exports = {
  ApiResponse,
  createPaginationMeta
};