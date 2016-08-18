(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
"use strict";

var _prototypeProperties = function (child, staticProps, instanceProps) { if (staticProps) Object.defineProperties(child, staticProps); if (instanceProps) Object.defineProperties(child.prototype, instanceProps); };

var mixins = require("../..");

// define a mixin behavior
var mixIntoGameObject = mixins({
    // this can only be defined once, will throw otherwise
    render: mixins.ONCE,

    // can be defined in the source and mixins
    // only the source return value will be returned
    // the mixin function is called first (as in all of the following except REDUCE_LEFT)
    onClick: mixins.MANY,

    // like MANY but expects objects to be returned
    // which will be merged with the other objects
    // will throw when duplicate keys are found
    getState: mixins.MANY_MERGED,

    // TODO: this isn't currently implemented, PR welcome (or I'll get around to it)
    // like MANY_MERGED but also handles arrays, and non-function properties
    // the behavior expressed in pseudo pattern matching syntax:
    //  undefined, y:any => y
    //  x:any, undefined => x
    //  x:Array, y:Array => x.concat(y)
    //  x:Object, y:Object => merge(x, y) // key conflicts cause error
    //  _, _ => THROWS
    getSomething: mixins.MANY_MERGED_LOOSE,

    // this calls the next function with the return value of
    // the previous
    // if not present the default value is the identity function
    // in REDUCE_LEFT this looks like mixinFn(sourceFn(...args));
    // in REDUCE_RIGHT this looks like sourceFn(mixinFn(...args));
    // of course the `this` value is still preserved
    countChickens: mixins.REDUCE_LEFT,
    countDucks: mixins.REDUCE_RIGHT,

    // define your own handler for it
    // the two operands are the value of onKeyPress on each object
    // these could be functions, undefined, or in strange cases something else
    // don't forget to call them with `this` set correctly
    // here we allow event.stopImmediatePropagation() to prevent the next mixin from
    // being called
    // key is 'onKeyPress' here, this allows reuse of these functions
    // args is the arguments we were called with; treat it like an arraylike object
    // thrower is a special function which attempts to improve the error stack by including
    // the location where it was actually mixed in
    onKeyPress: function (left, right, key) {
        left = left || function () {};
        right = right || function () {};
        return function (args, thrower) {
            var event = args[0];

            if (!event) thrower(TypeError(key + " called without an event object"));

            var ret = left.apply(this, args);
            if (event && !event.immediatePropagationIsStopped) {
                var ret2 = right.apply(this, args);
            }
            return ret || ret2;
        };
    }
}, {
    // optional extra arguments and their defaults

    // what should we do when the function is unknown?
    // most likely ONCE or NEVER
    unknownFunction: mixins.ONCE,

    // what should we do when there's a non-function property?
    // this function isn't exposed but the signature is (left, right, key) => any, with this pattern:
    //  undefined, y => y
    //  x, undefined => x
    //  _, _ => THROWS
    // note: it doesn't need to return a function
    nonFunctionProperty: "INTERNAL"
});


// simple usage example
var mixin = {
    getState: function getState(foo) {
        return { bar: foo + 1 };
    }
};

var Duck = (function () {
    function Duck() {}

    _prototypeProperties(Duck, null, {
        render: {
            value: function render() {
                console.log(this.getState(5)); // {baz: 4, bar: 6}
            },
            writable: true,
            configurable: true
        },
        getState: {
            value: function getState(foo) {
                return { baz: foo - 1 };
            },
            writable: true,
            configurable: true
        }
    });

    return Duck;
})();

// apply the mixin
mixIntoGameObject(Duck.prototype, mixin);

new Duck().render();

},{"../..":2}],2:[function(require,module,exports){
"use strict";

var objToStr = function (x) {
    return Object.prototype.toString.call(x);
};

var mixins = module.exports = function makeMixinFunction(rules, _opts) {
    var opts = _opts || {};
    if (!opts.unknownFunction) {
        opts.unknownFunction = mixins.ONCE;
    }

    if (!opts.nonFunctionProperty) {
        opts.nonFunctionProperty = function (left, right, key) {
            if (left !== undefined && right !== undefined) {
                var getTypeName = function (obj) {
                    if (obj && obj.constructor && obj.constructor.name) {
                        return obj.constructor.name;
                    } else {
                        return objToStr(obj).slice(8, -1);
                    }
                };
                throw new TypeError("Cannot mixin key " + key + " because it is provided by multiple sources, " + "and the types are " + getTypeName(left) + " and " + getTypeName(right));
            }
        };
    }

    // TODO: improve
    var thrower = function (error) {
        throw error;
    };

    return function applyMixin(source, mixin) {
        Object.keys(mixin).forEach(function (key) {
            var left = source[key],
                right = mixin[key],
                rule = rules[key];

            // this is just a weird case where the key was defined, but there's no value
            // behave like the key wasn't defined
            if (left === undefined && right === undefined) return;

            var wrapIfFunction = function (thing) {
                return typeof thing !== "function" ? thing : function () {
                    return thing.call(this, arguments, thrower);
                };
            };

            // do we have a rule for this key?
            if (rule) {
                // may throw here
                var fn = rule(left, right, key);
                source[key] = wrapIfFunction(fn);
                return;
            }

            var leftIsFn = typeof left === "function";
            var rightIsFn = typeof right === "function";

            // check to see if they're some combination of functions or undefined
            // we already know there's no rule, so use the unknown function behavior
            if (leftIsFn && right === undefined || rightIsFn && left === undefined || leftIsFn && rightIsFn) {
                // may throw, the default is ONCE so if both are functions
                // the default is to throw
                source[key] = wrapIfFunction(opts.unknownFunction(left, right, key));
                return;
            }

            // we have no rule for them, one may be a function but one or both aren't
            // our default is MANY_MERGED_LOOSE which will merge objects, concat arrays
            // and throw if there's a type mismatch or both are primitives (how do you merge 3, and "foo"?)
            source[key] = opts.nonFunctionProperty(left, right, key);
        });
    };
};

// define our built-in mixin types
mixins.ONCE = function (left, right, key) {
    if (left && right) {
        throw new TypeError("Cannot mixin " + key + " because it has a unique constraint.");
    }

    var fn = left || right;

    return function (args) {
        return fn.apply(this, args);
    };
};

mixins.MANY = function (left, right, key) {
    return function (args) {
        if (right) right.apply(this, args);
        return left ? left.apply(this, args) : undefined;
    };
};

mixins.MANY_MERGED = function (left, right, key) {
    return function (args, thrower) {
        var res1 = right && right.apply(this, args);
        var res2 = left && left.apply(this, args);
        if (res1 && res2) {
            var assertObject = function (obj, obj2) {
                var type = objToStr(obj);
                if (type !== "[object Object]") {
                    var displayType = obj.constructor ? obj.constructor.name : "Unknown";
                    var displayType2 = obj2.constructor ? obj2.constructor.name : "Unknown";
                    thrower("cannot merge returned value of type " + displayType + " with an " + displayType2);
                }
            };
            assertObject(res1, res2);
            assertObject(res2, res1);

            var result = {};
            Object.keys(res1).forEach(function (k) {
                if (Object.prototype.hasOwnProperty.call(res2, k)) {
                    thrower("cannot merge returns because both have the " + JSON.stringify(k) + " key");
                }
                result[k] = res1[k];
            });

            Object.keys(res2).forEach(function (k) {
                // we can skip the conflict check because all conflicts would already be found
                result[k] = res2[k];
            });
            return result;
        }
        return res2 || res1;
    };
};


mixins.REDUCE_LEFT = function (_left, _right, key) {
    var left = _left || function () {
        return x;
    };
    var right = _right || function (x) {
        return x;
    };
    return function (args) {
        return right.call(this, left.apply(this, args));
    };
};

mixins.REDUCE_RIGHT = function (_left, _right, key) {
    var left = _left || function () {
        return x;
    };
    var right = _right || function (x) {
        return x;
    };
    return function (args) {
        return left.call(this, right.apply(this, args));
    };
};

},{}]},{},[1])