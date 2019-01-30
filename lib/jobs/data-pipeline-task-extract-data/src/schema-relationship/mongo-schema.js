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
const mongoSourceMap = {
  NUMBER: supportedDataTypes.NUMBER,
  BOOLEAN: supportedDataTypes.BOOLEAN,
  STRING: supportedDataTypes.TEXT,
};


module.exports = { mongoSourceMap };
