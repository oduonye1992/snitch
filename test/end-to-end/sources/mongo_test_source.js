const {MongoClient} = require('mongodb');
const { async } = require('asyncawait');
const _await = require('asyncawait').await;

function asyncMongoConnect(url) {
    return new Promise((resolve, reject) => {
        MongoClient.connect(url, (err, db) => {
            if (err) return reject(err);
            resolve(db);
        });
    });
}

const source = [{
    "type": "mongodb",
    "credentials": {
        "url": process.env.DATA_PIPELINE_TEST_MONGO_SOURCE_DB,
    },
    "schema": [{
        "fields": [],
        "records_limit": 3,
        "table": "users",
        "destination_table_name": "users",
        "primary_key": "_id"
    }]
}];
function fetchNumberOfRecords(table){
    return new Promise((resolve, reject) => {
        const url = process.env.DATA_PIPELINE_TEST_MONGO_SOURCE_DB;
        const db = _await(asyncMongoConnect(url));
        console.log('Connected');
        const cursor = db.collection(table)
            .find({});
        const len = cursor.length;
        console.log('Got records ', len);
        return resolve(len);
    });
}
const MongoSource = {
    fetchNumberOfRecords,
    source
};
module.exports = MongoSource;