'use strict';

const express = require('express');

// eslint-disable-next-line new-cap
const router = express.Router();
const knex = require('../knex');
const { camelizeKeys, decamelizeKeys } = require('humps');
const boom = require('boom');
// const ev = require('express-validation');
// const validations = require('../validations/shops');
const { checkAuth } = require('./middleware');

const makeQuery = (id) => {
  const clause = id ? `and members.id = ${id}` : ``;
  return `
    select member_name, is_active, array_to_string(array_agg((shop_name, hours, items_array)), ', ') as results
    from
      (
        select members.name as member_name, member_id, members.is_active, shops.name as shop_name, shop_id, sum(hours) as hours
        from
          members,
          entries,
          shops
        where members.id = entries.member_id
        ${clause}
        and entries.shop_id = shops.id
        group by members.name, member_id, members.is_active, shops.name, shop_id
      ) items
    left join
      (
        select member_id, item_sums.shop_id, array_to_string(array_agg((items.name, sum)), ',') as items_array
        from
          (
            select member_id, shop_id, item_id, sum(quantity)
            from
              entries,
              entries_items
              where entries.id = entry_id
            group by member_id, shop_id, item_id
            order by member_id, shop_id, item_id
          ) item_sums,
          items
        where item_sums.item_id = items.id
        group by member_id, item_sums.shop_id
      ) hours
    on items.member_id = hours.member_id
    and items.shop_id = hours.shop_id
    group by member_name, is_active
    order by member_name
  `;
}

function blah(obj) {
  const str = obj.results.replace(/"/g, '')       // First, eliminate quotes
    .replace(/((?:\w|\s|&)+),(\d+)/g, `"$1",$2`)  // Then, put quotes around words
                                                  //  where a word is alphanumeric or space or &
    .replace(/\(/g, `[`)                          // Change ()
    .replace(/(,?\))/g, `]`);                     //  to []
  const arr = JSON.parse(`[${str}]`);
  const results = arr.map(a => {
    return {
      shop: a[0],
      hours: a[1],
      items: a.slice(2).map(i => ({ item: i[0], quantity: i[1]}))
    };
  });
  obj.results = results;
  return obj;
}

router.get(`/reports`, checkAuth, (req, res, next) => {
  if (!req.token.isAdmin) {
    return next(boom.create(401, 'Not logged in as admin'));
  }
  knex.raw(makeQuery())
  .then((data) => {
    res.send(camelizeKeys(data.rows).map(blah));
  })
  .catch((err) => {
    next(err);
  });
});

router.get(`/reports/:id`, (req, res, next) => {
  if (!req.token.isAdmin) {
    return next(boom.create(401, 'Not logged in as admin'));
  }
  knex.raw(makeQuery(req.params.id))
  .then((data) => {
    res.send(blah(camelizeKeys(data.rows)));
  })
  .catch((err) => {
    next(err);
  });
});

module.exports = router;
