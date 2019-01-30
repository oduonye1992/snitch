const { async } = require('asyncawait');
const _await = require('asyncawait').await;
const mysql = require('mysql');
const Log = require('../utils/logger');
const query = require('../utils/query');
const getSupportedType = require('../utils/supported-types');
const buildColumns = require('../builder/build-columns-values');

const connect = con => new Promise((resolve, reject) => {
  con.connect((err) => {
    if (err) {
      reject(err);
    }
    resolve();
  });
});
function createTables(source, data, {
  pipeline_id,
}, tableSchema) {
  return new Promise((resolve, reject) => {
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
        Log.d('No Data to Save');
        return resolve({
          status: 200,
          data: {},
          meta: {},
        });
      }

      const tableName = source.destination_table_name.length ? source.destination_table_name : `${source.table}_${pipeline_id}`;
      const {
        url,
      } = source.credentials;

      const con = mysql.createConnection(url);

      _await(connect(con));
      const database = url.split('/')[3];

      const SQL = `SELECT * FROM information_schema.tables WHERE table_schema = '${database}' AND table_name = '${tableName}' `;
      const result = _await(query(con, SQL, 'mysql'));
      if (result.length) {
        // Log.d('Table already exists...');
        // Log.d('Checking to see if new fields exists');

        const fetchTableSQL = `DESCRIBE ${tableName}`;
        const fields = _await(query(con, fetchTableSQL, 'mysql'));
        const fieldsArray = fields.map(x => x.Field);
        const dataKeyArray = data[0] ? Object.keys(data[0]) : [];

        // Select all the fields from the table, compare those that do not exist then add them
        const diff = dataKeyArray.filter(x => !fieldsArray.includes(x));
        // Log.d('Difference', diff);
        if (diff.length) {
          diff.forEach((d) => {
            const alterSQL = ` ALTER TABLE ${tableName} ADD ${d} ${tableSchema[d]}`;
            _await(query(con, alterSQL, 'mysql'));
          });
        }
        Log.d(`Table [${tableName}] altered.`);
      } else {
        // Create Table
        let creationSQL = `CREATE TABLE ${tableName} ( `;
        Object.keys(tableSchema).forEach((field) => {
          const fieldType = source.primary_key === field ? 'VARCHAR(255)' : tableSchema[field];
          creationSQL += ` ${field} ${fieldType},`;
        });
        creationSQL += `PRIMARY KEY (${source.primary_key}))`;
        _await(query(con, creationSQL, 'mysql'));
        Log.d(`Table [${tableName}] created.`);
      }

      // Insert
      let insertSQL = `INSERT INTO ${tableName} `;
      const {
        insertColumns,
        conflictResolution,
        insertValues,
      } = buildColumns(data, 'mysql');

      insertSQL = `${insertSQL} ${insertColumns} ${insertValues} 
                    ON DUPLICATE KEY UPDATE ${conflictResolution}`;

      _await(query(con, insertSQL, 'mysql'));
      Log.d(`Inserted records into the Table [${tableName}].`);
      resolve();
    } catch (e) {
      reject(e);
    }
  });
}

module.exports = function mysqlStore(credentials, parameters, { data, schema, tableSchema }) {
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
