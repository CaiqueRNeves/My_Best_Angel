const bcrypt = require('bcrypt');

exports.seed = async function(knex) {
  // Deleta todos os registros existentes
  await knex('angels').del();
  
  // Cria hash da senha
  const hash = await bcrypt.hash('admin123', 10);
  
  // Insere dados
  await knex('angels').insert([
    {
      name: 'Guia Demo',
      email: 'guia@mybestangel.com',
      password: hash,
      phone: '(91) 99999-9999',
      bio: 'Guia turístico com mais de 10 anos de experiência em Belém do Pará.',
      languages: 'Português, Inglês, Espanhol',
      specialty: 'Gastronomia e Cultura'
    }
  ]);
};