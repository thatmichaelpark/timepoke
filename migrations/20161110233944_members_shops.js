'use strict';

exports.up = function(knex) {
  return knex.schema.createTable('members_shops', (table) => {
    table.increments();
    table.integer('member_id')
      .notNullable()
      .references('id')
      .inTable('members')
      .onDelete('CASCADE')
      .index();
    table.integer('shop_id')
      .notNullable()
      .references('id')
      .inTable('shops')
      .onDelete('CASCADE')
      .index();
    table.integer('quantity')
    table.timestamps(true, true);
  });
};

exports.down = function(knex) {
  return knex.schema.dropTable('members_shops');
};
