/**
 * Deprecated
 * @type {{scheduler: {start: string, end: string, interval: number}, redis: {host: string, port: number, password: string}, fileStorage: {fileMode: string, accessKeyId: string, secretAccessKey: string, Bucket: string, defaultPath: string}, schema: {fields: Array, table: string, destination_table_name: string, limit: number, primary_key: string, incremental_key: string}, source: {type: string, database: string, host: string, port: number, user: string, password: string}, destination: {type: string, database: string, host: string, port: number, user: string, password: string}}}
 */
const validJSON = {
  scheduler: {
    start: '01-03-2018',
    end: '01-04-2018',
    interval: 1,
  },
  redis: {
    host: '127.0.0.1',
    port: 6379,
    password: '',
  },
  fileStorage: {
    fileMode: 'local',
    accessKeyId: '',
    secretAccessKey: '',
    Bucket: '',
    defaultPath: '',
  },
  schema: {
    fields: [],
    table: 'users',
    destination_table_name: 'users',
    limit: 1000,
    primary_key: 'id',
    incremental_key: 'created_at',
  },
  source: {
    type: '',
    database: '',
    host: '',
    port: 5432,
    user: '',
    password: '',
  },
  destination: {
    type: '',
    database: '',
    host: '',
    port: 5432,
    user: '',
    password: '',
  },
};
module.exports = validJSON;
