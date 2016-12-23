'use strict';

exports.up = function(knex) {
  return knex.schema.createTable('members', (table) => {
    table.increments();
    table.string('name').notNullable().defaultTo('');
    table.string('image_url').defaultTo('img/memberdefault.jpeg');
    table.boolean('is_active').defaultTo(true);
    table.string('membership_tier').defaultTo('mini');
    table.timestamps(true, true);
  });
};

exports.down = function(knex) {
  return knex.schema.dropTable('members');
};
