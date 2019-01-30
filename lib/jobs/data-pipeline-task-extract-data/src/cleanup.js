const redis = require('redis');
const Log = require('./utils/logger');

const REDIS_KEY_PREFIX = 'extract_data_';


module.exports = function cleanup({
  redisSource,
}, {
  system,
}) {
  return new Promise((resolve, reject) => {
    const {
      url,
    } = redisSource;
    const REDIS_KEY = REDIS_KEY_PREFIX + system.pipeline.pipeline_id;
    const client = redis.createClient({
      url,
    });
    client.on('error', (err) => {
      Log.d('Error ', err);
      reject(err);
    });
    client.on('connect', () => {
      Log.d('Connected to redis');
      Log.d('Updating redis index');
      client.set(REDIS_KEY, system.parent.currentIndex, (err, res) => {
        if (err) throw new Error('Error updating redis counter');
        Log.d('Updated redis index');
        client.quit();
        resolve({
          status: 200,
          data: {},
          meta: {},
        });
      });
    });
  });
};
