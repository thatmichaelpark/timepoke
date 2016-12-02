'use strict';

exports.seed = function(knex) {
  // Deletes ALL existing entries
  return knex('shops').del()
    .then(() =>
      knex('shops')
        .insert([{
          name: 'Litho',
          image_url: `img/litho.jpg`
        }, {
          name: 'Foundry',
          image_url: `img/foundry.jpg`
        }, {
          name: 'Darkroom',
          image_url: `img/darkroom.jpg`
        }, {
          name: 'Screenprint',
          image_url: `img/screenprint.jpg`
        }])
        .then(() =>
          knex.raw(
            "SELECT setval('shops_id_seq', (SELECT MAX(id) FROM shops));"
          )
        )
    );
};
