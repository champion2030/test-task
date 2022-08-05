import { Request, Response } from 'express';
import { ExpressMiddlewareInterface, Middleware } from 'routing-controllers';

@Middleware({ type: 'before' })
export class SetHeadersMiddleware implements ExpressMiddlewareInterface {
  public use(request: Request, response: Response, next: (err?: Error) => void) {
    response.setHeader('Access-Control-Allow-Origin', '*');
    response.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    response.setHeader('Access-Control-Allow-Credentials', 'true');
    next();
  }
}
