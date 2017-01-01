'use strict';

const express = require('express');

// eslint-disable-next-line new-cap
const router = express.Router();
const bcrypt = require('bcrypt-as-promised');
const knex = require('../knex');
const { camelizeKeys, decamelizeKeys } = require('humps');
const boom = require('boom');
const ev = require('express-validation');
// const validations = require('../validations/shops');
const { checkAuth } = require('./middleware');

// router.get('/shops', (req, res, next) => {
//   knex('shops')
//     .select('name', 'id', 'image_url')
//     .then((shops) => {
//       res.send(camelizeKeys(shops));
//     })
//     .catch((err) => {
//       next(err);
//     });
// });

router.get(`/entries/`, (req, res, next) => {
  knex('entries')
  .select(`*`)
  .then((data) => {
    res.send(camelizeKeys(data));
  })
  .catch((err) => {
    next(err);
  });
});

const bigQuery = `
select entries.created_at, entries.id, member_name, name as shop_name, hours, items
  from shops
  inner join (
    select entries.created_at, entries.id, name as member_name, entries.shop_id, hours, items
      from members
      inner join (
        select entries.created_at, entries.id, entries.member_id, entries.shop_id, hours, array_agg((entries.name, entries.quantity)) as items
          from (
            select entries.created_at, entries.id, hours, member_id, entries.shop_id, items.name, items.quantity
              from entries
              left join (
                 select *
                   from items
                   inner join entries_items
                     on items.id = entries_items.item_id
              ) items
                on entries.id = items.entry_id
          ) entries
            group by entries.created_at, entries.id, entries.member_id, entries.shop_id, hours
      ) entries
        on members.id = entries.member_id
  ) entries
  on shops.id = entries.shop_id
  order by entries.created_at
`;

router.get(`/entries/full`, (req, res, next) => {
  knex.raw(bigQuery)
  .then((data) => {
    res.send(camelizeKeys(data.rows));
  })
  .catch((err) => {
    next(err);
  });
});


router.post('/entries', checkAuth, /*ev(validations.post),*/ (req, res, next) => {
  const { memberId, shopId, hours, items } = req.body.entry;

  knex('entries')
    .insert(decamelizeKeys({ memberId, shopId, hours }), 'id')
    .then((result) => {
      const entryId = result[0];
      return Promise.all(items.filter(item => item.quantity).map((item) =>
        knex('entries_items')
        .insert({
          entry_id: entryId,
          item_id: item.id,
          quantity: item.quantity
        })
      ));
    })
    .then((result) => {
      res.sendStatus(200);
    })
    .catch((err) => {
      next(err);
    });
});

// router.patch('/shops/:id', checkAuth, /*ev(validations.patch),*/ (req, res, next) => {
//   if (req.token.shop_name !== 'admin') {
//     return next(boom.create(401, 'Not logged in as admin'));
//   }
//
//   knex('shops')
//   .update({ shop_name: req.body.shop_name }, ['id', 'shop_name'])
//   .where('id', req.params.id)
//   .then((shops) => {
//     res.send(shops[0]);
//   })
//   .catch((err) => {
//     next(err);
//   });
// });
//
// router.delete('/shops/:id', checkAuth, (req, res, next) => {
//   if (req.token.shop_name !== 'admin') {
//     return next(boom.create(401, 'Not logged in as admin'));
//   }
//
//   knex('shops')
//   .where('id', req.params.id)
//   .first()
//   .then((user) => {
//     if (!user) {
//       throw boom.create(400, 'Could not delete');
//     }
//
//     return knex('shops')
//       .del()
//       .where('id', req.params.id)
//       .then(() => {
//         res.send(user.shop_name);
//       });
//   })
//   .catch((err) => {
//     next(err);
//   });
// });

module.exports = router;
