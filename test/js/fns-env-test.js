module('fns.env module');


test('env module - browser test', function() {
    strictEqual( fns.env.DOM, true );
    strictEqual( fns.env.COMMON_JS, false );
    strictEqual( fns.env.RHINO, false );
    strictEqual( fns.env.NODE_JS, false );
});


test('env module - generic test', function() {
    strictEqual( typeof fns.env.E4X, "boolean" );
    strictEqual( typeof fns.env.JS_VERSION, "string" );
    ok( fns.env.JS_VERSION.indexOf("1.") >= 0 );
    strictEqual( fns.env.isJSVersion("1.0"), true );
    strictEqual( fns.env.isJSVersion("1"), true );
    strictEqual( typeof fns.env.ES_VERSION, "number" );
    strictEqual( typeof fns.env.ECMA_SCRIPT_5_METHODS, "boolean" );
    strictEqual( typeof fns.env.STRICT_MODE, "boolean" );
});


test('Function: env.toString', 1, function() {
	equals( typeof fns.env.toString, "function" );
});


test('Function: env.getFeatureVersion', function() {
    var f = fns.env.getFeatureVersion(window, "isNaN");
    equals( typeof f, "object" );
    equals( typeof f.ES, "number" );
    equals( f.ES, 2 );
    var f = fns.env.getFeatureVersion(Object, "getOwnPropertyNames");
    equals( f.ES, 5 );
    var f = fns.env.getFeatureVersion(Object.prototype, "toSource");
    equals( f.ES, -1 );
});





