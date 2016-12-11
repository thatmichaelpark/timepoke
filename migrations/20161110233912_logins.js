'use strict';

exports.up = function(knex) {
  return knex.schema.createTable('logins', (table) => {
    table.increments();
    table.string('login_name').notNullable().defaultTo('');
    table.boolean('is_active').defaultTo(true);
    table.boolean('is_admin').defaultTo(false);
    table.specificType('hashed_password',
      'char(60)').notNullable().defaultTo('');
    table.timestamps(true, true);
  });
};

exports.down = function(knex) {
  return knex.schema.dropTable('logins');
};
