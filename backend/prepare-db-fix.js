const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Caminho para o diretório de dados
const dataDir = path.resolve(__dirname, 'data');
const dbFile = path.join(dataDir, 'mybestangel.db');

console.log('Preparando ambiente para o banco de dados SQLite...');
console.log('Diretório de dados:', dataDir);
console.log('Arquivo de banco de dados:', dbFile);

// Criar diretório se não existir
if (!fs.existsSync(dataDir)) {
  console.log('Criando diretório de dados...');
  fs.mkdirSync(dataDir, { recursive: true, mode: 0o777 });
}

// Remover arquivo de banco de dados se existir
if (fs.existsSync(dbFile)) {
  console.log('Removendo banco de dados existente...');
  fs.unlinkSync(dbFile);
}

// Criar um arquivo vazio com permissões explícitas
console.log('Criando arquivo de banco de dados vazio...');
fs.writeFileSync(dbFile, '', { mode: 0o666 });

// Verificar permissões
console.log('Verificando permissões...');
try {
  const stats = fs.statSync(dbFile);
  console.log('Permissões do arquivo:', stats.mode.toString(8));
  console.log('Arquivo pode ser lido:', fs.accessSync(dbFile, fs.constants.R_OK) === undefined);
  console.log('Arquivo pode ser escrito:', fs.accessSync(dbFile, fs.constants.W_OK) === undefined);
} catch (err) {
  console.error('Erro ao verificar permissões:', err);
}

// Executar migrações
console.log('Executando migrações...');
try {
  execSync('npx knex migrate:latest', { stdio: 'inherit' });
  console.log('Migrações concluídas com sucesso!');
} catch (err) {
  console.error('Erro ao executar migrações:', err);
}

// Executar seeds
console.log('Inserindo dados iniciais...');
try {
  execSync('npx knex seed:run', { stdio: 'inherit' });
  console.log('Dados iniciais inseridos com sucesso!');
} catch (err) {
  console.error('Erro ao inserir dados iniciais:', err);
}

console.log('Preparação do banco de dados concluída!');