module('fns.obj module');



test('Function: obj.access', 40, function() {
    var undefined = void 0;
    strictEqual( typeof fns.obj.access, "function" );
    
    var obj = { name: "me" };
    strictEqual( fns.obj.access(obj, "name"), "me" );
    strictEqual( fns.obj.access(obj, "firstname"), undefined );
    strictEqual( fns.obj.access([1,2,3], 1), 2 );
    strictEqual( fns.obj.access([1], "[0]"), 1 );
    
    obj = {
        name: "test",
        addresses: [
             { country: "Iceland" },
             { street: "Queensway", country: "UK", city: "London" }
          ],
        skills: {
            languages: ["English", "Gaelic"],
            drivingLicense: true
        }
    };
    
    strictEqual( fns.obj.access(obj, "name"), "test" );
    strictEqual( fns.obj.access(obj, "addresses.0.country"), "Iceland" );
    strictEqual( fns.obj.access(obj, "addresses.0.city"), undefined );
    strictEqual( fns.obj.access(obj, "addresses.1.city"), "London" );
    strictEqual( fns.obj.access(obj, "addresses.5.city.district"), undefined );
    strictEqual( fns.obj.access(obj, "skills.languages.0"), "English" );
    strictEqual( fns.obj.access(obj, "skills.drivingLicense"), true );
    strictEqual( fns.obj.access(obj, "person.skills.drivingLicense"), undefined );
    
    strictEqual( fns.obj.access(obj, "addresses[0].country"), "Iceland" );
    strictEqual( fns.obj.access(obj, "skills.languages[1]"), "Gaelic" );
    strictEqual( fns.obj.access(obj, "skills[drivingLicense]"), true );
    strictEqual( fns.obj.access(obj, "skills[not-existing]"), undefined );
    strictEqual( fns.obj.access(obj, "[name]"), "test" );
    
    strictEqual( fns.obj.access({}, "skills.drivingLicense"), undefined );
    strictEqual( fns.obj.access(1, "skills.drivingLicense"), undefined );
    strictEqual( fns.obj.access("abc", "skills.drivingLicense"), undefined );
    strictEqual( fns.obj.access(null, "skills.drivingLicense"), null );
    strictEqual( fns.obj.access(undefined, "skills.drivingLicense"), undefined );
    
    // falsy values
    obj = { zero: 0, x: [0, false, null, undefined], y: { str: "" } };
    strictEqual( fns.obj.access({}), undefined );
    strictEqual( fns.obj.access(), undefined);
    strictEqual( fns.obj.access(obj, "zero"), 0 );
    strictEqual( fns.obj.access(obj, "x.0"), 0 );
    strictEqual( fns.obj.access(obj, "x.1"), false );
    strictEqual( fns.obj.access(obj, "x.2"), null );
    strictEqual( fns.obj.access(obj, "x.3"), undefined );
    strictEqual( fns.obj.access(obj, "y.str"), "" );
    
    // default values
    strictEqual( fns.obj.access({},undefined,1), 1);
    strictEqual( fns.obj.access(undefined,undefined,1), 1 );
    strictEqual( fns.obj.access(obj, "zero", 1), 0 );
    strictEqual( fns.obj.access(obj, "x.0", 1), 0 );
    strictEqual( fns.obj.access(obj, "x.1", 1), false );
    strictEqual( fns.obj.access(obj, "x.2", 1), null );
    strictEqual( fns.obj.access(obj, "x.3", 1), 1 );
    strictEqual( fns.obj.access(obj, "y.str", 1), "" );
    strictEqual( fns.obj.access({}, "test.0.value", 1), 1 );    
    
});


