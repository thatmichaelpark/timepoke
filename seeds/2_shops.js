'use strict';

exports.seed = function(knex) {
  // Deletes ALL existing entries
  return knex('shops').del()
    .then(() =>
      knex('shops')
        .insert([{
          id: 1,
          name: 'Litho'
        }, {
          id: 2,
          name: 'Foundry'
        }])
        .then(() =>
          knex.raw(
            "SELECT setval('shops_id_seq', (SELECT MAX(id) FROM shops));"
          )
        )
    );
};
