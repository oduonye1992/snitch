const chai = require('chai');
const {should} = chai;
const sinon = require('sinon');
const sinonChai = require("sinon-chai");
const rewire = require('rewire');
const {Client} = require('pg');
const chaiAsPromised = require("chai-as-promised");
const fetchFromPostgress = rewire('../../src/sources/postgress');
chai.use(sinonChai);
chai.use(chaiAsPromised);
chai.should();


describe('Postgres Extract Source', function() {
    beforeEach(function () {
        class MockExample {
            connect(){return Promise.resolve()};
            query(query, cb){return Promise.resolve({
                rows : []
            })};
            end(){};
        }
        fetchFromPostgress.__set__("Client", MockExample);
        fetchFromPostgress.__set__("destination", "mysql");
    });
    afterEach(function () {

    });
    it('It should connect to postgress and give valid results', (done) => {
        const options  = {
            url: 'postgres://user:password@localhost:5432/database',
        };
        const schema = [{}];
        fetchFromPostgress(options, schema).should.be.fulfilled.then(function(e){
            e.should.be.an('object');
        }).should.notify(done);
    });
});