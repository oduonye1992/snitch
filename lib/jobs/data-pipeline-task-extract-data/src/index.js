const mysql = require('mysql');
const { async } = require('asyncawait');
const _await = require('asyncawait').await;
const redis = require('redis');
const Log = require('./utils/logger');
const fetchFromMySQL = require('./sources/mysql');
const fetchFromMongo = require('./sources/mongo');
const fetchFromPostgress = require('./sources/postgress');
const fetchIndexFromRedis = require('./sources/redis');
const fetchFromMsSQL = require('./sources/mssql/mssql');
const fetchFromKafka = require('./sources/kafka');
const fetchFromRethinkDB = require('./sources/rethinkdb/run_rethink');
const DEFAULT_INDEX_MAP = [];
const REDIS_KEY_PREFIX = 'extract_data_';

module.exports = function index({ redisSource, dataSources }, { system }) {
  return new Promise((resolve, reject) => {
    const sources = dataSources;
    async(() => {
      try {
        if (!sources.length) throw new Error('You must specify at least one schema');

        // Create connection to redis
        const indexArray = _await(fetchIndexFromRedis(
          redisSource,
          DEFAULT_INDEX_MAP,
          REDIS_KEY_PREFIX + system.pipeline.pipeline_id
        ));
        const data = [];
        const indexes = [];
        const schemas = [];
        for (let i = 0; i < sources.length; i += 1) {
          const source = sources[i];
          if (source.type === 'mysql') {
            const { result, index, tableSchema } = _await(fetchFromMySQL(source.credentials, source.schema, indexArray[i] || []));
            data.push(result); indexes.push(index); schemas.push(tableSchema);
          } else if (source.type === 'mongodb') {
            const { result, index, tableSchema } = _await(fetchFromMongo(source.credentials, source.schema, indexArray[i] || []));
            data.push(result); indexes.push(index); schemas.push(tableSchema);
          } else if (source.type === 'postgres') {
            const { result, index, tableSchema } = _await(fetchFromPostgress(source.credentials, source.schema, indexArray[i] || []));
            data.push(result); indexes.push(index); schemas.push(tableSchema);
          } else if (source.type === 'mssql') {
            const { result, index, tableSchema } = _await(fetchFromMsSQL(source.credentials, source.schema, indexArray[i] || []));
            data.push(result); indexes.push(index); schemas.push(tableSchema);
          } else if (source.type === 'rethinkdb') {
            const { result, index, tableSchema } = _await(fetchFromRethinkDB(source.credentials, source.schema, indexArray[i] || []));
            data.push(result); indexes.push(index); schemas.push(tableSchema);
          } else if (source.type === 'kafka') {
            const { result, index, tableSchema } = _await(fetchFromKafka(source.credentials, source.schema, indexArray[i] || []));
            data.push(result); indexes.push(index); schemas.push(tableSchema);
          } else {
            throw new Error(`DataSource ${source.type} not currently supported`);
          }
        }
        return resolve({
          status: 200,
          data: {
            data,
            schemas,
          },
          meta: {
            currentIndex: JSON.stringify(indexes),
          },
        });
      } catch (e) {
        Log.d(e);
        return reject(e);
      }
    })();
  });
};
