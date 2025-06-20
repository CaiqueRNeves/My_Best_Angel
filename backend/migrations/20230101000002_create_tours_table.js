exports.up = function(knex) {
    return knex.schema.createTable('tours', table => {
      table.increments('id').primary();
      table.integer('angel_id').unsigned().notNullable().references('id').inTable('angels');
      table.string('title').notNullable();
      table.text('description');
      table.string('location').notNullable();
      table.datetime('date').notNullable();
      table.integer('duration'); // duração em minutos
      table.float('price');
      table.integer('max_participants').defaultTo(10);
      table.integer('current_participants').defaultTo(0);
      table.string('image');
      table.timestamp('created_at').defaultTo(knex.fn.now());
      table.timestamp('updated_at').defaultTo(knex.fn.now());
    });
  };
  
  exports.down = function(knex) {
    return knex.schema.dropTable('tours');
  };