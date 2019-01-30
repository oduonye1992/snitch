const rewire = require('rewire');
const chai = require('chai');
const {expect, should} = chai;

const sinon = require('sinon');
const sinonChai = require("sinon-chai");
const chaiAsPromised = require("chai-as-promised");

const postgresStore = rewire('../../src/sources/postgress');

chai.use(sinonChai);
chai.use(chaiAsPromised);
chai.should();

describe('Postgres Data warehouse', function() {
    beforeEach(function () {
        class MockExample {
            connect(){return Promise.resolve()};
            query(query, cb){return Promise.resolve({
                rows : []
            })};
            end(){};
        }
        postgresStore.__set__("Client", MockExample);
    });
    afterEach(function () {

    });
    const fileContents = [[[{name : 'daniel'}]]];
    const parameters = {
        system : {
            pipeline : "pipeline"
        }
    };
    const credentials = {
        "warehouse": {
            "type": "postgres",
            url : "postgres://root:password@localhost:3307/sample"
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
        postgresStore(credentials, parameters, {data : [], schema : {}, tableSchema : {id : 'INT'}, })
            .should.eventually.be.fulfilled
            .then(function(e){
                e.should.be.an('object');
            })
            .should.notify(done);
    });
});