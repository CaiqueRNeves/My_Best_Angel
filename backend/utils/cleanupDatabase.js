const knex = require('../db');

async function cleanup() {
  try {
    console.log('Iniciando limpeza de dados antigos...');
    
    // Remover dados meteorológicos expirados
    const deletedWeatherData = await knex('weather_data')
      .where('valid_until', '<', knex.fn.now())
      .del();
    console.log(`Removidos ${deletedWeatherData} registros de clima expirados`);
    
    // Atualizar status de tours passados
    const updatedTours = await knex('tours')
      .where('date', '<', knex.fn.now())
      .where('status', 'active')
      .update({
        status: 'completed',
        updated_at: knex.fn.now()
      });
    console.log(`Atualizados ${updatedTours} tours passados`);
    
    // Remover notificações antigas (mais de 30 dias)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    
    const deletedNotifications = await knex('notifications')
      .where('created_at', '<', thirtyDaysAgo)
      .del();
    console.log(`Removidas ${deletedNotifications} notificações antigas`);
    
    console.log('Limpeza concluída com sucesso!');
  } catch (error) {
    console.error('Erro durante limpeza:', error);
  } finally {
    knex.destroy();
  }
}

// Executar diretamente se chamado via node
if (require.main === module) {
  cleanup();
}

module.exports = cleanup;