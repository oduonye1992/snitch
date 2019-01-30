const AWS = require('aws-sdk');
const Log = require('../utils/logger');

function uploadFileToS3(credentials, parameters) {
  return new Promise((resolve, reject) => {
    const {
      accessKeyId,
      secretAccessKey,
      Bucket,
    } = credentials;
    const data = Buffer.from(JSON.stringify(parameters.data));
    const base64data = new Buffer(data, 'binary');
    const s3 = new AWS.S3();
    const Key = `${Date.now()}.txt`;

    // For dev purposes only
    AWS.config.update({
      accessKeyId,
      secretAccessKey,
    });

    s3.putObject({
      Bucket,
      Key,
      Body: base64data,
      ACL: 'public-read',
    }, (resp) => {
      const filePath = Key;
      Log.d('File saved remotely to Amazon\'s S3');
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
    });
  });
}
module.exports = uploadFileToS3;
