const { async } = require('asyncawait');
const _await = require('asyncawait').await;
const mysqlStore = require('./sources/mysql');
const postgressStore = require('./sources/postgress');
const cassandraStore = require('./sources/cassandra');
const bigQueryStore = require('./sources/bigQuery');
const fetchFileFroms3 = require('./sources/fetch-from-s3');
const fetchFromLocal = require('./sources/fetch-from-local');
const Log = require('./utils/logger');

module.exports = function start(credentials, parameters) {
  return new Promise(async((resolve, reject) => {
    Log.d('Extracting data from file.');
    const fileSource = credentials.s3.fileMode === 'remote' ? fetchFileFroms3 : fetchFromLocal;
    Log.d(`Fetching file from [${credentials.s3.fileMode}] source`);

    // Loop through sources
    const sources = parameters.filePath;

    for (let i = 0; i < sources.length; i++) {
      const table = sources[i];
      // loop through tables
      for (let x = 0; x < table.length; x++) {
        const chunks = table[x];
        // Loop through chunks
        for (let q = 0; q < chunks.length; q++) {
          const chunk = chunks[q];
          if (!chunk) continue;
          const fileContents = _await(fileSource(chunk, credentials.s3));
          Log.d('File content extracted');
          if (credentials.warehouse.type === 'mysql') {
            _await(mysqlStore(credentials, parameters, fileContents));
          } else if (credentials.warehouse.type === 'postgres') {
            Log.d('Inserting data into Postgress data warehouse');
            _await(postgressStore(credentials, parameters, fileContents));
          } else if (credentials.warehouse.type === 'cassandra') {
            Log.d('Inserting data into Cassandra data warehouse');
            _await(cassandraStore(credentials, parameters, fileContents));
          } else if (credentials.warehouse.type === 'googleBigQuery') {
            Log.d('Inserting data into googleBigQuery data warehouse');
            _await(bigQueryStore(credentials, parameters, fileContents, chunk));
          } else {
            throw new Error(`Data source ${credentials.warehouse.type} not supported`);
          }
        }
      }
    }
    resolve({
      status: 200,
      meta: {},
      data: {},
    });
  }));
};
