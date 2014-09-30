express-mongoose-docs
=====================

[![Build Status](https://travis-ci.org/nabeel-ahmad/express-mongoose-docs.svg?branch=master)](https://travis-ci.org/nabeel-ahmad/express-mongoose-docs)
[![Coverage Status](https://coveralls.io/repos/nabeel-ahmad/express-mongoose-docs/badge.png?branch=master)](https://coveralls.io/r/nabeel-ahmad/express-mongoose-docs?branch=master)

This module will take away the pain of writing API and Data Model documentation for your Express & Mongoose based REST API.
It auto-generates API documentation from the code on runtime so the documentation always stays up to date.


Installation
--------------

* Step 1 : Install

```sh
npm install express-mongoose-docs
```

* Step 2 : Configure

Add these lines to your app.js file

```sh
var docs = require("express-mongoose-docs");
```

Make sure the following line comes after all express middleware such as app.use(express.bodyParser());

```sh
docs(app, mongoose); // 2nd param is optional
```

That's it. The Docs web page should be accessible at Your-Base-URL/apiDocs

Example: http://localhost:5000/apiDocs

Screenshots
===========

![routes](https://raw.github.com/nabeel-ahmad/express-mongoose-docs/master/screenshots/screenshot1.png "Routes")

![data-model](https://raw.github.com/nabeel-ahmad/express-mongoose-docs/master/screenshots/screenshot2.png "Data Model")



[repository]:https://github.com/nabeel-ahmad/express-mongoose-docs

