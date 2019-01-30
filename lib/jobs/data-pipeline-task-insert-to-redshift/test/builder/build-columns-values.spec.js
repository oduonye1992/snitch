const chai = require('chai');
const {expect, should} = chai;
const sinon = require('sinon');
const sinonChai = require("sinon-chai");
const chaiAsPromised = require("chai-as-promised");
const rewire = require('rewire');

const buildColumns = require('../../src/builder/build-columns-values');

chai.use(sinonChai);
chai.use(chaiAsPromised);
chai.should();

describe('It should return valid snippet ', function() {
    beforeEach(function () {

    });
    afterEach(function () {

    });
    it('It should fetch index from redis', (done) => {
        const data = [{
            name : 'daniel'
        }];
        buildColumns(data, 'postgres').should.be.an('object');
        done();
    });
});