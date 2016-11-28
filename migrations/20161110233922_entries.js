'use strict';

exports.up = function(knex) {
  return knex.schema.createTable('entries', (table) => {
    table.increments();
    table.date('entry_date');
    table.integer('hours').defaultTo(0);
    table.integer('shop_id')
      .notNullable()
      .references('id')
      .inTable('shops')
      .onDelete('CASCADE');
    table.timestamps(true, true);
  });
};

exports.down = function(knex) {
  return knex.schema.dropTable('entries');
};
