
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
const testConnectionString = require('../../src/sources/mssql/connection-string');


/**
 * What are we testing?
 * 1. Check that the correct object is returned with the connection string
 */
describe('Test the Connection string class', function() {

    before(function () {});
    after(function () {});
    it('It should return the correct object given the connection string', (done) => {
        const connectionString = "mysql://root:s0ftware!@localhost:3307/sample";
        const res = testConnectionString(connectionString);
        stubs.identify.should.be.calledWith({
            userId: "ghi",
            traits: {
                pipelineID: "ghi"
            }
        });
        done();
    });
    it('It should invoke the track function in the Analytics class', (done) => {
        const options = {
            write_key : 'abc',
            text : 'def',
            pipelineID : 'ghi',
            event : 'jkl',
        };
        segment(options);
        stubs.track.should.be.calledWith({
            userId : 'ghi',
            event : 'jkl',
            properties: {
                message : 'def'
            }
        });
        done();
    });
});