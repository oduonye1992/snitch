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

const destination = {
    "type": "mysql",
    "url": process.env.DATA_PIPELINE_TEST_MYSQL_DESTINATION_DB,
    "insert_batch_limit": 100,
};

function fetchNumberOfRecords(table){
    return new Promise((resolve, reject) => {
        const url = process.env.DATA_PIPELINE_TEST_MYSQL_DESTINATION_DB;
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
                console.log('Got records', data.length);
                return resolve(data.length);
            } catch (e) {
                return reject(e);
            }
        }));
    });
}
function dropTable(table){
    return new Promise((resolve, reject) => {
        const url = process.env.DATA_PIPELINE_TEST_MYSQL_DESTINATION_DB;
        const con = mysql.createConnection(url);
        con.connect(async((err) => {
            try {
                if (err) {
                    console.log('Error ', err);
                    return reject(err);
                }
                console.log('Connected');
                const query = `DROP TABLE IF EXISTS ${table}`;
                let data = _await(asyncMySQLQuery(con, query));
                return resolve(data);
            } catch (e) {
                return reject(e);
            }
        }));
    });
}
const MySQLDestinaiton = {
    destination, fetchNumberOfRecords, dropTable
};
module.exports = MySQLDestinaiton;