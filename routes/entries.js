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

router.get('/shops/:id/items', (req, res, next) => {
  knex('items')
    .select('name', 'id')
    .where('shop_id', req.params.id)
    .then((items) => {
      res.send(camelizeKeys(items));
    })
    .catch((err) => {
      next(err);
    });
});

router.post('/entries', /*ev(validations.post),*/ (req, res, next) => {
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
