/**
 * Created by USER on 04/03/2018.
 */
const Log = require('../utils/logger');
const supportedTypes = require('../schema-relationship/supported-data-types');
const { cassandraDestinationMap } = require('../schema-relationship/cassandra-schema');
const { mongoSourceMap } = require('../schema-relationship/mongo-schema');
const { mysqlSourceMap, mysqlDestinationMap } = require('../schema-relationship/mysql-schema');
const { mssqlSourceMap } = require('../schema-relationship/mssql-schema');
const { postgresSourceMap, postgresDestinationMap } = require('../schema-relationship/postgres-schema');
const { bigqueryDestinationMap } = require('../schema-relationship/bigquery-schema');
/**
 *
 * @param source
 * @param destination
 * @param schema
 * @returns {*}
 */
function mapSchema(source, destination, schema) {
  /**
     * Schema =e.g {id : INTEGER}
     */
  if (source === destination) return schema;
  const sources = {
    mysql: mysqlSourceMap,
    postgres: postgresSourceMap,
    mssql: mssqlSourceMap,
    custom: mongoSourceMap,
  };
  const destinations = {
    mysql: mysqlDestinationMap,
    googleBigQuery: bigqueryDestinationMap,
    postgres: postgresDestinationMap,
    cassandra: cassandraDestinationMap,
  };
  const activeSource = sources[source];
  const activeDestination = destinations[destination];

  if (!activeSource) {
    throw new Error(`Source ${source} not supported`);
  }
  if (!activeDestination) {
    throw new Error(`Destination ${destination} not supported`);
  }

  // Now to the meat
  const resultObj = {};
  Object.keys(schema).forEach((field) => {
    // Get the corresponding value
    const upperCaseField = schema[field].toUpperCase();
    let constKey = activeSource[upperCaseField];
    if (!constKey) {
      Log.d(`Data type ${upperCaseField} is'nt supported in the DB source ${source}. Setting to TEXT`);
      constKey = supportedTypes.TEXT;
    }

    // Look it up in the destination
    const lowerCaseConstKey = constKey.toLowerCase();
    const destinationKey = activeDestination[lowerCaseConstKey];
    if (!destinationKey) throw new Error(`Data type ${constKey} is'nt supported in the DB Warehouse ${destination}`);
    resultObj[field] = destinationKey;
  });
  return resultObj;
}
module.exports = mapSchema;
