/**
 * Created by USER on 25/02/2018.
 */
const Log = require('../utils/logger');
const request = require('request');

module.exports = function postToZapier({ webhook, text, key }) {
  return new Promise(() => {
    const options = {};
    options[key] = text;
    request.post({
      url: webhook,
      method: 'POST',
      json: options,
    }, (err, httpResponse, body) => {
      if (err) return Log.e(`An error occured while posting to slack. ${JSON.stringify(err)}`);
      Log.d('Successfully posted to Zapier');
    });
  });
};
