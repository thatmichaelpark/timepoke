'use strict';

const { NMEMBERS, NSHOPS } = require('./utils/utils');

const p = 0.2;

const stuff = [];

for (let m = 1; m <= NMEMBERS; ++m) {
  for (let s = 1; s <= NSHOPS; ++s) {
    if (Math.random() < p) {
      stuff.push({ member_id: m, shop_id: s });
    }
  }
}

exports.seed = function(knex) {
  // Deletes ALL existing entries
  return knex('members_shops').del()
    .then(() =>
      knex('members_shops')
        .insert(stuff)
        .then(() =>
          knex.raw(
            "SELECT setval('members_shops_id_seq', (SELECT MAX(id) FROM members_shops));"
          )
        )
    );
};
