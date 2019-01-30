/**
 * Created by USER on 05/01/2018.
 */
function pipelineConf(configuration) {
  return {

    // Get data from
    id: 1,
    path: 'data-pipeline-task-extract-data',
    external: true,
    credentials: {
      redisSource: configuration.redis,
      dataSources: configuration.source.map((source) => {
        source.credentials.destination_type = configuration.destination.type;
        return source;
      }),
    },
    children: [{
      id: 2,
      path: 'data-pipeline-task-upload2s3',
      external: true,
      credentials: Object.assign({}, configuration.fileStorage, { source: configuration.source }),
      children: [{
        id: 4,
        path: 'data-pipeline-task-insert-to-redshift',
        external: true,
        credentials: {
          source: configuration.source,
          s3: configuration.fileStorage,
          warehouse: configuration.destination,
        },
        children: [],
      }],
    }],
  };
}
module.exports = pipelineConf;
