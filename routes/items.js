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

router.get(`/items/`, (req, res, next) => {
  knex('items')
  .select(`id`, `name`, `shop_id`, `is_active`)
  .then((items) => {
    res.send(camelizeKeys(items));
  })
  .catch((err) => {
    next(err);
  });
});

router.get('/items/byshopid/:shopId', (req, res, next) => {
  knex('items')
    .select('name', 'id', 'is_active', 'shop_id')
    .where('shop_id', req.params.shopId)
    .then((items) => {
      res.send(camelizeKeys(items));
    })
    .catch((err) => {
      next(err);
    });
});

router.post('/items', /*ev(validations.post),*/ (req, res, next) => {
  const name = req.body.name.trim().replace(/\s+/g, ' ');
  const { isActive, shopId } = req.body;

  knex('items').where('name', 'ilike', name)
    .then((items) => {
      if (items.length > 0) {
        throw boom.create(400, 'That name is already in use');
      }

      return knex('items')
        .insert(decamelizeKeys({ name, isActive, shopId }), '*');
    })
    .then((result) => {
      res.send({
        name: result[0].name,
        isActive: result[0].is_active,
        shopId: result[0].shop_id,
        id: result[0].id
      });
    })
    .catch((err) => {
      next(err);
    });
});

router.patch('/items/:id', checkAuth, /*ev(validations.patch),*/ (req, res, next) => {
  knex('items')
  .update(decamelizeKeys(req.body), ['id', 'name', 'is_active', 'shop_id'])
  .where('id', req.params.id)
  .then((items) => {
    res.send(camelizeKeys(items[0]));
  })
  .catch((err) => {
    next(err);
  });
});

module.exports = router;
