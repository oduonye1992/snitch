const chai = require('chai');
const {expect, should} = chai;
const sinon = require('sinon');
const sinonChai = require("sinon-chai");
const chaiAsPromised = require("chai-as-promised");
const rewire = require('rewire');

const fetchFileFroms3 = rewire('../../src/sources/fetch-from-s3');

chai.use(sinonChai);
chai.use(chaiAsPromised);
chai.should();

describe('It should fetch file from s3', function(done) {
    beforeEach(function () {
        let AWS = {
            config : {
                update : () => {}
            },
            S3 : function(){
                return {
                    getObject : function(opt, cb){
                        cb(null, {
                            Body : {
                                toString : function () {
                                    return JSON.stringify({name : "Daniel"});
                                }
                            }
                        })
                    }
                }
            }
        };
        fetchFileFroms3.__set__('AWS', AWS);
    });
    afterEach(function () {

    });
    it('It should return an object', (done) => {
        const credentials = {
            accessKeyId : '',
            secretAccessKey: '',
            Bucket: '',
        };
        fetchFileFroms3('dummystring.txt', credentials)
            .should.eventually.be.an('object');
        done();
    });
});
