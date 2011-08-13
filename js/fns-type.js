/**
 * The module provides functions for type recognition and verification.
 * Because of different understanding of types between JavaScript engines
 * and due to some best practices from one hand and design mistakes in the 
 * language from the other - FunctionSack had to
 * take some assumptions to treat types equally across all environments. 
 * In addition we took care to introduce meaningful and logical understanding
 * of type names. FunctionSack assumptions:
 * <ul><li>
 * 1. "object" is any value which is an instance of Object type and which 
 *    inherits from Object's prototype. As a result function is an object,
 *    but null is not (it represents internal [[Null]] type which doesn't 
 *    inherit from the Object)</li><li>
 * 2. Because null has been excluded from the object type, it is considered
 *    to be a value of a "null" type - same way like undefined is a value of
 *    "undefined" type. </li><li>
 * 3. "function" type is reserved for functions only (objects created with 
 *    Function constructor). Other callable objects are considered as "object"
 *    type. This assumption solves incompatibility between V8 JavaScript engine
 *    (where typeof new RegExp() === "function") and other engines (where RegExp
 *    is considered as "object" type).</li><li>
 * 4. Instances of object wrappers (String, Boolean and Number) should 
 *    be understood by their value, so fs.type.typeOf(new Number()) returns
 *    "number" (however fs.type.isObject(new Number()) returns true). 
 *    It can be compared to JavaScript function which returns 
 *    "function" value for typeof operator although is an object at the same time
 *    ((function(){}) instanceof Object returns true)
 *    Such treatment of wrappers seem to be more logical to us. Especially when
 *    we consider the fact that usage of the wrappers is not adviced 
 *    (JSLint/JSHint tools would mark them as mistakes). It means that we always
 *    want to treat them as values. In practice the developers almost never 
 *    check type in their programs against the wrappers (in example
 *    a instanceof Number), because they assume that wrapper won't be used.
 *    FunctionSack in the type-check functions like isNumber or isBoolean 
 *    always return true for primitive values and their wrappers.</li><li>   
 * 5. As a consequence of (4) falsy values are understood as the values themselves
 *    and also their object wrappers (so new String(""), new Number(0) and
 *    new Boolean(false)) </li></ul>
 *    
 * Due to mentioned incompatibilities and problems in JavaScript built-in
 * type recognition mechanism we strongly recommend to use FunctionSack
 * features instead of standard typeof and instance of operators. 
 * 
 * @name %(namespace)s.type
 * @static 
 * @namespace Module providing functions for type recognition and manipulation.
 */ 
