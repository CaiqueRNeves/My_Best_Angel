exports.seed = async function(knex) {
    // Deleta todos os registros existentes
    await knex('tours').del();
    
    // Insere dados
    await knex('tours').insert([
      {
        angel_id: 1,
        title: 'Mercado Ver-o-Peso',
        description: 'Visita ao tradicional mercado Ver-o-Peso, um dos mais antigos e maiores mercados a céu aberto da América Latina.',
        location: 'Ver-o-Peso, Belém, PA',
        date: '2025-06-01 09:00:00',
        duration: 180,
        price: 50.00,
        max_participants: 8
      },
      {
        angel_id: 1,
        title: 'Tour Gastronômico em Belém',
        description: 'Conheça o melhor da culinária paraense com visitas a restaurantes tradicionais e degustação de pratos típicos.',
        location: 'Centro Histórico, Belém, PA',
        date: '2025-06-02 18:00:00',
        duration: 240,
        price: 120.00,
        max_participants: 6
      },
      {
        angel_id: 1,
        title: 'Museu Emílio Goeldi',
        description: 'Visita ao Museu Paraense Emílio Goeldi, um dos mais importantes centros de pesquisa sobre a biodiversidade amazônica.',
        location: 'Av. Magalhães Barata, Belém, PA',
        date: '2025-06-03 14:00:00',
        duration: 150,
        price: 40.00,
        max_participants: 10
      }
    ]);
  };