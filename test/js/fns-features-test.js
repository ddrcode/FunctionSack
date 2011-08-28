module( "fns-features" );

function notRaises(block, message) {
	var isOK = true;
	try {
		block();
	} catch(ex) {
		alert("sdddd");
		isOK = false;
	}
	ok(isOK, message);
	return isOK;
}

test("Features required for core.toArray", 6, function(){
	var arr;
	try {
		arr = Array.prototype.slice.call("abcd");
		expect(8);
		ok( true, 'Array.prototype.slice.call("abcd") does not raise error' );
		equals( Object.prototype.toString.call(arr), "[object Array]", 'typeof Array.prototype.slice.call("abcd")' );
		equals( arr[0], "a", 'Array.prototype.slice.call("abcd")[0] === "a"' );
	} catch(ex) {
		ok( false, 'Array.prototype.slice.call("abcd") does not raise error' );
	}
	
	arr = [1,2,3,4].slice(undefined);
	equals( arr.length, 4, "[1,2,3,4].slice(undefined).length === 4");
	arr = [1,2,3,4].slice(undefined, undefined);
	equals( arr.length, 4, "[1,2,3,4].slice(undefined, undefined).length === 4");
	
	try {
		arr = Array.prototype.slice.call({x:1});
		expect(9);
		ok( true, "Array.prototype.slice.call({x:1}) does not raise error" );
		equals( Object.prototype.toString.call(arr), "[object Array]", "typeof Array.prototype.slice.call({})" );
	} catch(ex) {
		ok( false, "Array.prototype.slice.call({x:1}) does not raise error" );
	}
	
	var dom = document.body.childNodes;
	try {
		arr = Array.prototype.slice.call(dom);
		expect(10);
		ok( true, "Array.prototype.slice.call(document.body.childNodes) does not raise error" );
		equals( Object.prototype.toString.call(arr), "[object Array]", "typeof Array.prototype.slice.call(document.body.childNodes)" );
	} catch(ex) {
		ok( false, "Array.prototype.slice.call(document.body.childNodes) does not raise error" );
	}	
	
	try {
		var val = dom.hasOwnProperty("0");
		ok(true, 'dom.hasOwnProperty("0") does not raise error');
	} catch(ex){
		ok(false, 'dom.hasOwnProperty("0") does not raise error');
	}
});


test("Features required for __notEnumerableProperties (from es5)", 2, function(){
	equals( typeof Object.prototype.propertyIsEnumerable, "function", "Object.prototype.propertyIsEnumerable" );
	equals( typeof window.propertyIsEnumerable, "function", "window.propertyIsEnumerable" );
});


test("Browser detection", 3, function(){
	equals( typeof window.propertyIsEnumerable, "function", "typeof window.propertyIsEnumerable==='function' should fail on IE" );
	equals( typeof window.hasOwnProperty, "function", "typeof window.hasOwnProperty==='function' should fail on IE" );
	equals( Object.prototype.toString.call(window), "[object Window]", "Object.prototype.toString.call(document) === '[object Window]'" );
});


test("ECMAScript 3 Compatibility test", function(){
	equals( typeof Object.prototype.propertyIsEnumerable, "function", "Object.prototype.propertyIsEnumerable" );
	equals( typeof Array.prototype.splice, "function", "Array.prototype.splice" );
});