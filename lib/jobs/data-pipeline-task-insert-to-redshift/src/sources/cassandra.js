/**
 * Created by USER on 26/02/2018.
 */
const {
  async,
} = require('asyncawait');
const _await = require('asyncawait').await;
const cassandra = require('cassandra-driver');
const Log = require('../utils/logger');
const buildColumns = require('../builder/build-columns-values');

function createSQL(tableName, source, tableSchema) {
  let creationSQL = `CREATE TABLE ${tableName} ( `;
  Object.keys(tableSchema).forEach((field) => {
    const isPrimaryKey = source.primary_key === field ? ' PRIMARY KEY ' : '';
    const fieldType = tableSchema[field];
    creationSQL += ` ${field} ${fieldType} ${isPrimaryKey} ,`;
  });
  creationSQL = `${creationSQL.slice(0, -1)} )`;
  Log.d(creationSQL);
  return creationSQL;
}


function createTables(source, data, {
  pipeline_id,
}, tableSchema) {
  return new Promise(async((resolve, reject) => {
    try {
      if (!Array.isArray(data)) throw new Error('An array of data must be passed across');
      if (!Object.keys(tableSchema).length) {
        Log.d('No schema specified');
        return resolve({
          status: 200,
          data: {},
          meta: {},
        });
      }
      if (!data.length) {
        Log.d('There is no data to save');
        return resolve({
          status: 200,
          data: {},
          meta: {},
        });
      }
      const tableName = source.destination_table_name && source.destination_table_name.length ? source.destination_table_name : `${source.table}_${pipeline_id}`;
      const {
        url,
      } = source.credentials;
      const splitedUrl = url.split('/');
      const contactPoint = splitedUrl[0],
        keyspace = splitedUrl[1];
      const client = new cassandra.Client({ contactPoints: [contactPoint], keyspace });

      // Log.d(`Checking to see if ${tableName} exists`);
      const SQL = 'select * from system_schema.columns where table_name = ? and keyspace_name = ? allow filtering';

      const { rows } = _await(client.execute(SQL, [tableName, keyspace]));

      if (rows.length) {
        // Log.d('Table already exists...');
        // Log.d('Checking to see if new fields exists');

        const fieldsArray = rows.map(x => x.column_name);

        const dataKeyArray = data[0] ? Object.keys(data[0]) : [];

        // Select all the fields from the table, compare those that do not exist then add them
        const diff = dataKeyArray.filter(x => !fieldsArray.includes(x));
        // Log.d('Difference', diff);
        if (diff.length) {
          diff.forEach((d) => {
            const alterSQL = ` ALTER TABLE ${tableName} ADD ${d} ${tableSchema[d]}`;
            _await(client.execute(alterSQL));
          });
        }
        Log.d(`Altered Table [${tableName}]`);
      } else {
        // Create Table
        const creationSQL = createSQL(tableName, source, tableSchema);
        _await(client.execute(creationSQL));
        Log.d(`Created Table [${tableName}]`);
      }
      let batchQuery = 'BEGIN BATCH ';
      for (let p = 0; p < data.length; p += 1) {
        const {
          insertColumns,
          insertValues,
        } = buildColumns([data[p]], 'mysql');
        const insertSQL = `INSERT INTO ${tableName} ${insertColumns} ${insertValues}; `;
        batchQuery += insertSQL;
      }
      batchQuery += 'APPLY BATCH';
      Log.d(batchQuery);
      _await(client.execute(batchQuery));

      Log.d(`Inserted records into the Table [${tableName}].`);
      // TODO End connection
      resolve();
    } catch (e) {
      reject(e);
    }
  }));
}

module.exports = function postgressStore(credentials, parameters, { data, schema, tableSchema }) {
  return new Promise(async((resolve, reject) => {
    try {
      const insertBatchSize = parseInt(credentials.warehouse.insert_batch_limit) || 10000;
      Log.d(`Analyzing table [${schema.table}]`);
      schema.credentials = credentials.warehouse;
      for (let y = 0; y < data.length; y += insertBatchSize) {
        // Get the new batch to evaluate
        const evaluatedArray = data.slice(y, y + insertBatchSize);
        Log.d(`Evaluating chunked batch of length ${evaluatedArray.length} i.e From ${y + 1} to ${y + insertBatchSize}`);
        _await(createTables(schema, evaluatedArray, parameters.system.pipeline, tableSchema));
      }
      resolve({
        status: 200,
        data: {},
        meta: {},
      });
    } catch (e) {
      Log.e(`An error has occured ${e.message}`);
      reject(e);
    }
  }));
};