test('Function: obj.clone', 5, function() {
    equals( typeof fns.obj.clone, "function" );
    
    var obj = { x: 1, y: 2, c: [] };
    var clone = fns.obj.clone(obj);
    
    strictEqual(clone.x, 1);
    strictEqual(clone.hasOwnProperty("x"), false);
    strictEqual(obj.c, clone.c );
    if( Object.getPrototypeOf ) {
        expect(6);
        strictEqual(Object.getPrototypeOf(clone),obj, "Reason for fail can be not full support from Object.getPrototypeOf method (ES3 environment)");
    }
    
    obj = function(){};
    clone = fns.obj.clone(obj);
    if( Object.getPrototypeOf ) {
        expect(7);
        strictEqual(Object.getPrototypeOf(clone),obj, "Reason for fail can be not full support from Object.getPrototypeOf method (ES3 environment)");
    }    
    raises(clone, TypeError);
        
});



test('Function: obj.contains', 18, function() {
    strictEqual( typeof fns.obj.contains, "function" );
    
    var obj = { x: 5, y: null, z: undefined };
    strictEqual( fns.obj.contains(obj,"x"), true  );
    strictEqual( fns.obj.contains(obj,"y"), true  );
    strictEqual( fns.obj.contains(obj,"z"), true  );
    strictEqual( fns.obj.contains(obj,"v"), false );
    strictEqual( fns.obj.contains(obj,"toString"), false  );
    strictEqual( fns.obj.contains(obj,"toString", true), true );
    
    strictEqual( fns.obj.contains(Array.prototype,"slice"), true );
    strictEqual( fns.obj.contains(Array.prototype,"slice", false), true );
    strictEqual( fns.obj.contains(Array.prototype,"slice", false, true), false );
    strictEqual( fns.obj.contains(Array.prototype,"slice", true, true), false );
    
    strictEqual( fns.obj.contains([0],"0"), true );
    strictEqual( fns.obj.contains([0],0), true );
    strictEqual( fns.obj.contains([0],/.+/), false );
    
    strictEqual( fns.obj.contains(new String("abc"),1), true );
    
    raises( function(){fns.obj.contains(5);}, TypeError );
    raises( function(){fns.obj.contains(null);}, TypeError );
    raises( function(){fns.obj.contains();}, TypeError );    
   
});


test('Function: obj.deepEqual', 34, function() {
    equals( typeof fns.obj.deepEqual, "function" );
    var a = {};
    var b = {};
   
    // deep compare without deep objects (switch test)
    a = {}; b = {};
    ok( fns.obj.deepEqual(a,b) );
    a.x = 5; b.x = 5;
    ok( fns.obj.deepEqual(a,b) );
    a = {x:1, y:"a", z: false};
    a = {x:1, y:"a", z: false, q:null};
    ok( ! fns.obj.deepEqual(a,b) );
    ok( fns.obj.deepEqual(5, 5) );
    ok( fns.obj.deepEqual("a", "a") );
    ok( fns.obj.deepEqual(true, true) );
    ok( ! fns.obj.deepEqual(5, new Number(5)) );
    ok( ! fns.obj.deepEqual(new String("aa"), "aa") );
    ok( fns.obj.deepEqual(a,a, true) );
    
    // deep compare with deep objects
    a = { x: 1, y: { z: 5}  };
    b = { x: 1, y: { z: 5}  };
    ok( fns.obj.deepEqual(a,b) );
    
    a = { x: 1, y: [1,2,3,4,5]  };
    b = { x: 1, y: [1,2,3,4,5]  };   
    ok( fns.obj.deepEqual(a,b) );
    
    b.y.push(6);
    ok( ! fns.obj.deepEqual(a,b) );
    
    a.y.push(6);
    ok( fns.obj.deepEqual(a,b) );
    
    a.mth = function(){};
    b.mth = function(){};
    ok( fns.obj.deepEqual(a,b) );
    
    a.mth = b.mth;
    ok( fns.obj.deepEqual(a,b) );
    
    a = [[[[[[[[{x:55}],[1,2,3]]]],2]]]];
    b = [[[[[[[[{x:55}],[1,2,3]]]],2]]]];
    ok( fns.obj.deepEqual(a,b) );
    
    a = [[[[[[[[{x:55}],[1,2,3]]]],2]]]];
    b = [[[[[[[[{x:55}],[1,2.1,3]]]],2]]]];    
    ok( ! fns.obj.deepEqual(a,b) );
    
    // circular dependencies
    a = {};
    a.x = a;
    b = { x: a };
    ok( fns.obj.deepEqual(a,b, true) );
    
    // standard objects
    
    ok( fns.obj.deepEqual(new String("abc"), new String("abc")) );
    ok( ! fns.obj.deepEqual(new String("abcd"), new String("abc")) );
    ok( ! fns.obj.deepEqual(new String("abc"), new String("abcd")) );
    ok( ! fns.obj.deepEqual(new String("abc"), new Number(0)) );
    ok( fns.obj.deepEqual(/.+/g, /.+/g) );
    ok( ! fns.obj.deepEqual(/.+/g, /.+/) );
    ok( ! fns.obj.deepEqual(/.+/, /.*/) );
    
    a = { x: new Number(32), y: [1,2,3, new String("a"), /.+/ ] };
    b = { x: new Number(32), y: [1,2,3, new String("a"), /.+/ ] };
    ok( fns.obj.deepEqual(a, b) );
    b = { x: new Number(32), y: [1,2,3, new String("a"), /.+/g ] };
    ok( ! fns.obj.deepEqual(a, b) );
    
    // functions
    ok( fns.obj.deepEqual(function(){}, function(){}) );
    a = { x: function(){} }; b = { x: function(){} };
    ok( fns.obj.deepEqual(a, b) );
    
    a.x.q = 5;
    ok( ! fns.obj.deepEqual(a, b) );
    
    // length property
    a = { x: function(){} }; b = { x: function(a,b,c){} };
    ok( ! fns.obj.deepEqual(a, b) );
    
    a = { x: new Array(5) }; b = { x: new Array(6) };
    ok( ! fns.obj.deepEqual(a, b) );
    a = { x: new Array(5) }; b = { x: new Array(5) };
    ok( fns.obj.deepEqual(a, b) );    
});



