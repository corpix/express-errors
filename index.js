var ex = {};

ex._NotFound = function (){
  this.name = 'NotFound';
  this.status = 404;
  this.message = 'Oops! The page you requested doesn\'t exist';

  Error.call(this, this.message);
  Error.captureStackTrace(this, arguments.callee);
}

ex._Forbidden = function (){
  this.name = 'Forbidden';
  this.status = 403;
  this.message = 'Forbidden. You don\'t have permission to access this';

  Error.call(this, this.message);
  Error.captureStackTrace(this, arguments.callee);
}

ex._Unauthorized = function(){
  this.name = 'Unauthorized';
  this.status = 401;
  this.message = 'Unauthorized';

  Error.call(this, this.message);
  Error.captureStackTrace(this, arguments.callee);
}

for(var i in ex){
  ex[i].prototype.__proto__ = Error.prototype;
  (function(name, cl){
    ex.__defineGetter__(name, function(){
      return new cl()
    });
  })(i.slice(1), ex[i]);
}

////
// <-
//

ex.bind = function(app, opts){

  app.use(function(req, res, next){
    next(new ex._NotFound());
  });
  
  app.error(function(err, req, res, next){
    if(!err.name || err.name == 'Error' || !ex['_' + err.name]){
      console.error(err);
      if(req.xhr)
        return res.send({ error: 'Internal error' }, 500);

      return res.render('errors/500', {
        layout: opts.layout,
        status: 500,
        error: err,
        showStack: app.settings.showStackError,
        title: 'Oops! Something went wrong!'
      });
    }

    if(req.xhr)
      return res.send({ error: err.name }, err.status);

    res.render('errors/' + err.status, {
      layout: opts.layout,
      status: err.status,
      error: err,
      showStack: app.settings.showStackError,
      title: err.message
    });


  });

}


module.exports = ex;
