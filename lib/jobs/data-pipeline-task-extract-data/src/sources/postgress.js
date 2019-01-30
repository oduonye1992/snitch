const { Client } = require('pg');
const { async } = require('asyncawait');
const xawait = require('asyncawait').await;
const moment = require('moment-timezone');
const Log = require('../utils/logger');

const DEFAULT_INDEX = JSON.stringify({
  currentIndex: '1970-10-10', currentPrimaryKey: 'unspecified'
});

const buildQuery = require('../queries/select-query');
const schemaQuery = require('../queries/select-schema-query');
const mapSchema = require('../utils/map-schema');

module.exports = function fetchFromPostgress(credentials, schema, index = []) {
  return new Promise(async((resolve, reject) => {
    try {
      const { url, destination_type } = credentials;
      const client = new Client({ connectionString: url, ssl: true });
      Log.d('Connecting to Postgres DB');
      xawait(client.connect());
      Log.d('Connected');
      const resultArray = [];
      const indexes = [];
      const tableSchema = [];
      for (let i = 0; i < schema.length; i += 1) {
        const sch = schema[i];
        let schemaDefaultIndex = sch.default_index ? JSON.stringify({ currentIndex: sch.default_index, currentPrimaryKey: 'unspecified' }) : null;
        const defIndex = index[i] ? index[i] : (schemaDefaultIndex || DEFAULT_INDEX);
        Log.d(`Extracting data from table [${sch.table}]`);
        const query = buildQuery('postgres', sch, defIndex);
        // Log.d(query)
        const res = xawait(client.query(query));
        const data = res.rows;
        Log.d(`Number of records found [${data.length}]`);
        Log.d('Extracting schema');
        const schemaQuerySQL = schemaQuery('postgres', sch);
        const schemaRes = xawait(client.query(schemaQuerySQL));
        
        const schemaData = schemaRes.rows;
        let formattedSchema = {};
        schemaData.forEach((x) => {
          if (!formattedSchema[x.column_name]) {
            formattedSchema[x.column_name] = x.data_type;
          }
        });
        formattedSchema = mapSchema('postgres', destination_type, formattedSchema);
        Log.d('Schema extracted.');
        let { currentIndex, currentPrimaryKey } = JSON.parse(defIndex)
        if (data.length && sch.incremental_key && Array.isArray(sch.incremental_key) && sch.incremental_key.length) {
          currentIndex = data[data.length - 1]['gr'] || currentIndex;
          currentPrimaryKey = data[data.length - 1][sch.primary_key] || currentPrimaryKey;
        } 
        let indexJson = {
          currentIndex, currentPrimaryKey
        };
        
        resultArray.push(data);
        indexes.push(JSON.stringify(indexJson));
        tableSchema.push(formattedSchema);
      }
      client.end();
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
