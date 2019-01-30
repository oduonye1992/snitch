/**
 * Created by USER on 12/02/2018.
 */
module.exports = function schemaQuery(type, source) {
  if (type === 'postgres') {
    return ` select column_name, data_type from information_schema.columns where table_name = '${source.table}';`;
  } else if (type === 'mongodb') {
    return {};
  } else if (type === 'mysql') {
    return `describe ${source.table}`;
  } else if (type === 'mssql') {
    return `select data_type, column_name from information_schema.columns where table_name = '${source.table}'`;
  }
  throw new Error(`Data source ${type} not supported`);
};
