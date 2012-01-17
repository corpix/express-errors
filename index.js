var fs = require('fs')
  , path = require('path')
  , basename = path.basename
  , ex = {};

ex.define = function(opts){
  var fn = function(){
    this.message = opts.message;
    this.name = opts.name;
    this.status = opts.status;

    Error.call(this, this.message);
    Error.captureStackTrace(this, arguments.callee);
  }

  fn.prototype.__proto__ = Error.prototype;
  ex.__defineGetter__(opts.name, function(){
    return new fn();
  });

  return fn;
}

ex.bind = function(app, opts){

  app.use(function(req, res, next){
    next(ex.NotFound);
  });

  app.error(function(err, req, res, next){
    if(!err.name || err.name == 'Error' || !ex.hasOwnProperty(err.name)){
      console.log('>>', err);
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
      return res.send({ error: err.message }, err.status);

    res.render('errors/' + err.status, {
      layout: opts.layout,
      status: err.status,
      error: err,
      showStack: app.settings.showStackError,
      title: err.message
    });


  });

}

//
// Loading errors
//

var httpErrors = __dirname + '/http';

fs.readdir(httpErrors, function(err, files){
  if(err)
    throw new Error(err);

  files.forEach(function(file){
    var opts = require(httpErrors + '/' + file);
    opts.name = basename(file, '.json');
    ex.define(opts);
  });
});

module.exports = ex;
