'use strict';

const express = require('express');

// eslint-disable-next-line new-cap
const router = express.Router();
const bcrypt = require('bcrypt-as-promised');
const knex = require('../knex');
const { camelizeKeys, decamelizeKeys } = require('humps');
const boom = require('boom');
const ev = require('express-validation');
// const validations = require('../validations/members');
const { checkAuth } = require('./middleware');

router.get('/members', (req, res, next) => {
  knex('members')
    .select('id', 'name', 'image_url', 'is_active')
    .then((members) => {
      res.send(camelizeKeys(members));
    })
    .catch((err) => {
      next(err);
    });
});

// get a member's shops:
router.get('/members/:id/shops', (req, res, next) => {
  knex('members_shops')
    .select('shop_id')
    .where('member_id', req.params.id)
    .then((shops) => {
      res.send(camelizeKeys(shops));
    })
    .catch((err) => {
      next(err);
    });
});

// save a member's shops:
router.post('/members/:id/shops', (req, res, next) => {
  const { id } = req.params;
  const { shopIds } = req.body;

  knex('members_shops')
    .del()
    .where(`member_id`, id)
    .then(() => {
      return Promise.all(shopIds.map(shopId =>
        knex(`members_shops`)
        .insert({ member_id: id, shop_id: shopId })
      ))
    })
    .then(() => {
      res.sendStatus(200);
    })
    .catch((err) => {
      next(err);
    });
});

router.post('/members', /*ev(validations.post),*/ (req, res, next) => {
  const name = req.body.name.trim().replace(/\s+/g, ' ');
  const { imageUrl, isActive } = req.body;

  knex('members').where('name', 'ilike', name)
    .then((members) => {
      if (members.length > 0) {
        throw boom.create(400, 'That name is already in use');
      }

      return knex('members')
        .insert(decamelizeKeys({ name, imageUrl, isActive }), '*');
    })
    .then((result) => {
      res.send({
        id: result[0].id,
        name: result[0].name,
        imageUrl: result[0].image_url,
        isActive: result[0].is_active
      });
    })
    .catch((err) => {
      next(err);
    });
});

router.patch('/members/:id', checkAuth, /*ev(validations.patch),*/ (req, res, next) => {
  knex('members')
  .update(decamelizeKeys(req.body), ['id', 'name', 'image_url', 'is_active'])
  .where('id', req.params.id)
  .then((members) => {
    res.send(camelizeKeys(members[0]));
  })
  .catch((err) => {
    next(err);
  });
});

router.get(`/members/:id/entries/`, (req, res, next) => {
  const q = `

select *
from
  (
    select entry_id, quantity, name as item_name
    from
      entries_items
    inner join
      items
    on entries_items.item_id = items.id
  ) entries_items
right join
  (
    select *
    from
      (
        select id as entry_id, hours, shop_id
        from
          entries
        where entries.member_id = ${req.params.id}
      ) entries
    inner join
      (
        select id as shop_id, name as shop_name
        from
          shops
      ) shops
    on entries.shop_id = shops.shop_id
  ) entries_shops

on entries_items.entry_id = entries_shops.entry_id

  `;
  knex.raw(q)
  .then((data) => {
    res.send(camelizeKeys(data.rows));
  })
  .catch((err) => {
    next(err);
  });
});


router.delete('/members/:id', checkAuth, (req, res, next) => {
  if (req.token.member_name !== 'admin') {
    return next(boom.create(401, 'Not logged in as admin'));
  }

  knex('members')
  .where('id', req.params.id)
  .first()
  .then((user) => {
    if (!user) {
      throw boom.create(400, 'Could not delete');
    }

    return knex('members')
      .del()
      .where('id', req.params.id)
      .then(() => {
        res.send(user.member_name);
      });
  })
  .catch((err) => {
    next(err);
  });
});

module.exports = router;
