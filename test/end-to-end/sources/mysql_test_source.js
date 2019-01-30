const mysql = require('mysql');
const { async } = require('asyncawait');
const _await = require('asyncawait').await;

function asyncMySQLQuery(con, query) {
    return new Promise((resolve, reject) => {
        con.query(query, (err, res) => {
            if (err) reject(err);
            resolve(res);
        });
    });
}

const source = [{
    "type": "mysql",
    "credentials": {
        "url": process.env.DATA_PIPELINE_TEST_MYSQL_SOURCE_DB,
    },
    "schema": [{
        "fields": [],
        "records_limit": 3,
        "table": "users",
        "destination_table_name": "users",
        "primary_key": "id"
    }]
}];
function fetchNumberOfRecords(table){
    return new Promise((resolve, reject) => {
       const url = process.env.DATA_PIPELINE_TEST_MYSQL_SOURCE_DB;
        const con = mysql.createConnection(url);
        con.connect(async((err) => {
            try {
                if (err) {
                    console.log('Error ', err);
                    return reject(err);
                }
                console.log('Connected');
                const query = `Select * from ${table}`;
                let data = _await(asyncMySQLQuery(con, query));
                console.log(`Got records ${data.length}`);
                return resolve(data.length);
            } catch (e) {
                return reject(e);
            }
        }));
    });
}
const MysqlSource = {
    source, fetchNumberOfRecords
};
module.exports = MysqlSource;