test('Function: obj.equals', 50, function() {
    strictEqual( typeof fns.obj.equals, "function" );
    var a = {};
    var b = {};
    
    // shallow compare
    ok( fns.obj.equals(a,b) );
    a.x = 5; b.x = 5;
    ok( fns.obj.equals(a,b) );
    var arr = [1,2,3];
    a.y = arr; b.y = arr;
    ok( fns.obj.equals(a,b) );
    a.z = []; b.z = [];
    ok( ! fns.obj.equals(a,b) );
    
    a = {x:1, y:"a", z: false};
    a = {x:1, y:"a", z: false, q:null};
    ok( ! fns.obj.equals(a,b) );
    
    // basic types and falsy values compare
    ok( fns.obj.equals(5, 5) );
    ok( fns.obj.equals("a", "a") );
    ok( fns.obj.equals(true, true) );
    ok( ! fns.obj.equals(5, new Number(5)) );
    ok( ! fns.obj.equals(new String("aa"), "aa") );
    ok( ! fns.obj.equals(5) );
    ok( fns.obj.equals() );
    ok( fns.obj.equals(a,a) );
    
    // deep compare without deep objects (switch test)
    a = {}; b = {};
    ok( fns.obj.equals(a,b, true) );
    a.x = 5; b.x = 5;
    ok( fns.obj.equals(a,b, true) );
    a = {x:1, y:"a", z: false};
    a = {x:1, y:"a", z: false, q:null};
    ok( ! fns.obj.equals(a,b, true) );
    ok( fns.obj.equals(5, 5, true) );
    ok( fns.obj.equals("a", "a", true) );
    ok( fns.obj.equals(true, true, true) );
    ok( ! fns.obj.equals(5, new Number(5), true) );
    ok( ! fns.obj.equals(new String("aa"), "aa", true) );
    ok( fns.obj.equals(a,a, true) );
    
    // deep compare with deep objects
    a = { x: 1, y: { z: 5}  };
    b = { x: 1, y: { z: 5}  };
    ok( fns.obj.equals(a,b, true) );
    
    a = { x: 1, y: [1,2,3,4,5]  };
    b = { x: 1, y: [1,2,3,4,5]  };   
    ok( fns.obj.equals(a,b, true) );
    
    b.y.push(6);
    ok( ! fns.obj.equals(a,b, true) );
    
    a.y.push(6);
    ok( fns.obj.equals(a,b, true) );
    
    a.mth = function(){};
    b.mth = function(){};
    ok( fns.obj.equals(a,b, true) );
    
    a.mth = b.mth;
    ok( fns.obj.equals(a,b, true) );
    
    a = [[[[[[[[{x:55}],[1,2,3]]]],2]]]];
    b = [[[[[[[[{x:55}],[1,2,3]]]],2]]]];
    ok( fns.obj.equals(a,b, true) );
    
    a = [[[[[[[[{x:55}],[1,2,3]]]],2]]]];
    b = [[[[[[[[{x:55}],[1,2.1,3]]]],2]]]];    
    ok( ! fns.obj.equals(a,b, true) );
    
    // circular dependencies
    a = {};
    a.x = a;
    b = { x: a };
    ok( fns.obj.equals(a,b, false) );
    ok( fns.obj.equals(a,b, true) );
    
    // standard objects
    
    ok( fns.obj.equals(new String("abc"), new String("abc"), true) );
    ok( ! fns.obj.equals(new String("abcd"), new String("abc"), true) );
    ok( ! fns.obj.equals(new String("abc"), new String("abcd"), true) );
    ok( ! fns.obj.equals(new String("abc"), new Number(0), true) );
    ok( fns.obj.equals(/.+/g, /.+/g, true) );
    ok( ! fns.obj.equals(/.+/g, /.+/, true) );
    ok( ! fns.obj.equals(/.+/, /.*/, true) );
    
    a = { x: new Number(32), y: [1,2,3, new String("a"), /.+/ ] };
    b = { x: new Number(32), y: [1,2,3, new String("a"), /.+/ ] };
    ok( fns.obj.equals(a, b, true) );
    b = { x: new Number(32), y: [1,2,3, new String("a"), /.+/g ] };
    ok( ! fns.obj.equals(a, b, true) );
    
    // functions
    ok( ! fns.obj.equals(function(){}, function(){}) );
    ok( fns.obj.equals(function(){}, function(){}, true) );
    a = { x: function(){} }; b = { x: function(){} };
    ok( ! fns.obj.equals(a, b, false) );
    ok( fns.obj.equals(a, b, true) );
    
    a.x.q = 5;
    ok( ! fns.obj.equals(a, b, true) );
    
    // length property
    a = { x: function(){} }; b = { x: function(a,b,c){} };
    ok( ! fns.obj.equals(a, b, true) );
    
    a = { x: new Array(5) }; b = { x: new Array(6) };
    ok( ! fns.obj.equals(a, b, true) );
    a = { x: new Array(5) }; b = { x: new Array(5) };
    ok( fns.obj.equals(a, b, true) );    
});



