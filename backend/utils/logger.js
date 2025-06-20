const winston = require('winston');
const path = require('path');

// Definir formato personalizado para logs
const logFormat = winston.format.combine(
  winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
  winston.format.errors({ stack: true }),
  winston.format.json(),
  winston.format.prettyPrint()
);

// Formato para console em desenvolvimento
const consoleFormat = winston.format.combine(
  winston.format.colorize(),
  winston.format.timestamp({ format: 'HH:mm:ss' }),
  winston.format.printf(({ timestamp, level, message, ...meta }) => {
    let log = `${timestamp} [${level}]: ${message}`;
    
    if (Object.keys(meta).length > 0) {
      log += `\n${JSON.stringify(meta, null, 2)}`;
    }
    
    return log;
  })
);

// Criar diretório de logs se não existir
const fs = require('fs');
const logsDir = path.join(__dirname, '../logs');
if (!fs.existsSync(logsDir)) {
  fs.mkdirSync(logsDir, { recursive: true });
}

// Configurar transports
const transports = [];

// Console transport (sempre ativo em desenvolvimento)
if (process.env.NODE_ENV !== 'production') {
  transports.push(
    new winston.transports.Console({
      format: consoleFormat,
      level: 'debug'
    })
  );
}

// File transports
transports.push(
  // Log de erros
  new winston.transports.File({
    filename: path.join(logsDir, 'error.log'),
    level: 'error',
    format: logFormat,
    maxsize: 5242880, // 5MB
    maxFiles: 5,
  }),
  
  // Log combinado
  new winston.transports.File({
    filename: path.join(logsDir, 'combined.log'),
    format: logFormat,
    maxsize: 5242880, // 5MB
    maxFiles: 5,
  }),
  
  // Log de acesso/requests
  new winston.transports.File({
    filename: path.join(logsDir, 'access.log'),
    level: 'info',
    format: logFormat,
    maxsize: 5242880, // 5MB
    maxFiles: 10,
  })
);

// Criar logger
const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: logFormat,
  defaultMeta: { 
    service: 'mybestangel-api',
    version: process.env.npm_package_version || '1.0.0'
  },
  transports,
  // Não sair do processo em caso de erro
  exitOnError: false
});

// Middleware para logging de requests
const requestLogger = (req, res, next) => {
  const startTime = Date.now();
  
  // Interceptar o final da resposta
  const originalEnd = res.end;
  res.end = function(chunk, encoding) {
    const duration = Date.now() - startTime;
    
    // Log da requisição
    logger.info('HTTP Request', {
      method: req.method,
      url: req.originalUrl,
      statusCode: res.statusCode,
      duration: `${duration}ms`,
      userAgent: req.get('User-Agent'),
      ip: req.ip || req.connection.remoteAddress,
      userId: req.user?.id,
      userType: req.user?.userType
    });
    
    // Chamar o método original
    originalEnd.call(this, chunk, encoding);
  };
  
  next();
};

// Métodos de conveniência
const loggers = {
  // Log de autenticação
  auth: (action, data) => {
    logger.info(`AUTH: ${action}`, data);
  },
  
  // Log de operações de negócio
  business: (action, data) => {
    logger.info(`BUSINESS: ${action}`, data);
  },
  
  // Log de operações de banco de dados
  database: (action, data) => {
    logger.debug(`DATABASE: ${action}`, data);
  },
  
  // Log de APIs externas
  external: (action, data) => {
    logger.info(`EXTERNAL: ${action}`, data);
  },
  
  // Log de performance
  performance: (action, duration, data = {}) => {
    logger.info(`PERFORMANCE: ${action}`, {
      duration: `${duration}ms`,
      ...data
    });
  },
  
  // Log de segurança
  security: (event, data) => {
    logger.warn(`SECURITY: ${event}`, data);
  },
  
  // Log de erros de negócio
  businessError: (error, context = {}) => {
    logger.error('BUSINESS ERROR', {
      message: error.message,
      code: error.code,
      stack: error.stack,
      ...context
    });
  }
};

// Adicionar os métodos ao logger principal
Object.assign(logger, loggers);

// Stream para integração com Morgan (se necessário)
logger.stream = {
  write: (message) => {
    logger.info(message.trim());
  }
};

module.exports = logger;