const Log = require('../utils/logger');

function orderBySQLSnippetFn(source) {
  
  if (!source.incremental_key) return '';
  if (!Array.isArray(source.incremental_key)) return '';
  
  if (source.incremental_key.length) {
    return 'ORDER BY gr ASC';
  }
}
function conditionalSQLSnippetFn(source, index) {
  if (!source.incremental_key) return '';
  let { currentIndex, currentPrimaryKey } = JSON.parse(index);
  if (!Array.isArray(source.incremental_key)) return '';
  let snippet = 'WHERE ';
  let additionalSQL = currentPrimaryKey === "unspecified" ? "" : `AND ${source.primary_key} != '${currentPrimaryKey}'`;
  for (let i = 0; i < source.incremental_key.length; i += 1) {
    snippet += ` (${source.incremental_key[i]} > '${currentIndex}' ${additionalSQL} ) OR`;
  }
  snippet = snippet.slice(0, -2);
  return snippet;
}
module.exports = function buildQuery(type, source, index, handle) {
  if (type === 'mysql' || type === 'postgres' || type === 'mssql') {
    let fields = source.fields && source.fields.length ? source.fields.toString() : '*';
    fields += source.incremental_key ? `, GREATEST(${source.incremental_key.toString()}) as gr ` : '';
    const limitSQLSnippet = source.limit ? ` LIMIT ${source.limit}` : '';
    const orderBySQLSnippet = orderBySQLSnippetFn(source);
    const conditionalSQLSnippet = conditionalSQLSnippetFn(source, index);
    let query = `SELECT ${fields} FROM ${source.table} ${conditionalSQLSnippet} ${orderBySQLSnippet} ${limitSQLSnippet}`;
    query = query.trimRight();
    
    return query;
  } else if (type === 'mongodb') {
    const query = {};
    if (!source.incremental_key) return {};
    if (!Array.isArray(source.incremental_key)) return {};
    for (let i = 0; i < source.incremental_key.length; i += 1) {
      query[source.incremental_key[i]] = {
        $gte: new Date(index),
      };
    }
    return query;
  } else if (type === 'rethinkdb') {
    // fields | conditional | order | limit
    function fields(r) {
      if (source.fields && source.fields.length) {
        return r.table(source.table)
          .pluck(source.fields.toString());
      }
      return r.table(source.table);
    }
    function conditional(r) {
      return r;
    }
    function order(r) {
      return r;
    }
    function limit(r) {
      return r;
    }
    const rFields = fields(handle);
    const rCondiitonal = conditional(rFields);
    const rOrder = order(rCondiitonal);
    const rLimit = limit(rOrder);
    return rLimit;
  }
  throw new Error(`Data source ${type} not supported`);
};
