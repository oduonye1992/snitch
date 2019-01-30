function buildColumns(data, type, conflictKey = 'excluded') {
  // Insert
  let insertColumns = '(';
  let insertValues = 'VALUES ';
  let conflictResolution = '';
  Object.keys(data[0]).forEach((key) => {
    insertColumns += ` ${key},`;
    if (type === 'postgres') {
      conflictResolution += `${key} = ${conflictKey}.${key},`;
    } else if (type === 'mysql') {
      conflictResolution += `${key}=VALUES(${key}),`;
    } else {
      throw new Error(`Query type ${type} not found`);
    }
  });
  data.forEach((item) => {
    insertValues += '(';
    Object.keys(item).forEach((key) => {
      // Add quotes for string values
      let quotes = "'";
      let formattedValue = null;
      if (typeof item[key] === 'string') {
        formattedValue = item[key].replace("'", '');
      } else if (typeof item[key] === 'object') {
        formattedValue = item[key] ? JSON.stringify(item[key]) : null;
        quotes = item[key] ? "'" : '';
      } else {
        formattedValue = item[key];
        quotes = '';
      }
      insertValues += `${quotes}${formattedValue}${quotes},`;
    });
    insertValues = `${insertValues.slice(0, -1)}),`;
  });
  insertValues = insertValues.slice(0, -1);
  insertColumns = `${insertColumns.slice(0, -1)})`;
  conflictResolution = conflictResolution.slice(0, -1);
  return {
    insertColumns,
    insertValues,
    conflictResolution,
  };
}
module.exports = buildColumns;
