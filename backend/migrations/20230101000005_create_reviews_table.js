exports.up = function(knex) {
    return knex.schema.createTable('reviews', table => {
      table.increments('id').primary();
      table.integer('tour_id').unsigned().notNullable().references('id').inTable('tours');
      table.integer('visitor_id').unsigned().notNullable().references('id').inTable('visitors');
      table.integer('angel_id').unsigned().notNullable().references('id').inTable('angels');
      table.integer('rating').notNullable(); // 1 a 5
      table.text('comment');
      table.timestamp('created_at').defaultTo(knex.fn.now());
    });
  };
  
  exports.down = function(knex) {
    return knex.schema.dropTable('reviews');
  };