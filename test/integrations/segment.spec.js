
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
const segment = rewire('../../lib/integrations/segment');

/**
 * These are the objects we'll be "stubbing" (tracking)
 * @type {{identify: ((p1:*)), track: ((p1:*))}}
 */
const stubs = {
    identify : (args) => {},
    track : (args) => {}
};

/**
 * What are we testing?
 * 1. Test that the identify and track functions
 * are called tithe the given arguments
 */
describe('Test the Segment integration class', function() {

    before(function () {
        sinon.stub(stubs, 'identify').returns();
        sinon.stub(stubs, 'track').returns();
        class Analytics {
            constructor(write_key){}
            identify(args){
                stubs.identify(args);
            }
            track(args) {
                stubs.track(args);
            }
        }
        segment.__set__('Analytics', Analytics);
    });
    after(function () {});
    it('It should invoke the identify function in the Analytics class', (done) => {
        const options = {
            write_key : 'abc',
            text : 'def',
            pipelineID : 'ghi',
            event : 'jkl',
        };
        segment(options);
        stubs.identify.should.be.calledWith({
            userId: "ghi",
            traits: {
                pipelineID: "ghi"
            }
        });
        done();
    });
    it('It should invoke the track function in the Analytics class', (done) => {
        const options = {
            write_key : 'abc',
            text : 'def',
            pipelineID : 'ghi',
            event : 'jkl',
        };
        segment(options);
        stubs.track.should.be.calledWith({
            userId : 'ghi',
            event : 'jkl',
            properties: {
                message : 'def'
            }
        });
        done();
    });
});