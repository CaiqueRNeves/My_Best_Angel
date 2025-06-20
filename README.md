# MyBestAngel API

> **API REST para plataforma de turismo conectando guias turísticos e visitantes em Belém durante a COP30**

[![Node.js](https://img.shields.io/badge/Node.js-16+-green.svg)](https://nodejs.org/)
[![Express](https://img.shields.io/badge/Express-4.18+-blue.svg)](https://expressjs.com/)
[![SQLite](https://img.shields.io/badge/SQLite-3+-lightgrey.svg)](https://sqlite.org/)
[![JWT](https://img.shields.io/badge/JWT-Authentication-orange.svg)](https://jwt.io/)
[![Swagger](https://img.shields.io/badge/API-Documented-brightgreen.svg)](http://localhost:3001/api-docs)

## Desenvolvedor Responsável

Nome: Caique Rabelo Neves
E-mail: caiquerabelo2015@hotmail.com

##  Índice

- [Sobre o Projeto](#sobre-o-projeto)
- [Funcionalidades](#funcionalidades)
- [Tecnologias](#tecnologias)
- [Instalação](#instalação)
- [Configuração](#configuração)
- [Uso](#uso)
- [API Endpoints](#api-endpoints)
- [Documentação](#documentação)
- [Testes](#testes)
- [Contribuição](#contribuição)
- [Licença](#licença)

##  Sobre o Projeto

A **MyBestAngel API** é uma plataforma que conecta guias turísticos locais (Angels) com visitantes durante a COP30 em Belém do Pará. A API oferece um sistema completo de:

-  **Gestão de Guias Turísticos** - Cadastro, perfil e especialidades
-  **Gestão de Visitantes** - Afiliação a guias e preferências
-  **Tours e Passeios** - Criação, reserva e avaliação
-  **Sistema de Mensagens** - Comunicação entre guias e visitantes
-  **Sistema de Avaliações** - Feedback e ratings
-  **Dashboard e Insights** - Estatísticas e relatórios

##  Funcionalidades

###  Autenticação e Autorização
- [x] Registro de guias e visitantes
- [x] Login com JWT
- [x] Autenticação por tipo de usuário
- [x] Renovação de tokens
- [x] Alteração de senhas

###  Gestão de Guias (Angels)
- [x] Dashboard personalizado
- [x] Perfil com especialidades e idiomas
- [x] Criação e gestão de tours
- [x] Lista de visitantes afiliados
- [x] Sistema de mensagens
- [x] Insights e estatísticas

###  Gestão de Visitantes
- [x] Dashboard com tours e atualizações
- [x] Perfil com preferências
- [x] Busca e reserva de tours
- [x] Histórico de reservas
- [x] Avaliação de tours
- [x] Comunicação com guia

###  Sistema de Tours
- [x] CRUD completo de tours
- [x] Busca e filtros avançados
- [x] Sistema de reservas
- [x] Controle de vagas
- [x] Tours em destaque

###  Monitoramento e Logs
- [x] Logging estruturado com Winston
- [x] Tratamento de erros centralizado
- [x] Rate limiting
- [x] Health checks
- [x] Métricas de performance

## 🛠 Tecnologias

### Backend
- **[Node.js](https://nodejs.org/)** - Runtime JavaScript
- **[Express.js](https://expressjs.com/)** - Framework web
- **[SQLite](https://sqlite.org/)** - Banco de dados
- **[Knex.js](https://knexjs.org/)** - Query builder
- **[JWT](https://jwt.io/)** - Autenticação
- **[bcrypt](https://github.com/kelektiv/node.bcrypt.js)** - Hash de senhas

### Documentação e Qualidade
- **[Swagger/OpenAPI](https://swagger.io/)** - Documentação da API
- **[Winston](https://github.com/winstonjs/winston)** - Logging
- **[Jest](https://jestjs.io/)** - Testes
- **[ESLint](https://eslint.org/)** - Linting
- **[Prettier](https://prettier.io/)** - Formatação de código

### Segurança e Performance
- **[Helmet](https://helmetjs.github.io/)** - Headers de segurança
- **[express-rate-limit](https://github.com/nfriedly/express-rate-limit)** - Rate limiting
- **[compression](https://github.com/expressjs/compression)** - Compressão GZIP
- **[CORS](https://github.com/expressjs/cors)** - Cross-Origin Resource Sharing

##  Instalação

### Pré-requisitos
- Node.js 16+ 
- npm 8+
- Git

### Clonando o repositório
```bash
git clone https://github.com/caique-rabelo/mybestangel-api.git
cd mybestangel-api
```

### Instalando dependências
```bash
npm install
```

### Configurando o banco de dados
```bash
# Executar migrações
npm run migrate

# Inserir dados iniciais
npm run seed

# Ou fazer ambos
npm run db:setup
```

##  Configuração

### Variáveis de Ambiente

Crie um arquivo `.env` na raiz do projeto:

```env
# Servidor
NODE_ENV=development
PORT=3001
API_URL=http://localhost:3001/api

# JWT
JWT_SECRET=seu_jwt_secret_super_seguro_aqui
JWT_EXPIRES_IN=24h

# Logging
LOG_LEVEL=info
LOG_STACK=true

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
AUTH_RATE_LIMIT_MAX_REQUESTS=5

# CORS
ALLOWED_ORIGINS=http://localhost:3000,http://localhost:5173

# Banco de Dados
DATABASE_PATH=./data/mybestangel.db
```

### Estrutura de Pastas
```
mybestangel-api/
├── config/           # Configurações
├── controllers/      # Controladores REST
├── data/            # Banco SQLite
├── logs/            # Arquivos de log
├── middleware/      # Middlewares
├── migrations/      # Migrações do DB
├── models/          # Models/Entidades
├── routes/          # Definição de rotas
├── seeds/           # Dados iniciais
├── services/        # Lógica de negócio
├── tests/           # Testes automatizados
├── utils/           # Utilitários
├── server.js        # Entrada da aplicação
└── package.json     # Dependências
```

## 🎮 Uso

### Desenvolvimento
```bash
# Iniciar servidor em modo desenvolvimento
npm run dev

# A API estará disponível em: http://localhost:3001
# Documentação em: http://localhost:3001/api-docs
```

### Produção
```bash
# Iniciar servidor em produção
npm start
```

### Scripts Úteis
```bash
# Resetar banco de dados
npm run db:reset

# Executar testes
npm test

# Testes com coverage
npm run test:coverage

# Linting
npm run lint

# Formatação de código
npm run format

# Limpar logs
npm run logs:clear
```

##  API Endpoints

###  Autenticação (`/api/auth`)
```http
POST   /login              # Fazer login
POST   /register/angel     # Registrar guia
POST   /register/visitor   # Registrar visitante
GET    /me                 # Dados do usuário
POST   /refresh            # Renovar token
POST   /logout             # Fazer logout
GET    /available-angels   # Listar guias disponíveis
POST   /change-password    # Alterar senha
```

###  Guias (`/api/angel`)
```http
GET    /dashboard          # Dashboard do guia
GET    /profile            # Buscar perfil
PUT    /profile            # Atualizar perfil
POST   /tours              # Criar tour
GET    /tours              # Listar tours
GET    /tours/:id          # Detalhes do tour
PUT    /tours/:id          # Atualizar tour
DELETE /tours/:id          # Cancelar tour
GET    /visitors           # Listar visitantes
GET    /messages           # Buscar mensagens
POST   /messages           # Enviar mensagem
GET    /insights           # Estatísticas e insights
```

###  Visitantes (`/api/visitor`)
```http
GET    /dashboard          # Dashboard do visitante
GET    /profile            # Buscar perfil
PUT    /profile            # Atualizar perfil
GET    /available-tours    # Tours disponíveis
GET    /tours/:id          # Detalhes do tour
POST   /tours/:id/book     # Reservar tour
POST   /bookings/:id/cancel # Cancelar reserva
GET    /bookings           # Listar reservas
GET    /messages           # Buscar mensagens
POST   /messages           # Enviar mensagem
POST   /tours/:id/review   # Avaliar tour
GET    /stats              # Estatísticas
```

###  Tours Públicos (`/api/tour`)
```http
GET    /featured           # Tours em destaque
GET    /search             # Buscar tours
GET    /details/:id        # Detalhes públicos
```

###  Sistema (`/api`)
```http
GET    /                   # Informações da API
GET    /health             # Health check
```

##  Documentação

### Swagger/OpenAPI
A documentação interativa da API está disponível em:
- **Desenvolvimento**: http://localhost:3001/api-docs
- **Produção**: https://api.mybestangel.com/api-docs

### Exemplos de Uso

#### Fazer Login
```javascript
// POST /api/auth/login
{
  "email": "guia@mybestangel.com",
  "password": "admin123",
  "userType": "angel"
}

// Resposta
{
  "success": true,
  "message": "Login realizado com sucesso",
  "data": {
    "user": {
      "id": 1,
      "name": "Guia Demo",
      "email": "guia@mybestangel.com"
    },
    "userType": "angel",
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  },
  "timestamp": "2025-01-15T10:30:00.000Z"
}
```

#### Criar Tour
```javascript
// POST /api/angel/tours
// Headers: Authorization: Bearer {token}
{
  "title": "Tour pelo Ver-o-Peso",
  "description": "Conheça o famoso mercado de Belém",
  "location": "Ver-o-Peso, Belém, PA",
  "date": "2025-07-15",
  "time": "09:00",
  "duration": 180,
  "price": 50.00,
  "maxParticipants": 8
}
```

#### Reservar Tour
```javascript
// POST /api/visitor/tours/1/book
// Headers: Authorization: Bearer {token}
{
  "notes": "Primeira vez em Belém, muito animado!"
}
```

##  Testes

### Executando Testes
```bash
# Todos os testes
npm test

# Testes em modo watch
npm run test:watch

# Coverage
npm run test:coverage
```

### Estrutura de Testes
```
tests/
├── unit/           # Testes unitários
├── integration/    # Testes de integração
├── fixtures/       # Dados de teste
└── setup.js        # Configuração dos testes
```

### Exemplo de Teste
```javascript
// tests/integration/auth.test.js
const request = require('supertest');
const app = require('../../server');

describe('Authentication', () => {
  test('Should login with valid credentials', async () => {
    const response = await request(app)
      .post('/api/auth/login')
      .send({
        email: 'guia@mybestangel.com',
        password: 'admin123',
        userType: 'angel'
      });

    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.data.token).toBeDefined();
  });
});
```

##  Configuração de Produção

### Variáveis de Ambiente Produção
```env
NODE_ENV=production
PORT=3001
JWT_SECRET=jwt_secret_super_seguro_de_producao
DATABASE_PATH=/app/data/mybestangel.db
LOG_LEVEL=warn
```

### Docker (Opcional)
```dockerfile
FROM node:16-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
EXPOSE 3001
CMD ["npm", "start"]
```

### Proxy Reverso (Nginx)
```nginx
server {
    listen 80;
    server_name api.mybestangel.com;

    location / {
        proxy_pass http://localhost:3001;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

##  Troubleshooting

### Problemas Comuns

#### Erro de Permissão no SQLite
```bash
# Verificar permissões do diretório data
chmod 755 data/
chmod 644 data/mybestangel.db
```

#### Porta já em uso
```bash
# Verificar processo usando a porta
lsof -ti:3001

# Matar processo
kill -9 $(lsof -ti:3001)
```

#### Erro de dependências
```bash
# Limpar cache e reinstalar
rm -rf node_modules package-lock.json
npm install
```

### Logs
```bash
# Ver logs em tempo real
tail -f logs/combined.log

# Ver apenas erros
tail -f logs/error.log

# Logs de acesso
tail -f logs/access.log
```

##  Monitoramento

### Health Check
```bash
curl http://localhost:3001/health
```

### Métricas Disponíveis
- Uptime do servidor
- Número de requests por minuto
- Tempo de resposta médio
- Erros por tipo
- Usuários ativos

### Padrões de Código
- Use ESLint e Prettier
- Siga os padrões REST
- Documente endpoints com Swagger
- Escreva testes para novas funcionalidades
- Use commit semântico (feat:, fix:, docs:, etc.)

### Estrutura de Commits
```
feat: adiciona endpoint de busca de tours
fix: corrige validação de email
docs: atualiza documentação da API
test: adiciona testes para autenticação
refactor: melhora estrutura do controller
```

##  Roadmap

### Versão 1.1 (Próxima)
- [ ] Sistema de notificações push
- [ ] Upload de imagens de perfil e tours
- [ ] Sistema de pagamentos
- [ ] Cache com Redis
- [ ] Migração para PostgreSQL

### Versão 1.2 (Futuro)
- [ ] Sistema de chat em tempo real
- [ ] Geolocalização e mapas
- [ ] Integração com APIs externas (clima, trânsito)
- [ ] Sistema de cupons e promoções
- [ ] App mobile React Native

### Versão 2.0 (Longo Prazo)
- [ ] Microserviços
- [ ] GraphQL
- [ ] Inteligência artificial para recomendações
- [ ] Sistema de afiliados
- [ ] Dashboard administrativo

##  Segurança

### Medidas Implementadas
- ✅ Autenticação JWT
- ✅ Hash de senhas com bcrypt
- ✅ Rate limiting
- ✅ Validação de entrada
- ✅ Headers de segurança (Helmet)
- ✅ CORS configurado
- ✅ Logging de segurança

### Práticas Recomendadas
- Mantenha dependências atualizadas
- Use HTTPS em produção
- Configure firewall adequadamente
- Monitore logs de segurança
- Implemente rotação de tokens
- Use variáveis de ambiente para secrets

##  Monitoramento de Performance

### Métricas Importantes
```javascript
// Exemplo de métricas coletadas
{
  "api": {
    "uptime": "2d 5h 30m",
    "requests_per_minute": 45,
    "average_response_time": "150ms",
    "error_rate": "0.5%"
  },
  "database": {
    "connection_pool": "5/10",
    "query_time_avg": "25ms",
    "slow_queries": 2
  },
  "memory": {
    "usage": "256MB",
    "heap_used": "180MB",
    "heap_total": "220MB"
  }
}
```

### Alertas Configuráveis
- Tempo de resposta > 1s
- Taxa de erro > 5%
- Uso de memória > 80%
- Disco > 90%
- CPU > 85%

##  Deploy e CI/CD

### GitHub Actions (Exemplo)
```yaml
name: CI/CD Pipeline

on:
  push:
    branches: [ main, develop ]
  pull_request:
    branches: [ main ]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
    - uses: actions/checkout@v3
    - name: Use Node.js
      uses: actions/setup-node@v3
      with:
        node-version: '16'
    - run: npm ci
    - run: npm run lint
    - run: npm test
    - run: npm run test:coverage

  deploy:
    needs: test
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/main'
    steps:
    - name: Deploy to production
      run: echo "Deploy to production server"
```

### Ambientes
- **Development**: `http://localhost:3001`
- **Staging**: `https://staging-api.mybestangel.com`
- **Production**: `https://api.mybestangel.com`

##  Checklist de Deploy

### Pré-Deploy
- [ ] Testes passando
- [ ] Código revisado
- [ ] Documentação atualizada
- [ ] Variáveis de ambiente configuradas
- [ ] Backup do banco de dados
- [ ] Migrations testadas

### Deploy
- [ ] Deploy em staging
- [ ] Testes de aceitação
- [ ] Deploy em produção
- [ ] Verificação de saúde
- [ ] Monitoramento ativo

### Pós-Deploy
- [ ] Verificar logs
- [ ] Testar endpoints críticos
- [ ] Monitorar métricas
- [ ] Comunicar stakeholders

##  Recursos Adicionais

### Links Úteis
- [Documentação Express.js](https://expressjs.com/)
- [Knex.js Query Builder](https://knexjs.org/)
- [JWT.io](https://jwt.io/)
- [Swagger Editor](https://editor.swagger.io/)
- [SQLite Documentation](https://sqlite.org/docs.html)

### Ferramentas Recomendadas
- **Postman**: Testes de API
- **Insomnia**: Cliente REST
- **SQLite Browser**: Visualizar banco
- **PM2**: Process manager
- **Docker**: Containerização

##  Suporte

### Canais de Comunicação
- **Issues**: [GitHub Issues](https://github.com/caique-rabelo/mybestangel-api/issues)
- **Email**: caiquerabelo2015@hotmail.com


### Como Reportar Bugs
1. Verifique se o bug já foi reportado
2. Use o template de issue
3. Inclua logs relevantes
4. Descreva passos para reproduzir
5. Adicione informações do ambiente

### Template de Bug Report
```markdown
**Descrição do Bug**
Uma descrição clara do que é o bug.

**Para Reproduzir**
Passos para reproduzir o comportamento:
1. Vá para '...'
2. Clique em '....'
3. Role para baixo até '....'
4. Veja o erro

**Comportamento Esperado**
Uma descrição clara do que você esperava que acontecesse.

**Screenshots**
Se aplicável, adicione screenshots para ajudar a explicar seu problema.

**Ambiente:**
 - OS: [e.g. iOS]
 - Browser [e.g. chrome, safari]
 - Version [e.g. 22]

**Contexto Adicional**
Adicione qualquer outro contexto sobre o problema aqui.
```

##  Changelog

### [1.0.0] - 2025-01-15
#### Added
- ✨ Sistema completo de autenticação JWT
- ✨ CRUD completo para Angels e Visitors
- ✨ Sistema de tours e reservas
- ✨ Sistema de mensagens
- ✨ Sistema de avaliações
- ✨ Dashboard e insights
- ✨ Documentação Swagger completa
- ✨ Logging estruturado
- ✨ Tratamento de erros centralizado
- ✨ Rate limiting
- ✨ Testes automatizados

#### Security
- 🔒 Implementação de headers de segurança
- 🔒 Validação rigorosa de entrada
- 🔒 Hash seguro de senhas
- 🔒 Rate limiting para prevenção de ataques

---

<div align="center">
  
  <p>
    <a href="https://mybestangel.com">Website</a> •
    <a href="https://api.mybestangel.com/api-docs">API Docs</a> •
    <a href="mailto:caique@mybestangel.com">Contato</a>
  </p>
</div>