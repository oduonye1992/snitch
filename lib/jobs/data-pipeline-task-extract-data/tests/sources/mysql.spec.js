const chai = require('chai');
const {expect, should} = chai;
const {async, await,} = require('asyncawait');
const sinon = require('sinon');
const mysql = require('mysql');
const sinonChai = require("sinon-chai");
const chaiAsPromised = require("chai-as-promised");
const fetchFromMySQL = require('../../src/sources/mysql');
chai.use(sinonChai);
chai.use(chaiAsPromised);
chai.should();


describe('MySQL Extract Source', function() {
    beforeEach(function () {
        sinon.stub(mysql, 'createConnection').returns({
            connect:function(cb){cb()},
            query: function(query, cb){cb(null, [])},
            end:()=>{}
        });
    });
    afterEach(function () {
        mysql.createConnection.restore();
    });
    it('It should create a mysql connection', (done) => {
        const options  = {
            url: 'mysql://root:password@localhost:3307/sample',
        };
        const schema = [{}];
        fetchFromMySQL(options, schema);
        mysql.createConnection.should.be.calledWith(options.url);
        fetchFromMySQL(options, schema).should.be.fulfilled.then(function(e){
            e.should.be.an('object');
        }).should.notify(done);
    });
});