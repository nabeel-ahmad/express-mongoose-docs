/**
 * User: Nabeel
 * Date: 4/1/14
 * Time: 7:25 PM
 */

var express = require('express');
var mongoose = require('mongoose');
var request = require('supertest');
var should = require('should');
var docs = require("../index.js");

var app = express();
app.use(app.router);

docs(app, mongoose);



before(function (done) {

    app.get("/test1", function() {});

    app.listen(5000, done);
});

before(function (done) {

    var NestedSchema = new mongoose.Schema({
        prop1: Number
    });

    var EntitySchema = new mongoose.Schema({
        prop1: {type: String, required: true, enum: ["123"]},
        prop2: [NestedSchema]
    });

    mongoose.model("Entity", EntitySchema);
    done();
});

describe("docs", function () {
    it("should get API docs", function (done) {
        request("http://localhost:5000")
            .get("/api-docs")
            .expect(200)
            .end(function (err, res) {
                if (err) return done(err);

                // Routes
                res.body.should.have.property("routes");
                res.body.routes.should.be.an.instanceOf(Array).with.length(1);
                res.body.routes[0][1][0].should.have.properties(["method", "path"]);

                // Schemas
                res.body.should.have.property("schemas");
                var schemas = res.body.schemas;
                schemas.should.be.an.instanceOf(Array).with.length(2);
                schemas[0].should.have.properties(["name", "fields"]);
                var fields = schemas[0].fields;
                fields[0].required.should.be.true;
                fields[0].enumValues.should.be.an.instanceOf(Array);

                done();
            });
    });
});



