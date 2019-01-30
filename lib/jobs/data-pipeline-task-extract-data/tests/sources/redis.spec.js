const chai = require('chai');
const {expect, should} = chai;
const {async, await,} = require('asyncawait');
const sinon = require('sinon');
const sinonChai = require("sinon-chai");
const chaiAsPromised = require("chai-as-promised");

chai.use(sinonChai);
chai.use(chaiAsPromised);
chai.should();

const redis = require('redis');
const fetchIndexFromRedis = require('../../src/sources/redis');

describe('Fetch index from index', function() {
    const sampleRedisResult = '{"name":"index"}';
    beforeEach(function () {
        sinon.stub(redis, 'createClient').returns({
            on: function(key, cb){
                if(key === 'connect') {
                    cb();
                }
            },
            get: function(key, cb){
                cb(null, sampleRedisResult);
            },
            quit: () => {

            }
        });
    });
    afterEach(function () {
        redis.createClient.restore();
    });
    it('It should return a valid JSON response', (done) => {
        const options  = {
            url : 'redis://127.0.0.1:6379'
        };
        const schema = [{}];
        fetchIndexFromRedis(options, [], 'sampleRedisKey');
        redis.createClient.should.be.calledWith(options);
        fetchIndexFromRedis(options, schema).should.be.fulfilled.then(function(e){
            e.should.be.an('object');
        }).should.notify(done);
    });
});