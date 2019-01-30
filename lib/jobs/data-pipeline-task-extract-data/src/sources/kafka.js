const moment = require('moment-timezone');
const { async } = require('asyncawait');
const _await = require('asyncawait').await;
const Log = require('../utils/logger');
const kafka = require('kafka-node');

const DEFAULT_INDEX = 0;

function processTopic(credentials, schema, index) {
  return new Promise(async((resolve, reject) => {
    const MAX_NUMBER_TO_PROCESS = schema.records_limit;
    const TOPIC = schema.topic;
    const DEFAULT_OFFSET = index;
    const CONNECTION_STRING = credentials.url;
    const Consumer = kafka.Consumer;
    const client = new kafka.Client(CONNECTION_STRING);
    Log.d(`Listening on the topic ${schema.topic} on the offset ${index}`);
    const consumer = new Consumer(
      client,
      [
        { topic: TOPIC, partition: 0 },
      ],
      {
        autoCommit: true,
      }
    );
    let currentOffset = DEFAULT_OFFSET;
    const dataList = [];
    consumer.on('error', (e) => {
      Log.d(`An error occured while setting up the kafka consumer: ${e}`);
      consumer.close(true, () => {});
      return reject(e);
    });
    consumer.on('message', ({ offset, value }) => {
      Log.d('New message');

      // Increment the index
      currentOffset = offset;
      try {
        // Process the data. Try to add store it in memory
        Log.d(offset, value);
        const parsedData = JSON.parse(value);
        dataList.push(parsedData);
        Log.d('Message Processed');
        if (dataList.length === MAX_NUMBER_TO_PROCESS) {
          return consumer.close(true, () => resolve({
            data: dataList,
            offset,
          }));
        }
        Log.d(`Expecting ${MAX_NUMBER_TO_PROCESS - dataList.length} more records`);
      } catch (e) {
        Log.d(e.message);
        Log.d(`An error occured processing this message.${JSON.stringify(value)}`);
      }
    });
    Log.d('Consumer listener is set. Now listening for messages');
  }));
}
module.exports = function fetchFromKafka(credentials, schema, index) {
  return new Promise(async((resolve, reject) => {
    try {
      const resultArray = [];
      const indexes = [];
      const tableSchema = [];
      for (let i = 0; i < schema.length; i += 1) {
        const source = schema[i];
        const defIndex = index[i] ? index[i] : (source.default_index || DEFAULT_INDEX);
        const { data, offset } = _await(processTopic(credentials, source, defIndex));
        Log.d(`Number of records found [${data.length}]`);
        Log.d('Extracting schema');
        const formattedSchema = {};
        if (data.length) {
          const map = {
            number: 'INTEGER',
            boolean: 'BOOLEAN',
          };
          Object.keys(data[0]).forEach((x) => {
            if (source.primary_key === x) {
              formattedSchema[x] = 'VARCHAR(255)';
            } else {
              formattedSchema[x] = map[typeof x] || 'TEXT';
            }
          });
        }
        Log.d('Schema extracted.');
        resultArray.push(data);
        indexes.push(offset);
        tableSchema.push(formattedSchema);
      }
      resolve({
        result: resultArray,
        index: indexes,
        tableSchema,
      });
    } catch (e) {
      reject(e);
    }
  }));
};
