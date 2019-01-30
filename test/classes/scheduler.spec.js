
// Boilerplate
const rewire = require("rewire");
const chai = require('chai');
const sinon = require('sinon');
const sinonChai = require("sinon-chai");
const chaiAsPromised = require("chai-as-promised");
chai.use(sinonChai);
chai.use(chaiAsPromised);
chai.should();

// Module to test
const scheduler = rewire('../../lib/classes/scheduler');
const schedule = require('node-schedule');
const config = require('../../pipeline');

/**
 * These are the objects we'll be "stubbing" (tracking)
 * @type {{identify: ((p1:*)), track: ((p1:*))}}
 */
const stubs = {
    pipelineContructor : (args) => {},
    pipelineStart : (args) => {},
    pipelineSetup : (args) => {}
};

/**
 * What are we testing?
 * Test that the pipeline is istantiated
 * Test that the scheduleJob function is run
 */
describe('Test the Segment integration class', function() {

    before(function () {
        sinon.stub(stubs, 'pipelineContructor').returns();
        sinon.stub(stubs, 'pipelineStart').returns();
        sinon.stub(stubs, 'pipelineSetup').returns({
            name : 'daniel'
        });
        sinon.stub(schedule, 'scheduleJob').returns();

        class Pipeline {
            constructor(args){
                stubs.pipelineContructor(args);
            }
            start(args){
                stubs.pipelineStart(args);
            }
        }
        function pipelineSetup(args){
            return stubs.pipelineSetup(args);
        }
        scheduler.__set__('Pipeline', Pipeline);
        scheduler.__set__('pipelineSetup', pipelineSetup);
    });
    after(function () {});
    it('It should invoke the functions with the correct parameters', (done) => {
        new scheduler().run();
        stubs.pipelineSetup.should.be.calledWith(config);
        done();
    });
    it('It should instantiate the pipeline class with the correct arguments', (done) => {
        new scheduler().run();
        stubs.pipelineContructor.should.be.calledWith({
            name : 'daniel'
        });
        done();
    });
    it('It should schedule the job based on the correct parameters passed', (done) => {
        new scheduler().run();
        stubs.pipelineContructor.should.be.calledWith({
            name : 'daniel'
        });
        const scheduleRule = config.scheduler;
        const ruleObj = {
            start: new Date(scheduleRule.start),
            end: new Date(scheduleRule.end),
            rule: `*/${scheduleRule.interval * 60} * * * * *`,
        };
        schedule.scheduleJob.should.be.calledWith(ruleObj);
        done();
    });
});