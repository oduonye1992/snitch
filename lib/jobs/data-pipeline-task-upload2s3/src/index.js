const uploadToS3 = require('./sources/s3');
const uploadToLocal = require('./sources/local');

module.exports = function index(credentials, parameters) {
  const FILE_MODE = credentials.fileMode || 'local';
  if (FILE_MODE === 'local') {
    return uploadToLocal(credentials, parameters);
  }
  return uploadToS3(credentials, parameters);
};
