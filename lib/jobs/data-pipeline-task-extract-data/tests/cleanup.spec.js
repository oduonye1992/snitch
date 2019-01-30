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
const cleanup = require('../src/cleanup');

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
            set: function(key, val, cb){
                cb(null, "");
            }
        });
    });
    afterEach(function () {
        redis.createClient.restore();
    });
    it('It should return a valid JSON response', (done) => {
        const options  = {
            host: 'a',
            port: 'e'
        };
        const schema = [{}];
        cleanup({redisSource:options}, {system:{
            pipeline : {},
            parent : {}
        }});
        redis.createClient.should.be.calledWith(options);
        cleanup({redisSource:options}, {system:{
            pipeline : {},
            parent : {}
        }}).should.be.fulfilled.then(function(e){
            e.should.be.an('object');
        }).should.notify(done);
    });
});