var _ = require("underscore");
var express = require("express");

module.exports = function (app, mongoose) {


    // Add an API endpoint to be used internally by this module
    app.get('/api-docs', function (req, res) {
        try {
            if (app.routes) {
                // Extract all API routes in one array  in case of express3
                var routes = _.flatten(app.routes);
            }
            else {
                // Extract all API routes in one array  in case of express4
                var arr = [];
                _.each(app._router.stack, function (route) {
                    if (!_.isUndefined(route.route)) {
                        route.route.method = Object.keys(route.route.methods).toString();
                        arr.push(route.route);
                    } else if(route.handle.stack) {
                        var preRoute = route.regexp.toString().replace(/\\/ig, '').replace('/^', '').replace('?(?=/|$)/i', '').replace('/api', '');
                        // Extract routes from middlewere installed Router
                        _.each(route.handle.stack, function (route) {
                            if (!_.isUndefined(route.route)) {
                                var toPush = {
                                    method: Object.keys(route.route.methods).toString(),
                                    path: preRoute + route.route.path.replace('/', '')
                                };
                                arr.push(toPush);
                            }
                        });
                    }
                });
                routes = arr;
            }
            // Group routes by resource name
            routes = _.groupBy(routes, function (route) {
                return route.path.split("/")[1];
            });

            // Skip the routes to be used internally by this module
            delete routes['api-docs'];

            // Transform route groups object to an array of group/routes pairs
            routes = _.pairs(routes);

            var schemas;

            if (mongoose)
                schemas = generateSchemaDocs(mongoose);

            res.send({routes: routes, schemas: schemas});
        } catch (e) {
            res.status(400).send(e);
        }
    });

    // Configure the directory which holds html docs template
    app.use(express.static(__dirname + '/html'));
};

var nestedSchemas;

// Transform mongoose model schemas into a readable format
function generateSchemaDocs(mongoose) {

    nestedSchemas = [];

    // Transform models object to an array
    var schemas = _.pairs(mongoose.modelSchemas);

    // Map each schema to a readable format
    schemas = _.map(schemas, function (schema) {
        var info = getSchemaInfo(schema);
        return info;
    });

    // Add nested schemas
    schemas = schemas.concat(nestedSchemas);
    return schemas;
}

function getSchemaInfo(schema) {

    // Extract schema info for all fields of a schema
    var paths = _.map(schema[1].paths, function (path) {

        // Extract field info like type, required, enum etc.
        var info = getFieldInfo(path);

        // If field is a nested array with a custom, add it's schema to nested schemas
        if (info && info.schema)
            nestedSchemas.push(info.schema);

        return info;
    });

    // Add virtual fields to schema info
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
        // This field is a nested array with a custom schema
        field.type = field.name;
        // Get schema info for the array item schema
        field.schema = getSchemaInfo([field.name, path.schema]);
    }

    if (path.isRequired)
        field.required = true;

    return field;
}
