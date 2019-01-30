const mysql = require('mysql');
const { async } = require('asyncawait');
const _await = require('asyncawait').await;

const DEFAULT_INDEX = '1970-10-10';
const buildQuery = require('../queries/select-query');
const moment = require('moment-timezone');
const Log = require('../utils/logger');
const schemaQuery = require('../queries/select-schema-query');
const mapSchema = require('../utils/map-schema');

function asyncMySQLQuery(con, query) {
  return new Promise((resolve, reject) => {
    con.query(query, (err, res) => {
      if (err) reject(err);
      resolve(res);
    });
  });
}
module.exports = function fetchFromMySQL(credentials, schema, index = []) {
  return new Promise((resolve, reject) => {
    const { url, destination_type } = credentials;

    const con = mysql.createConnection(url);
    Log.d('Connecting to MySQL DB');
    con.connect(async((err) => {
      try {
        if (err) {
          Log.d('Error ', err);
          return reject(err);
        }
        Log.d('Connected');
        const resultArray = [];
        const indexes = [];
        const tableSchema = [];
        for (let i = 0; i < schema.length; i += 1) {
          const sch = schema[i];
          const defIndex = index[i] ? index[i] : (sch.default_index || DEFAULT_INDEX);
          Log.d(`Extracting data from table [${sch.table}]`);
          const query = buildQuery('mysql', sch, defIndex);
          const data = _await(asyncMySQLQuery(con, query));
          Log.d(`Number of records found [${data.length}]`);
          Log.d('Extracting schema');
          const schemaQuerySQL = schemaQuery('mysql', sch);
          const schemaData = _await(asyncMySQLQuery(con, schemaQuerySQL));
          let formattedSchema = {};
          schemaData.forEach((x) => {
            if (!formattedSchema[x.Field]) {
              formattedSchema[x.Field] = x.Type;
            }
          });
          formattedSchema = mapSchema('mysql', destination_type, formattedSchema);
          Log.d('Schema extracted.');
          let currentIndex = '';
          if (sch.incremental_key && Array.isArray(sch.incremental_key) && sch.incremental_key.length) {
            currentIndex = data.length ? data[data.length - 1][sch.incremental_key[0]] : defIndex;
          }
          resultArray.push(data);
          indexes.push(currentIndex);
          tableSchema.push(formattedSchema);
        }
        con.end();
        return resolve({
          result: resultArray,
          index: indexes,
          tableSchema,
        });
      } catch (e) {
        reject(e);
      }
    }));
  });
};
