/**
 * Created by USER on 11/03/2018.
 */
const rewire = require('rewire');
const chai = require('chai');
const {expect, should} = chai;

const sinon = require('sinon');
const sinonChai = require("sinon-chai");
const chaiAsPromised = require("chai-as-promised");

const cassandraStore = rewire('../../src/sources/cassandra');

chai.use(sinonChai);
chai.use(chaiAsPromised);
chai.should();

describe('Cassandra Data warehouse', function() {
    beforeEach(function () {
        class MockExample {
            client(){return Promise.resolve()};
            execute(query, cb){return Promise.resolve({
                rows : []
            })};
            end(){};
        }
        cassandraStore.__set__("cassandra", MockExample);
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
        cassandraStore(credentials, parameters, {data : [], schema : {}, tableSchema : {id : 'INT'}, })
            .should.eventually.be.fulfilled
            .then(function(e){
                e.should.be.an('object');
            })
            .should.notify(done);
    });
});