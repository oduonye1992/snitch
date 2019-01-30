const schedule = require('node-schedule');
const Pipeline = require('./pipeline');
const pipelineSetup = require('../config/pipeline-setup');
const logger = require('../utils/logger');
const config = require('../../pipeline');

const RUN_IMMEDIATELY = process.env.RUN_IMMEDIATELY || true;

class Scheduler {
  runPipeline(configuration) {
    const options = {
      referencedPipeline: configuration.pipeline_id,
      taskTimeout: configuration.timeout,
      events: configuration.events || {},
    };
    const pipelineConf = pipelineSetup(configuration);
    const scheduleRule = configuration.scheduler;
    const ruleObj = {
      start: new Date(scheduleRule.start),
      end: new Date(scheduleRule.end),
      rule: `*/${scheduleRule.interval} * * * *`,
    };

    logger.d(`This pipeline has been configured to run every ${scheduleRule.interval} minute(s).`);
    const pipeline = new Pipeline(pipelineConf, options);
    if (RUN_IMMEDIATELY) {
      pipeline.start();
    }
    schedule.scheduleJob(ruleObj, () => {
      try {
        pipeline.start();
      } catch (e) {
        logger.d(e);
      }
    });
    return pipeline;
  }
  run() {
    // Fetch the pipeline configuration
    try {
      this.runPipeline(config);
    } catch (e) {
      logger.e(e);
      throw new Error(e);
    }
  }
}
module.exports = Scheduler;
