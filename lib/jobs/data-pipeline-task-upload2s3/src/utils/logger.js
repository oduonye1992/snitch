const winston = require('winston');

winston.remove(winston.transports.Console);
winston.add(winston.transports.Console, { timestamp: true });

const Log = {
  d: (...args) => { winston.info(`File Storage Task: ${args}`); },
  e: (...args) => { winston.error(`File Storage Task: ${args}`); },
};
module.exports = Log;
