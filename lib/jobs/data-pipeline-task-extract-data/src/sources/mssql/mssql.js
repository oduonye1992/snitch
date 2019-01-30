/**
 * Created by USER on 01/03/2018.
 */
const Connection = require('tedious').Connection;
const Request = require('tedious').Request;
const { async } = require('asyncawait');
const xawait = require('asyncawait').await;
const moment = require('moment-timezone');

const DEFAULT_INDEX = '1970-10-10';
const Log = require('../../utils/logger');
const extractDetailsFromConnectionString = require('./connection-string');
const buildQuery = require('../../queries/select-query');
const schemaQuery = require('../../queries/select-schema-query');
const mapSchema = require('../../utils/map-schema');

function connect(connection) {
  return new Promise((resolve, reject) => {
    connection.on('connect', (err) => {
      // If no error, then good to go...
      if (err) {
        Log.d('Could not connect to MSSQL. Error', err);
        return reject(err);
      }
      Log.d('Connected!');
      resolve();
    });
  });
}
function executeStatement(connection, sql, mode = 'formatted') {
  return new Promise((resolve, reject) => {
    request = new Request(sql, ((err, rowCount, rows) => {
      if (err) {
        reject(err);
      } else {
        if (mode === 'raw') return resolve(rows);
        const data = [];
        rows.forEach((row) => {
          const records = {};
          row.forEach((r) => {
            records[r.metadata.colName] = r.value;
          });
          data.push(records);
        });
        resolve(data);
      }
    }));
    connection.execSql(request);
  });
}
module.exports = function fetchFromMsSQL(credentials, schema, index = []) {
  return new Promise(async((resolve, reject) => {
    try {
      const { url, destination_type } = credentials;
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
        options: {
          encrypt: true, database, port, rowCollectionOnRequestCompletion: true,
        },
      };
      const connection = new Connection(config);
      Log.d('Connecting to MsSQL DB');
      xawait(connect(connection));
      Log.d('Connected');
      const resultArray = [];
      const indexes = [];
      const tableSchema = [];
      for (let i = 0; i < schema.length; i += 1) {
        const sch = schema[i];
        const defIndex = index[i] ? index[i] : (sch.default_index || DEFAULT_INDEX);
        Log.d(`Extracting data from table [${sch.table}]`);
        const query = buildQuery('mssql', sch, defIndex);
        const res = xawait(executeStatement(connection, query));
        const data = res;
        Log.d(`Number of records found [${data.length}]`);
        Log.d('Extracting schema');
        const schemaQuerySQL = schemaQuery('mssql', sch);
        const schemaRes = xawait(executeStatement(connection, schemaQuerySQL));
        const schemaData = schemaRes;
        const formattedSchema = {};
        schemaData.forEach(({ data_type, column_name }) => {
          if (!formattedSchema[column_name]) {
            formattedSchema[column_name] = data_type;
          }
        });
        const formatted = mapSchema('mssql', destination_type, formattedSchema);
        Log.d('Schema extracted.');
        let currentIndex = '';
        if (sch.incremental_key && Array.isArray(sch.incremental_key) && sch.incremental_key.length) {
          currentIndex = data.length ? data[data.length - 1][sch.incremental_key[0]] : defIndex;
        }
        resultArray.push(data);
        indexes.push(currentIndex);
        tableSchema.push(formatted);
      }
      return resolve({
        result: resultArray,
        index: indexes,
        tableSchema,
      });
    } catch (e) {
      return reject(e);
    }
  }));
};
