import { Request, Response } from 'express';
import { HttpError, Middleware } from 'routing-controllers';
// eslint-disable-next-line max-len
import { ExpressErrorMiddlewareInterface } from 'routing-controllers/driver/express/ExpressErrorMiddlewareInterface';
import { logger } from '../../logger';
import { QueryFailedError } from 'typeorm';
import { ValidationError } from 'class-validator';

@Middleware({ type: 'after' })
export class ErrorHandlerMiddleware implements ExpressErrorMiddlewareInterface {
  constructor() {}

  public error(
    err: QueryFailedError | HttpError | Error | ValidationError | ValidationError[],
    request: Request,
    response: Response,
    next?: (err?: Error) => void,
  ) {
    if (Array.isArray(err)) {
      const isNotValidationError = err.find((error) => !(error instanceof ValidationError));

      if (!isNotValidationError) {
        const message = err.map((error) => parseValidationError(error).join(', ')).join('; ');

        logger.error(message);
        logger.debug(JSON.stringify(err));

        return response.status(400).json(message);
      }
    }

    if (err instanceof ValidationError) {
      const message = parseValidationError(err).join(', ');

      logger.error(message);
      logger.debug(JSON.stringify(err));

      return response.status(400).json(message);
    }

    if (err instanceof QueryFailedError) {
      const error = err as unknown as { message: string; code: string; detail: string };

      logger.error(error.detail);
      logger.debug(error.message);

      // https://www.postgresql.org/docs/10/errcodes-appendix.html
      if (error.code === '23505') {
        // unique_violation
        return response.status(400).json(error.detail);
      }
      if (error.code === '23502') {
        // not_null_violation
        return response.status(400).json(error.detail);
      }
    }

    if (!Array.isArray(err) && (err as HttpError & { errors: ValidationError[] }).errors) {
      const validationError = err as HttpError & { errors: ValidationError[] };

      const message = validationError.errors
        .map((error) =>
          ((error.constraints && Object.keys(error.constraints)) || [])
            .map((key) => error.constraints![key])
            .join(', '),
        )
        .join(', ');

      logger.error(err.message);

      return response.status(validationError.httpCode).json(message);
    }

    if (err instanceof HttpError) {
      logger.error(err.message);
      if (err.stack) {
        logger.debug(err.stack);
      }

      return response.status(err.httpCode).json(err.message);
    }

    if (err instanceof Error) {
      logger.error(err.message);
      if (err.stack) {
        logger.debug(err.stack);
      }

      return response.status(500).json(err.message);
    }

    logger.error('Unknown error type', err);

    return response.status(500).json('Internal Server Error');
  }
}

function parseValidationError(error: ValidationError) {
  const result = [];

  if (error.children) {
    for (const item of error.children) {
      result.push(...parseValidationError(item));
    }
  }
  result.push(
    ...((error.constraints && Object.keys(error.constraints)) || []).map(
      (key) => error.constraints![key],
    ),
  );

  return result;
}
