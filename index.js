var fs = require('fs'),
    path = require('path'),
    pjoin = path.join,
    basename = path.basename,
    defaultLogger,
    hasOwn = Object.prototype.hasOwnProperty,
    ex = {};

var ERRORS_DIR = pjoin(__dirname, 'errors');

function Errors(app, config) {
    config || (config = { });

    app.set('view engine') ||
        (config.plain = true);

    config.list || (config.list = [
        'badRequest',
        'conflict',
        'forbidden',
        'notFound',
        'unauthorized'
    ]);

    this._logger = config.logger || this._defaultLogger;
    this._config = config;

    this._app = app;

    this._errors = { };
    this._loadErrors(config.list);

    this._bind();
}

Errors.prototype.get = function(key) {
    return key?
        this._errors[key] :
        this._errors;
};

Errors.prototype.set = function(key, decl) {
    this._errors[key] = this._create(decl);
    return this;
};

Errors.prototype.unset = function(key) {
    delete this._errors[key];
    return this;
};

Errors.prototype._create = function(decl) {
    var Fn = function() {
        Object.keys(decl).forEach(function(key) {
            this[key] = decl[key];
        }, this);

        Error.call(this, this.message);
        Error.captureStackTrace(this, Fn);
    };

    Fn.prototype = Error.prototype;

    return Fn;
};

Errors.prototype._loadErrors = function(list) {
    list.forEach(function(item) {
        var decl;

        try {
            decl = require(pjoin(ERRORS_DIR, item));
        } catch(e) {
            if (e.code === 'MODULE_NOT_FOUND') {
                decl = require(item);
            } else {
                throw e;
            }
        }

        this.set(decl.name, decl);
    }, this);
};

Errors.prototype._defaultLogger = {
    error: function(err) {
        console.error(new Date().toLocaleString(), '>>', err);
        console.log(err.stack);
    }
};

Errors.prototype._bind = function() {
    var errors = this.get(),
        config = this._config,
        logger = this._logger,
        app    = this._app;

    app.use(function(err, req, res, next) {
        if(!err.name || err.name == 'Error' || !hasOwn.call(errors, err.name)) {
            logger.error(err);
            res.status(500);

            if(req.xhr || config.plain)
                return res.send({ error: 'Internal error' });

            return res.render('errors/500', {
                layout: config.layout,
                error: err,
                showStack: app.settings.showStackError,
                title: 'Oops! Something went wrong!'
            });
        }

        res.status(err.status);

        if(req.xhr) return res.send({ error: err.message });

        config.plain?
            res.send(err.message) :
            res.render((config.errorViews || 'errors') + '/' + err.status, {
                layout: config.layout,
                error: err,
                showStack: app.settings.showStackError,
                title: err.message
            });

    });
};

module.exports = Errors;
