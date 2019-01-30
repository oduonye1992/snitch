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
const bigqueryDestinationMap = {};
bigqueryDestinationMap[supportedDataTypes.BOOLEAN] = 'boolean';
bigqueryDestinationMap[supportedDataTypes.TEXT] = 'string';
bigqueryDestinationMap[supportedDataTypes.NUMBER] = 'numeric';
bigqueryDestinationMap[supportedDataTypes.INTEGER] = 'integer';
bigqueryDestinationMap[supportedDataTypes.FLOAT] = 'float';
bigqueryDestinationMap[supportedDataTypes.TIMESTAMP] = 'timestamp';
bigqueryDestinationMap[supportedDataTypes.DATE] = 'timestamp';
bigqueryDestinationMap[supportedDataTypes.DATETIME] = 'datetime';
bigqueryDestinationMap[supportedDataTypes.YEAR] = 'string';
bigqueryDestinationMap[supportedDataTypes.VARCHAR] = 'string';
bigqueryDestinationMap[supportedDataTypes.TIME] = 'time';
bigqueryDestinationMap[supportedDataTypes.JSON] = 'string';

module.exports = { bigqueryDestinationMap };
