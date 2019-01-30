const fs = require('fs');
const Log = require('../utils/logger');
const { async } = require('asyncawait');
const _await = require('asyncawait').await;

function fetchFileFromLocal(filePath) {
  return new Promise((resolve, reject) => {
    try {
      Log.d(`Fetching from local path ${filePath}`);
      if (!fs.existsSync(filePath)) {
        throw new Error(`Path ${filePath} does not exist`);
      }
      // Log.d(`Reading file from ${filePath}`);
      const fileContents = fs.readFileSync(filePath, 'utf8');
      // Log.d(`Parsing file ${filePath}`);
      const parsedFileContent = JSON.parse(fileContents);
      Log.d('File gotten');
      return resolve(parsedFileContent);
    } catch (e) {
      throw new Error(`Cannot read from file ${filePath}. Error ${e}`);
    }
  });
}

module.exports = fetchFileFromLocal;
