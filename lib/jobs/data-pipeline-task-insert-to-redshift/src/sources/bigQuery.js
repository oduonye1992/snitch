const { async } = require('asyncawait');
const _await = require('asyncawait').await;
const Log = require('../utils/logger');
const query = require('../utils/query');
const moment = require("moment");

function listTables(datasetId, projectId) {
  return new Promise((resolve, reject) => {
    
    const { BigQuery } = require('@google-cloud/bigquery');

    // Creates a client
    const bigquery = new BigQuery({
      projectId,
    });

    // Lists all tables in the dataset
    bigquery
      .dataset(datasetId)
      .getTables()
      .then((results) => {
        const tables = results[0];
        return resolve(tables.map(table => table.id));
      })
      .catch((err) => {
        console.error('ERROR:', err);
        reject(err);
      });
  });
}
function createTable(datasetId, tableId, schema, projectId) {
  return new Promise((resolve, reject) => {
    const { BigQuery } = require('@google-cloud/bigquery');
    
    // const schema = "Name:string, Age:integer, Weight:float, IsMagic:boolean";
    // Creates a client
    const bigquery = new BigQuery({
      projectId,
    });

    // For all options, see https://cloud.google.com/bigquery/docs/reference/v2/tables#resource
    const options = {
      schema : schema,
    };

    // Create a new table in the dataset
    bigquery
      .dataset(datasetId)
      .createTable(tableId, options)
      .then((results) => {
        const table = results[0];
        Log.d(`Table ${table.id} created.`);
        resolve(table);
      })
      .catch((err) => {
        console.error('ERROR:', err);
        reject(err);
      });
  });
}

/**
 * 
 * @param {*} datasetId 
 * @param {*} tableId 
 * @param {*} rows 
 * @param {*} projectId 
 * @param {*} source 
 */
function deleteDuplicate(source, tables){
  return new Promise(async((resolve, reject) => {
    try {
      const {
        projectId, datasetId,
      } = source.credentials;
      const { BigQuery } = require('@google-cloud/bigquery');
      const bigquery = new BigQuery({
        projectId,
      });

      for (let q = 0; q < tables.length; q++) {
        let tableId = tables[q];
        Log.d(`Evaluating table [${tableId}]`);
        const query = `
          SELECT ${source.primary_key} 
          FROM \`${datasetId}.${tableId}\`
          GROUP BY ${source.primary_key} HAVING COUNT(${source.primary_key}) > 1
        `


        const resp = _await(bigquery.dataset(datasetId).query({ query }));
        const response = resp[0];

        for (let i = 0; i < response.length; i++) {

          let idInContext = response[i][source.primary_key];

          idInContext = isNaN(idInContext) ? "'" + idInContext + "'" : idInContext;

          let bqTimeQuery = `SELECT bq_inserted_at FROM \`${datasetId}.${tableId}\` 
          WHERE ${source.primary_key} = ${idInContext}
          ORDER BY bq_inserted_at DESC LIMIT 1;`;

          let bqResponse = _await(bigquery.dataset(datasetId).query({ query: bqTimeQuery }));

          let timeInContext = bqResponse[0][0]['bq_inserted_at']['value'];

          let momentTime = moment(timeInContext, 'YYYY-MM-DDTHH:mm:ss').subtract(120, "minutes").format('YYYY-MM-DDTHH:mm:ss');

          let deleteQuery = `
          DELETE 
          FROM \`${datasetId}.${tableId}\`
          WHERE ${source.primary_key} = ${idInContext}
          AND bq_inserted_at <= '${momentTime}';
          `;

          _await(bigquery.dataset(datasetId).query({ query: deleteQuery }));
        }
      }

      return resolve();
    } catch (e) {
      return reject(e);
    }
  }))
}

