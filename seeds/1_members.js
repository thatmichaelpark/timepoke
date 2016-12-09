'use strict';


function Bork() {
  let p = 0.001;
  function randomLetter() {
    const alphabet = `abcdefghijklmnopqrstuvwxyzåäö`;
    return alphabet[Math.floor(Math.random() * alphabet.length)];
  }
  let result = randomLetter().toUpperCase();
  while (Math.random() > p) {
    result += randomLetter();
    p = Math.sqrt(p);
  }
  return result;
}


const originalNames = [{
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
}];

const names = [];
for (let i = 0; i < 100; ++i) {
  names.push({ name: Bork() + ' ' + Bork() });
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
