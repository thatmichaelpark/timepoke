'use strict';

const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt-as-promised');
const knex = require('../knex');
const boom = require('boom');
const { camelizeKeys } = require('humps');
const express = require('express');

const router = express.Router();

router.post('/token', (req, res, next) => {
  let login;

  const loginName = req.body.loginName.trim().replace(/\s+/g, ' ');

  knex('logins')
    .where('login_name', 'ilike', loginName)
    .where('is_active', true)
    .first()
    .then((row) => {
      if (row) {
        login = camelizeKeys(row);
        return bcrypt.compare(req.body.password, login.hashedPassword);
      }
    })
    .then(() => {
      // const expiry = new Date(Date.now() + 1000 * 60 * 60 * 3);
      const payload = {
        loginId: login.id,
        loginName: login.loginName,
        isAdmin: login.isAdmin
      };
      const token = jwt.sign(
        payload,
        process.env.JWT_SECRET,
        { /*expiresIn: `3h`*/ }
      );

      res.cookie('MonoculturedAccessToken', token, {
        httpOnly: true,
        // expires: expiry,
        secure: router.get('env') === 'production'
      });

      res.cookie('MonoculturedLoggedIn', true, {
        // expires: expiry,
        secure: router.get('env') === 'production'
      });

      res.cookie('MonoculturedLoginName', payload.loginName, {
        // expires: expiry,
        secure: router.get('env') === 'production'
      });

      res.cookie('MonoculturedLoginId', payload.loginId, {
        // expires: expiry,
        secure: router.get('env') === 'production'
      });

      res.send({ loginName: payload.loginName, loginId: payload.loginId });
    })
    .catch(bcrypt.MISMATCH_ERROR, () => {
      throw boom.create(401, 'Login failed');
    })
    .catch((err) => {
      next(err);
    });
});

router.delete('/token', (req, res) => {
  res.clearCookie('MonoculturedAccessToken');
  res.clearCookie('MonoculturedLoggedIn');
  res.clearCookie('MonoculturedLoginName');
  res.clearCookie('MonoculturedLoginId');

  res.sendStatus(200);
});

module.exports = router;
