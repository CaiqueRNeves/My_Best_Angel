exports.up = function(knex) {
    return knex.schema.createTable('bookings', table => {
      table.increments('id').primary();
      table.integer('tour_id').unsigned().notNullable().references('id').inTable('tours');
      table.integer('visitor_id').unsigned().notNullable().references('id').inTable('visitors');
      table.string('status').defaultTo('confirmado'); // confirmado, cancelado, realizado
      table.text('notes');
      table.timestamp('created_at').defaultTo(knex.fn.now());
      table.timestamp('updated_at').defaultTo(knex.fn.now());
    });
  };
  
  exports.down = function(knex) {
    return knex.schema.dropTable('bookings');
  };