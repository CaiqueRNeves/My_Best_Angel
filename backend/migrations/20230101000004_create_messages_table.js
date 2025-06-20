exports.up = function(knex) {
    return knex.schema.createTable('messages', table => {
      table.increments('id').primary();
      table.string('sender_type').notNullable(); // angel ou visitor
      table.integer('sender_id').notNullable();
      table.string('receiver_type').notNullable(); // angel ou visitor
      table.integer('receiver_id').notNullable();
      table.text('content').notNullable();
      table.boolean('read').defaultTo(false);
      table.timestamp('created_at').defaultTo(knex.fn.now());
    });
  };
  
  exports.down = function(knex) {
    return knex.schema.dropTable('messages');
  };