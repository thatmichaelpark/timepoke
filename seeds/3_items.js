'use strict';

exports.seed = function(knex) {
  // Deletes ALL existing entries
  return knex('items').del()
    .then(() =>
      knex('items')
        .insert([{
          id: 1,
          name: 'Ceramic shell',
          shop_id: 2
        }, {
          id: 2,
          name: 'Kiln',
          shop_id: 2
        }])
        .then(() =>
          knex.raw(
            "SELECT setval('items_id_seq', (SELECT MAX(id) FROM items));"
          )
        )
    );
};
