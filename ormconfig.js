/* eslint-disable */

const join = require("path").join;
require('ts-node/register');

console.log('ORM CONFIG LOADED FROM "ormconfig.js"');

const typeORMConfig = {
    type: 'postgres',

    host: process.env.DB_HOST || 'localhost',
    port: +process.env.DB_PORT || 5432,
    username: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASSWORD || 'postgres',
    database: process.env.DB_NAME || 'test',

    entities: [join(__dirname, join('src/models/entities/*.entity.ts'))],

    logging: process.env.LOG_LEVEL,
}

const migrationsConfig = {
    ...typeORMConfig,
    name: 'migrations',
    migrationsTableName: 'migrations',
    migrations: [join(__dirname, 'src/migrations/*.ts')],
}

const seedsConfig = {
    ...typeORMConfig,
    name: 'seeds',
    migrationsTableName: 'seeds',
    migrations: [join(__dirname, 'src/seeds/*.ts')],
}

module.exports = [
  Object.assign(
    {
      ...migrationsConfig,
      cli: {migrationsDir: 'src/migrations'},

      name: 'default',
    },
    module.exports,
  ),
  Object.assign(
    {
      ...seedsConfig,
      cli: { migrationsDir: 'src/seeds'},

      name: 'seeds',
    },
    module.exports,
  ),
];
