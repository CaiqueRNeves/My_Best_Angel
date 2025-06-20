exports.up = function(knex) {
    return knex.schema.createTable('angels', table => {
      table.increments('id').primary();
      table.string('name').notNullable();
      table.string('email').unique().notNullable();
      table.string('password').notNullable();
      table.string('phone');
      table.text('bio');
      table.string('languages');
      table.string('profile_image');
      table.string('specialty');
      table.float('rating').defaultTo(5.0);
      table.integer('reviews_count').defaultTo(0);
      table.timestamp('created_at').defaultTo(knex.fn.now());
      table.timestamp('updated_at').defaultTo(knex.fn.now());
    });
  };
  
  exports.down = function(knex) {
    return knex.schema.dropTable('angels');
  };