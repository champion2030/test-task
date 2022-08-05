import { Logger, QueryRunner } from 'typeorm';
import { logger } from '../../logger';

export class CustomTypeOrmLogger implements Logger {
  private readonly formatSql: (query: string) => string;

  constructor(formatSql: (query: string) => string) {
    this.formatSql = formatSql;
  }

  public logQuery(query: string, parameters?: Array<{}>, queryRunner?: QueryRunner) {
    const res = this.getQueryWithParameters(query, parameters);

    logger.debug(res);
  }
  public logQueryError(
    error: string,
    query: string,
    parameters?: Array<{}>,
    queryRunner?: QueryRunner,
  ) {
    const res: string[] = [];

    res.push(`Query Error: ${error}`);
    const formated = this.getQueryWithParameters(query, parameters);

    res.push(formated);
    logger.error(res.join('\n\r'));
  }
  public logQuerySlow(
    time: number,
    query: string,
    parameters?: Array<{}>,
    queryRunner?: QueryRunner,
  ) {
    const res: string[] = [];

    res.push(`Query Slow: ${time}ms`);
    const formated = this.getQueryWithParameters(query, parameters);

    res.push(formated);
    logger.debug(res.join('\n\r'));
  }
  public logSchemaBuild(message: string, queryRunner?: QueryRunner) {
    logger.info(`Log Schema Build: ${message}`);
  }
  public logMigration(message: string, queryRunner?: QueryRunner) {
    logger.info(`Log Migration: ${message}`);
  }
  public log(level: 'log' | 'info' | 'warn', message: {}, queryRunner?: QueryRunner) {
    logger.log(level, `Log Message: ${message}`);
  }

  private getQueryWithParameters(query: string, parameters?: Array<{}>): string {
    const res: string[] = [];

    res.push('Query:');
    res.push(this.formatSql(query));
    if (parameters && parameters.length > 0) {
      res.push('');
      res.push('Parameters:');
      res.push(parameters.join(', '));
    }

    return res.join('\n\r');
  }
}
