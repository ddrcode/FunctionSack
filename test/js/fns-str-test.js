module( "fns.str module" );


test( "Function: fns.str.contains", 13, function(){
    
    strictEqual( typeof fns.str.contains, "function", "Function existence verification" );
    strictEqual( fns.str.contains("abc", "b"), true );
    strictEqual( fns.str.contains("abc", "abc"), true );
    strictEqual( fns.str.contains("abc", "a"), true );
    strictEqual( fns.str.contains("abc", "d"), false);
    strictEqual( fns.str.contains("abc", "abcc"), false );
    strictEqual( fns.str.contains("", ""), true );
    strictEqual( fns.str.contains("a1bc", 1), true );
    strictEqual( fns.str.contains("true", true), true );
    strictEqual( fns.str.contains("null", null), true );
    strictEqual( fns.str.contains("null", undefined), false );
    strictEqual( fns.str.contains(), true );
    strictEqual( fns.str.contains(123,2), true );
});



test( "fns.str.escapeHTML", 3, function(){
	
	equals( typeof fns.str.escapeHTML, "function", "Function existence verification" );
	equals( fns.str.escapeHTML("<a>&</a>"), "&lt;a&gt;&amp;&lt;/a&gt;" );
	equals( fns.str.escapeHTML(), "undefined" );
	
});


test( "Function: fns.str.escapeURI", function(){
    
    equals( typeof fns.str.escapeURI, "function", "Function existence verification" );
});



test( "fns.str.format", function(){
    
    equals( typeof fns.str.format, "function", "Function existence verification" );
    equals( fns.str.format("Hello, I'm {0}, age {1}", "David", 34), "Hello, I'm David, age 34" );
    equals( fns.str.format("Hello, I'm {0}, age {1}", ["David", 34]), "Hello, I'm David, age 34" );
    equals( fns.str.format("Hello, I'm {name}, age {age}", {name: "David", age:34}), "Hello, I'm David, age 34" );
    
    var obj = {
            name: "test",
            addresses: [
                 { country: "Iceland" },
                 { street: "Queensway", country: "UK", city: "London" }
              ],
            skills: {
                languages: ["English", "Gealic"],
                drivingLicense: true
            }
        };
    
    equals( fns.str.format("Hello, I'm {name}", obj), "Hello, I'm test" );
    equals( fns.str.format("Hello, I'm {addresses.0.country}", obj), "Hello, I'm Iceland" );
    equals( fns.str.format("Hello, I'm {skills.drivingLicense}", obj), "Hello, I'm true" );
    
    equals( fns.str.format("Hello, I'm {addresses.somethingNotExisting}", obj), "Hello, I'm undefined" );
    equals( fns.str.format("Hello, I'm {5}", 1, 2), "Hello, I'm undefined" );
    equals( fns.str.format("Hello, I'm {5000}"), "Hello, I'm undefined" );
    
    equals( fns.str.format("It's not a template", 1, 2, 3), "It's not a template" );
    equals( fns.str.format("It's not a template"), "It's not a template" );
    equals( fns.str.format(), undefined );
    
    equals( fns.str.format("{1} is {0}", 0, 1), "1 is 0" );
    equals( fns.str.format("{1} is {0}", "{1}", 1), "1 is {1}" );
    equals( fns.str.format("It's not {{a}} template {{0}}", 1), "It's not {a} template {0}" );
    equals( fns.str.format("{0}", 1), "1" );
    equals( fns.str.format("{{{0}}}", 1), "{1}" );
});



test( "Function: fns.str.repeat", function(){
    
    equals( typeof fns.str.repeat, "function", "Function existence verification" );
    equals( fns.str.repeat("abc"), "abc" );
    equals( fns.str.repeat("abc",0), "abc" );
    equals( fns.str.repeat("abc",1), "abc" );
    equals( fns.str.repeat("abc",2), "abcabc" );
    equals( fns.str.repeat("abc",3), "abcabcabc" );
});



test( "Function: fns.str.reverse", function(){
    
    equals( typeof fns.str.reverse, "function", "Function existence verification" );
    equals( fns.str.reverse("abc"), "cba" );
    equals( fns.str.reverse(" abc"), "cba " );
    equals( fns.str.reverse(123), "321" );
});


test( "Function: fns.str.trim", function(){
    
    equals( typeof fns.str.trim, "function", "Function existence verification" );
    equals( fns.str.trim("abc"), "abc" );
    equals( fns.str.trim(" abc "), "abc" );
    equals( fns.str.trim("abc\t"), "abc" );
    equals( fns.str.trim(" abc"), "abc" );
});


test( "fns.str.unescapeHTML", 3, function(){
    
    equals( typeof fns.str.unescapeHTML, "function", "Function existence verification" );
    equals( fns.str.unescapeHTML("&lt;a&gt;&amp;&lt;/a&gt;"), "<a>&</a>" );
    equals( fns.str.unescapeHTML(), "undefined" );
    
});



test( "Function: fns.str.unescapeURI", function(){
    
    equals( typeof fns.str.unescapeURI, "function", "Function existence verification" );
    equals( fns.str.unescapeURI("abc+def%20gh"), "abc def gh" );
});
