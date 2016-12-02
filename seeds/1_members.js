'use strict';

exports.seed = function(knex) {
  // Deletes ALL existing entries
  return knex('members').del()
    .then(() =>
      knex('members')
        .insert([{
          name: 'Alliser Thorne'
        }, {
          name: 'Myrcella Baratheon'
        }, {
          name: 'Syrio Forel'
        }, {
          name: 'Othell Yarwyck'
        }, {
          name: 'Nobody'
        }, {
          name: 'Osha'
        }, {
          name: 'Meryl Trant'
        }, {
          name: 'Kevan Lannister'
        }, {
          name: 'Podrick Payne'
        }])
        .then(() =>
          knex.raw(
            "SELECT setval('members_id_seq', (SELECT MAX(id) FROM members));"
          )
        )
    );
};
