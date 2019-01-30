const {Client} = require('pg');
const {async} = require('asyncawait');
const xawait = require('asyncawait').await;

const source = [{
    "type": "postgres",
    "credentials": {
        "url": process.env.DATA_PIPELINE_TEST_POSTGRES_SOURCE_DB,
    },
    "schema": [{
        "fields": [],
        "records_limit": 3,
        "table": "my_users",
        "destination_table_name": "users",
        "primary_key": "id"
    }]
}];
function fetchNumberOfRecords(table){
    return new Promise((resolve, reject) => {
        try {
            const url = process.env.DATA_PIPELINE_TEST_POSTGRES_SOURCE_DB;
            const client = new Client({ connectionString :  url, ssl: true});
            xawait(client.connect());
            console.log('Conected');
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
const PostgresSource = {
    source, fetchNumberOfRecords
};
module.exports = PostgresSource;