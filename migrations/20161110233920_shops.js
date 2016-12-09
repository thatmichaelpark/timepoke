'use strict';

exports.up = function(knex) {
  return knex.schema.createTable('shops', (table) => {
    table.increments();
    table.string('name').notNullable().defaultTo('');
    table.string('image_url').defaultTo('img/shopdefault.jpeg');
    table.boolean('active').defaultTo(true);
    table.timestamps(true, true);
  });
};

exports.down = function(knex) {
  return knex.schema.dropTable('shops');
};
