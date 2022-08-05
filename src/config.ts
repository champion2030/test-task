import convict = require('convict');
import * as dotenv from 'dotenv';

dotenv.config();

const values = convict({
  env: {
    doc: 'The application environment.',
    format: ['production', 'development'],
    default: 'development',
    env: 'NODE_ENV',
    arg: 'node-env',
  },
  host: {
    default: 'localhost',
    env: 'APP_HOST',
    doc: 'Application host',
    format: String,
  },
  port: {
    default: 3000,
    env: 'APP_PORT',
    doc: 'Application port',
    format: Number,
  },
  logLevel: {
    default: 'debug',
    env: 'LOG_LEVEL',
    doc: 'Log level',
    format: String,
  },
  database: {
    host: {
      default: 'localhost',
      env: 'DB_HOST',
      doc: 'Database host',
      format: String,
    },
    port: {
      default: 5432,
      env: 'DB_PORT',
      doc: 'Database port',
      format: Number,
    },
    username: {
      default: 'postgres',
      env: 'DB_USER',
      doc: 'Database username',
      format: String,
    },
    password: {
      default: 'postgres',
      env: 'DB_PASSWORD',
      doc: 'Database password',
      format: String,
    },
    name: {
      default: 'test',
      env: 'DB_NAME',
      doc: 'Database name',
      format: String,
    },
    ssl: {
      default: 'false',
      env: 'DB_SSL',
      doc: 'Is SSL connection',
      format: Boolean,
    },
    connectionTimeout: {
      default: 1200000,
      env: 'DB_TIMEOUT',
      doc: 'idleTimeoutMillis',
      format: Number,
    },
    poolSize: {
      default: 50,
      env: 'DB_POOLSIZE',
      doc: 'Connection pool size',
      format: Number,
    },
  },
  disableSqlLogs: {
    default: false,
    env: 'DISABLE_SQL_LOGS',
    doc: 'Is disable SQL logs',
    format: Boolean,
  },
  web3ProviderUrl: {
    default: 'https://mainnet.infura.io/v3/f8c1a385e2d948bb9ba8b4d6052eecc4 ',
    env: 'WEB3_URL',
    doc: 'Web3 provider url',
    format: String,
  },
});

values.validate({ allowed: 'strict' });

export const config = values.getProperties();
