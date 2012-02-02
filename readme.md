##### Express errors

Available in NPM `npm install express-errors`

Provides easy access to common http errors for express e.g.

  * 400 - Bad request
  * 401 - Unathorized
  * 403 - Forbidden
  * 404 - NotFound
  * 500 - Internal server error

---
#### Example
You need create `views/errors` directory and add 401,403,404 error views.

```javascript
    var errors = require('express-errors');

    errors.bind(app, { layout: false });
    
    app.get('/400', function(req, res, next){
      next(errors.BadRequest); // You will get "bad request" error
    });

    app.get('/500', function(req, res, next){
      next(new Error('Something went wrong :(')); // You will get "Internal server error" error
    })
```

#### Options
Currently this options are available:

  * `lastRoute` - if false `express-errors` will not maintain last app.use route(NotFound error)
  * `plain` - if app.settings['view engine'] is undefined OR this option is presented res.send instead of res.render will be used

#### Defining an error
Yeah, you can. Use .define method:

```javascript
    errors.define({
      name: 'BadRequest', // You will be able to access it through `errors.BadRequest` in future
      message: 'Bad request', // This message for XHR requests
      status: 400 // HTTP status
    });
```

#### TODO

  * Bundled views
  * More options
