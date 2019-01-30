const winston = require('winston');

winston.remove(winston.transports.Console);
winston.add(winston.transports.Console, { timestamp: true });

const Log = {
  d: (args) => { winston.info(args); },
  e: (args) => { winston.error(args); },
};
module.exports = Log;
