
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
const mssql = rewire('../../../src/sources/mssql/mssql');

/**
 * These are the objects we'll be "stubbing" (tracking)
 * @type {{identify: ((p1:*)), track: ((p1:*))}}
 */
const stubs = {
    connectionConstructor : (args) => {},
    schemaQuery : (args) => {},
    executeStatement : (args) => {},
    connect : (args) => {},
    buildQuery : (args) => {}
};

/**
 * What are we testing?
 * 1. Test that the identify and track functions
 * are called tithe the given arguments
 */
describe('Test the MsSQL', function() {

    before(function () {
        sinon.stub(stubs, 'connectionConstructor').returns({
            name : 'daniel'
        });
        sinon.stub(stubs, 'schemaQuery').returns('Select * from users');
        sinon.stub(stubs, 'executeStatement').returns([
            {name : 'charles'}
        ]);
        sinon.stub(stubs, 'buildQuery').returns('Select * from users');
        sinon.stub(stubs, 'connect').returns(new Promise((resolve, reject) =>{
            resolve();
        }));
        class Connection {
            constructor(args){
                stubs.connectionConstructor(args);
            }
        }
        function schemaQuery(args){
            return stubs.schemaQuery(args);
        }
        function executeStatement(args){
            return stubs.executeStatement(args);
        }
        function connect(args){
            return stubs.connect(args);
        }
        mssql.__set__('schemaQuery', schemaQuery);
        mssql.__set__('executeStatement', executeStatement);
        mssql.__set__('connect', connect);
        mssql.__set__('buildQuery', stubs.buildQuery);
        mssql.__set__('Connection', Connection);
    });
    afterEach(() => {
        stubs.connect.restore();
    });
    after(function () {});
    it('It should Instantiate a new connection class', (done) => {
        const credentials = {
            url : 'mysql://root:password@localhost:3307/sample'
        };
        let schema = [{
            table : 'name'
        }];
        mssql(credentials, schema);
        stubs.connectionConstructor.should.be.calledWith({
                userName: 'root',
                password: 'password',
                server: 'localhost',
                // If you're on Windows Azure, you will need this:
                options: {encrypt: true, database: 'sample', port: "3307", rowCollectionOnRequestCompletion: true}
            }
        );
        done();
    });
    it('It should build the query with the default index when no index is passed', (done) => {
        const credentials = {
            url : 'mysql://root:password@localhost:3307/sample'
        };
        let schema = [{
            table : 'name'
        }];
        mssql(credentials, schema);
        stubs.buildQuery.should.be.calledWith('mssql', {table : 'name'}, '1970-10-10');
        done();
    });
});