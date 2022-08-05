/* eslint-disable */
import { EntityManager, getManager } from 'typeorm';

export function UseTransaction() {
  return function (target: any, propertyKey: string) {
    if (!target.__transactions) {
      target.__transactions = [];
    }
    target.__transactions.push({ propertyKey });
  };
}

export function AllowTransactions<T extends new (...args: any[]) => {}>(Constructor: T) {
  const constructor = class extends Constructor {
    [key: string]: any;
    constructor(...args: any[]) {
      super(...args);
      // eslint-disable-next-line no-underscore-dangle
      if (this.__transactions) {
        this.__transactions.forEach((item) => {
          const backupKey = '_' + item.propertyKey;

          this[backupKey] = this[item.propertyKey];
          this[item.propertyKey] = function (req: Request, res: Response) {
            if (!(arguments[arguments.length - 1] instanceof EntityManager)) {
              return getManager().transaction((manager) => {
                return this[backupKey](...arguments, manager);
              });
            } else {
              return this[backupKey](...arguments);
            }
          }.bind(this);
        });
      }
    }
  };

  Object.defineProperty(constructor, 'name', { value: Constructor.name, writable: false });

  return constructor;
}
