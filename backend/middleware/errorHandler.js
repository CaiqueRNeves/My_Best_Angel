const AppError = require('../utils/AppError');
const logger = require('../utils/logger');

// Middleware para capturar erros assíncronos
const catchAsync = (fn) => {
  return (req, res, next) => {
    fn(req, res, next).catch(next);
  };
};

// Handlers para tipos específicos de erro
const handleCastErrorDB = (err) => {
  const message = `Valor inválido para o campo: ${err.path}`;
  return AppError.badRequest(message);
};

const handleDuplicateFieldsDB = (err) => {
  const field = err.message.match(/(["'])(\\?.)*?\1/)[0];
  const message = `Valor duplicado no campo ${field}. Use outro valor.`;
  return AppError.conflict(message);
};

const handleValidationErrorDB = (err) => {
  const errors = Object.values(err.errors).map(el => el.message);
  const message = `Dados inválidos: ${errors.join('. ')}`;
  return AppError.validationError(message);
};

const handleJWTError = () => {
  return AppError.unauthorized('Token inválido. Faça login novamente.');
};

const handleJWTExpiredError = () => {
  return AppError.unauthorized('Token expirado. Faça login novamente.');
};

const handleSQLiteError = (err) => {
  if (err.code === 'SQLITE_CONSTRAINT_UNIQUE') {
    const field = err.message.match(/UNIQUE constraint failed: \w+\.(\w+)/)?.[1] || 'campo';
    return AppError.conflict(`Valor já existe para o campo: ${field}`);
  }
  
  if (err.code === 'SQLITE_CONSTRAINT_FOREIGNKEY') {
    return AppError.badRequest('Referência inválida. Verifique os dados fornecidos.');
  }
  
  if (err.code === 'SQLITE_CONSTRAINT_CHECK') {
    return AppError.badRequest('Dados não atendem às restrições de validação.');
  }

  return AppError.internalServer('Erro no banco de dados');
};

// Enviar erro em desenvolvimento
const sendErrorDev = (err, res) => {
  logger.error('ERROR 💥', {
    error: err,
    stack: err.stack,
    timestamp: new Date().toISOString()
  });

  res.status(err.statusCode).json({
    success: false,
    error: {
      name: err.name,
      message: err.message,
      statusCode: err.statusCode,
      status: err.status,
      code: err.code,
      details: err.details,
      stack: err.stack,
      timestamp: err.timestamp || new Date().toISOString()
    }
  });
};

// Enviar erro em produção
const sendErrorProd = (err, res) => {
  // Log do erro
  logger.error('ERROR 💥', {
    message: err.message,
    statusCode: err.statusCode,
    code: err.code,
    details: err.details,
    stack: process.env.LOG_STACK === 'true' ? err.stack : undefined,
    timestamp: new Date().toISOString()
  });

  // Erro operacional: enviar mensagem para o cliente
  if (err.isOperational) {
    res.status(err.statusCode).json({
      success: false,
      error: {
        message: err.message,
        code: err.code,
        details: err.details,
        timestamp: err.timestamp || new Date().toISOString()
      }
    });
  } else {
    // Erro de programação: não vazar detalhes para o cliente
    res.status(500).json({
      success: false,
      error: {
        message: 'Algo deu errado no servidor',
        code: 'INTERNAL_SERVER_ERROR',
        timestamp: new Date().toISOString()
      }
    });
  }
};

// Middleware principal de tratamento de erros
const globalErrorHandler = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  if (process.env.NODE_ENV === 'development') {
    sendErrorDev(err, res);
  } else {
    let error = { ...err };
    error.message = err.message;
    error.name = err.name;

    // Tratar diferentes tipos de erro
    if (error.name === 'CastError') error = handleCastErrorDB(error);
    if (error.code === 11000) error = handleDuplicateFieldsDB(error);
    if (error.name === 'ValidationError') error = handleValidationErrorDB(error);
    if (error.name === 'JsonWebTokenError') error = handleJWTError();
    if (error.name === 'TokenExpiredError') error = handleJWTExpiredError();
    if (error.code && error.code.startsWith('SQLITE')) error = handleSQLiteError(error);

    sendErrorProd(error, res);
  }
};

// Middleware para capturar rotas não encontradas
const notFound = (req, res, next) => {
  const err = AppError.notFound(`Rota ${req.originalUrl} não encontrada`);
  next(err);
};

// Response helper para sucesso
const sendSuccess = (res, data, message = 'Operação realizada com sucesso', statusCode = 200) => {
  const response = {
    success: true,
    message,
    timestamp: new Date().toISOString()
  };

  if (data !== undefined) {
    response.data = data;
  }

  res.status(statusCode).json(response);
};

// Response helper para sucesso com paginação
const sendSuccessWithPagination = (res, data, pagination, message = 'Dados recuperados com sucesso') => {
  res.status(200).json({
    success: true,
    message,
    data,
    pagination,
    timestamp: new Date().toISOString()
  });
};

module.exports = {
  catchAsync,
  globalErrorHandler,
  notFound,
  sendSuccess,
  sendSuccessWithPagination,
  AppError
};