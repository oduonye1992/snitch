const moment = require('moment');
const { async } = require('asyncawait');
const _await = require('asyncawait').await;
const redis = require('redis');
const Log = require('../utils/logger');

module.exports = function fetchIndexFromRedis({ url }, defaultIndex = [], redisKey) {
  return new Promise(async((resolve, reject) => {
    try {
      Log.d('Connecting to redis...');
      const client = redis.createClient({
        url,
      });
      client.on('error', (err) => {
        reject(err);
      });
      client.on('connect', () => {
        Log.d('Connected to redis');
        client.get(redisKey, (err, index) => {
          // Log.d('Current index', redisKey, index);
          client.quit();
          resolve(JSON.parse(index) || defaultIndex);
        });
      });
    } catch (e) {
      reject(e);
    }
  }));
};
