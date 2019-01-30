/**
 * Created by USER on 25/02/2018.
 */
const Log = require('../utils/logger');
const request = require('request');

module.exports = function postToWebhook({ webhook, text }) {
  return new Promise(() => {
    const options = {
      message: text,
    };

    request.post({
      url: webhook,
      method: 'POST',
      json: options,
    }, (err, httpResponse, body) => {
      if (err) return Log.e(`An error occured while posting to slack. ${JSON.stringify(err)}`);
      Log.d('Successfully posted to webhook');
    });
  });
};
