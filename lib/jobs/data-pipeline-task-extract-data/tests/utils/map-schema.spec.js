
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
const mapSchema = require('../../src/utils/map-schema');

/**
 * What are we testing?
 1. Test that an error is thrown if an unsupported source or destination is passed
 2. Test map from same source and destination
 3. Test map from Mysql to Postgres
 4. Test map from postgres to mysql
 5. Test map from SQL Server to Mysql and Postgres
 6. Test map from Mongo to Myswl
 7. Test map from mysql, postgres, sqlserver to cassandra
 *
 */

describe('Test the direct mappings', function() {

    before(function () {});
    after(function () {});

    it('It should throw an error if invalid source is passed', (done) => {
        mapSchema.bind(this, 'invalidSource', 'invalidDestination', {})
            .should.throw('Source invalidSource not supported');
        done();
    });
    it('It should throw an error if invalid destination is passed', (done) => {
        mapSchema.bind(this, 'mysql', 'invalidDestination', {})
            .should.throw('Destination invalidDestination not supported');
        done();
    });
});

describe('Test Mapping to Postgres DB', function() {

    before(function () {});
    after(function () {});

    it('It return the valid schema map from Postgres to Postgress', (done) => {
        const schema = {
            a : 'integer',
            b : 'character varying',
            c : 'timestamp with time zone',
            d : 'double precision',
            e : 'int',
            f : 'smallint',
            g : 'varbinary'
        };
        const res = mapSchema('postres', 'postres', schema);
        res.should.equal(schema);
        done();
    });
    it('It return the valid schema map from MySQL to Postgress', (done) => {
        const schema = {
            a : 'json',
            b : 'year',
            c : 'bit',
            d : 'decimal',
            e : 'varchar',
            f : 'enum',
            g : 'bool'
        };
        const res = mapSchema('mysql', 'postgres', schema);
        const resultJSON= {
            a: "JSON",
            b: "YEAR",
            c: "BOOLEAN",
            "d": "INTEGER",
            "e": "TEXT",
            "f": "TEXT",
            "g": "BOOLEAN"
        };
        JSON.stringify(res).should.equal(JSON.stringify(resultJSON));
        done();
    });
});

describe('Test Mapping to Mysql DB', function() {

    before(function () {});
    after(function () {});

    it('It return the valid schema map from Postgres to MySQL', (done) => {
        const schema = {
            a : 'integer',
            b : 'character varying',
            c : 'timestamp with time zone',
            d : 'double precision',
            e : 'int',
            f : 'smallint',
            g : 'varbinary'
        };
        const res = mapSchema('postgres', 'mysql', schema);
        const resultJSON= {
            a: "INTEGER",
            b: "VARCHAR (255)",
            c: "TIMESTAMP",
            "d": "INTEGER",
            "e": "INTEGER",
            "f": "INTEGER",
            "g": "TEXT"
        };
        JSON.stringify(res).should.equal(JSON.stringify(resultJSON));
        done();
    });
});

describe('Test Mapping to Cassandra DB', function() {

    before(function () {});
    after(function () {});

    it('It return the valid schema map from Postgres to Cassandra', (done) => {
        const schema = {
            a : 'integer',
            b : 'character varying',
            c : 'timestamp with time zone',
            d : 'double precision',
            e : 'int',
            f : 'smallint',
            g : 'varbinary'
        };
        const res = mapSchema('postgres', 'cassandra', schema);
        const resultJSON= {
            a: "BIGINT",
            b: "TEXT",
            c: "TIMESTAMP",
            "d": "BIGINT",
            "e": "BIGINT",
            "f": "BIGINT",
            "g": "TEXT"
        };
        JSON.stringify(res).should.equal(JSON.stringify(resultJSON));
        done();
    });
    it('It return the valid schema map from MySQL to Cassandra', (done) => {
        const schema = {
            a : 'json',
            b : 'year',
            c : 'bit',
            d : 'decimal',
            e : 'varchar',
            f : 'enum',
            g : 'bool'
        };
        const res = mapSchema('mysql', 'cassandra', schema);
        const resultJSON= {
            a: "TEXT",
            b: "TEXT",
            c: "BOOLEAN",
            "d": "BIGINT",
            "e": "TEXT",
            "f": "TEXT",
            "g": "BOOLEAN"
        };
        JSON.stringify(res).should.equal(JSON.stringify(resultJSON));
        done();
    });

});