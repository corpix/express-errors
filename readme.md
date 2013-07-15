##### Express errors

Available in NPM `npm install express-errors`

Provides easy access to common http errors for express e.g.

  * 400 - bad request
  * 401 - unathorized
  * 403 - forbidden
  * 404 - notFound
  * 409 - conflict
  * 500 - internal server error

---
#### Example
You need create `views/errors` directory and add 401,403,404 error views.

```javascript
    app.get('/400', function(req, res, next) {
        next(errors.badRequest); // You will get "bad request" error in browser
    });

    app.get('/500', function(req, res, next) {
        next(new Error('Something went wrong :(')); // You will get "Internal server error" error in browser
    });

    var errors = require('express-errors'),
        logger = function(err) { // Custom logger function
            console.error(err);
        };

    errors.bind(app, { layout: false, logger: logger }); // IMPORTANT! Call it after all routes defined
```

#### Options
Currently this options are available:

  * `lastRoute` - if false `express-errors` will not maintain last app.use route(notFound error)
  * `plain` - if app.settings['view engine'] is undefined OR this option is presented res.send instead of res.render will be used
  * `logger` - custom logger function

#### Defining an error
Yeah, you can. Use .define method:

```javascript
    errors.define({
        name: 'badRequest', // You will be able to access it through `errors.badRequest` in future
        message: 'Bad request', // This message for XHR requests
        status: 400 // HTTP status
    });
```
