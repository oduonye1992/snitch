const {
    async
} = require('asyncawait');
const _await = require('asyncawait').await;

const destination = {
    "type": "googleBigQuery",
    "projectId": process.env.GOOGLE_BIGQUERY_TEST_PROJECTID,
    "datasetId": process.env.GOOGLE_BIGQUERY_TEST_DATASET,
    "insert_batch_limit": 100,
};
function dropTable(tableId){
    return new Promise((resolve, reject) => {
       try {
           const projectId = process.env.GOOGLE_BIGQUERY_TEST_PROJECTID;
           const datasetId = process.env.GOOGLE_BIGQUERY_TEST_DATASET;
           console.log(projectId, datasetId);
           const BigQuery = require('@google-cloud/bigquery');
           const bigquery = new BigQuery({
               projectId
           });
           // Deletes the table
           console.log('Deleting');
           bigquery
               .dataset(datasetId)
               .table(tableId)
               .delete()
               .then(() => {
                   console.log(`Table ${tableId} deleted.`);
                   resolve();
               })
               .catch(err => {
                   console.error('ERROR:', err);
                   resolve();
               });

       } catch (e) {
           reject(e);
       }
    });
}
function fetchNumberOfRecords(table){
    return new Promise(async((resolve, reject) => {
        try {
            const projectId = process.env.GOOGLE_BIGQUERY_TEST_PROJECTID;
            const datasetId = process.env.GOOGLE_BIGQUERY_TEST_DATASET;

            const BigQuery = require('@google-cloud/bigquery');
            const bigquery = new BigQuery({
                projectId: projectId,
            });
            const options = {
                query : `SELECT * FROM ${table}`,
                useLegacySql: true,
            };
            bigquery
                .dataset(datasetId)
                .query(options)
                .then((row) => {
                    console.log(`Got number of records ${row.length}`);
                    resolve(row.length);
                })
                .catch(err => {
                    if (err && err.name === 'PartialFailureError') {
                        if (err.errors && err.errors.length > 0) {
                            Log.e('Insert errors:');
                            err.errors.forEach(err => Log.e(JSON.stringify(err)));
                        }
                    } else {
                        console.log('ERROR:', err);
                    }
                    reject(err);
                });
        } catch (e) {
            console.log(e);
            reject(e);
        }
    }));
}
const BigQueryDestination = {
    destination,
    fetchNumberOfRecords,
    dropTable
};
module.exports = BigQueryDestination;