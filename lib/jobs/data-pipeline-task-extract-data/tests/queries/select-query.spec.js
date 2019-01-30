
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
const selectQuery = require('../../src/queries/select-query');;

/**
 * What are we testing?
 * Test that the correct slect queries are returned for each
 * ... data type
 *
 */
describe('Test the correct query is being returned given the params', function() {

    before(function () {});
    after(function () {});

    it('It should throw an error if a given type is not supported', (done) => {
        selectQuery.bind(this, 'invalidSource').should.throw('Data source invalidSource not supported');
        done();
    });

    it('It should return a valid SQL based on the MySQL input params', (done) => {
        const source = {
            "fields": [],
            "records_limit": 3,
            "table": "users",
            "destination_table_name": "rethink_users",
            "primary_key": "id"
        };
        const index = '10-10-2010';
        const sql = `SELECT * FROM users`;
        const res = selectQuery('mysql', source, index);
        res.should.equal(sql);
        done();
    });
    it('It should return a valid SQL with incremental keys', (done) => {
        const index = 'created_at';
        const source = {
            "fields": [],
            "records_limit": 3,
            "table": "users",
            "incremental_key": [index],
            "destination_table_name": "rethink_users",
            "primary_key": "id"
        };
        const sql = `SELECT * FROM users WHERE  ${index} >= \'10-10-2010\'  ORDER BY ${index} ASC`;
        const res = selectQuery('mysql', source, '10-10-2010');
        res.should.equal(sql);
        done();
    });
    it('It should return a valid SQL with multiple incremental keys', (done) => {
        const index = 'created_at';
        const source = {
            "fields": [],
            "records_limit": 3,
            "table": "users",
            "incremental_key": [index, "added_at"],
            "destination_table_name": "rethink_users",
            "primary_key": "id"
        };
        const sql = `SELECT * FROM users WHERE  ${index} >= \'10-10-2010\' OR added_at >= \'10-10-2010\'  ORDER BY ${index} ASC,added_at ASC`;
        const res = selectQuery('mysql', source, '10-10-2010');
        res.should.equal(sql);
        done();
    });
    it('It return a valid MongoDB query object', (done) => {
        const index = 'created_at';
        const source = {
            "fields": [],
            "records_limit": 3,
            "table": "users",
            "incremental_key": [index, "added_at"],
            "destination_table_name": "rethink_users",
            "primary_key": "id"
        };
        const res = selectQuery('mongodb', source, '10-10-2010');
        res.should.have.property(index);
        res.should.have.property('added_at');
        done();
    });

});