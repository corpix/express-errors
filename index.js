module.exports = function(app, opts){

  app.use(function(req, res, next){
    next(new NotFound(req.url))
  })
  
  function NotFound(path){
    this.name = 'NotFound'
    if (path) {
      Error.call(this, 'Cannot find ' + path)
      this.path = path
    } else {
      Error.call(this, 'Not Found')
    }
    Error.captureStackTrace(this, arguments.callee)
  }
  
  NotFound.prototype.__proto__ = Error.prototype
  
  app.error(function(err, req, res, next){
    if (err instanceof NotFound){
      if(req.xhr)
        return res.send({ error: 'Not found' }, 404)

      res.render('errors/404', {
        layout: opts.layout,
        status: 404,
        error: err,
        showStack: app.settings.showStackError,
        title: 'Oops! The page you requested doesn\'t exist'
      })
    } else {
      console.log(err.stack)
      if(req.xhr)
        return res.send({ error: 'Internal error' }, 500)
      res.render('errors/500', {
        layout: opts.layout,
        status: 500,
        error: err,
        showStack: app.settings.showStackError,
        title: 'Oops! Something went wrong!'
      })
    }
  })

}
