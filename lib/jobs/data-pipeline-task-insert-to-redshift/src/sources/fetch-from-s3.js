const AWS = require('aws-sdk');
const Log = require('../utils/logger');

function fetchFileFroms3(filePath, credentials) {
  return new Promise((resolve, reject) => {
    Log.d(`Fetching file from f3. Path: ${filePath}`);
    const {
      accessKeyId,
      secretAccessKey,
      Bucket,
    } = credentials;
    const s3 = new AWS.S3();
    const Key = filePath;

    // For dev purposes only
    AWS.config.update({
      accessKeyId,
      secretAccessKey,
    });

    s3.getObject({
      Bucket,
      Key,
    }, (err, resp) => {
      if (err) throw new Error(err);
      resolve(JSON.parse(resp.Body.toString()));
    });
  });
}
module.exports = fetchFileFroms3;
