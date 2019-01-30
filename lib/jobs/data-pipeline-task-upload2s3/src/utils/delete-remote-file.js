const AWS = require('aws-sdk');

function deleteFileFromS3(credentials, parameters) {
  return new Promise((resolve, reject) => {
    const s3 = new AWS.S3();
    const Key = parameters.system.parent.filePath;
    const {
      accessKeyId,
      secretAccessKey,
      Bucket,
    } = credentials;

    AWS.config.update({
      accessKeyId,
      secretAccessKey,
    });

    s3.deleteObjects({
      Bucket,
      Delete: {
        Objects: [
          { Key },
        ],
      },
    }, (err, resp) => {
      if (err) return reject(err);
      return resolve({
        status: 200,
        data: {},
        meta: {},
      });
    });
  });
}
module.exports = deleteFileFromS3;
