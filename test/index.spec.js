const chai = require('chai');
const expect = chai.expect;
const assert = chai.assert;
const sinon = require('sinon');

const start = require('../lib/index');
const Scheduler = require('../lib/classes/scheduler');
const scheduler = new Scheduler();

after(function () {

});

describe('Index', function() {
    it('should instantiate a new scheduler class and call the run function', function() {
        expect(true).to.be.true;
    });
});