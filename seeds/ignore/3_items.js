'use strict';

exports.seed = function(knex) {
  // Deletes ALL existing entries
  return knex('items').del()
    .then(() =>
      knex('items')
        .insert([{
          name: 'Ceramic shell',
          shop_id: 2
        }, {
          name: 'Kiln',
          shop_id: 2
        }, {
          name: 'Fixer',
          shop_id: 3
        }, {
          name: 'Developer',
          shop_id: 3
        }, {
          name: 'Screen',
          shop_id: 4
        }, {
          name: 'Ink',
          shop_id: 4
        }, {
          name: 'Squeegee',
          shop_id: 4
        }])
        .then(() =>
          knex.raw(
            "SELECT setval('items_id_seq', (SELECT MAX(id) FROM items));"
          )
        )
    );
};
