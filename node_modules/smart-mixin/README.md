![travis](https://travis-ci.org/brigand/smart-mixin.svg)

Mixins with smart merging strategies and errors over silent failure.

Install with one of:

```sh
# recommended
npm install --save smart-mixin

# will expose window.smartMixin or the smartMixin AMD module
curl 'wzrd.in/standalone/smart-mixin@1' > vendor/smart-mixin.js 
```

Usage:

```js
var mixins = require('smart-mixin');

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
    onKeyPress: function(left, right, key) {
        left = left || function(){};
        right = right || function(){};
        return function(args, thrower){
            var event = args[0];

            if (!event) thrower(TypeError(key + ' called without an event object'));

            var ret = left.apply(this, args);
            if (event && !event.immediatePropagationIsStopped) {
                var ret2 = right.apply(this, args);    
            }
            return ret || ret2;
        }
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
    getState(foo){
        return {bar: foo+1}    
    }
};

class Duck {
    render(){
        console.log(this.getState(5)); // {baz: 4, bar: 6}
    }

    getState(foo){
        return {baz: foo - 1}
    }
}

// apply the mixin
mixIntoGameObject(Duck.prototype, mixin);

// use it
new Duck().render();
```

# That's it

Nothing too crazy, this was mostly built for use in react-class-mixins, but hopefully
is useful to other people.  I'll be adding more test coverage (the mixin.FN apis are fully tested, but not the actual mixin function).  Any bug reports will be fixed ASAP.

# License

MIT
