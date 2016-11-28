'use strict';

exports.up = function(knex) {
  return knex.schema.createTable('items', (table) => {
    table.increments();
    table.string('item_name').notNullable().defaultTo('');
    table.integer('shop_id')
      .notNullable()
      .references('id')
      .inTable('shops')
      .onDelete('CASCADE');
    table.timestamps(true, true);
  });
};

exports.down = function(knex) {
  return knex.schema.dropTable('items');
};
