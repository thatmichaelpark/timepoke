'use strict';

const NMEMBERS = 500;
const NSHOPS = 15;

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

module.exports = { NMEMBERS, NSHOPS, Bork };
