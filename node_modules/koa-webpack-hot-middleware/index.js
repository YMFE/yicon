var webpackHotMiddleware = require('webpack-hot-middleware');

function middleware(doIt, req, res) {
    var originalEnd = res.end;
    return function(done) {
        res.end = function() {
            originalEnd.apply(this, arguments);
            done(null, 0);
        };
        doIt(req, res, function() {
            done(null, 1);
        });
    };
}

module.exports = function(compiler, option) {
    var action = webpackHotMiddleware(compiler, option);
    return function* (next) {
        var nextStep = yield middleware(action, this.req,  this.res);
        if (nextStep && next) {
            yield* next;
        }
    };
};
