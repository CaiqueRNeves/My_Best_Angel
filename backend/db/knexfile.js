// knexfile.js
const path = require('path');

// Caminho absoluto para o banco de dados
const dbPath = path.join(__dirname, 'data', 'mybestangel.db');
console.log('Caminho do banco de dados:', dbPath);

module.exports = {
  development: {
    client: 'sqlite3',
    connection: {
      filename: dbPath
    },
    migrations: {
      directory: path.resolve(__dirname, './migrations')
    },
    seeds: {
      directory: path.resolve(__dirname, './seeds')
    },
    useNullAsDefault: true
  },
  production: {
    client: 'sqlite3',
    connection: {
      filename: dbPath
    },
    migrations: {
      directory: path.resolve(__dirname, './migrations')
    },
    seeds: {
      directory: path.resolve(__dirname, './seeds')
    },
    useNullAsDefault: true,
    pool: {
      min: 2,
      max: 10
    }
  }
};