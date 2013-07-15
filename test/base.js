var express = require('express'),
    request = require('request'),
    assert  = require('assert'),
    Errors  = require('../');

var hasOwn = Object.hasOwnProperty;

describe('express-errors base', function() {

    var app, errors;

    beforeEach(function() {
        app = express();
        errors = new Errors(app);
    });

    it('should init', function() {
        assert.ok(errors instanceof Errors);
    });

    it('should apply custom config correctly', function() {
        var errors = new Errors(app, {
            errorViews: 'test',
            plain: true,
            list: [ 'notFound', __dirname + '/fixtures/decl/teapot' ]
        });

        assert.equal(2, Object.keys(errors._errors).length);
    });

    it('should contain errors of valid type', function() {
        assert.equal(typeof errors._errors.notFound, 'function');
        assert.ok(new errors._errors.notFound() instanceof Error);
    });

    it('should return all errors', function() {
        assert.ok(Object.keys(errors.get()).length > 0);
    });

    it('should return specific error', function() {
        assert.equal(typeof errors.get('notFound'), 'function');
    });

    it('should set custom error', function() {
        var teapot = require(__dirname + '/fixtures/decl/teapot');

        errors.set(teapot.name, teapot);
        assert.equal(typeof errors._errors.teapot, 'function');
    });

    it('should unset error', function() {
        assert.equal(typeof errors._errors.notFound, 'function');
        errors.unset('notFound');
        assert.equal(typeof errors._errors.notFound, 'undefined');
        assert.ok(!hasOwn.call(errors._errors, 'notFound'));
    });

    it('should use custom logger', function(done) {
        var app = express();

        app.get('/', function(req, res, next) {
            next(new Error('ololo'));
        });

        var executed = false,
            logger = { error: function() { executed = true; } },
            errors = new Errors(app, { logger: logger });

        assert.strictEqual(logger.error, errors._logger.error);

        var server = app.listen(3000, function() {
            request.get('http://127.0.0.1:3000', function(error, response) {
                assert.equal(response.statusCode, 500);
                assert.ok(executed);
                server.close(function() { done(); });
            });
        });

    });

    it('should return 404', function(done) {
        var app = express();

        app.get('/', function(req, res, next) {
            next(new notFound());
        });

        var errors = new Errors(app),
            notFound = errors.get('notFound');

        var server = app.listen(3001, function() {
            request.get('http://127.0.0.1:3001', function(error, response) {
                assert.equal(response.statusCode, 404);

                server.close(function() { done(); });
            });
        });

    });
});
