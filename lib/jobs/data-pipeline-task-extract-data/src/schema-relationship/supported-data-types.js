/**
 * Created by USER on 03/03/2018.
 */
/**
 * @description We are making a generalization on the supported data types
 * @type {{BOOLEAN: string, TEXT: string, NUMBER: string, timestamp: string, JSON: string}}
 */
const supportedDataTypes = {
  BOOLEAN: 'boolean',
  TEXT: 'text',
  VARCHAR: 'varchar',
  NUMBER: 'number',
  INTEGER: 'integer',
  FLOAT: 'float',
  TIMESTAMP: 'timestamp',
  DATE: 'date',
  DATETIME: 'datetime',
  YEAR: 'year',
  TIME: 'time',
  JSON: 'json',
};
module.exports = supportedDataTypes;
