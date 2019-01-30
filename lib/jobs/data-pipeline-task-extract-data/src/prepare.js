const { MongoClient } = require('mongodb');
const mysql = require('mysql');
const { Client } = require('pg');
const { async } = require('asyncawait');
const _await = require('asyncawait').await;
const redis = require('redis');
const Log = require('./utils/logger');
const prepareMsSQL = require('./sources/mssql/prepare_mssql');
const prepareRethinkDB = require('./sources/rethinkdb/prepare_rethink');

function pingMySQL(source) {
  return new Promise((resolve, reject) => {
    const {
      url,
    } = source.credentials;
    Log.d(url);
    const con = mysql.createConnection(url);

    con.connect((err) => {
      if (err) {
        Log.d(err);
        return reject(err);
      }
      Log.d('Connected...');
      return resolve({
        status: 200,
        data: {},
        meta: {},
      });
    });
  });
}
function pingMongo({ credentials }) {
  return new Promise((resolve, reject) => {
    const {
      url,
    } = credentials;
    return MongoClient.connect(url, (err, res) => {
      if (err) return reject(err);
      Log.d('Connected');
      return resolve(res);
    });
  });
}
function pingKafka({ url }) {
  return new Promise(async((resolve, reject) => {
    resolve();
  }));
}
function pingRedis({ url }) {
  return new Promise(async((resolve, reject) => {
    try {
      Log.d('Connecting to redis...');
      const client = redis.createClient({ url });
      client.on('error', (err) => {
        reject(err);
      });
      client.on('connect', () => {
        Log.d('Connected');
        client.quit();
        resolve();
      });
    } catch (e) {
      reject(e);
    }
  }));
}
function pingPostgres(source) {
  return new Promise((resolve, reject) => {
    try {
      const {
        url,
      } = source.credentials;
      const client = new Client({
        connectionString: url,
        ssl: true,
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


module.exports = function prepare({ redisSource, dataSources }) {
  return new Promise((resolve, reject) => {
    const sources = dataSources;
    async(() => {
      try {
        // Check connection to redis
        _await(pingRedis(redisSource));
        for (let i = 0; i < sources.length; i += 1) {
          const source = sources[i];
          if (source.type === 'mysql') {
            Log.d('Connecting to MySQL');
            _await(pingMySQL(source));
          } else if (source.type === 'mongodb') {
            Log.d('Connecting to Mongo');
            _await(pingMongo(source));
          } else if (source.type === 'postgres') {
            Log.d('Connecting to Postgres');
            _await(pingPostgres(source));
          } else if (source.type === 'kafka') {
            Log.d('Connecting to Kafka');
            _await(pingKafka(source));
          } else if (source.type === 'mssql') {
            Log.d('Connecting to MsSQL');
            _await(prepareMsSQL(source));
          } else if (source.type === 'rethinkdb') {
            Log.d('Connecting to RethinkDB');
            _await(prepareRethinkDB(source));
          } else {
            throw new Error(`Data source ${source.type} not supported. Please check your DATA_PIPELINE_${i + 1}_DATABASE_TYPE environmental variables.`);
          }
        }
        return resolve({
          status: 200,
          data: {},
          meta: {},
        });
      } catch (e) {
        return reject(e);
      }
    })();
  });
};
