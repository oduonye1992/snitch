const deleteLocalFile = require('./utils/delete-local-file');
const deleteRemoteFile = require('./utils/delete-remote-file');

module.exports = function cleanup(credentials, parameters) {
  return credentials.fileMode === 'local'
    ? deleteLocalFile(credentials, parameters)
    : deleteRemoteFile(credentials, parameters);
};
