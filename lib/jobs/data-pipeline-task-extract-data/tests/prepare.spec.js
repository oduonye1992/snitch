const chai = require('chai');
const {expect, should} = chai;
const {async, await,} = require('asyncawait');
const sinon = require('sinon');
const sinonChai = require("sinon-chai");
const chaiAsPromised = require("chai-as-promised");
const rewire = require('rewire');

const mysql = require('mysql');
const { Client } = require('pg');
const redis = require('redis');
const prepare = require('../src/prepare');
const { MongoClient } = require('mongodb');

chai.use(sinonChai);
chai.use(chaiAsPromised);
chai.should();

describe('It should invoke the necessary data sources', function() {
    const sampleRedisResult = '{"name":"index"}';
    beforeEach(function () {
        sinon.stub(mysql, 'createConnection').returns({
            connect:function(cb){cb()},
            query: function(query, cb){cb(null, [])}
        });
        sinon.stub(redis, 'createClient').returns({
            on: function(key, cb){
                if(key === 'connect') {
                    cb();
                }
            },
            get: function(key, cb){
                cb(null, sampleRedisResult);
            }
        });
    });
    afterEach(function () {
        mysql.createConnection.restore();
        redis.createClient.restore();
    });
    it('It should fetch index from redis', (done) => {
        const options  = {
            dataSources: [{
                type : 'mysql',
                credentials : {
                    host : 'a',
                    user : 'b',
                    password : 'c',
                    database : 'd',
                    port : 'e'
                }
            }],
            redisSource: {host : 10}
        };

        prepare(options).should.be.fulfilled.then(function(data){
            data.should.be.an('object');
        }).should.notify(done);
    });
});