/**
 * Created by USER on 01/03/2018.
 */
const extractDetailsFromConnectionString = require('../mssql/connection-string');
const r = require('rethinkdb');

module.exports = function rethink({ credentials }) {
  return new Promise((resolve, reject) => {
    const { url } = credentials;
    console.log(credentials);
    const {
      userName,
      password,
      server,
      database,
      port,
    } = extractDetailsFromConnectionString(url);
    const options = {
      user: userName,
      password: password || '',
      host: server,
      port,
      database,
    };
    console.log(options);
    r.connect(options, (err, con) => {
      if (err) return reject();
      return resolve();
    });
  });
};
