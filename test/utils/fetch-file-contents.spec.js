const chai = require('chai');
const expect = chai.expect;
const assert = chai.assert;
const sinon = require('sinon');
const fetchFileContents = require('../../lib/utils/fetch-file-contents');

after(function () {

});

describe('Fetch File Contents', function() {
    it('should return string when a valid file is passed', function() {
      const filePath = '/Users/USER/Documents/Daniel/Work/Atlas.Money/snitch/pipeline.json';
      expect(fetchFileContents(filePath)).to.be.a('string');
    });
});