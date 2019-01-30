const { async } = require('asyncawait');
const _await = require('asyncawait').await;
const r = require('rethinkdb');
const extractDetailsFromConnectionString = require('../../../lib/jobs/data-pipeline-task-extract-data/src/sources/mssql/connection-string');
const source = [{
    "type": "rethinkdb",
    "credentials": {
        "url": process.env.DATA_PIPELINE_TEST_RETHINKDB_SOURCE_DB,
    },
    "schema": [{
        "fields": [],
        "records_limit": 3,
        "table": "users",
        "destination_table_name": "users",
        "primary_key": "id"
    }]
}];
function asyncRethinkDBConnect(r, options) {
    return new Promise((resolve, reject) => {
        r.connect(options, (err, conn) => {
            if (err) return reject();
            return resolve(conn);
        });
    });
}
function execute(r, con) {
    return new Promise((resolve, reject) => {
        r.run(con, (err, cursor, e) => {
            if (err) return reject(err);
            let res= [];
            cursor.each((x, q) => {
                res.push(q);
            });
            resolve(res);
        });
    });
}
function fetchNumberOfRecords(table){
    return new Promise((resolve, reject) => {
        try {
            const url = process.env.DATA_PIPELINE_TEST_RETHINKDB_SOURCE_DB;
            const {
                userName,
                password,
                server,
                database,
                port
            } = extractDetailsFromConnectionString(url);
            const options = {
                user : userName,
                password : password || '',
                host : server,
                port,
                database
            };
            const conn = _await(asyncRethinkDBConnect(r, options));
            console.log('Connected');
            let data = _await(execute(r.table(table), conn));
            console.log('Got records ', data.length);
            return resolve(data.length);
        } catch (e) {
            reject(e)
        }
    });
}
const RethinkDBSource = {
    source, fetchNumberOfRecords
};
module.exports = RethinkDBSource;