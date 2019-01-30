const moment = require('moment-timezone');
const { async } = require('asyncawait');
const _await = require('asyncawait').await;

const DEFAULT_INDEX = '1970-10-10';
const DEFAULT_LIMIT = 5000;
const buildQuery = require('../../queries/select-query');
const Log = require('../../utils/logger');
const r = require('rethinkdb');
const extractDetailsFromConnectionString = require('../../sources/mssql/connection-string');
const mapSchema = require('../../utils/map-schema');

function asyncRethinkDBConnect(r, options) {
  return new Promise((resolve, reject) => {
    r.connect(options, (err, conn) => {
      if (err) return reject();
      return resolve(conn);
    });
  });
}
function execute(r, con) {
  return new Promise((resolve, reject) => {
    r.run(con, (err, cursor, e) => {
      if (err) return reject(err);
      const res = [];
      cursor.each((x, q) => {
        res.push(q);
      });
      resolve(res);
    });
  });
}
module.exports = function fetchFromRethinkDB(credentials, schema, index) {
  return new Promise(async((resolve, reject) => {
    try {
      const { url, destination_type } = credentials;
      Log.d('Connecting to url ', url);
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
      const conn = _await(asyncRethinkDBConnect(r, options));
      Log.d('Connected to Rethink DB');
      const resultArray = [];
      const indexes = [];
      const tableSchema = [];
      for (let i = 0; i < schema.length; i += 1) {
        const source = schema[i];
        const defIndex = index[i] ? index[i] : (source.default_index || DEFAULT_INDEX);
        Log.d(`Extracting data from table [${source.table}]`);
        const tableR = buildQuery('rethinkdb', source, defIndex, r);
        const data = _await(execute(tableR, conn));
        Log.d(`Number of records found [${data.length}]`);
        Log.d(JSON.stringify(data));
        Log.d('Extracting schema');
        let formattedSchema = {};
        if (data.length) {
          const map = {
            number: 'number',
            boolean: 'boolean',
          };
          Object.keys(data[0]).forEach((x) => {
            formattedSchema[x] = map[typeof data[0][x]] || 'string';
          });
        }
        Log.d('Schema extracted.');
        Log.d(JSON.stringify(formattedSchema));
        formattedSchema = mapSchema('custom', destination_type, formattedSchema);
        let currentIndex = '';
        if (source.incremental_key && Array.isArray(source.incremental_key) && source.incremental_key.length) {
          currentIndex = data.length ? data[data.length - 1][source.incremental_key[0]] : defIndex;
        }
        resultArray.push(data);
        indexes.push(currentIndex);
        tableSchema.push(formattedSchema);
      }
      resolve({
        result: resultArray,
        index: indexes,
        tableSchema,
      });
    } catch (e) {
      reject(e);
    }
  }));
};
