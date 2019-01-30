const chai = require('chai');
const {expect, should} = chai;
const {async, await,} = require('asyncawait');
const sinon = require('sinon');
const sinonChai = require("sinon-chai");
const chaiAsPromised = require("chai-as-promised");
const rewire = require('rewire');

const fetchFromMySQL = require('../src/sources/mysql');
const fetchFromMongo = require('../src/sources/mongo');
const fetchFromPostgress = require('../src/sources/postgress');
const fetchIndexFromRedis = require('../src/sources/redis');
const index = rewire('../src/index');

chai.use(sinonChai);
chai.use(chaiAsPromised);
chai.should();

describe('It should invoke the index function', function() {

    beforeEach(function () {
        const res = {
            result : [],
            index : []
        };
        const fetchFromMySQL = () => {return res;};
        const fetchFromMongo = () => {return res;};
        const fetchFromPostgress = () => {return res;};
        const fetchIndexFromRedis = () => {return [];};

        index.__set__("fetchFromMySQL", fetchFromMySQL);
        index.__set__("fetchFromMongo", fetchFromMongo);
        index.__set__("fetchFromPostgress", fetchFromPostgress);
        index.__set__("fetchIndexFromRedis", fetchIndexFromRedis);

    });
    afterEach(function () {

    });
    it('It should fetch index from redis', (done) => {
        const options  = {
            dataSources: [{
                type : 'mysql',
                credentials : {}
            }],
            redisSource: {host : 10}
        };
        const options2 = {
            system : {
                pipeline : {
                    pipeline_id : 'asss'
                }
            }
        };

        const REDIS_KEY_PREFIX = 'extract_data_';
        index(options, options2).should.be.fulfilled.then(function(data){
            data.data.data.should.be.an('array').and.to.have.lengthOf(1);
        }).should.notify(done);
    });
});