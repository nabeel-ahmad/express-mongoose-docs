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

var baseURL = "http://localhost:5000";

before(function (done) {

    // Add sample routes and start express app
    app.get("/route1", function() {});

    app.listen(5000, done);
});

before(function (done) {

    // Add sample schemas to mongoose
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

    it("should return routes", function (done) {
        request(baseURL)
            .get("/api-docs")
            .expect(200)
            .end(function (err, res) {
                if (err) return done(err);

                res.body.should.have.property("routes");
                res.body.routes.should.be.an.instanceOf(Array).with.length(1);
                res.body.routes[0][1][0].should.have.properties(["method", "path"]);

                done();
            });
    });

    it("should return schemas", function (done) {
        request(baseURL)
            .get("/api-docs")
            .expect(200)
            .end(function (err, res) {
                if (err) return done(err);

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



