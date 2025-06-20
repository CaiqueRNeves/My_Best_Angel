require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');
const fs = require('fs');
const path = require('path');

// Garantir que o diretório data exista
const dataDir = path.join(__dirname, 'data');
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

// Garantir que o diretório logs exista
const logsDir = path.join(__dirname, 'logs');
if (!fs.existsSync(logsDir)) {
  fs.mkdirSync(logsDir, { recursive: true });
}

// Garantir que o diretório config exista
const configDir = path.join(__dirname, 'config');
if (!fs.existsSync(configDir)) {
  fs.mkdirSync(configDir, { recursive: true });
}

// Inicialização do Express
const app = express();
const PORT = process.env.PORT || 3001;

// Trust proxy (importante para produção)
app.set('trust proxy', 1);

// Middlewares de segurança e otimização básicos
app.use(helmet({
  contentSecurityPolicy: false, // Simplificado para evitar problemas
  crossOriginEmbedderPolicy: false
}));

app.use(compression());

// CORS básico
const corsOptions = {
  origin: true, // Permitir todas as origens em desenvolvimento
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
};

app.use(cors(corsOptions));

// Rate limiting básico (se a dependência estiver instalada)
try {
  const rateLimit = require('express-rate-limit');
  
  const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutos
    max: 100, // máximo 100 requests por IP
    message: {
      success: false,
      error: {
        message: 'Muitas requisições, tente novamente em 15 minutos',
        code: 'RATE_LIMIT_EXCEEDED'
      }
    }
  });

  app.use('/api', limiter);
} catch (error) {
  console.log('Rate limiting não disponível:', error.message);
}

// Middlewares para parsing
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: false, limit: '10mb' }));

// Middleware simples de logging
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
  next();
});

// Health check
app.get('/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'API está funcionando',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV || 'development',
    version: '1.0.0'
  });
});

// Documentação da API (Swagger)
try {
  const swaggerUi = require('swagger-ui-express');
  
  // Tentar importar a configuração do swagger
  let swaggerConfig;
  try {
    swaggerConfig = require('./config/swagger');
  } catch (configError) {
    console.log('Configuração do Swagger não encontrada, criando configuração básica...');
    
    // Configuração básica do Swagger se o arquivo não existir
    const swaggerJsdoc = require('swagger-jsdoc');
    
    const options = {
      definition: {
        openapi: '3.1.0',
        info: {
          title: 'MyBestAngel API',
          version: '1.0.0',
          description: 'API REST para a plataforma de turismo MyBestAngel'
        },
        servers: [
          {
            url: `http://localhost:${PORT}`,
            description: 'Servidor de Desenvolvimento'
          }
        ]
      },
      apis: ['./controllers/*.js', './routes/*.js']
    };
    
    swaggerConfig = {
      specs: swaggerJsdoc(options)
    };
  }
  
  app.use('/api-docs', swaggerUi.serve);
  app.get('/api-docs', swaggerUi.setup(swaggerConfig.specs, {
    explorer: true,
    swaggerOptions: {
      persistAuthorization: true,
      displayRequestDuration: true
    }
  }));
  
  console.log(' Documentação Swagger configurada');
} catch (error) {
  console.log(' Swagger não disponível:', error.message);
}

// Redirecionamento da raiz para documentação em desenvolvimento
if (process.env.NODE_ENV === 'development') {
  app.get('/', (req, res) => {
    res.json({
      message: 'MyBestAngel API',
      version: '1.0.0',
      documentation: '/api-docs',
      health: '/health',
      endpoints: {
        auth: '/api/auth',
        angels: '/api/angel',
        visitors: '/api/visitor',
        tours: '/api/tour'
      }
    });
  });
}

// Rotas da API
try {
  const authRoutes = require('./routes/auth');
  const angelRoutes = require('./routes/angel');
  const visitorRoutes = require('./routes/visitor');
  const tourRoutes = require('./routes/tour');

  app.use('/api/auth', authRoutes);
  app.use('/api/angel', angelRoutes);
  app.use('/api/visitor', visitorRoutes);
  app.use('/api/tour', tourRoutes);
  
  console.log(' Rotas configuradas com sucesso');
} catch (error) {
  console.error(' Erro ao configurar rotas:', error.message);
}

// Rota de teste da API
app.get('/api', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'MyBestAngel API funcionando',
    data: {
      name: 'MyBestAngel API',
      version: '1.0.0',
      description: 'API para plataforma de turismo MyBestAngel',
      documentation: '/api-docs',
      endpoints: {
        auth: '/api/auth',
        angels: '/api/angel',
        visitors: '/api/visitor',
        tours: '/api/tour'
      }
    },
    timestamp: new Date().toISOString()
  });
});

// Middleware para rotas não encontradas
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    error: {
      message: `Rota ${req.originalUrl} não encontrada`,
      code: 'NOT_FOUND',
      timestamp: new Date().toISOString()
    }
  });
});

// Middleware global de tratamento de erros
app.use((err, req, res, next) => {
  console.error('Erro na aplicação:', err);
  
  res.status(err.statusCode || 500).json({
    success: false,
    error: {
      message: process.env.NODE_ENV === 'development' ? err.message : 'Erro interno do servidor',
      code: err.code || 'INTERNAL_SERVER_ERROR',
      timestamp: new Date().toISOString(),
      ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
    }
  });
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM received, shutting down gracefully');
  server.close(() => {
    console.log('Process terminated');
    process.exit(0);
  });
});

process.on('SIGINT', () => {
  console.log('SIGINT received, shutting down gracefully');
  server.close(() => {
    console.log('Process terminated');
    process.exit(0);
  });
});

// Tratamento de erros não capturados
process.on('uncaughtException', (err) => {
  console.error('Uncaught Exception:', err);
  process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
  process.exit(1);
});

// Inicialização do servidor
const server = app.listen(PORT, () => {
  console.log(` Servidor iniciado na porta ${PORT}`);
  console.log(` API Base URL: http://localhost:${PORT}/api`);
  console.log(` Documentação: http://localhost:${PORT}/api-docs`);
  console.log(` Health Check: http://localhost:${PORT}/health`);
  console.log(` Ambiente: ${process.env.NODE_ENV || 'development'}`);
});

// Configurar timeout do servidor
server.timeout = 30000; // 30 segundos

module.exports = app;