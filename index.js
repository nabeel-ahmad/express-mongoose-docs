var mongoose = require("mongoose");
var _ = require("underscore");

module.exports = function(app) {
    app.get('/api-docs', function(req, res) {
        var routes = _.flatten(app.routes);
        var schemas = generateSchemaDocs();
        res.send({routes: routes, schemas: schemas});
    });
};

function generateSchemaDocs() {
    var schemas = _.pairs(mongoose.modelSchemas);
    var nestedSchemas = [];
    schemas = _.map(schemas, function (schema) {
        var info = getSchemaInfo(schema);
        if (info.schemas)
            nestedSchemas = nestedSchemas.concat(info.schemas);
        return info;
    });

    schemas = schemas.concat(nestedSchemas);
    return schemas;
};

function getSchemaInfo(schema) {
    var nestedSchemas = [];
    var paths = _.map(schema[1].paths, function (path) {
        var info = getFieldInfo(path);
        if (info && info.schema)
            nestedSchemas.push(info.schema);
        return info;
    });

    _.each(schema[1].virtuals, function(virtual) {
        if(virtual.path != "id")
            paths.push({name: virtual.path, type: "Unknown"});
    });

    return {name: schema[0], fields: paths, schemas: nestedSchemas};
}

function getFieldInfo(path) {

    var field = {name: path.path, type: path.instance};

    if (path.options.type) {
        field.type = path.options.type.name;
        if (path.options.type instanceof Array && !path.schema)
            field.type = path.options.type[0].name + " []";
    }

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