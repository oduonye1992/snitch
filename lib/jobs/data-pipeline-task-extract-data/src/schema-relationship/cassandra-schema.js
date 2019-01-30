/**
 * Created by USER on 03/03/2018.
 */
const supportedDataTypes = require('./supported-data-types');
/**
 * When extracting data from a source,
 * we indicate the mapping from that source to the
 * supported source of truth
 * @type {{}}
 */


const cassandraDestinationMap = {};
cassandraDestinationMap[supportedDataTypes.BOOLEAN] = 'BOOLEAN';
cassandraDestinationMap[supportedDataTypes.TEXT] = 'TEXT';
cassandraDestinationMap[supportedDataTypes.NUMBER] = 'INT';
cassandraDestinationMap[supportedDataTypes.TIMESTAMP] = 'TIMESTAMP';
cassandraDestinationMap[supportedDataTypes.DATE] = 'DATE';
cassandraDestinationMap[supportedDataTypes.DATETIME] = 'TIMESTAMP';
cassandraDestinationMap[supportedDataTypes.YEAR] = 'TEXT';
cassandraDestinationMap[supportedDataTypes.TIME] = 'TEXT';
cassandraDestinationMap[supportedDataTypes.VARCHAR] = 'TEXT';
cassandraDestinationMap[supportedDataTypes.JSON] = 'TEXT';

module.exports = { cassandraDestinationMap };
