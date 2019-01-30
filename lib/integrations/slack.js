/**
 * Created by USER on 25/02/2018.
 */
const Log = require('../utils/logger');
const Slack = require('slack-node');

module.exports = function postToSlack({
  channel, username, webhook, text,
}) {
  return new Promise(() => {
    const slack = new Slack();
    slack.setWebhook(webhook);
    slack.webhook({
      channel, username, text,
    }, (err, response) => {
      if (err) return Log.e(`An error occured while posting to slack. ${JSON.stringify(err)}`);
      Log.d('Successfully posted to slack');
    });
  });
};
