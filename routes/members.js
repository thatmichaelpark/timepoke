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
    .select('name', 'id', 'image_url')
    .then((members) => {
      res.send(camelizeKeys(members));
    })
    .catch((err) => {
      next(err);
    });
});

router.get('/members/:id', (req, res, next) => {
  knex('members')
    .select('member_name', 'id')
    .where('id', req.params.id)
    .then((members) => {
      res.send(camelizeKeys(members[0]));
    })
    .catch((err) => {
      next(err);
    });
});

router.get('/members/byshopid/:shopId', (req, res, next) => {
  knex('members_shops')
    .where('shop_id', req.params.shopId)
    .innerJoin(`members`, `members.id`, `member_id`)
    .select(`members.id`, 'name', 'image_url')
    .then((items) => {
      res.send(camelizeKeys(items));
    })
    .catch((err) => {
      next(err);
    });
});

router.post('/members', /*ev(validations.post),*/ (req, res, next) => {
  const memberName = req.body.memberName.trim().replace(/\s+/g, ' ');
  const imageUrl = req.body.imageUrl;

  knex('members').where('member_name', 'ilike', memberName)
    .then((members) => {
      if (members.length > 0) {
        throw boom.create(400, 'That name is already in use');
      }

      return knex('members')
        .insert(decamelizeKeys({ memberName, imageUrl }), '*');
    })
    .then((result) => {
      res.send({
        memberName: result[0].member_name,
        imageUrl: result[0].image_url,
        id: result[0].id
      });
    })
    .catch((err) => {
      next(err);
    });
});

router.patch('/members/:id', checkAuth, /*ev(validations.patch),*/ (req, res, next) => {
  if (req.token.member_name !== 'admin') {
    return next(boom.create(401, 'Not logged in as admin'));
  }

  knex('members')
  .update({ member_name: req.body.member_name }, ['id', 'member_name'])
  .where('id', req.params.id)
  .then((members) => {
    res.send(members[0]);
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
