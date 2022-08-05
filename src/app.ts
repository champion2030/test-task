import * as express from 'express';
import { createExpressServer, useContainer as useRouteContainer } from 'routing-controllers';
import { useContainer as useTypeormContainer } from 'typeorm';
import { useContainer as useValidatorContainer } from 'class-validator';
import { Container } from 'typedi';
import { config } from './config';
import { logger } from './logger';
import { DataBase } from './database';
import { WalletsController } from './controllers/wallets.controller';
import { ErrorHandlerMiddleware } from './services/middlewares/error-handler.middleware';
import { SetHeadersMiddleware } from './services/middlewares/set-headers.middleware';

export class App {
  public app: express.Application;

  constructor(private database: DataBase) {
    useRouteContainer(Container);
    useTypeormContainer(Container);
    useValidatorContainer(Container);

    this.app = createExpressServer({
      routePrefix: '/api',
      defaultErrorHandler: false,
      classTransformer: true,
      validation: false,
      controllers: [WalletsController],
      middlewares: [ErrorHandlerMiddleware, SetHeadersMiddleware],
    });

    database.connect();

    this.app.listen(config.port, () => {
      logger.info(`Listening at http://${config.host}:${config.port}/`);
    });
  }
}

export const app = new App(Container.get(DataBase)).app;
