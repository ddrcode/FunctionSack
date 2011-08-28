module( "fns.core module" );


test( "fns.mixin", 9, function(){
	equals( typeof fns.mixin, "function", "Function existence verification" );
	
	var test = {};
	var out = fns.mixin( test, { a:1, b: "test"} );
	equals( test, out );
	equals( typeof test.a, 'number' );
	
	test = { a: 5, b: 5 };
	out = { b: 10, c: 10 };
	fns.mixin( test, out, { c:15, d: 15} );
	equals( test.a, 5 );
	equals( test.b, 10 );
	equals( test.c, 15 );
	equals( test.d, 15 );
	
	out = fns.mixin( test );
	equals( test, out );
	equals( fns.mixin(), void 0 );
	
});


test( "fns.toArray", 19, function(){

	equals( typeof fns.toArray, "function", "Function existence verification" );
	
	// conversion test
	equals( typeof fns.toArray(arguments), "object" ); //2
	var arr = (function(){ return fns.toArray(arguments); })("a","b","c","d","e","f");
	equals( arr[2], 'c' );
	equals( Object.prototype.toString.call(arr), '[object Array]' );
	equals( arr.length, 6 );
	
	arr = fns.toArray( document.body.childNodes );
	equals( arr.length, document.body.childNodes.length ); // 6
	ok( typeof arr[0] !== "undefined" );
	equals( arr[0], document.body.childNodes[0] );
	
	arr = fns.toArray( {a:1, b:"test"} );
	equals( arr.length, 1 ); // 9
	equals( typeof arr[0], "object" );
	
	arr = fns.toArray( 42 );
	equals( arr.length, 1 );	
	equals( typeof arr[0], "number" );
	
	// parameters test
	arr = fns.toArray( "abcdef", 2 );
	equals( arr.length, 0 );
	arr = fns.toArray( "abcdef", 0,2 );
	equals( arr.length, 1 );
	arr = (function(){ return fns.toArray(arguments, 2); })("a","b","c","d","e","f");
	equals( arr.join(""), "cdef" );
    arr = (function(){ return fns.toArray(arguments, 1, 3); })("a","b","c","d","e","f");
    equals( arr.join(""), "bc" );
	
	// object test
	arr = fns.toArray({ length: 10 });
	equals( arr.length, 10 );
	arr = fns.toArray({ length: 10, "5": 'a' });
	equals( arr[5], 'a' );
	var F = function(){};
	F.prototype["4"] = "a";
	var f = new F();
	f.length = 10;
	arr = fns.toArray( f );
	equals( arr[4], 'a' );
});


test( "fns.bind", 6, function(){
	equals( typeof fns.bind, "function", "Function existence verification" );
	
	var obj = { msg: "in", test: function(txt){ return txt || this.msg;} };
	var fun1 = fns.bind(obj.test, obj );
	var fun2 = fns.bind(obj.test, obj, "out" );
	
	ok( fun1() === "in", "fun1 with no param" );
	ok( fun1("out") === "out", "fun1 with 'out' param" );
	ok( fun2() === "out", "fun2 with no param" );
	ok( fun2() === "out", "fun2 with param" );

	raises(
			function(){obj.msg.bind.call(new Object());},
			TypeError, "obj.msg.bind.call(new Object()) should throw an error" );	
} );

