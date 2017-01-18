'use strict';

exports.seed = function(knex) {
  // Deletes ALL existing entries
  return knex('shops').del()
    .then(() =>
      knex('shops')
        .insert([{
          name: 'Brons & Gjuteri',
          image_url: `img/litho.jpg`
        }, {
          name: 'Elektronik',
          image_url: `img/foundry.jpg`
        }, {
          name: 'Emalj',
          image_url: `img/darkroom.jpg`
        }, {
          name: 'Glas',
          image_url: `img/screenprint.jpg`
        }, {
          name: 'Keramik',
          image_url: `img/litho.jpg`
        }, {
          name: 'Koppargrafik',
          image_url: `img/foundry.jpg`
        }, {
          name: 'Laserskärere',
          image_url: `img/darkroom.jpg`
        }, {
          name: 'Litografi',
          image_url: `img/screenprint.jpg`
        }, {
          name: 'Metall',
          image_url: `img/litho.jpg`
        }, {
          name: 'Textilpatinering',
          image_url: `img/foundry.jpg`
        }, {
          name: 'Textil',
          image_url: `img/darkroom.jpg`
        }, {
          name: 'Trä',
          image_url: `img/screenprint.jpg`
        }, {
          name: 'Tuft',
          image_url: `img/screenprint.jpg`
        }, {
          name: 'Screentryck',
          image_url: `img/screenprint.jpg`
        }, {
          name: 'Vinylplotter',
          image_url: `img/screenprint.jpg`
        }])
        .then(() =>
          knex.raw(
            "SELECT setval('shops_id_seq', (SELECT MAX(id) FROM shops));"
          )
        )
    );
};
