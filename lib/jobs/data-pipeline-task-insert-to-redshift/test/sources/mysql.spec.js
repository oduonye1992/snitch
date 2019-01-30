const chai = require('chai');
const {expect, should} = chai;

const sinon = require('sinon');
const mysql = require('mysql');
const sinonChai = require("sinon-chai");
const chaiAsPromised = require("chai-as-promised");

const mysqlStore = require('../../src/sources/mysql');

chai.use(sinonChai);
chai.use(chaiAsPromised);
chai.should();


describe('MySQL Data warehouse', function() {
    beforeEach(function () {
        sinon.stub(mysql, 'createConnection').returns({
            connect:function(cb){cb()},
            query: function(query, cb){cb(null, [])},
            end:()=>{}
        });
    });
    afterEach(function () {
        mysql.createConnection.restore();
    });
    const fileContents = [[[{name : 'daniel'}]]];
    const parameters = {
        system : {
            pipeline : "pipeline"
        }
    };
    const credentials = {
        "warehouse": {
            "type": "mysql",
            url : "mysql://root:password@localhost:3307/sample"
        },
        source : [{
            "schema": [{
                "fields": [],
                "table": Date.now(),
                "limit": 1000,
                "destination_table_name": "accounts",
                "primary_key": "number",
                "incremental_key": "updated_at"
            }]
        }]
    };

    it('It should resolve successfully', (done) => {
        mysqlStore(credentials, parameters, {data : [], schema : {}, tableSchema : {id : 'INT'}, })
            .should.eventually.be.fulfilled
            .then(function(e){
                e.should.be.an('object');
            })
            .should.notify(done);
    });
    it('MySQL connection should be created', (done) => {
        mysqlStore(credentials, parameters,
            {data : [{name: 'Daniel'}], schema : {
            table:'users',
            destination_table_name :'users'
        },
                tableSchema : {id : 'INT'}, });
        mysql.createConnection.should.be.calledWith("mysql://root:password@localhost:3307/sample");
        done();
    });
});