const request = require('request');
const Log = require('./utils/logger');
const fs = require('fs');

module.exports = function start({ localFileDirectory, fileMode = 'local', defaultPath }, parameters) {
  return new Promise((resolve, reject) => {
    if (fileMode === 'local') {
      Log.d('Using local file storage');
      Log.d(`Checking for READ/WRITE permissions in the directory ${localFileDirectory}`);
      const data = Buffer.from('Testing');
      const base64data = new Buffer(data, 'binary');
      const tmpStoragePath = localFileDirectory;
      const Key = 'dummy.txt';
      const filePath = `${tmpStoragePath}/${Key}`;
      fs.writeFileSync(filePath, base64data, 'utf8');
      fs.readFileSync(filePath, 'utf8');
      fs.unlinkSync(filePath);
      Log.d(`Success, READ/WRITE permissions exist on the folder ${localFileDirectory}`);
      return resolve({
        status: 200,
        data: {},
        meta: {},
      });
    } else if (fileMode === 'remote') {
      Log.d('Pinging...', defaultPath);
      request(defaultPath, (err, body) => {
        if (err) reject(err);
        return resolve({
          status: 200,
          data: {},
          meta: {},
        });
      });
    } else {
      throw new Error(`Filemode ${fileMode} not supported. Please check the DATA_PIPELINE_FILE_STORAGE_MODE environmental variable. Valid options: local/remote`);
    }
  });
};
