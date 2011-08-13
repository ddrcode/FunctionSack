module('fns.type module');


test('Function: fns.type.getClassName', 14, function() {
    equals( typeof fns.type.getClassName, "function" );
    
    equals( fns.type.getClassName(), "Undefined" );
    equals( fns.type.getClassName(1), "Number" );
    equals( fns.type.getClassName(new Number(1)), "Number" );
    equals( fns.type.getClassName(false), "Boolean" );
    equals( fns.type.getClassName(new Boolean(false)), "Boolean" );
    equals( fns.type.getClassName("abc"), "String" );
    equals( fns.type.getClassName(new String("abc")), "String" );
    equals( fns.type.getClassName(function(){}), "Function" );
    equals( fns.type.getClassName({}), "Object" );
    equals( fns.type.getClassName(/.+/), "RegExp" );
    equals( fns.type.getClassName(new Date()), "Date" );
    equals( fns.type.getClassName(undefined), "Undefined" );
    equals( fns.type.getClassName(null), "Null" );
    
});


test('Function: fns.type.getConstructorName', 20, function() {
    equals( typeof fns.type.getConstructorName, "function" );
    
    equals( fns.type.getConstructorName(), "undefined" );
    equals( fns.type.getConstructorName(1), "number" );
    equals( fns.type.getConstructorName(new Number(1)), "Number" );
    equals( fns.type.getConstructorName(false), "boolean" );
    equals( fns.type.getConstructorName(new Boolean(false)), "Boolean" );
    equals( fns.type.getConstructorName("abc"), "string" );
    equals( fns.type.getConstructorName(new String("abc")), "String" );
    equals( fns.type.getConstructorName(function(){}), "Function" );
    equals( fns.type.getConstructorName({}), "Object" );
    equals( fns.type.getConstructorName(/.+/), "RegExp" );
    equals( fns.type.getConstructorName(new Date()), "Date" );
    equals( fns.type.getConstructorName(undefined), "undefined" );
    equals( fns.type.getConstructorName(null), "null" );
    equals( fns.type.getConstructorName(null), "null" );
    
    function Test (){}
    var test = new Test();
    equals( fns.type.getConstructorName(test), "Test" );
    
    Test = function(){};
    test = new Test(); 
    equals( fns.type.getConstructorName(test), "Object*" );
    equals( fns.type.getConstructorName(test, "not-recognized"), "not-recognized" );
    
    equals( fns.type.getConstructorName(document), "HTMLDocument" );
    equals( fns.type.getConstructorName(window), "Window" );
});



test('Function: fns.type.isArray', 6, function() {
    equals( typeof fns.type.isArray, "function" );
    equals( fns.type.isArray([]), true );
    equals( fns.type.isArray(arguments), false );
    equals( fns.type.isArray("test"), false );
    equals( fns.type.isArray(null), false );
    equals( fns.type.isArray(), false );
});



test('Function: fns.type.isBoolean', 6, function() {
    equals( typeof fns.type.isBoolean, "function" );
    equals( fns.type.isBoolean(false), true );
    equals( fns.type.isBoolean(new Boolean(true)), true);
    equals( fns.type.isBoolean("abc"), false );
    equals( fns.type.isBoolean(null), false );
    equals( fns.type.isBoolean(), false );
});



test('Function: fns.type.isDate', 6, function() {
    equals( typeof fns.type.isDate, "function" );
    equals( fns.type.isDate(new Date()), true );
    equals( fns.type.isDate(+new Date()), false);
    equals( fns.type.isDate("abc"), false );
    equals( fns.type.isDate(null), false );
    equals( fns.type.isDate(), false );
});



test('Function: fns.type.isError', 12, function() {
    equals( typeof fns.type.isError, "function" );
    equals( fns.type.isError(new Error()), true );
    equals( fns.type.isError(new TypeError()), true );
    equals( fns.type.isError(new URIError()), true );
    equals( fns.type.isError(new RangeError()), true );
    equals( fns.type.isError(new ReferenceError()), true );
    equals( fns.type.isError(new EvalError()), true );
    equals( fns.type.isError(new SyntaxError()), true );
    equals( fns.type.isError(function(){}), false);
    equals( fns.type.isError("abc"), false );
    equals( fns.type.isError(null), false );
    equals( fns.type.isError(), false );
});



test('Function: fns.type.isFalsy', function() {
    strictEqual( typeof fns.type.isFalsy, "function" );
    strictEqual( fns.type.isFalsy(), true );
    strictEqual( fns.type.isFalsy(false), true );
    strictEqual( fns.type.isFalsy(""), true );
    strictEqual( fns.type.isFalsy(0), true );
    strictEqual( fns.type.isFalsy(NaN), true );
    strictEqual( fns.type.isFalsy(null), true );
    strictEqual( fns.type.isFalsy(void 0), true );
    strictEqual( fns.type.isFalsy("   "), false );
    strictEqual( fns.type.isFalsy("\n\t\r"), false );
    strictEqual( fns.type.isFalsy(new Boolean(false)), true );

    strictEqual( fns.type.isFalsy({}), false );
    strictEqual( fns.type.isFalsy(true), false );
    strictEqual( fns.type.isFalsy("."), false );
    strictEqual( fns.type.isFalsy(1), false );
    strictEqual( fns.type.isFalsy(Infinity), false );
    strictEqual( fns.type.isFalsy([]), false );
    strictEqual( fns.type.isFalsy(function(){}), false );
    strictEqual( fns.type.isFalsy(" !  "), false );
    strictEqual( fns.type.isFalsy("\n\ta\r"), false );
    strictEqual( fns.type.isFalsy(new Boolean(true)), false );
    
});



