
// Boilerplate
const rewire = require("rewire");
const chai = require('chai');
const sinon = require('sinon');
const sinonChai = require("sinon-chai");
const chaiAsPromised = require("chai-as-promised");
chai.use(sinonChai);
chai.use(chaiAsPromised);
chai.should();

// Module to test
const schemaQuery = require('../../src/queries/select-schema-query');

/**
 * What are we testing?
 * Test that the correct slect queries are returned for each
 * ... data type
 *
 */
const source = {
    "fields": [],
    "records_limit": 3,
    "table": "users",
    "incremental_key": ["added_at"],
    "destination_table_name": "rethink_users",
    "primary_key": "id"
};

describe('Test the correct query is being returned given the params', function() {

    before(function () {});
    after(function () {});

    it('It should return a valid SQL based on the MySQL input params', (done) => {
        schemaQuery.bind(this, 'invalidSource', source)
            .should.throw('Data source invalidSource not supported');
        done();
    });
    it('It should return a valid Schema description for Postgres', (done) => {
        const sql = ` select column_name, data_type from information_schema.columns where table_name = \'users\';`;
        const res = schemaQuery('postgres', source);
        res.should.equal(sql);
        done();
    });
    it('It should return a valid Schema description for mysql', (done) => {
        const sql = `describe users`;
        const res = schemaQuery('mysql', source);
        res.should.equal(sql);
        done();
    });
    it('It should return a valid Schema description for MsSQL', (done) => {
        const sql = `select * from information_schema.columns where table_name = \'users\'`;
        const res = schemaQuery('mssql', source);
        res.should.equal(sql);
        done();
    });
});