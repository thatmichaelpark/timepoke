'use strict';

if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config();
}

const express = require('express');
const app = express();

app.disable('x-powered-by');

const morgan = require('morgan');

switch (app.get('env')) { // enhanced process.env.NODE_ENV
  case 'development':
    app.use(morgan('dev'));
    break;
  case 'production':
    app.use(morgan('short'));
    break;
  default:
}

const path = require('path');

app.use(express.static(path.join(__dirname, 'public')));

// CSRF protection
app.use('/api', (req, res, next) => {
  if (/json/.test(req.get('Accept'))) {
    return next();
  }

  res.sendStatus(406);
});

const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');

app.use(bodyParser.json());
app.use(cookieParser());

const { decodeAuth } = require(`./routes/middleware`);

app.get('/', decodeAuth, (req, res) => {
  if (req.token) {
    const { username } = req.token;
    if (req.token.isAdmin) {
      res.sendFile(`${__dirname}/public/index_admin.html`);
    }
    else {
      res.sendFile(`${__dirname}/public/index_members.html`);
    }
  }
  else {
    res.sendFile(`${__dirname}/public/login.html`);
  }
});

const members = require('./routes/members');
app.use('/api', members);
const shops = require('./routes/shops');
app.use('/api', shops);
const entries = require('./routes/entries');
app.use('/api', entries);
const items = require('./routes/items');
app.use('/api', items);
const logins = require('./routes/logins');
app.use('/api', logins);
const token = require('./routes/token');
app.use('/api', token);

app.use((err, _req, res, _next) => {
  if (err.output && err.output.statusCode) {
    return res
      .status(err.output.statusCode)
      .set('Content-Type', 'text/plain')
      .send(err.message);
  }
  else if (err.status) {
    return res
      .status(err.status)
      .set('Content-Type', 'text/plain')
      .send(err.message);
  }

  // eslint-disable-next-line no-console
  console.error('error:', err);
  res.sendStatus(500);
});

const port = process.env.PORT || 8000;

app.listen(port, () => {
  // eslint-disable-next-line no-console
  console.log('Listening on port', port);
});

module.exports = app;