test('Function: obj.filter', function() {
    equals( typeof fns.obj.filter, "function" );
    var obj = { test: 23 };
    var subobj = fns.obj.filter(obj, function(name, type, descriptor, object){
            strictEqual( name, "test" );
            strictEqual( type, "number" );
            strictEqual( object, obj );
            ok( descriptor !== null );
            strictEqual( descriptor.writable, true );
            strictEqual( descriptor.enumerable, true );
            strictEqual( descriptor.configurable, true );
            strictEqual( descriptor.value, 23 );
            strictEqual( typeof descriptor, "object" );
            return true;
        });   
    
    strictEqual( typeof subobj, "object" );
    strictEqual( subobj.test, 23 );
    
     var person = {
               firstname: "John",
               lastname: "Ubot",
               getFullName: function(){ return this.firstname+" "+this.lastname; },
               age: 42,
               sex: "M"
            };  
                
     var subobj = fns.obj.filter(person, function(name, type, desc){
           return type !== "function" && /name/.test(name);
        });  
     
     strictEqual( typeof subobj, "object" );
     strictEqual( typeof subobj.firstname, "string" );     
     strictEqual( typeof subobj.lastname, "string" );
     strictEqual( typeof subobj.getFullName, "undefined" );
     strictEqual( typeof subobj.age, "undefined" );
     strictEqual( typeof subobj.sex, "undefined" );
     strictEqual( subobj.firstname, "John" );
     strictEqual( subobj.lastname, "Ubot" );
     
     raises(function(){
             fns.obj.filter(null, function(name, type, desc){
                 return type !== "function" && /name/.test(name);
              });           
         }, TypeError);
     raises(function(){ fns.obj.filter(); }, TypeError);     
});



