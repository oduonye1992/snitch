const Connection = require('tedious').Connection;
const Request = require('tedious').Request;
const {async} = require('asyncawait');
const xawait = require('asyncawait').await;
const extractDetailsFromConnectionString = require('../../../lib/jobs/data-pipeline-task-extract-data/src/sources/mssql/connection-string');
function connect(connection){
    return new Promise((resolve, reject) => {
        connection.on('connect', function(err) {
                // If no error, then good to go...
                if (err) {
                    console.log('Could not connect to MSSQL. Error', err);
                    return reject(err);
                }
                console.log('Connected!');
                resolve();
            }
        );
    });
}
function executeStatement(connection, sql) {
    return new Promise((resolve, reject) => {
        let request = new Request(sql, function(err, rowCount, rows) {
            if (err) {
                reject(err);
            } else {
                resolve(rows);
            }
        });
        connection.execSql(request);
    });
}

const source = [{
    "type": "mssql",
    "credentials": {
        "url": process.env.DATA_PIPELINE_TEST_MSSQL_SOURCE_DB,
    },
    "schema": [{
        "fields": [],
        "records_limit": 3,
        "table": "pets",
        "destination_table_name": "users",
        "primary_key": "id"
    }]
}];
function fetchNumberOfRecords(table){
    return new Promise((resolve, reject) => {
       const url = process.env.DATA_PIPELINE_TEST_MSSQL_SOURCE_DB;
        const {
            userName,
            password,
            server,
            database,
            port
        } = extractDetailsFromConnectionString(url);
        const config = {
            userName,
            password,
            server,
            // If you're on Windows Azure, you will need this:
            options: {encrypt: true, database, port, rowCollectionOnRequestCompletion : true}
        };
        const connection = new Connection(config);
        xawait(connect(connection));
        console.log('connected');
        const query = `SELECT * FROM ${table}`;
        const res = xawait(executeStatement(connection, query));
        const num = res.length;
        console.log('Got records', num);
        return resolve(num);
    });
}
const MysqlSource = {
    source, fetchNumberOfRecords
};
module.exports = MysqlSource;