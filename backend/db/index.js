const environment = process.env.NODE_ENV || 'development';
const path = require('path');
const knexfile = require(path.join(__dirname, '..', 'knexfile.js'));
const config = knexfile[environment];

// Verificar se a configuração está correta
console.log('Ambiente:', environment);
console.log('Configuração do banco de dados:', JSON.stringify(config, null, 2));

// Inicializar o knex
const knex = require('knex')(config);

// Teste de conexão
knex.raw('SELECT 1')
  .then(() => {
    console.log('Conexão com o banco de dados estabelecida com sucesso');
  })
  .catch(err => {
    console.error('Erro ao conectar ao banco de dados:', err);
  });

module.exports = knex;