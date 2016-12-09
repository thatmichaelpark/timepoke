'use strict';

const MEMBERS = 500;
const SHOPS = 4;
const p = 0.2;

const stuff = [];

for (let m = 1; m <= MEMBERS; ++m) {
  for (let s = 1; s <= SHOPS; ++s) {
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
