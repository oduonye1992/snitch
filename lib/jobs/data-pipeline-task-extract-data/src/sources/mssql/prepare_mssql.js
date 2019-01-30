/**
 * Created by USER on 01/03/2018.
 */
const Connection = require('tedious').Connection;
const extractDetailsFromConnectionString = require('./connection-string');

module.exports = function prepareMsSQL({ credentials }) {
  return new Promise((resolve, reject) => {
    const {
      url,
    } = credentials;
    const {
      userName,
      password,
      server,
      database,
      port,
    } = extractDetailsFromConnectionString(url);
    const config = {
      userName,
      password,
      server,
      // If you're on Windows Azure, you will need this:
      options: { encrypt: true, database, port },
    };
    const connection = new Connection(config);
    connection.on('connect', (err) => {
      if (err) return reject(err);
      return resolve();
    });
  });
};