test('Function: obj.filterPropertyNames', 17, function() {
    strictEqual( typeof fns.obj.filterPropertyNames, "function" );
    
    var obj = { test: 23 };
    var names = fns.obj.filterPropertyNames(obj, function(name, type, descriptor, object){
            strictEqual( name, "test" );
            strictEqual( type, "number" );
            strictEqual( object, obj );
            ok( descriptor !== null );
            strictEqual( descriptor.writable, true );
            strictEqual( descriptor.enumerable, true );
            strictEqual( descriptor.configurable, true );
            strictEqual( descriptor.value, 23 );
            strictEqual( typeof descriptor, "object" );
            return true;
        });
    
    strictEqual( names.length, 1 );
    strictEqual( names[0], "test" );

    var person = {
            firstname: "John",
            lastname: "Ubot",
            getFullName: function(){ return this.firstname+" "+this.lastname; },
            age: 42,
            sex: "M"
         };     
    var names = fns.obj.filterPropertyNames(person, function(name, type, desc){
        return type !== "function" && /name/.test(name);
     });      
    strictEqual( names.length,  2 );
    strictEqual( names[0],  "firstname" );
    strictEqual( names[1],  "lastname" );

    raises(function(){
        fns.obj.filterPropertyNames(null, function(name, type, desc){
            return type !== "function" && /name/.test(name);
         });           
    }, TypeError);
    raises(function(){ fns.obj.filterPropertyNames(); }, TypeError);   
});



test('Function: obj.getGlobal', 3, function() {
    equals( typeof fns.obj.getGlobal, "function" );
    strictEqual( fns.obj.getGlobal(), window );
    (function(){
        "strict mode";
        strictEqual( fns.obj.getGlobal(), window );
    })();
});



test('Function: obj.getLength', 11, function() {
    equals( typeof fns.obj.getLength, "function" );
    
    var obj = {};
    equals( fns.obj.getLength(obj), 0 );
    obj.x = 10;
    equals( fns.obj.getLength(obj), 1 );
    
    equals( fns.obj.getLength([]), 0 );
    equals( fns.obj.getLength([1,2,3]), 3 );
    
    obj = [1,2,3];
    obj.test = false;
    equals( fns.obj.getLength(obj), 4 );
    
    equals( fns.obj.getLength(new String("abcd")), 4 );
    equals( fns.obj.getLength(function(){}), 0 );
    
    raises( function(){fns.obj.getLength(5);}, TypeError );
    raises( function(){fns.obj.getLength(null);}, TypeError );
    raises( function(){fns.obj.getLength();}, TypeError );
});



test('Function: obj.isEmpty', 12, function() {
    equals( typeof fns.obj.isEmpty, "function" );
    
    strictEqual( fns.obj.isEmpty({}), true );
    strictEqual( fns.obj.isEmpty([]), true );
    strictEqual( fns.obj.isEmpty(new String("")), true );
    strictEqual( fns.obj.isEmpty(new Boolean(true)), true );
    strictEqual( fns.obj.isEmpty(new Number(1)), true );
    
    strictEqual( fns.obj.isEmpty({a:1}), false );
    strictEqual( fns.obj.isEmpty([1]), false );
    strictEqual( fns.obj.isEmpty(new String("a")), false );
    
    raises( function(){fns.obj.isEmpty(5);}, TypeError );
    raises( function(){fns.obj.isEmpty(null);}, TypeError );
    raises( function(){fns.obj.isEmpty();}, TypeError );
});



