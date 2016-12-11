'use strict';

const express = require('express');

// eslint-disable-next-line new-cap
const router = express.Router();
const bcrypt = require('bcrypt-as-promised');
const knex = require('../knex');
const { camelizeKeys, decamelizeKeys } = require('humps');
const boom = require('boom');
const ev = require('express-validation');
// const validations = require('../validations/logins');
const { checkAuth } = require('./middleware');

router.get('/logins', (req, res, next) => {
  knex('logins')
    .select('login_name', 'id', 'active')
    .then((logins) => {
      res.send(camelizeKeys(logins));
    })
    .catch((err) => {
      next(err);
    });
});

router.post('/logins', /*ev(validations.post),*/ (req, res, next) => {
  const loginName = req.body.loginName.trim().replace(/\s+/g, ' ');

  knex('logins').where('login_name', 'ilike', loginName)
    .then((logins) => {
      if (logins.length > 0) {
        throw boom.create(400, 'That login is already in use');
      }

      return knex('logins')
        .insert(decamelizeKeys({ loginName, imageUrl, active }), '*');
    })
    .then((result) => {
      res.send({
        id: result[0].id,
        loginName: result[0].login_name,
        active: result[0].active
      });
    })
    .catch((err) => {
      next(err);
    });
});

router.patch('/logins/:id', checkAuth, /*ev(validations.patch),*/ (req, res, next) => {
  knex('logins')
  .update(decamelizeKeys(req.body), ['id', 'login_name', 'active'])
  .where('id', req.params.id)
  .then((logins) => {
    res.send(camelizeKeys(logins[0]));
  })
  .catch((err) => {
    next(err);
  });
});

module.exports = router;
