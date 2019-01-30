const { MongoClient } = require('mongodb');
const mysql = require('mysql');
const moment = require('moment-timezone');
const { async } = require('asyncawait');
const _await = require('asyncawait').await;
const redis = require('redis');

const DEFAULT_INDEX = '1970-10-10';
const DEFAULT_LIMIT = 5000;
const buildQuery = require('../queries/select-query');
const Log = require('../utils/logger');
const mapSchema = require('../utils/map-schema');

function asyncMongoConnect(url) {
  return new Promise((resolve, reject) => {
    MongoClient.connect(url, (err, db) => {
      if (err) return reject(err);
      resolve(db);
    });
  });
}

module.exports = function fetchFromMongo(credentials, schema, index) {
  return new Promise(async((resolve, reject) => {
    try {
      const { url, destination_type } = credentials;
      Log.d('Connecting to url ', url);
      const db = _await(asyncMongoConnect(url));
      Log.d('Connected to Mongo DB');

      const resultArray = [];
      const indexes = [];
      const tableSchema = [];
      for (let i = 0; i < schema.length; i += 1) {
        const source = schema[i];
        const defIndex = index[i] ? index[i] : (source.default_index || DEFAULT_INDEX);
        Log.d(`Extracting data from table [${source.table}]`);
        const query = buildQuery('mongodb', source, defIndex);
        const projections = {};
        source.fields.forEach(field => projections[field] = 1);
        Log.d(JSON.stringify(projections));
        const cursor = db.collection(source.table)
          .find(query)
          .project(projections)
          .limit(source.limit || DEFAULT_LIMIT);
        const sortValues = {};
        sortValues[source.incremental_key] = 1;
        const data = _await(cursor.sort(sortValues).toArray());
        Log.d(JSON.stringify(data));
        Log.d(`Number of records found [${data.length}]`);
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
        formattedSchema = mapSchema('custom', destination_type, formattedSchema);
        Log.d('Schema extracted.');
        let currentIndex = '';
        if (source.incremental_key && Array.isArray(source.incremental_key) && source.incremental_key.length) {
          currentIndex = data.length ? data[data.length - 1][source.incremental_key[0]] : defIndex;
        }
        cursor.close();
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
