express-mongoose-docs
=====================

This module will take away the pain of writing API and Data Model documentation for your Express & Mongoose based API


Installation
--------------

* Step 1

```sh
npm install express-mongoose-docs
```

* Step 2

Add these lines to your app.js file

```sh
var docs = require("express-mongoose-docs");
```


```sh
docs(app, mongoose);
```


* Step 3

Copy the '/docs' directory from this [repository] to the '/public' directory in your Node.js project.


* Step 4

The Docs web page can be accessed at Your-Base-URL/docs

Example: http://localhost:5000/docs

Screenshots
===========

![routes](/screenshots/screenshot1.png "Routes")

![data-model](/screenshots/screenshot2.png "Data Model")



[repository]:https://github.com/nabeel-ahmad/express-mongoose-docs

