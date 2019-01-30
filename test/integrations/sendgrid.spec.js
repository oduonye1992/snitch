
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
const sendgrid = rewire('../../lib/integrations/sendgrid');
const sgMail = require('@sendgrid/mail');

describe('Test the Sendgrid integration class', function() {

    before(function () {
        sinon.stub(sgMail, 'setApiKey').returns();
        sinon.stub(sgMail, 'send').returns();
    });
    after(function () {});
    it('It should invoke the send function of the sendgrid library', (done) => {
        const options = {
            apiKey : 'abc',
            to : 'def',
            from : 'ghi',
            text : 'jkl',
        };
        sendgrid(options);
        sgMail.setApiKey.should.be.calledWith('abc');
        sgMail.send.should.be.calledWith({
            to : 'def',
            from : 'ghi',
            subject: 'Pipeline Report:',
            text : 'jkl'
        });
        done();
    });
});