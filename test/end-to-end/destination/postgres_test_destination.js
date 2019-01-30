const {Client} = require('pg');
const {async} = require('asyncawait');
const xawait = require('asyncawait').await;

const destination = {
    "type": "postgres",
    "ssl" : true,
    "url": process.env.DATA_PIPELINE_TEST_POSTGRES_DESTINATION_DB,
    "insert_batch_limit": 100,
};

function fetchNumberOfRecords(table){
    return new Promise((resolve, reject) => {
        try {
            const url = process.env.DATA_PIPELINE_TEST_POSTGRES_DESTINATION_DB;
            const client = new Client({ connectionString :  url, ssl: true});
            xawait(client.connect());
            console.log('Connected');
            const query = `SELECT * FROM ${table}`;
            const res = xawait(client.query(query));
            const data = res.rows;
            console.log('Got records', data.length);
            return resolve(data.length);
        } catch (e) {
            reject(e);
        }
    });
}
function dropTable(table){
    return new Promise(async((resolve, reject) => {
        try {
            const url = process.env.DATA_PIPELINE_TEST_POSTGRES_DESTINATION_DB;
            const client = new Client({ connectionString :  url, ssl: true});
            xawait(client.connect());
            console.log('Dropping table.................................');
            const query = `DROP TABLE IF EXISTS ${table}`;
            const res = xawait(client.query(query));
            const data = res.rows;
            return resolve(data);
        } catch (e) {
            reject(e);
        }
    }));
}
const PostgresDestination = {
    destination, fetchNumberOfRecords, dropTable
};
module.exports = PostgresDestination;