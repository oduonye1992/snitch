const getSupportedType = (field) => {
  return 'VARCHAR(8000)';
  const supportedTypes = {
    string: ' TEXT ',
    integer: ' INT ',
    boolean: ' BOOLEAN ',
  };
  return supportedTypes[typeof field] || 'TEXT';
};
module.exports = getSupportedType;
