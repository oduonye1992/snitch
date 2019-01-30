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
const postgresSourceMap = {
  INTEGER: supportedDataTypes.INTEGER,
  'CHARACTER VARYING': supportedDataTypes.VARCHAR,
  'TIMESTAMP WITH TIME ZONE': supportedDataTypes.TIMESTAMP,
  'DOUBLE PRECISION': supportedDataTypes.FLOAT,
  INT: supportedDataTypes.INTEGER,
  SMALLINT: supportedDataTypes.INTEGER,
  TINYINT: supportedDataTypes.INTEGER,
  MEDIUMINT: supportedDataTypes.INTEGER,
  DECIMAL: supportedDataTypes.NUMBER,
  DEC: supportedDataTypes.NUMBER,
  FIXED: supportedDataTypes.NUMBER,
  NUMERIC: supportedDataTypes.NUMBER,
  FLOAT: supportedDataTypes.FLOAT,
  DOUBLE: supportedDataTypes.NUMBER,
  BIT: supportedDataTypes.NUMBER,
  REAL: supportedDataTypes.NUMBER,
  DATE: supportedDataTypes.DATE,
  DATETIME: supportedDataTypes.DATETIME,
  TIMESTAMP: supportedDataTypes.TIMESTAMP,
  TIME: supportedDataTypes.TIME,
  YEAR: supportedDataTypes.YEAR,
  CHAR: supportedDataTypes.TEXT,
  VARCHAR: supportedDataTypes.TEXT,
  BINARY: supportedDataTypes.TEXT,
  VARBINARY: supportedDataTypes.TEXT,
  BLOB: supportedDataTypes.TEXT,
  TEXT: supportedDataTypes.TEXT,
  ENUM: supportedDataTypes.TEXT,
  JSON: supportedDataTypes.JSON,
  BOOL: supportedDataTypes.BOOLEAN,
  BOOLEAN: supportedDataTypes.BOOLEAN,
};

const postgresDestinationMap = {};
postgresDestinationMap[supportedDataTypes.BOOLEAN] = 'BOOLEAN';
postgresDestinationMap[supportedDataTypes.TEXT] = 'TEXT';
postgresDestinationMap[supportedDataTypes.NUMBER] = 'INTEGER';
postgresDestinationMap[supportedDataTypes.INTEGER] = 'INTEGER';
postgresDestinationMap[supportedDataTypes.TIMESTAMP] = 'TIMESTAMP [WITHOUT TIME ZONE]';
postgresDestinationMap[supportedDataTypes.DATE] = 'DATE';
postgresDestinationMap[supportedDataTypes.DATETIME] = 'TIMESTAMP [WITHOUT TIME ZONE]';
postgresDestinationMap[supportedDataTypes.YEAR] = 'YEAR';
postgresDestinationMap[supportedDataTypes.TIME] = 'TIME';
postgresDestinationMap[supportedDataTypes.JSON] = 'JSON';

module.exports = { postgresSourceMap, postgresDestinationMap };