test('Function: fns.type.isFunction', 7, function() {
    equals( typeof fns.type.isFunction, "function" );
    equals( fns.type.isFunction(function(){}), true );
    equals( fns.type.isFunction(/.+/), false );
    equals( fns.type.isFunction(123), false );
    equals( fns.type.isFunction(null), false );
    equals( fns.type.isFunction(), false );
    equals( fns.type.isFunction(RegExp), true );
});



test('Function: fns.type.isGlobal',  function() {
    equals( typeof fns.type.isGlobal, "function" );
    equals( fns.type.isGlobal(window), true );
    
    var w = window.open("", "test", "width=100,height=100");
    if( w ) {
        expect(7);
        equals( fns.type.isGlobal(w), false );
        equals( fns.type.isGlobal(w, false), true );
        w.close();
    }
    
    equals( fns.type.isGlobal("abc"), false );
    equals( fns.type.isGlobal(null), false );
    equals( fns.type.isGlobal(), false );
});



test('Function: fns.type.isNumber', 6, function() {
    equals( typeof fns.type.isNumber, "function" );
    equals( fns.type.isNumber(0), true );
    equals( fns.type.isNumber(new Number(1)), true);
    equals( fns.type.isNumber("abc"), false );
    equals( fns.type.isNumber(null), false );
    equals( fns.type.isNumber(), false );
});



test('Function: fns.type.isObject', 12, function() {
    equals( typeof fns.type.isObject, "function" );
    equals( fns.type.isObject(function(){}), true );
    equals( fns.type.isObject(function(){}, false), false );
    equals( fns.type.isObject(/.+/), true );
    equals( fns.type.isObject(/.+/, false), true );
    equals( fns.type.isObject({}), true );
    equals( fns.type.isObject("abc"), false );
    equals( fns.type.isObject(123), false );
    equals( fns.type.isObject(new Number(123)), true );
    equals( fns.type.isObject(null), false );
    equals( fns.type.isObject(null,true,true), true );
    equals( fns.type.isObject(), false );
});



test('Function: fns.type.isRegExp', 7, function() {
    equals( typeof fns.type.isRegExp, "function" );
    equals( fns.type.isRegExp(/.+/), true );
    equals( fns.type.isRegExp(new RegExp(".+")), true);
    equals( fns.type.isRegExp(55), false );
    equals( fns.type.isRegExp(function(){}), false );
    equals( fns.type.isRegExp(null), false );
    equals( fns.type.isRegExp(), false );
});



test('Function: fns.type.isStandardType', 17, function() {
    strictEqual( typeof fns.type.isStandardType, "function" );
    
    strictEqual( fns.type.isStandardType(), true );
    strictEqual( fns.type.isStandardType(1), true );
    strictEqual( fns.type.isStandardType("abc"), true );
    strictEqual( fns.type.isStandardType(false), true );
    
    strictEqual( fns.type.isStandardType(null), true );
    strictEqual( fns.type.isStandardType(function(){}), true );
    strictEqual( fns.type.isStandardType(new Number(1)), true );
    strictEqual( fns.type.isStandardType(new String("11")), true );
    strictEqual( fns.type.isStandardType(new Boolean(false)), true );
    strictEqual( fns.type.isStandardType(new RegExp("/.+/")), true );
    strictEqual( fns.type.isStandardType(new Date()), true );
    strictEqual( fns.type.isStandardType(new Error()), true );
    strictEqual( fns.type.isStandardType([]), true );
    
    strictEqual( fns.type.isStandardType(new Object()), false );
    strictEqual( fns.type.isStandardType(window), false );
    strictEqual( fns.type.isStandardType({}), false );
});



test('Function: fns.type.isString', 6, function() {
    equals( typeof fns.type.isString, "function" );
    equals( fns.type.isString(""), true );
    equals( fns.type.isString(new String()), true);
    equals( fns.type.isString(123), false );
    equals( fns.type.isString(null), false );
    equals( fns.type.isString(), false );
});



test('Function: fns.type.isWrapper', 11, function() {
    strictEqual( typeof fns.type.isWrapper, "function" );
    
    strictEqual( fns.type.isWrapper(new String("")), true );
    strictEqual( fns.type.isWrapper(new Number(123)), true );
    strictEqual( fns.type.isWrapper(new Boolean(false)), true );
    
    strictEqual( fns.type.isWrapper([]), false );
    strictEqual( fns.type.isWrapper({}), false );
    strictEqual( fns.type.isWrapper(), false );
    strictEqual( fns.type.isWrapper(null), false );
    strictEqual( fns.type.isWrapper(122), false );
    strictEqual( fns.type.isWrapper("abc"), false );
    strictEqual( fns.type.isWrapper(false), false );
    
});



test('Function: fns.type.typeOf', 15, function() {
    equals( typeof fns.type.typeOf, "function" );
    
    equals( fns.type.typeOf(), "undefined" );
    equals( fns.type.typeOf(1), "number" );
    equals( fns.type.typeOf(new Number(1)), "number" );
    equals( fns.type.typeOf(false), "boolean" );
    equals( fns.type.typeOf(new Boolean(false)), "boolean" );
    equals( fns.type.typeOf("abc"), "string" );
    equals( fns.type.typeOf(new String("abc")), "string" );
    equals( fns.type.typeOf(function(){}), "function" );
    equals( fns.type.typeOf({}), "object" );
    equals( fns.type.typeOf(/.+/), "object" );
    equals( fns.type.typeOf(new Date()), "object" );
    equals( fns.type.typeOf(undefined), "undefined" );
    equals( fns.type.typeOf(null), "null" );
    equals( fns.type.typeOf(null, true), "object" );
    
});
