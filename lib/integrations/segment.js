/**
 * Created by USER on 02/03/2018.
 */
const Analytics = require('analytics-node');
const Log = require('../utils/logger');

module.exports = function postToSegment(options) {
  return new Promise((resolve, reject) => {
    const {
      write_key, text, pipelineID, event,
    } = options;
    const analytics = new Analytics(write_key);
    analytics.identify({
      userId: pipelineID,
      traits: {
        pipelineID,
      },
    });
    analytics.track({
      userId: pipelineID,
      event,
      properties: {
        message: text,
      },
    });
    Log.d('Posted event to Segment');
    resolve();
  });
};
