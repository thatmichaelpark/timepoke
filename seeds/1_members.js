'use strict';

exports.seed = function(knex) {
  // Deletes ALL existing entries
  return knex('members').del()
    .then(() =>
      knex('members')
        .insert([{
          id: 1,
          name: 'Alliser Thorne'
        }, {
          id: 2,
          name: 'Myrcella Baratheon'
        }, {
          id: 3,
          name: 'Syrio Forel'
        }, {
          id: 4,
          name: 'Othell Yarwyck'
        }])
        .then(() =>
          knex.raw(
            "SELECT setval('members_id_seq', (SELECT MAX(id) FROM members));"
          )
        )
    );
};
