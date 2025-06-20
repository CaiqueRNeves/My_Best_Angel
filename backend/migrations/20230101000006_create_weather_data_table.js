// 20230101000006_create_weather_data_table.js
exports.up = function(knex) {
  return knex.schema.createTable('weather_data', table => {
    table.increments('id').primary();
    table.string('city').notNullable();
    table.float('temperature').notNullable();
    table.float('min_temperature');
    table.float('max_temperature');
    table.float('humidity');
    table.float('wind_speed');
    table.string('condition');
    table.string('icon');
    table.timestamp('created_at').defaultTo(knex.fn.now());
    table.timestamp('valid_until').notNullable();
  });
};

exports.down = function(knex) {
  return knex.schema.dropTable('weather_data');
};