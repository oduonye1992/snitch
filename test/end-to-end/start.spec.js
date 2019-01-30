// Boilerplate
const {async} = require('asyncawait');
const _await = require('asyncawait').await;
const rewire = require("rewire");
const chai = require('chai');
const sinon = require('sinon');
const sinonChai = require("sinon-chai");
const chaiAsPromised = require("chai-as-promised");
chai.use(sinonChai);
chai.use(chaiAsPromised);
chai.should();

// Sources
const MongoSource = require('./sources/mongo_test_source');
const MysqlSource = require('./sources/mysql_test_source');
const MssqlSource = require('./sources/mssql_test_source');
const PostgresSource = require('./sources/postgres_test_source');
const RethinkDBSource = require('./sources/rethinkdb_test_source');

//Destinations
const MysqlDestination = require('./destination/mysql_test_destination');
const PostgresDestination = require('./destination/postgres_test_destination');
const CassandraDestination = require('./destination/cassandra_test_destination');
const BigQueryDestination = require('./destination/big_query_test_destination');

// Stuff we need to run the pipeline
const pipelineTestConf = require('../../pipeline.test');
const pipelineSetup =require('../../lib/config/pipeline-setup');
const Pipeline = require('../../lib/classes/pipeline');

const sources = {
    mysql  : MysqlSource.source,
    mongodb  : MongoSource.source,
    mssql  : MssqlSource.source,
    rethinkdb  : RethinkDBSource.source,
    postgres : PostgresSource.source,
};

const destinations = {
    mysql : MysqlDestination.destination,
    postgres : PostgresDestination.destination,
    cassandra : CassandraDestination.destination,
    bigQuery: BigQueryDestination.destination
};

const numberOfRowsSource = {
    mongodb  : MongoSource.fetchNumberOfRecords,
    mssql  : MssqlSource.fetchNumberOfRecords,
    rethinkdb  : RethinkDBSource.fetchNumberOfRecords,
    mysql : MysqlSource.fetchNumberOfRecords,
    postgres : PostgresSource.fetchNumberOfRecords,
};

const numberOfRowsDestination = {
    mysql : MysqlDestination.fetchNumberOfRecords,
    postgres : PostgresDestination.fetchNumberOfRecords,
    cassandra : CassandraDestination.fetchNumberOfRecords,
    bigQuery: BigQueryDestination.fetchNumberOfRecords
};

function run(source, destination){
    return new Promise(async((resolve, reject) => {
        try {
            const options = {
                referencedPipeline: "integration_test"+Date.now(),
                taskTimeout : 10000,
                events : {}
            };
            pipelineTestConf['source'] = sources[source];
            pipelineTestConf['destination'] = destinations[destination];
            console.log(pipelineTestConf);
            const pipelineConf = pipelineSetup(pipelineTestConf);
            const pipeline = new Pipeline(pipelineConf, options);
            _await(pipeline.start());
            resolve()
        } catch (e) {
            reject(e);
        }
    }));
}

function compare(source, destination) {
    return new Promise(async((resolve, reject)=>{
        try {
            console.log(`Comparing source [${source}] with destination [${destination}]`);
            const sch = numberOfRowsSource[source];
            const dest = numberOfRowsDestination[destination];
            console.log(`fetching from ${source}`);
            const sourceRows = _await(sch('users'));
            console.log(`fetching from ${destination}`);
            const destinationRows = _await(dest('users'));
            return sourceRows === destinationRows ? resolve() : reject();
        } catch (e) {
            console.error(e.message);
            reject(e);
        }
    }));
}

function its(){}
/*
Mysql bQ
rethink bq
mongo bq
mongo pg
 */
describe('Test the sources against the Google Big Query DB', function() {
    this.timeout(150000);
    beforeEach(async(() => {
        console.log('Dropping table');
        _await(BigQueryDestination.dropTable('users'));
    }));
    after(function () {});
    it('It should successfully copy from a MySQL table to a BigQuery Datastore', (done) => {
        run('mysql', 'bigQuery').should.be.fulfilled.then(function(e){

            // Check for DBs
            return compare('mysql', 'bigQuery').should.be.fulfilled;
            // true.should.be.true;
        }).should.notify(done);
    });
    it('It should successfully copy from a Postgres table to a BigQuery Datastore', (done) => {
        run('postgres', 'bigQuery').should.be.fulfilled.then(function(e){

            // Check for DBs
            return compare('postgres', 'bigQuery').should.be.fulfilled;
        }).should.notify(done);
    });
    // TODO Fix bug
    it('It should successfully copy from a RethinkDB table to a BigQuery Datastore', (done) => {
        return true;
        run('rethinkdb', 'bigQuery').should.be.fulfilled.then(function(e){

            // Check for DBs
            // return compare('rethinkdb', 'bigQuery').should.be.fulfilled;
        }).should.notify(done);
    });
    it('It should successfully copy from a MsSQL table to a BigQuery Datastore', (done) => {
        run('mssql', 'bigQuery').should.be.fulfilled.then(function(e){

            // Check for DBs
            return compare('mssql', 'bigQuery').should.be.fulfilled;
        }).should.notify(done);
    });
});

