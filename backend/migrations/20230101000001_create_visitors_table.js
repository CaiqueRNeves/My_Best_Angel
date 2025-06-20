exports.up = function(knex) {
    return knex.schema.createTable('visitors', table => {
      table.increments('id').primary();
      table.integer('angel_id').unsigned().references('id').inTable('angels');
      table.string('name').notNullable();
      table.string('email').unique().notNullable();
      table.string('password').notNullable();
      table.string('phone');
      table.string('nationality');
      table.string('language_preference');
      table.string('profile_image');
      table.timestamp('created_at').defaultTo(knex.fn.now());
      table.timestamp('updated_at').defaultTo(knex.fn.now());
    });
  };
  
  exports.down = function(knex) {
    return knex.schema.dropTable('visitors');
  };