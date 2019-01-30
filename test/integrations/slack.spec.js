
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
const slack = rewire('../../lib/integrations/slack');

/**
 * These are the objects we'll be "stubbing" (tracking)
 * @type {{webhook: ((p1:*)), setWebhook: ((p1:*))}}
 */
const stubs = {
    webhook : (a, args) => {

    },
    setWebhook : (...args) => {

    }
};
const Log = {
    d : ()=>{},
    e : ()=>{},
};

/**
 * What are we testing?
 * 1. Test that the identify and track functions
 * are called tithe the given arguments
 */
describe('Test the Slack integration class', function() {

    before(function () {
        sinon.stub(stubs, 'setWebhook').returns();
        sinon.stub(stubs, 'webhook').returns();
        class Slack {
            constructor(write_key){}
            setWebhook(args){
                return stubs.setWebhook(args);
            }
            webhook(args, args2) {
                return stubs.webhook(args, args2);
            }
        }
        slack.__set__('Slack', Slack);
    });
    after(function () {});
    it('It should invoke the webhook function in the Slack class', (done) => {
        const options = {
            channel : 'abc',
            username : 'def',
            text : 'ghi',
            webhook : 'jkl'
        };
        slack(options);
        stubs.setWebhook.should.be.calledWith('jkl');
        stubs.webhook.should.be.calledWith({
            channel : 'abc',
            username : 'def',
            text : 'ghi'
        });
        done();
    });
});