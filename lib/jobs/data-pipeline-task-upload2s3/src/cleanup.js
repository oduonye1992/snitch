const deleteLocalFile = require('./utils/delete-local-file');
const deleteRemoteFile = require('./utils/delete-remote-file');

module.exports = function cleanup(credentials, parameters) {
  return credentials.fileMode === 'remote'
    ? deleteRemoteFile(credentials, parameters)
    : deleteLocalFile(credentials, parameters);
};