function createTables(source,  { pipeline_id }, tableSchema) {
  return new Promise((resolve, reject) => {
    try {

      const tableName = source.destination_table_name.length ? source.destination_table_name : `${source.table}_${pipeline_id}`;

      
      const {
        projectId, datasetId,
      } = source.credentials;
      
      const result = _await(listTables(datasetId, projectId));
      
      if (result.includes(tableName)) {
        Log.d("Table already exist");
      } else {
      
        let sch = [];
        Object.keys(tableSchema).forEach((key) => {
          sch.push(`${key}:${tableSchema[key]}`);
        });
        sch.push(`bq_inserted_at:Datetime`);
        sch = sch.toString();
        Log.d('Creating table');
        _await(createTable(datasetId, tableName, sch, projectId));
      }

      resolve(tableName);
    } catch (e) {
      reject(e);
    }
  });
}


function processBigQuery(credentials, parameters, { data, schema, tableSchema }, filename) {
  return new Promise(async((resolve, reject) => {
    try {
      
      const {
        projectId, datasetId,
      } = credentials.warehouse;
      schema.credentials = credentials.warehouse;

      const { BigQuery } = require('@google-cloud/bigquery');
      const fs = require('fs');
      const Json2csvParser = require('json2csv').Parser;

      const bigquery = new BigQuery({ projectId });
      const dataset = bigquery.dataset(datasetId);

      Log.d("Evaluating table " + schema.destination_table_name);
      let tableName = _await(createTables(schema, parameters.system.pipeline, tableSchema));
      
      const table = dataset.table(tableName);  
      let fields = Object.keys(tableSchema);
      fields.push("bq_inserted_at");
      const json2csvParser = new Json2csvParser({ fields });
      const latestInsertTime = moment().format("YYYY-MM-DDTHH:mm:ss");
      
      let newData = data.map(x => {
        x["bq_inserted_at"] = latestInsertTime;
        let parsedRecord = {}
        for (let key in x) {
          if (x[key] && typeof(x[key]) === "string") {
            parsedRecord[key] = x[key].replace(/(\r\n|\n|\r)/gm, "");
          }
          else {
            parsedRecord[key] = x[key];
          }

        }
        return parsedRecord;
      });
      
      const csv = json2csvParser.parse(newData);
      
      const tmpCSVPath = `/tmp/${tableName}_${Date.now()}.csv`;
      
      fs.writeFileSync(tmpCSVPath, csv, 'utf8');

      let options = {
        skipLeadingRows: 1
      }
      if (!schema.hasOwnProperty('incremental_key')) { 
        options['writeDisposition'] = 'WRITE_TRUNCATE';
        Log.d("Loading and truncating data into "+tableName);
      } else {
        Log.d("Loading and appending data into " + tableName);
      }
      
      
      table.load(tmpCSVPath, options, (err, apiResponse) => { 
        // fs.unlink(tmpCSVPath);
        if (err) {
          console.log(JSON.stringify(err));
          return reject(err);
        }
        if (apiResponse && apiResponse.status && apiResponse.status.errors && apiResponse.status.errors.length) {
          console.log(apiResponse.status.errors);
          return reject(apiResponse);
        } else {
          return resolve({
            status: 200,
            data: {},
            meta: {},
          });
        }
      });

    } catch (e) {
      Log.e(`An error has occured ${e}`);
      reject(e);
    }
  }));
};

function bigQueryStore(credentials, parameters, { data, schema, tableSchema }, filename) {
  return new Promise(async((resolve, reject) => {
    try {
      const insertBatchSize = parseInt(credentials.warehouse.insert_batch_limit) || 10000;
      Log.d(`Analyzing table [${schema.table}]`);
      schema.credentials = credentials.warehouse;
      
      for (let y = 0; y < data.length; y += insertBatchSize) {
        // Get the new batch to evaluate
        const evaluatedArray = data.slice(y, y + insertBatchSize);
        Log.d(`Evaluating chunked batch of length ${evaluatedArray.length} i.e From ${y + 1} to ${y + insertBatchSize}`);
        _await(processBigQuery(credentials, parameters, { data: evaluatedArray, schema, tableSchema }, filename));
      }

      return resolve({
        status: 200,
        data: {},
        meta: {},
      });
    } catch (e) {
      reject(e);
    }
  }))
}


module.exports = bigQueryStore;