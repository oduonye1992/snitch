
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
const getDetailsFromConnectionString = require('../../../src/sources/mssql/connection-string');

/**
 * What are we testing?
 * 1. Check that the correct object is returned with the connection string
 */
describe('Test the Connection string class', function() {

    before(function () {});
    after(function () {});
    it('It should return the correct object given the connection string', (done) => {
        const connectionString = "mysql://root:password@localhost:3307/sample";
        const res = getDetailsFromConnectionString(connectionString);
        JSON.stringify(res).should.equal(JSON.stringify({
            userName : 'root',
            password : 'password',
            server : 'localhost',
            database : 'sample',
            port: '3307'
        }));
        done();
    });
});