test('Function: obj.isEnumerable', 8, function() {
    strictEqual( typeof fns.obj.isEnumerable, "function" );
    strictEqual( fns.obj.isEnumerable(window, "parseInt"), false );
    strictEqual( fns.obj.isEnumerable(window, "nonexistingstuff"), false );
    
    var obj = {a:1};
    strictEqual( fns.obj.isEnumerable(obj, "a"), true);
    
    var F = function(){};
    F.prototype.x = 12;
    obj = new F();
    
    strictEqual( fns.obj.isEnumerable(obj, "x"), false);
    strictEqual( fns.obj.isEnumerable(obj, "x", true), true);
    
    raises( function(){ fns.obj.isEnumerable(5, "x"); }, TypeError);
    raises( function(){ fns.obj.isEnumerable(); }, TypeError);
});


test( "Function: fns.obj.safeMixin", 9, function(){
    equals( typeof fns.obj.safeMixin, "function", "Function existence verification" );
    
    var test = {};
    var out = fns.obj.safeMixin( test, { a:1, b: "test"} );
    equals( test, out );
    equals( typeof test.a, 'number' );
    
    test = { a: 5, b: 5 };
    out = { b: 10, c: 10 };
    fns.obj.safeMixin( test, out, { c:15, d: 15} );
    equals( test.a, 5 );
    equals( test.b, 5 );
    equals( test.c, 10 );
    equals( test.d, 15 );
    
    out = fns.obj.safeMixin( test );
    equals( test, out );
    equals( fns.obj.safeMixin(), void 0 );
    
});



test('Function: obj.toPropertyDescriptor', 28, function() {
    strictEqual( typeof fns.obj.toPropertyDescriptor, "function" );
    
    var obj = { x: 5, y: "test"};
    var dsc = fns.obj.toPropertyDescriptor(obj);
    strictEqual( typeof dsc.value, "undefined" );
    strictEqual( typeof dsc.enumerable, "undefined" );
    strictEqual( typeof dsc.writable, "undefined" );
    strictEqual( typeof dsc.configurable, "undefined" );
    strictEqual( typeof dsc.get, "undefined" );
    strictEqual( typeof dsc.set, "undefined" );
    strictEqual( typeof dsc.x, "undefined" );
    strictEqual( typeof dsc.y, "undefined" );
    
    obj = { value: 11, writable: false, test: function(){} };
    dsc = fns.obj.toPropertyDescriptor(obj);    
    strictEqual( typeof dsc.value, "number" );
    strictEqual( typeof dsc.enumerable, "undefined" );
    strictEqual( typeof dsc.writable, "boolean" );
    strictEqual( typeof dsc.configurable, "undefined" );
    strictEqual( typeof dsc.get, "undefined" );
    strictEqual( typeof dsc.set, "undefined" );  
    strictEqual( typeof dsc.test, "undefined" ); 
    
    obj = { set: function(){} };
    dsc = fns.obj.toPropertyDescriptor(obj);    
    strictEqual( typeof dsc.set, "function" );
    
    obj.set = "text";
    raises( function(){ fns.obj.toPropertyDescriptor(obj); }, TypeError);
    
    obj = { set: function(){}, writable: true };
    raises( function(){ fns.obj.toPropertyDescriptor(obj); }, TypeError);
    
    obj = { get: function(){}, value: 11 };
    raises( function(){ fns.obj.toPropertyDescriptor(obj); }, TypeError);    
    
    obj = { configurable: false, enumerable: true, get: function(){}, set: function(){} };
    dsc = fns.obj.toPropertyDescriptor(obj);    
    strictEqual( typeof dsc.value, "undefined" );
    strictEqual( typeof dsc.enumerable, "boolean" );
    strictEqual( typeof dsc.writable, "undefined" );
    strictEqual( typeof dsc.configurable, "boolean" );
    strictEqual( typeof dsc.get, "function" );
    strictEqual( typeof dsc.set, "function" ); 
    
    raises( function(){ fns.obj.toPropertyDescriptor(42); }, TypeError);    
    raises( function(){ fns.obj.toPropertyDescriptor(); }, TypeError);    
});



