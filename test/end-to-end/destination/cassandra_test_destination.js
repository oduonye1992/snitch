const {
    async
} = require('asyncawait');
const _await = require('asyncawait').await;
const cassandra = require('cassandra-driver');
/**
 * Created by USER on 11/03/2018.
 */
const destination = {
    "type": "cassandra",
    "url": process.env.DATA_PIPELINE_TEST_CASSANDRA_DESTINATION_DB,
    "insert_batch_limit": 100,
};
function fetchNumberOfRecords(table){
    return new Promise((resolve, reject) => {
       try {
           const url = process.env.DATA_PIPELINE_TEST_CASSANDRA_DESTINATION_DB;
           const splitedUrl = url.split('/');
           const contactPoint = splitedUrl[0], keyspace = splitedUrl[1];
           const client = new cassandra.Client({contactPoints: [contactPoint], keyspace});
           console.log('Connected');
           const query = `SELECT * FROM ${table} allow filtering`;
           const {rows} = _await (client.execute(query));
           console.log('Got records', rows.length);
           return resolve(rows.length);
       } catch (e) {
           reject(e);
       }
    });
}
function dropTable(table){
    return new Promise(async((resolve, reject) => {
        try {
            const url = process.env.DATA_PIPELINE_TEST_CASSANDRA_DESTINATION_DB;
            const splitedUrl = url.split('/');
            const contactPoint = splitedUrl[0], keyspace = splitedUrl[1];
            const client = new cassandra.Client({contactPoints: [contactPoint], keyspace});
            const query = `DROP TABLE IF EXISTS ${table};`;
            console.log('....................................................');
            const {rows} = _await(client.execute(query));
            console.log('........................................................ Dropping table', query, rows);
            return resolve();
        } catch (e) {
            console.log(e);
            reject(e);
        }
    }));
}
const CassandraDestination = {
    destination,
    fetchNumberOfRecords,
    dropTable
};
module.exports = CassandraDestination;