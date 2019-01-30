
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
const zapier = rewire('../../lib/integrations/zapier');
const request = require('request');

describe('Test the Sendgrid integration class', function() {

    before(function () {
        sinon.stub(request, 'post').returns();
    });
    after(function () {});
    it('It should invoke the post function of the request library', (done) => {
        const options = {
            webhook : 'abc',
            text : 'def',
            key : 'ghi',
        };
        zapier(options);
        request.post.should.be.calledWith({
            url : 'abc',
            method : 'POST',
            json: {
                'ghi' : 'def'
            }
        });
        done();
    });
});