'use strict';

exports.up = function(knex) {
  return knex.schema.createTable('entries', (table) => {
    table.increments();
    table.integer('hours').defaultTo(0);
    table.integer('member_id')
      .notNullable()
      .references('id')
      .inTable('members')
      .onDelete('CASCADE');
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
