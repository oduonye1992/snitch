const Scheduler = require('./classes/scheduler');

function start() {
  const scheduler = new Scheduler();
  scheduler.run();
}

module.exports = start;

start();

// Keep Node Running forever. TODO Don't be lazy, find a better way to do this.
setInterval(() => {}, 300000000);

