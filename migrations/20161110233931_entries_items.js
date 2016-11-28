'use strict';

exports.up = function(knex) {
  return knex.schema.createTable('entries_items', (table) => {
    table.increments();
    table.integer('entry_id')
      .notNullable()
      .references('id')
      .inTable('entries')
      .onDelete('CASCADE')
      .index();
    table.integer('item_id')
      .notNullable()
      .references('id')
      .inTable('items')
      .onDelete('CASCADE')
      .index();
    table.integer('quantity')
    table.timestamps(true, true);
  });
};

exports.down = function(knex) {
  return knex.schema.dropTable('entries_items');
};
