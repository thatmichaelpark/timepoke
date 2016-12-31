'use strict';

const { NMEMBERS, Bork } = require('./utils/utils');

// const originalNames = [{
//   name: 'Alliser Thorne'
// }, {
//   name: 'Myrcella Baratheon'
// }, {
//   name: 'Syrio Forel'
// }, {
//   name: 'Othell Yarwyck'
// }, {
//   name: 'Nobody'
// }, {
//   name: 'Osha'
// }, {
//   name: 'Meryl Trant'
// }, {
//   name: 'Kevan Lannister'
// }, {
//   name: 'Podrick Payne'
// }];

const names = [];
while (names.length < NMEMBERS) {
  names.push({ name: Bork() + ' ' + Bork(), is_active: Math.random() < 0.5 });
}

exports.seed = function(knex) {
  // Deletes ALL existing entries
  return knex('members').del()
    .then(() =>
      knex('members')
        .insert(names)
        .then(() =>
          knex.raw(
            "SELECT setval('members_id_seq', (SELECT MAX(id) FROM members));"
          )
        )
    );
};