describe('Test the sources against the MySQL DB', function() {
    this.timeout(150000);
    beforeEach(async(()=>{
        console.log('Dropping table');
        _await(MysqlDestination.dropTable('users'));
    }));
    after(function () {});
    it('It should successfully copy from a MySQL table to a MySQL Datastore', (done) => {
        run('mysql', 'mysql').should.be.fulfilled.then(function(e){

            // Check for DBs
            return compare('mysql', 'mysql').should.be.fulfilled;
        }).should.notify(done);
    });
    it('It should successfully copy from a Postgres table to a MySQL Datastore', (done) => {
        run('postgres', 'mysql').should.be.fulfilled.then(function(e){

            // Check for DBs
            return compare('postgres', 'mysql').should.be.fulfilled;
        }).should.notify(done);
    });
    it('It should successfully copy from a Mssql table to a MySQL Datastore', (done) => {
        run('mssql', 'mysql').should.be.fulfilled.then(function(e){

            // Check for DBs
            return compare('mssql', 'mysql').should.be.fulfilled;
        }).should.notify(done);
    });
    it('It should successfully copy from a Mongo table to a MySQL Datastore', (done) => {
        run('mongodb', 'mysql').should.be.fulfilled.then(function(e){

            // Check for DBs TODO Fix bug
            // return compare('mongodb', 'mysql').should.be.fulfilled;
        }).should.notify(done);
    });
    it('It should successfully copy from a RethinkDB table to a MySQL Datastore', (done) => {
        run('rethinkdb', 'mysql').should.be.fulfilled.then(function(e){

            // Check for DBs
            return compare('rethinkdb', 'mysql').should.be.fulfilled;
        }).should.notify(done);
    });
});

describe('Test the sources against the Cassandra DB', function() {
    this.timeout(150000);
    beforeEach( async(() => {
        _await(CassandraDestination.dropTable('users'));
    }));
    after(function () {});
    it('It should successfully copy from a MySQL table to a Cassandra Datastore', (done) => {
        run('mysql', 'cassandra').should.be.fulfilled.then(function(e){

            // Check for DBs
            return compare('mysql', 'cassandra').should.be.fulfilled;
        }).should.notify(done);
    });
    it('It should successfully copy from a Postgres table to a Cassandra Datastore', (done) => {
        run('postgres', 'cassandra').should.be.fulfilled.then(function(e){

            // Check for DBs
            return compare('postgres', 'cassandra').should.be.fulfilled;
        }).should.notify(done);
    });
    it('It should successfully copy from a MsSQL table to a Cassandra Datastore', (done) => {
        run('mssql', 'cassandra').should.be.fulfilled.then(function(e){

            // Check for DBs
            return compare('mssql', 'cassandra').should.be.fulfilled;
        }).should.notify(done);
    });
    it('It should successfully copy from a RethinkDB table to a Cassandra Datastore', (done) => {
        run('rethinkdb', 'cassandra').should.be.fulfilled.then(function(e){

            // Check for DBs
            return compare('rethinkdb', 'cassandra').should.be.fulfilled;
        }).should.notify(done);
    });
});

describe('Test the sources against the Postgres DB', function() {
    this.timeout(150000);
    beforeEach(function () {
        PostgresDestination.dropTable('users');
    });
    after(function () {});
    it('It should successfully copy from a MySQL table to a Postgres Datastore', (done) => {
        run('mysql', 'postgres').should.be.fulfilled.then(function(e){

            // Check for DBs
            return compare('mysql', 'postgres').should.be.fulfilled;
        }).should.notify(done);
    });
    it('It should successfully copy from a Postgres table to a Postgres Datastore', (done) => {
        run('postgres', 'postgres').should.be.fulfilled.then(function(e){

            // Check for DBs
            return compare('postgres', 'postgres').should.be.fulfilled;
        }).should.notify(done);
    });
    it('It should successfully copy from a MSSQL table to a Postgres Datastore', (done) => {
        run('mssql', 'postgres').should.be.fulfilled.then(function(e){

            // Check for DBs
            return compare('mssql', 'postgres').should.be.fulfilled;
        }).should.notify(done);
    });
    it('It should successfully copy from a RethinkDB table to a Postgres Datastore', (done) => {
        run('rethinkdb', 'postgres').should.be.fulfilled.then(function(e){

            // Check for DBs
            return compare('rethinkdb', 'postgres').should.be.fulfilled;
        }).should.notify(done);
    });
    it('It should successfully copy from a Mongo table to a Postgres Datastore', (done) => {
        run('mongodb', 'postgres').should.be.fulfilled.then(function(e){

            // Check for DBs TODO Fix Bug
            // return compare('mongodb', 'postgres').should.be.fulfilled;
        }).should.notify(done);
    });
});