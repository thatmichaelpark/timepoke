'use strict';

exports.seed = function(knex) {
  // Deletes ALL existing entries
  return knex('logins').del()
    .then(() =>
      knex('logins')
        .insert([{
          id: 1,
          login_name: 'admin',
          is_admin: true,
          hashed_password:
            '$2a$12$s2bKx.s1DsdF5Y6jEo4KQ.R7XB4iuxfveCxAXN9U4KCCKwQUP54HO'
        }, {
          id: 2,
          login_name: 'terminal1',
          hashed_password:
            '$2a$12$s2bKx.s1DsdF5Y6jEo4KQ.R7XB4iuxfveCxAXN9U4KCCKwQUP54HO'
        }, {
          id: 3,
          login_name: 'terminal2',
          hashed_password:
            '$2a$12$s2bKx.s1DsdF5Y6jEo4KQ.R7XB4iuxfveCxAXN9U4KCCKwQUP54HO'
        }])
        .then(() =>
          knex.raw(
            "SELECT setval('logins_id_seq', (SELECT MAX(id) FROM logins));"
          )
        )
    );
};