$NS.type = (function(){
    
    
    return {
        
        
        /**
         * Safe version of typeof operator. Differences
         * 1. Does not differenciate between primitives and object wrappers (string and String)
         * 2. Never returns "function" for RegExp (Chrome/V8 case)
         * 3. For null value returns "null" string (unless second parameter specified)
         *
         * @name $NS.type.typeOf
         * @info Returns type name of given object
         * @nosideeffects
         * @function
         * 
         * @param {*} obj An object to examine
         * @param {boolean} [nullAsObject=false] Flag which specifies if null should be considered as object (as it is in typeof operator) 
         * @returns {string} type name of the given object
         * 
         * @example $NS.type.typeOf("123") === "string"
         * @example $NS.type.typeOf(new String("123")) === "string"
         * @example $NS.type.typeOf(/.+/g) === 'object'
         * @example $NS.type.typeOf(null) === 'null'
         * @example $NS.type.typeOf(null, true) === 'object'
         */
        typeOf: function(obj, nullAsObject) {
            if( obj === null ) {
                return !!nullAsObject ? "object" : "null";
            }
            var type = typeof obj;
            if( type === "function" ) {
                return this.isRegExp(obj) ? "object" : type;
            } else if( type === "object" ) {
                type = (Object.prototype.toString.call(obj).match(/\s(\S+?)(?=\]$)/) || [])[1];
                return new RegExp("\\b"+type+"\\b").test("String Boolean Number") ? type.toLowerCase() : "object";
            }
            return type;
        },
        
        
        /**
         * Returns the value of Class internal property of a given object. The Class internal property
         * is a string representing the name of object's constructor. According to ECMAScript 
         * specification only the standard, built-in objects provide the value of Class property. For all
         * other objects (like custom types) the returned value will be always "Object" - however
         * it might be implementation-dependent. In example DOM objects in Firefox browser
         * provide custom values of Class properties, so getClass(document) will return "HTMLDocument". 
         * The same example on Internet Explorer will return "Object". 
         * To get constructor name instead of "Object" for custom types use getName function instead.
         * 
         * @name $NS.type.getClassName
         * @info Returns value of the [[Class]] internal property of an object
         * @function
         * @nosideeffects
         * @see $NS.type.getConstructorName
         * 
         * @param {*} obj
         * @returns {string} value of ECMAScript [[Class]] internal property
         * 
         * @example $NS.type.getClass({}) === 'Object';
         * @example $NS.type.getClass([]) === 'Array';
         * @example $NS.type.getClass() === "Undefined"
         */
        getClassName: function(obj) {
            if( obj === null ) {
                return "Null";
            }
            if( typeof obj === "undefined" ) {
                return "Undefined";
            }
            return (Object.prototype.toString.call(obj).match(/\s(\S+?)(?=\]$)/) || [""])[1];
        },
        
        
        
        
        /**
         * Returns a type name of an object passed as an argument. It works with
         * primitives and objects. For primitives the function returns value of
         * typeof operator. For objects the function uses following algorithm:
         * 1. if object is null return "null"
         * 2. if object is a built-in object then return its [[Class]] internal property
         *    (ie. "Array" for array object)
         * 3. if object.constructor.name is defined and not empty then return it as a result
         * 4. try to convert constructor function to a string and recognize its name
         * 5. if there is not possible to determine type name, return "Object*" string
         * 
         * @name $NS.type.getConstructorName
         * @info Replaces typeof and instanceof to one consistent solution
         * @nosideeffects
         * @requires $NS.type.getClassName
         * @see $NS.type.getClassName
         * @function
         * 
         * @param {Object} obj an object to test; can be of any type
         * @param {string} [unrecognizedConstructorName="Object*"] a name returned when function
         *                     won't be able to recognize the constructor name.
         * @returns {string} type name
         * 
         * @example $NS.type.getName(123) === "number"
         * @example $NS.type.getName(new Number(1)) === "Number"
         * @example $NS.type.getName([]} === "Array" 
         * @example $NS.type.getName(function(){}) === "function"
         * @example $NS.type.getName(/.+/) === "RegExp"
         * @example $NS.type.getName(null) === "null"
         * @example $NS.type.getName() === "undefined"
         */
        getConstructorName: function(obj, unrecognizedConstructorName) {
            if( obj === null ) {
                return "null";
            }
            var t = typeof obj;
            
            // 'function' not returned here due to RegExp case on V8
            if( t !== 'object' && t !== 'function' ) {
                return t;
            }
            
            t=$NS.type.getClassName(obj);
            // built-in objects case
            if( t !== 'Object' || obj.constructor === Object ) {
                return t;
            }
            
            // when type name provided via constructor
            // (can return wrong values for overridden constructors)
            if( obj.constructor && obj.constructor.name ) {
                return obj.constructor.name;
            }
            
            // Find function name in the constructors' source 
            if( obj.constructor && (t=String(obj.constructor).match(/^function\s+([^\s\(]+?)[\(\s]/)) !== null ) {
                return t[1];
            }

            // when not possible to determine object's type name
            return unrecognizedConstructorName || "Object*";
        },
        
 
        
        /**
         * Check weather passed parameter is a function.
         * Usage of this method is more secure than typeof operator, because in some
         * environments (like Google Chrome / V8), typeof can return "function" value also
         * for non-function arguments, like regular expressions
         * 
         * @name $NS.type.isFunction
         * @info Check weather passed parameter is a function.
         * @nosideeffects
         * @function
         *  
         * @param {*} obj An object to examine
         * @returns {boolean} true if obj is a function, otherwise false
         * 
         * @example ddr.type.isFunction(/.+/) === false
         */
        isFunction: __utils.isFunction, 
        
        
        /**
         * Checks whether passed argument is an an object.
         * Because in JavaScript function is an object too, the method returns
         * true for functions as well.
         * 
         * @name $NS.type.isObject
         * @info Checks whether passed argument is an an object.
         * @nosideeffects
         * @function
         * 
         * @param {*} obj An object to examine 
         * @param {boolean} [considerFunction=true] specify if function should be considered as an object
         * @param {boolean} [considerNull=false] specify if null should be considered as an object
         * @returns {boolean} true whether the argument is an object, false otherwise.
         */
        isObject: __utils.isObject,
        
        
        /**
         * Checks whether passed argument is an an array.
         * 
         * @name $NS.type.isArray
         * @info Checks whether passed argument is an an array.
         * @nosideeffects
         * @function
         * 
         * @param {*} obj An object to examine
         * @returns {boolean} True when obj is an array, false otherwise. 
         */
        isArray: __utils.isArray,
        
        
        /**
         * Function checks whether the given attribute is a string. It works
         * correctly both with string primitive and string objects.
         * Thanks to it there is no need in comparisons to call code like 
         * if( typeof x==='string' && x instaceof String) or similar
         * 
         * @name $NS.type.isString
         * @info Function checks whether the given attribute is a string.
         * @nosideeffects
         * @function 
         * 
         * @param {*} obj An object to examine
         * @returns {boolean} true when obj is string (object or primitive); false otherwise
         */
        isString: __utils.isString,
    
        
        /**
         * Function checks whether the given attribute is a number or not. It works
         * with number primitives and object wrappers. 
         * 
         * @name $NS.type.isNumber
         * @info Function checks whether the given attribute is a number
         * @nosideeffects
         * @function
         * 
         * @param {*} obj An object to examine
         * @returns {boolean} true if obj is a number (or instance of Number); false otherwise
         */
        isNumber: function(obj) {
            return Object.prototype.toString.call(obj) === "[object Number]";
        },
        
        
        /**
         * Function checks whether the given attribute is a boolean. It works
         * with boolean primitives and object wrappers. 
         * 
         * @name $NS.type.isBoolean
         * @info Function checks whether the given attribute is a boolean
         * @nosideeffects
         * @function
         * 
         * @param {*} obj An object to examine
         * @returns {boolean} true if obj is a boolean (or instance of Boolean); false otherwise
         */
        isBoolean: function(obj) {
            return Object.prototype.toString.call(obj) === "[object Boolean]";
        },        
        
        
        /**
         * Function checks whether the given attribute is a RegExp.
         *  
         * @name $NS.type.isRegExp
         * @info Function checks whether the given attribute is a RegExp
         * @nosideeffects
         * @function
         * 
         * @param {*} obj An object to examine
         * @returns {boolean} true if obj is a RegExp; false otherwise
         */
        isRegExp: function(obj) {
            return Object.prototype.toString.call(obj) === "[object RegExp]";
        },        
        
        
        /**
         * Function checks whether the given attribute is a Data object.
         *  
         * @name $NS.type.isDate
         * @info Function checks whether the given attribute is a Date object
         * @nosideeffects
         * @function
         * 
         * @param {*} obj An object to examine
         * @returns {boolean} true if obj is a Date; false otherwise
         */
        isDate: function(obj) {
            return Object.prototype.toString.call(obj) === "[object Date]";
        },     
        
        
        /**
         * Function checks whether the given attribute is an instance of
         * Error object. It considers objects created with Error constructor or
         * inheriting from Error's prototype (like TypeError) 
         * 
         * @name $NS.type.isError
         * @info Function checks whether the given attribute is instance of Error
         * @nosideeffects
         * @function
         * 
         * @param {*} obj An object to examine
         * @returns {boolean} true if obj is an Error instance; false otherwise
         */
        isError: function(obj) {
            return Object.prototype.toString.call(obj) === "[object Error]";
        },           
        
        
        /**
         * Test if passed object is a global object. If the second attribute is set to true
         * the function will consider only the current global object.
         *  
         * @name $NS.type.isGlobal
         * @info Function checks whether given attribute is a reference to the global object
         * @nosideeffects 
         * @function
         * 
         * @param {*} obj obj An object to examine
         * @param {boolean} [currentContextOnly=true]
         * @returns {boolean}
         */
        isGlobal: function(obj, currentContextOnly) {
            if( !obj || typeof obj !== 'object' ) {
                return false;
            }
            // non strict mode 
            if( (function(){ return this; })() === obj ) {
                return true;
            }
            if( typeof currentContextOnly === "undefined" || !!currentContextOnly ) {
                return Function===obj.Function && encodeURIComponent===obj.encodeURIComponent 
                        && RegExp===obj.RegExp && isNaN === obj.isNaN; 
            }
            // Rhino, Node.JS
            if( Object.prototype.toString.call(obj) === "[object Error]" ) {
                return true;
            }
            return obj.Function && obj.RegExp && obj.encodeURIComponent && obj.RegExp && "undefined" in obj;
        },
        
        
        /**
         * Returns true if the argument is a falsy value, so one of
         * the following values: 0, "", false, null, undefined or... the object
         * wrapper of them. The last one may sound bit controversial, however
         * it matches the way how FunctionSack treats the types. For more details
         * see the description of type modele. 
         * @name $NS.type.isFalsy
         * @info Returns true if the argument is a falsy value.
         * @see $NS.type
         * @requires $NS.type.isWrapper 
         * @function  
         * @param {*} obj A value to test
         * @returns {boolean} true for falsy value; false otherwise
         */
        isFalsy: function(obj) {
            return !obj || (this.isWrapper(obj) && !obj.valueOf());
        },
        
        
        /**
         * @name $NS.type.isStandardType
         * @info Checks if given object is a standard type
         * @requires $NS.type.getClassName
         * @function
         * 
         * @param {*} An object to examine
         * @returns {boolean} 
         */
        isStandardType: function(obj) {
            if( typeof obj !== "object" || obj === null ) {
                return true;
            }
            var c = this.getClassName(obj);
            return c === "String" || c === "Number" || c === "Boolean" || c === "Date" 
                    || c === "RegExp" || c === "Error" || c === "Array";
        },
        
        
        /**
         * @name $NS.type.isWrapper
         * @info Checks if given object is an object representation of a primitive type.
         * @requires $NS.type.getClassName
         * @function
         */
        isWrapper: function(obj) {
            var c;
            return __utils.isObject(obj,false) 
                        && ((c=this.getClassName(obj)) === "String" || c === "Number" || c === "Boolean");
        }
        
        //###
    };
    
})();

