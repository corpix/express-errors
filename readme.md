##### Express errors

Available in NPM `npm install express-errors`

Provides easy access to common http errors for express e.g.
  
  * 401 - Unathorized
  * 403 - Forbidden
  * 404 - NotFound

---
#### Example
You need create `views/errors` directory and add 401,403,404 error views.

```javascript
    var errors = require('express-errors');

    errors.bind(app, { layout: false });
    // all done!
```

#### TODO

  * Bundled views
  * More options
