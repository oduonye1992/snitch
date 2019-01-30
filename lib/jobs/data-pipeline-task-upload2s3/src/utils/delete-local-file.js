const fs = require('fs');
const Log = require('./logger');

function deleteLocalFile(credentials, parameters) {
  return new Promise((resolve, reject) => {
    try {
      const files = parameters.system.parent.filePath;
      files.forEach((file) => {
        file.forEach((f) => {
          f.forEach((ff) => {
            Log.d(`Deleting file ${ff}`);
            fs.unlinkSync(ff);
          });
        });
      });
      return resolve({
        status: 200,
        data: {},
        meta: {},
      });
    } catch (e) {
      reject(e);
    }
  });
}

module.exports = deleteLocalFile;
