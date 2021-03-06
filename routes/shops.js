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

router.get('/shops', (req, res, next) => {
  knex('shops')
    .select(`id`, 'name', 'is_active', 'image_url')
    .then((shops) => {
      res.send(camelizeKeys(shops));
    })
    .catch((err) => {
      next(err);
    });
});

// get a shop's members (incl. members' names)
router.get('/shops/:id/members/', (req, res, next) => {
  knex('members_shops')
    .where('shop_id', req.params.id)
    .where(`is_active`, true) // active members only
    .innerJoin(`members`, `members.id`, `member_id`)
    .select(`members.id`, 'name', 'image_url', 'is_active', 'membership_tier')
    .then((items) => {
      res.send(camelizeKeys(items));
    })
    .catch((err) => {
      next(err);
    });
});

// get a shop's items
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

router.post('/shops', /*ev(validations.post),*/ (req, res, next) => {
  const name = req.body.name.trim().replace(/\s+/g, ' ');
  const imageUrl = req.body.imageUrl;

  knex('shops').where('name', 'ilike', name)
    .then((shops) => {
      if (shops.length > 0) {
        throw boom.create(400, 'That name is already in use');
      }

      return knex('shops')
        .insert(decamelizeKeys({ name, imageUrl }), '*');
    })
    .then((result) => {
      res.send({
        name: result[0].name,
        imageUrl: result[0].image_url,
        id: result[0].id
      });
    })
    .catch((err) => {
      next(err);
    });
});

router.put('/shops/:id', checkAuth, /*ev(validations.put),*/ (req, res, next) => {
  const name = req.body.name.trim().replace(/\s+/g, ' ');
  knex('shops').where('name', 'ilike', name).where('id', '!=', req.params.id)
    .then((shops) => {
      if (shops.length > 0) {
        throw boom.create(400, 'That name is already in use');
      }
    return knex('shops')
      .update(decamelizeKeys(req.body), ['id', 'name', `is_active`])
      .where('id', req.params.id)
  })
  .then((shops) => {
    res.send(camelizeKeys(shops[0]));
  })
  .catch((err) => {
    next(err);
  });
});

router.delete('/shops/:id', checkAuth, (req, res, next) => {
  if (req.token.shop_name !== 'admin') {
    return next(boom.create(401, 'Not logged in as admin'));
  }

  knex('shops')
  .where('id', req.params.id)
  .first()
  .then((user) => {
    if (!user) {
      throw boom.create(400, 'Could not delete');
    }

    return knex('shops')
      .del()
      .where('id', req.params.id)
      .then(() => {
        res.send(user.shop_name);
      });
  })
  .catch((err) => {
    next(err);
  });
});

module.exports = router;
