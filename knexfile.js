'use strict';

module.exports = {
  development: {
    client: 'pg',
    connection: {
	host: 'localhost',
	user: 'postgres',
	password: 'password',
	database: 'timepoke_dev'
    }
  },
  test: {
    client: 'pg',
    connection: 'postgres://localhost/timepoke_test'
  },
  production: {
    client: 'pg',
    connection: process.env.DATABASE_URL
  }
};
