const bcrypt = require('bcrypt');

exports.seed = async function(knex) {
  // Deleta todos os registros existentes
  await knex('visitors').del();
  
  // Cria hash da senha
  const hash = await bcrypt.hash('visitor123', 10);
  
  // Insere dados
  await knex('visitors').insert([
    {
      angel_id: 1, // Associado ao guia com ID 1
      name: 'Visitante Demo',
      email: 'visitante@mybestangel.com',
      password: hash,
      phone: '(91) 88888-8888',
      nationality: 'Brasil',
      language_preference: 'Português'
    }
  ]);
};