'use strict';

const jwt = require('jsonwebtoken');

const checkAuth = function(req, res, next) {
  jwt.verify(req.cookies.MonoculturedAccessToken, process.env.JWT_SECRET,
    (err, decoded) => {
      if (err) {
        return res.sendStatus(401);
      }

      req.token = decoded; // Access the payload via req.token.userId etc
      next();
    }
  );
};

const decodeAuth = function(req, res, next) {
// Same as checkAuth except any error is ignored.
  jwt.verify(req.cookies.MonoculturedAccessToken, process.env.JWT_SECRET,
    (err, decoded) => {
      if (!err) {
        req.token = decoded; // Access the payload via req.token.userId etc
      }
      next();
    }
  );
};

module.exports = { checkAuth, decodeAuth };
