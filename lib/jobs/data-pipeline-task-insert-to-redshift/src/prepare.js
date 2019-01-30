const mysql = require('mysql');
const { Client } = require('pg');
const { async } = require('asyncawait');
const _await = require('asyncawait').await;
const Log = require('./utils/logger');
const cassandra = require('cassandra-driver');

function pingMySQL(source) {
  return new Promise((resolve, reject) => {
    const {
      url,
    } = source;

    const con = mysql.createConnection(url);

    con.connect((err) => {
      Log.d('Connected...');
      if (err) {
        Log.d(err);
        return reject(err);
      }
      return resolve({
        status: 200,
        data: {},
        meta: {},
      });
    });
  });
}
function pingPostgres(source) {
  return new Promise((resolve, reject) => {
    try {
      const {
        url, ssl,
      } = source;

      const client = new Client({
        connectionString: url,
        ssl,
      });
      _await(client.connect());
      Log.d('connected');
      client.end();
      return resolve();
    } catch (e) {
      return reject(e);
    }
  });
}
function pingCassandra({ url }) {
  return new Promise((resolve, reject) => {
    try {
      Log.d(`Connecting to cassandra using credentials ${JSON.stringify(url)}`);
      const splitedUrl = url.split('/');
      const contactPoint = splitedUrl[0],
        keyspace = splitedUrl[1];
      const client = new cassandra.Client({ contactPoints: [contactPoint], keyspace });
      return resolve();
    } catch (e) {
      Log.e('Error', e.message);
      reject(e);
    }
    return resolve();
  });
}
module.exports = function cleanup({ warehouse }, parameters) {
  return new Promise((resolve, reject) => {
    try {
      if (warehouse.type === 'mysql') {
        Log.d('Connecting to MySQL');
        _await(pingMySQL(warehouse));
      } else if (warehouse.type === 'postgres') {
        Log.d('Connecting to Postgress');
        _await(pingPostgres(warehouse));
      } else if (warehouse.type === 'cassandra') {
        Log.d('Connecting to Apache\'s Cassandra');
        _await(pingCassandra(warehouse));
      } else if (warehouse.type === 'googleBigQuery') {
        Log.d('Connecting to Googles Big Query');
      } else {
        throw new Error(`Destination ${warehouse.type} not found`);
      }
      return resolve({
        status: 200,
        data: {},
        meta: {},
      });
    } catch (e) {
      Log.d(e);
      return reject(e);
    }
  });
};
