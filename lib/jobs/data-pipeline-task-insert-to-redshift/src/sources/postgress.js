const {
  async,
} = require('asyncawait');
const _await = require('asyncawait').await;
const {
  Client,
} = require('pg');
const mysql = require('mysql');
const Log = require('../utils/logger');
const query = require('../utils/query');
const getSupportedType = require('../utils/supported-types');
const buildColumns = require('../builder/build-columns-values');

function createSQL(tableName, data, source, isTemporary = false, tableSchema) {
  const temporaryFlag = isTemporary ? 'TEMPORARY' : '';
  let creationSQL = `CREATE ${temporaryFlag} TABLE ${tableName} ( `;
  Object.keys(tableSchema).forEach((field) => {
    const isPrimaryKey = source.primary_key === field ? ' PRIMARY KEY ' : '';
    const fieldType = tableSchema[field];
    creationSQL += ` ${field} ${fieldType} ${isPrimaryKey} ,`;
  });
  creationSQL = `${creationSQL.slice(0, -1)} )`;
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
        url, ssl,
      } = source.credentials;
      const con = new Client({
        connectionString: url,
        ssl,
      });

      _await(con.connect());
      // Log.d(`Checking to see if ${tableName} exists`);
      const SQL = `SELECT * FROM INFORMATION_SCHEMA.COLUMNS where table_name = '${tableName}'`;
      const result = _await(query(con, SQL));

      if (result.length) {
        // Log.d('Table already exists...');
        // Log.d('Checking to see if new fields exists');

        const fetchTableSQL = `SELECT column_name FROM information_schema.columns WHERE table_schema = 'public' AND table_name   = '${tableName}'`;
        const fields = _await(query(con, fetchTableSQL));
        const fieldsArray = fields.map(x => x.column_name);

        const dataKeyArray = data[0] ? Object.keys(data[0]) : [];

        // Select all the fields from the table, compare those that do not exist then add them
        const diff = dataKeyArray.filter(x => !fieldsArray.includes(x));
        // Log.d('Difference', diff);
        if (diff.length) {
          diff.forEach((d) => {
            const alterSQL = ` ALTER TABLE ${tableName} ADD ${d} ${tableSchema[d]}`;

            _await(query(con, alterSQL));
          });
        }
        Log.d(`Altered Table [${tableName}]`);
      } else {
        // Create Table
        // Log.d('Creating table...');
        const creationSQL = createSQL(tableName, data, source, false, tableSchema);
        _await(query(con, creationSQL));
        // Log.d('Table Created');
        Log.d(`Created Table [${tableName}]`);
      }


      const {
        insertColumns,
        conflictResolution,
        insertValues,
      } = buildColumns(data, 'postgres', 'newvals');

      const legacySQL = `BEGIN;
        
      ${createSQL('newvals', data, source, true, tableSchema)};
      
      INSERT INTO newvals ${insertColumns} ${insertValues};

      LOCK TABLE ${tableName} IN EXCLUSIVE MODE;

      UPDATE ${tableName}
      SET ${conflictResolution}
      FROM newvals
      WHERE newvals.${source.primary_key} = ${tableName}.${source.primary_key};

      INSERT INTO ${tableName}
      SELECT ${insertColumns
    .replace('(', '').replace(')', '')
    .split(',')
    .map(x => `newvals.${x.trim()}`)
    .toString()}
      FROM newvals
      LEFT OUTER JOIN ${tableName} ON (${tableName}.${source.primary_key} = newvals.${source.primary_key})
      WHERE ${tableName}.${source.primary_key} IS NULL;

      COMMIT;`;
      _await(query(con, legacySQL));
      Log.d(`Inserted records into the Table [${tableName}].`);
      con.end();
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
