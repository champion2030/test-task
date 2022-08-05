import { Container, Service } from 'typedi';
import { createConnection } from 'typeorm';
import { config } from './config';
import { CustomTypeOrmLogger } from './services/helpers/customTypeOrmLogger';

@Service()
export class DataBase {
  constructor() {}

  public async connect() {
    const entities = ['src/models/entities/*.ts'];
    const migrations = ['src/migrations/**/*.ts', 'src/seeds/**/*.ts'];
    const entitiesDir = 'src/models';
    const migrationsDir = 'src/migration';

    const connection = await createConnection({
      type: 'postgres',
      host: config.database.host,
      port: config.database.port,
      username: config.database.username,
      password: config.database.password,
      database: config.database.name,
      synchronize: false,
      dropSchema: false,
      migrationsRun: true,
      logging: !config.disableSqlLogs,
      logger: config.disableSqlLogs
        ? undefined
        : new CustomTypeOrmLogger((query) => {
            return require('sql-formatter').format(query, { language: 'pl/sql' });
          }),
      extra: {
        ssl: config.database.ssl,
        idleTimeoutMillis: config.database.connectionTimeout,
        poolSize: config.database.poolSize,
      },
      entities,
      migrations,
      cli: {
        entitiesDir,
        migrationsDir,
      },
    });

    Container.set('connection', connection);
  }
}
