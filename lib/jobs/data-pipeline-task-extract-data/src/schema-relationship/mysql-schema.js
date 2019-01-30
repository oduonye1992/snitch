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
const mysqlSourceMap = {
  INTEGER: supportedDataTypes.NUMBER,
  INT: supportedDataTypes.NUMBER,
  SMALLINT: supportedDataTypes.NUMBER,
  TINYINT: supportedDataTypes.NUMBER,
  MEDIUMINT: supportedDataTypes.NUMBER,
  DECIMAL: supportedDataTypes.NUMBER,
  DEC: supportedDataTypes.NUMBER,
  FIXED: supportedDataTypes.NUMBER,
  NUMERIC: supportedDataTypes.NUMBER,
  FLOAT: supportedDataTypes.NUMBER,
  DOUBLE: supportedDataTypes.NUMBER,
  BIT: supportedDataTypes.BOOLEAN,
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
};
for (let i = 1; i < 13; i++) {
  mysqlSourceMap[`INT(${i})`] = supportedDataTypes.NUMBER;
}

const mysqlDestinationMap = {};
mysqlDestinationMap[supportedDataTypes.BOOLEAN] = 'BOOLEAN';
mysqlDestinationMap[supportedDataTypes.TEXT] = 'TEXT';
mysqlDestinationMap[supportedDataTypes.NUMBER] = 'INTEGER';
mysqlDestinationMap[supportedDataTypes.TIMESTAMP] = 'TIMESTAMP';
mysqlDestinationMap[supportedDataTypes.DATE] = 'DATE';
mysqlDestinationMap[supportedDataTypes.DATETIME] = 'TIMESTAMP';
mysqlDestinationMap[supportedDataTypes.YEAR] = 'YEAR';
mysqlDestinationMap[supportedDataTypes.VARCHAR] = 'VARCHAR (255)';
mysqlDestinationMap[supportedDataTypes.TIME] = 'TIME';
mysqlDestinationMap[supportedDataTypes.JSON] = 'TEXT';

module.exports = { mysqlSourceMap, mysqlDestinationMap };
