'use strict';

module.exports = {
  development: {
    client: 'pg',
    connection: 'postgres://localhost/monocultured_dev'
  },
  test: {
    client: 'pg',
    connection: 'postgres://localhost/monocultured_test'
  },
  production: {
    client: 'pg',
    connection: process.env.DATABASE_URL
  }
};
