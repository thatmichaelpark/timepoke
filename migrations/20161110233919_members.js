'use strict';

exports.up = function(knex) {
  return knex.schema.createTable('members', (table) => {
    table.increments();
    table.string('member_name').notNullable().defaultTo('');
    table.string('image_url').defaultTo('img/default.jpeg');
    table.boolean('active').defaultTo(true);
    table.specificType('hashed_password',
      'char(60)').notNullable().defaultTo('');
    table.timestamps(true, true);
  });
};

exports.down = function(knex) {
  return knex.schema.dropTable('members');
};
