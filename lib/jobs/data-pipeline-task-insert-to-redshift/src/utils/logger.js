const winston = require('winston');

winston.remove(winston.transports.Console);
winston.add(winston.transports.Console, { timestamp: true });

const Log = {
  d: (...args) => { winston.info(`Insert To Data Warehouse: ${args}`); },
  e: (...args) => { winston.error(`Insert To Data Warehouse: ${args}`); },
};
module.exports = Log;
