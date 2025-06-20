class AppError extends Error {
  constructor(message, statusCode, code = null, details = null) {
    super(message);
    
    this.name = this.constructor.name;
    this.statusCode = statusCode;
    this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';
    this.isOperational = true;
    this.code = code;
    this.details = details;
    this.timestamp = new Date().toISOString();

    Error.captureStackTrace(this, this.constructor);
  }

  // Métodos estáticos para erros comuns
  static badRequest(message = 'Bad Request', details = null) {
    return new AppError(message, 400, 'BAD_REQUEST', details);
  }

  static unauthorized(message = 'Unauthorized', details = null) {
    return new AppError(message, 401, 'UNAUTHORIZED', details);
  }

  static forbidden(message = 'Forbidden', details = null) {
    return new AppError(message, 403, 'FORBIDDEN', details);
  }

  static notFound(message = 'Not Found', details = null) {
    return new AppError(message, 404, 'NOT_FOUND', details);
  }

  static conflict(message = 'Conflict', details = null) {
    return new AppError(message, 409, 'CONFLICT', details);
  }

  static validationError(message = 'Validation Error', details = null) {
    return new AppError(message, 422, 'VALIDATION_ERROR', details);
  }

  static internalServer(message = 'Internal Server Error', details = null) {
    return new AppError(message, 500, 'INTERNAL_SERVER_ERROR', details);
  }

  static serviceUnavailable(message = 'Service Unavailable', details = null) {
    return new AppError(message, 503, 'SERVICE_UNAVAILABLE', details);
  }

  // Métodos específicos do domínio
  static tourNotFound(tourId) {
    return new AppError(`Tour com ID ${tourId} não encontrado`, 404, 'TOUR_NOT_FOUND', { tourId });
  }

  static angelNotFound(angelId) {
    return new AppError(`Guia com ID ${angelId} não encontrado`, 404, 'ANGEL_NOT_FOUND', { angelId });
  }

  static visitorNotFound(visitorId) {
    return new AppError(`Visitante com ID ${visitorId} não encontrado`, 404, 'VISITOR_NOT_FOUND', { visitorId });
  }

  static bookingNotFound(bookingId) {
    return new AppError(`Reserva com ID ${bookingId} não encontrada`, 404, 'BOOKING_NOT_FOUND', { bookingId });
  }

  static tourFullyBooked(tourId) {
    return new AppError('Tour está lotado', 409, 'TOUR_FULLY_BOOKED', { tourId });
  }

  static alreadyBooked(tourId, visitorId) {
    return new AppError('Você já reservou este tour', 409, 'ALREADY_BOOKED', { tourId, visitorId });
  }

  static tourExpired(tourId) {
    return new AppError('Tour já passou', 400, 'TOUR_EXPIRED', { tourId });
  }

  static invalidCredentials() {
    return new AppError('Email ou senha incorretos', 401, 'INVALID_CREDENTIALS');
  }

  static emailAlreadyExists(email) {
    return new AppError('Este email já está em uso', 409, 'EMAIL_ALREADY_EXISTS', { email });
  }

  static invalidToken() {
    return new AppError('Token inválido ou expirado', 401, 'INVALID_TOKEN');
  }

  static insufficientPermissions() {
    return new AppError('Permissões insuficientes', 403, 'INSUFFICIENT_PERMISSIONS');
  }

  static angelNotAvailable(angelId) {
    return new AppError('O guia selecionado não tem vagas disponíveis', 409, 'ANGEL_NOT_AVAILABLE', { angelId });
  }

  static cannotReviewTour(reason) {
    return new AppError(`Não é possível avaliar este tour: ${reason}`, 400, 'CANNOT_REVIEW_TOUR', { reason });
  }

  static alreadyReviewed(tourId, visitorId) {
    return new AppError('Você já avaliou este tour', 409, 'ALREADY_REVIEWED', { tourId, visitorId });
  }

  // Serialização para JSON
  toJSON() {
    return {
      error: {
        name: this.name,
        message: this.message,
        statusCode: this.statusCode,
        status: this.status,
        code: this.code,
        details: this.details,
        timestamp: this.timestamp,
        ...(process.env.NODE_ENV === 'development' && { stack: this.stack })
      }
    };
  }
}

module.exports = AppError;