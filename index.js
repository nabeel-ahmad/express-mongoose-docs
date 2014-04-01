var _ = require("underscore");
var express = require("express");

module.exports = function (app, mongoose) {
    app.get('/api-docs', function (req, res) {
        try {
            var routes = _.flatten(app.routes);

            routes = _.groupBy(routes, function (route) {
                return route.path.split("/")[1];
            });

            delete routes['api-docs'];

            routes = _.pairs(routes);
            var schemas;
            if (mongoose)
                schemas = generateSchemaDocs(mongoose);
            res.send({routes: routes, schemas: schemas});
        } catch (e) {
            res.send(e);
        }
    });
    app.use(express.static(__dirname + '/html'));
};

var nestedSchemas = [];

function generateSchemaDocs(mongoose) {
    var schemas = _.pairs(mongoose.modelSchemas);
    schemas = _.map(schemas, function (schema) {
        var info = getSchemaInfo(schema);
        return info;
    });

    schemas = schemas.concat(nestedSchemas);
    return schemas;
}

function getSchemaInfo(schema) {
    var paths = _.map(schema[1].paths, function (path) {
        var info = getFieldInfo(path);
        if (info && info.schema)
            nestedSchemas.push(info.schema);
        return info;
    });

    _.each(schema[1].virtuals, function (virtual) {
        if (virtual.path != "id")
            paths.push({name: virtual.path, type: "Unknown"});
    });

    return {name: schema[0], fields: paths};
}

function getFieldInfo(path) {

    var field = {name: path.path, type: path.instance};

    if (path.options.type) {
        field.type = path.options.type.name;
        if (path.options.type instanceof Array && !path.schema)
            field.type = path.options.type[0].name + " []";
    }

    field.min = path.options.min;
    field.max = path.options.max;

    if (path.enumValues && path.enumValues.length > 0)
        field.enumValues = path.enumValues;

    if (path.schema) {
        field.type = field.name;
        field.schema = getSchemaInfo([field.name, path.schema]);
    }
    if (path.isRequired)
        field.required = true;
    return field;
}