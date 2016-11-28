'use strict';

exports.seed = function(knex) {
  // Deletes ALL existing entries
  return knex('members').del()
    .then(() =>
      knex('members')
        .insert([{
          id: 1,
          member_name: 'Alliser Thorne'
        }, {
          id: 2,
          member_name: 'Myrcella Baratheon'
        }, {
          id: 3,
          member_name: 'Syrio Forel'
        }, {
          id: 4,
          member_name: 'Othell Yarwyck'
        }])
        .then(() =>
          knex.raw(
            "SELECT setval('members_id_seq', (SELECT MAX(id) FROM members));"
          )
        )
    );
};
