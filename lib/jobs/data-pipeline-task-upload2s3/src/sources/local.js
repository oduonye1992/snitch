const fs = require('fs');
const Log = require('../utils/logger');
const JSONStream = require('JSONStream');
const { async } = require('asyncawait');
const _await = require('asyncawait').await;

const CHUNK_LIMIT = parseInt(process.env.DATA_PIPELINE_BATCH_LOCAL_WRITE_LIMIT) || 100000;

function writeTableChunk(_data, filePath, schema, tableSchema) {
  return new Promise(async((resolve, reject) => {
    const dataToSave = {
      data: _data,
      schema,
      tableSchema,
    };
    const data = Buffer.from(JSON.stringify(dataToSave));
    const base64data = new Buffer(data, 'binary');
    fs.writeFileSync(filePath, base64data, 'utf8');
    Log.d(`File saved locally to path ${filePath}`);
    resolve();
  }));
}

function writeSource(data, { schema }, filePath, schemas) {
  return new Promise(async((resolve, reject) => {
    // Chunk and write to table
    // For each table
    const returnArray = [];
    for (let i = 0; i < data.length; i++) {
      const dataFromTable = data[i];
      // Chunk
      const tableArray = [];
      for (let y = 0; y < dataFromTable.length; y += CHUNK_LIMIT) {
        // Get the new batch to evaluate
        const evaluatedArray = dataFromTable.slice(y, y + CHUNK_LIMIT);
        const newFilePath = `${filePath}_${schema[i].table}_${y}_${y + CHUNK_LIMIT}.txt`;
        Log.d(`Evaluating chunked batch of length ${evaluatedArray.length} i.e From ${y + 1} to ${y + CHUNK_LIMIT}`);
        _await(writeTableChunk(evaluatedArray, newFilePath, schema[i], schemas[i]));
        tableArray.push(newFilePath);
      }
      returnArray.push(tableArray);
    }
    resolve(returnArray);
  }));
}

function fetchFilePaths(data, credentials, schemas) {
  return new Promise(async((resolve, reject) => {
    const tmpStoragePath = credentials.localFileDirectory;
    const Key = `${Date.now()}`;
    const filePath = `${tmpStoragePath}/${Key}`;
    const returnArray = [];
    for (let i = 0; i < data.length; i++) {
      const a = _await(writeSource(data[i], credentials.source[i], filePath, schemas[i]));
      returnArray.push(a);
    }
    resolve(returnArray);
  }));
}

function uploadFileToLocal(credentials, parameters) {
  return new Promise((resolve, reject) => {
    try {
      const filePath = _await(fetchFilePaths(parameters.data, credentials, parameters.schemas));
      resolve({
        status: 200,
        data: {
          parameters,
          filePath,
        },
        meta: {
          filePath,
        },
      });
    } catch (e) {
      reject(e);
    }
  });
}
module.exports = uploadFileToLocal;
