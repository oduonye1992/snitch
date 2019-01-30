const winston = require('winston');

winston.remove(winston.transports.Console);
winston.add(winston.transports.Console, { timestamp: true });

const Log = {
  d: (...args) => { winston.info(`Extract Data Task: ${args}`); },
  e: (...args) => { winston.error(`Extract Data Task: ${args}`); },
};
module.exports = Log;
