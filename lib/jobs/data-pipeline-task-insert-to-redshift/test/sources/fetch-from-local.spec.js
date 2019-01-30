const chai = require('chai');
const {expect, should} = chai;
const sinon = require('sinon');
const sinonChai = require("sinon-chai");
const chaiAsPromised = require("chai-as-promised");
const rewire = require('rewire');

const fetchFileFromLocal = require('../../src/sources/fetch-from-local');

const fs = require('fs');
chai.use(sinonChai);
chai.use(chaiAsPromised);
chai.should();

describe('It should return valid snippet ', function(done) {
    beforeEach(function () {
        sinon.stub(fs, 'existsSync').returns(true);
        sinon.stub(fs, 'readFileSync').returns('{"name" : "daniel"}');
    });
    afterEach(function () {
        fs.existsSync.restore();
        fs.readFileSync.restore();
    });
    it('It should fetch index from redis', (done) => {
        fetchFileFromLocal('dummystring.txt').should.eventually.be.an('object');
        done();
    });
});

describe('It should return valid snippet ', function(done) {
    beforeEach(function () {
        sinon.stub(fs, 'existsSync').returns(true);
        sinon.stub(fs, 'readFileSync').returns('{"name" : "daniel"}');
    });
    afterEach(function () {
        fs.existsSync.restore();
        fs.readFileSync.restore();
    });
    it('It should fetch index from redis', (done) => {
        fetchFileFromLocal('dummystring.txt').should.eventually.be.an('object');
        done();
    });
});

describe('It should throw an error when the file doesnt exist', function(done) {
    beforeEach(function () {
        sinon.stub(fs, 'existsSync').returns(false);
        sinon.stub(fs, 'readFileSync').returns('{"name" : "daniel"}');
    });
    afterEach(function () {
        fs.existsSync.restore();
        fs.readFileSync.restore();
    });
    it('It should fetch index from redis', (done) => {
        fetchFileFromLocal('dummystring.txt').should.be.rejectedWith('Path dummystring.txt does not exist');
        done();
    });
});