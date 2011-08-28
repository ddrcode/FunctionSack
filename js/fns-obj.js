/**
 * @name %(namespace)s.obj
 * @namespace Provides object access and manipulation functions
 * @static
 */ 
$NS.obj = (function(){

    
    var __throwTypeErrorForNonObject = function(obj){
        if( !__utils.isObject(obj) ) {
            throw new TypeError( obj+" is not an object" );
        }
    };
    
    
    return {
        
        /**
         * Allows to get an access to deep object properties via string.
         * When given path is not reachable function return undefined or 
         * default value. 
         * 
         * @name $NS.obj.access
         * @info Access deep object properties with a string path. 
         * @requires Array.prototype.reduce
         * @function
         * 
         * @param {Object} ctx Object to examine
         * @param {string} path Property path
         * @param {*} [defaultValue=undefined] Default value
         * @returns {*} Value of the property selected by path or default value 
         * 
         * @example
         * var obj = {
         *        name: "test",
         *        addresses: [
         *          { country: "Iceland" },
         *          { street: "Queensway", country: "UK", city: "London" }
         *        ]
         *    };
         * fs.obj.access(obj, "name") === "test";
         * fs.obj.access(obj, "addresses[0].country") === "Iceland";
         * fs.obj.access(obj, "addresses.[0].city.district") === undefined;
         * fs.obj.access(obj, "addresses.1.city") === "London";
         * 
         */
        access: function(ctx, path, defaultValue){
            var value = String(path).split(".").reduce(function fn(obj, pelem){
                    if(obj && pelem.charAt(pelem.length-1)===']'){
                        // can't split with /\[(.+?)\]/ (without replace) due to bug in IE
                        return pelem.replace("]","").split("[")
                                .reduce(fn, obj);
                    }
                    return obj && pelem ? obj[pelem] : obj;
                }, ctx);
            return typeof value !== "undefined" ? value : defaultValue;
        },
        
        
        
        /**
         * Clones the given object with respect to the prototype
         * chain. If object is a clone of obj then it prototypaly 
         * inherits from his origin (obj). It means that obj becomes
         * a prototype for all their clones. 
         * 
         * @name $NS.obj.clone
         * @info Creates a clone of an object (ECMAScript 5 Object.create equivalent)
         * @function 
         * 
         * @param {Object} obj Object to clone
         * @returns {Object} cloned object
         * 
         * @example
         * var obj = { x: 1, y: 2 };
         * var clone = fs.obj.clone(obj);
         * // cloned object has properties of its origin... 
         * clone.x === 1;
         * // but their are not clone's internal properties
         * clone.hasOwnProperty("x") === false;
         * // original object is clone's prototype
         * Object.getPrototypeOf(clone) === obj;
         * // and both objects are of the same type
         * clone.constructor === obj.constructor;
         */
        clone: (function(){
            
            var __CloneConstructor = function(){};
            
            return function(obj){
                if( !__utils.isObject(obj) ) {
                    return ob;
                }
                __CloneConstructor.prototype = obj;
                return new __CloneConstructor();
            };
        })(),
        

        
        /**
         * Compares two objects by value. By default it does the shallow comparison. It means
         * the internal objects will be compared by references. When third attribute is set to true, 
         * function will run deep comparison - for each internal object it will execute the
         * comparator again recursively - unless it will be able to compare attributes by value.
         * Because the language does not provide standard by-value comparators, certain assumptions
         * had to be taken:<ul><li>
         * a) Standard object wrappers (String, Boolean, Number) will be compared by valueOf method result</li><li>
         * b) Error and RegExp objects will be compared by toString method result</li><li>
         * c) Date object will be compared by getTime method results</li><li>
         * d) all other objects (including arrays) will be compared item by item; applying recursive comparison
         *    for object members</li><li>
         * e) only own, enumerable properties will be compared</li><li>
         * f) objects containing non-enumerable length internal property (like arrays, strings, functions, node lists)   
         *    will be additionally compared by the length value</li><li>
         * g) objects containing different number of internal properties are considered as not equal</li><li>
         * h) functions are compared by length property and by function-object properties; function body</li><li>
         *    is not a subject of comparison as there is no cross-environment solution for such operation</li></ul>
         * 
         * @name $NS.obj.equals
         * @info Compares two objects by value (shallow and deep compare possible)
         * @requires Array.prototype.indexOf
         * @requires $NS.obj.getLength
         * @requires $NS.type.isStandardType
         * @function
         * 
         * @param {*} obj1 First object for comparison
         * @param {*} obj2 Second object for comparison
         * @param {boolean} [deepCompare=false]
         * @returns {boolean} True when objects are equal, false otherwise
         * 
         * @example
         * var obj1 = { x: 1, y: [1,2,3] };
         * var obj2 = { x: 1, y: [1,2,3] };
         * 
         * // shallow comparison returns false because inner arrays are compared by reference
         * $NS.obj.equals(obj1, obj2) === false;
         * 
         * // deep comparison returns true (internal array is compared element by element) 
         * $NS.obj.equals(obj1, obj2, true) === true;
         */
        equals: (function(){
            
            // standard objects comparator
            var __compareStandardOjects = function(v1, v2) {
                var v1t = Object.prototype.toString.call(v1);
                if( v1t !== Object.prototype.toString.call(v2) ) {
                    return false;
                }
                return v1t === "[object RegExp]" || v1t === "[object Error]" 
                            ? v1.toString() === v2.toString() 
                            : v1.valueOf() === v2.valueOf();
            };

            // hidden implementation due to fourth attribute (history)
            var __deepEquals = function (obj1, obj2, deepCompare, history) {
                if( deepCompare && $NS.type.isStandardType(obj1) && !__utils.isFunction(obj1) && !__utils.isArray(obj1) ) {
                    if(__compareStandardOjects(obj1, obj2) === false ) {
                        return false;
                    }
                }     
                if( (Object.keys(obj1).length !== Object.keys(obj2).length) || ("length" in obj1 && obj1.length !== obj2.length) ) {
                    return false;
                }
                for(var key in obj1) {
                    if(obj1.hasOwnProperty(key)){
                        if( !obj2.hasOwnProperty(key) ) {
                            return false;
                        }
                        if( deepCompare && __utils.isObject(obj1[key], true) && __utils.isObject(obj2[key], true) ){
                            if(history.indexOf(obj1[key]) >=0 ) {
                                continue;
                            }
                            history.push(obj1);
                            if( __deepEquals(obj1[key], obj2[key], deepCompare, history) === false ){
                                return false;
                            }
                        } else {
                            if( obj1[key] !== obj2[key] ) {
                                return false;
                            }
                        }
                    }
                }
                return true;
            };
            
            return function(obj1, obj2, deepCompare){
                if( !__utils.isObject(obj1,!!deepCompare) || !__utils.isObject(obj2,!!deepCompare) ) {
                    return obj1 === obj2;
                } 
                return __deepEquals(obj1, obj2, !!deepCompare, []);
            };

        })(),
        
        
        
        /**
         * Enforces execution of $NS.obj.equals function with deepCompare attribute set to true.
         * 
         * @name $NS.obj.deepEqual
         * @info Enforces execution of $NS.obj.equals function with deepCompare attribute set to true
         * @see $NS.obj.equals
         * @requires $NS.obj.equals
         * @function
         * 
         * @param {*} obj1 First object for comparison
         * @param {*} obj2 Second object for comparison
         * @returns {boolean} comparison result
         * 
         * @example $NS.obj.equals(obj1, obj2, true) === $NS.obj.deepEqual(obj1, obj2);
         */
        deepEqual: function(obj1, obj2) {
            return this.equals(obj1, obj2, true);
        },        

        
        
        /**
         * Returns an array containing property names of an object filtered by
         * given criteria. Function works similiar to ECMAScript 5 Array.prototype.filter,
         * but the callback attributes are adopted for property selection.
         * The function takes as a parameter an object and a callback function.
         * The callback is executed for each own property of an object. The result of the
         * function is an array of property names for which the callback returned true.  
         * 
         * @name $NS.obj.filterPropertyNames
         * @info Filters property names from an object with callback method.
         * @requires Object.getOwnPropertyNames
         * @requires Object.getOwnPropertyDescriptor
         * @requires $NS.type.typeOf
         * @requires Array.prototype.filter
         * @see $NS.obj.filter
         * @function
         * 
         * @param {Object} obj Object to filter
         * @param {function} callback A callback function - will be executed for each object's property
         * @param {Object} [thisObj=obj] A value of this property inside a callback
         * @param {boolean} [includeNotEnumerable=false] - flag which says that callback should be run also for non-enumerable properties
         * @returns {Array.<string>}
         * 
         * @example
         * var person = {
         *       firstname: "John",
         *       lastname: "Ubot",
         *       getFullName: function(){ return this.firstname+" "+this.lastname },
         *       age: 42,
         *       sex: "M"
         *    };
         *    
         * // selects from person the property names which point to
         * // non-functions and which contain string "name"
         * // result: ["firstname", "lastname"] 
         * var props = fs.obj.filterPropertyNames(person, function(name, type, desc){
         *       return type !== "function" && /name/.test(name);
         *    });
         */
        filterPropertyNames: function(obj, callback, thisObj, includeNotEnumerable) {
            __throwTypeErrorForNonObject( obj );
            var keys;
            if( !!includeNotEnumerable && Object.getOwnPropertyNames ) {
                keys =  Object.getOwnPropertyNames(obj);
            } else {
                keys = [];
                for(var key in obj) {
                    if( Object.prototype.hasOwnProperty.call(obj, key) ) {
                        keys.push(key);
                    }
                }
            }
            thisObj = thisObj || obj;
            return keys.filter(function(key){
                    return callback.call(thisObj, key, $NS.type.typeOf(obj[key]), Object.getOwnPropertyDescriptor(obj, key), obj );
                });
        },
        
        
        
        /**
         * Creates a new object by filtering properties from a source object. Method works similar 
         * {@link fs.obj.filterNames}, but it produces an a real object as a result instead of an 
         * array of property names. To filter properties the function runs a callback for each object
         * property. Result object contains attributes for which the callback has returned true.   
         * 
         * @name $NS.obj.filter
         * @info Creates a new object by filtering properties from a source object.
         * @see $NS.obj.filterPropertyNames
         * @function
         * @requires $NS.obj.filterPropertyNames
         * 
         * @param {Object} obj Object to filter
         * @param {function} callback A callback function - will be executed for each object's property
         * @param {Object} [thisObj=obj] A value of this property inside a callback
         * @param {boolean} [includeNotEnumerable=false] - flag which says that callback should be run also for non-enumerable properties
         * @returns {Object} a sub-object
         * 
         * @example
         * var person = {
         *       firstname: "John",
         *       lastname: "Ubot",
         *       getFullName: function(){ return this.firstname+" "+this.lastname },
         *       age: 42,
         *       sex: "M"
         *    };  
         *    
         * // selects from person only those properties which point to
         * // non-functions and which contain string "name"
         * // result: { firstname: "John", lastname: "Ubot" } 
         * var newObj = fs.obj.filter(person, function(name, type, desc){
         *       return type !== "function" && /name/.test(name);
         *    });
         */
        filter: function(obj, callback, thisObj, includeNotEnumerable) {
            var names = this.filterPropertyNames(obj, callback, thisObj, includeNotEnumerable);
            var result = {};
            for( var i=0, len=names.length; i < len; ++i ) {
                result[names[i]] = obj[names[i]];
            }
            return result;
        },
        
        
        
        /**
         * Copies only those properties from the source which does not exist in destination object
         * @name $NS.obj.safeMixin
         * @info Mixin without override ability
         * @see $NS.mixin
         * @function
         * @returns {Object}
         */
        safeMixin: function(dst){
            var src = null, prop = null;
            for(var srcId=1, len=arguments.length; srcId < len; ++srcId) {
                for(prop in (src=arguments[srcId])) { 
                    if( src.hasOwnProperty(prop) && !dst.hasOwnProperty(prop) ){
                        dst[prop] = src[prop];
                    }
                }
            }
            return dst;            
        },
        
        
        
        /**
         * Checks if an object contains given property. By default it works like a standard
         * Object.prototype.hasOwnProperty method, but it also provides some enhancements:<ul><li>
         * 1. It works properly on DOM elements under Internet Explorer (where hasOwnProperty
         *    method is not supported)</li><li>
         * 2. It allows to examine also object's prototype chain (depends on a value of 
         *    the third attribute)</li><li>
         * 3. It allows to include or exclude non-enumerable properties (depends on the 
         *    value of the forth parameter).</li></ul>
         * 
         * @name $NS.obj.contains
         * @info Checks if an object contains given property.
         * @requires $NS.obj.isEnumerable
         * @function
         * 
         * @param {Object} obj
         * @param {string} propertyName
         * @param {boolean} [considerPrototypes=false]
         * @param {boolean} [enumerableOnly=false]
         * @returns {boolean}
         * 
         * @example
         * // an equivalent of hasOwnProperty 
         * $NS.obj.contains(Array.prototype, "slice") === true;
         * // false, because "slice" is not enumerable 
         * $NS.obj.contains(Array.prototype, "slice", false, false) === false;
         * // false, "slice" is not direct property of Array instance
         * $NS.obj.contains([], "slice") === false;
         * // true, because test of prototype chain has been requested
         * $NS.obj.contains([], "slice", true) === true; 
         */
        contains: function(obj, propertyName, considerPrototypes, enumerableOnly){
            __throwTypeErrorForNonObject( obj );
            var exists = !!considerPrototypes ? propertyName in obj : Object.prototype.hasOwnProperty.call(obj, propertyName);
            return exists && (!enumerableOnly || this.isEnumerable(obj, propertyName, considerPrototypes));
        },
        
        
        
        /**
         * Returns the number of own enumerable properties inside an object.
         * 
         * @name $NS.obj.getLength
         * @info Returns the number of own enumerable properties inside the object.
         * @function
         * 
         * @param {Object} obj Object to test.
         * @returns {number} A number of own enumerable properties inside an object
         */
        getLength: function(obj){
            __throwTypeErrorForNonObject( obj );
            
            var len = 0;
            for(var key in obj) {
                if( Object.prototype.hasOwnProperty.call(obj, key) ) {
                    ++len;
                } 
            }
            return len;
        },        
        
      
        
        /**
         * Returns a reference to the global object (even in the strict mode). 
         * 
         * @name $NS.obj.getGlobal
         * @info Return a reference to the global object (works in the strict mode too)
         * @function
         * 
         * @param {boolean} [dontThrow=false] When set to true will not throw any error if global object not found.
         * @returns {Object} The global object
         * @throws {TypeError} when impossible to determine the global object. It may
         *         happen when SES is used
         */
        getGlobal: function(dontThrow) {
            var glob = (function(){ return this; })();
            if( glob ) {
                return glob;
            }
            
            if( typeof window === 'object' ) {
                return window;
            } 
            
            if( !!(glob = new Function("return this;")()) ) {
                return glob;
            }
            
            var e = eval;
            if( !!(glob = e("this")) ) {
                return glob;
            }
            
            glob = typeof global === 'object' ? global : ( typeof GLOBAL === 'object' ? GLOBAL : null );
            if( glob && glob.Array && glob.isNaN && glob.TypeError ) {
                return glob;
            }
            
            if( !dontThrow ) {
                throw new TypeError("Impossible to determine the global object");
            }
        },
        
        
        /**
         * Object is considered to be empty when the number of own, enumerable properties
         * is equal to zero. The function does not check the value of length internal property.
         * 
         * @name $NS.obj.isEmpty
         * @info Function checks if the object is empty.
         * @requires $NS.obj.getLength
         * @function
         * 
         * @param {*} obj An object to examine
         * @returns {boolean} true if object is empty, false otherwise
         * 
         * @example $NS.obj.isEmpty([]) === true;
         * @example 
         * var arr = [];
         * arr.addNewElement(elem) { this.push(elem); };
         * $NS.obj.isEmpty(arr) === false;
         */
        isEmpty: function(obj) {
            return this.getLength(obj) === 0;
        },
        
        
        /**
         * Checks whether the property of given object is enumerable. It works like standard
         * Object.prototype.propertyIsEnumerable method with following enhancements:
         * 1. It works properly for DOM elements in Internet Explorer where propertyIsEnumerable
         *    method is not available
         * 2. It allows to check either direct object properties or also properties in its prototype chain.
         * 
         * @name $NS.obj.isEnumerable
         * @info Cross-environment version of standard propertyIsEnumerable method
         * @function
         *  
         * @param {Object} obj an object
         * @param {string} propertyName name of object's property
         * @param {boolean} [considerPrototypes=false] If set to true object's prototype chain will be tested as well
         * @returns {boolean} true if property is enumerable, false otherwise
         */
        isEnumerable: function(obj, propertyName, considerPrototypes){
            __throwTypeErrorForNonObject( obj );
            
            if( !considerPrototypes && typeof obj.propertyIsEnumerable === "function" ) {
                return obj.propertyIsEnumerable( propertyName );
            }
            if( ! (!!considerPrototypes ? propertyName in obj : Object.prototype.hasOwnProperty.call(obj, propertyName)) ) {
                return false;
            }
            for(var key in obj) {
                if( key === propertyName ){
                    return true;
                }
            }
            return false;            
        },
        
        
        
        /**
         * Implementation of ToPropertyDescriptor inner ECMAScript 5 method.
         * Function returns object representing property descriptor based on 
         * input parameter.
         * ECMAScript 5 reference: 8.10.5
         * 
         * @name $NS.obj.toPropertyDescriptor
         * @info Creates property descriptor from a given object.
         * @function 
         * 
         * @param {Object} obj a property object
         * @returns {Object} a property descriptor
         * @throws {TypeError} when obj is not an object or when accessor and 
         *             writable/value properties provided at the same time
         * 
         */
        toPropertyDescriptor: function(obj){
            __throwTypeErrorForNonObject( obj );
            
            var desc = {};
            obj.hasOwnProperty("enumerable") && ( desc.enumerable = !!obj.enumerable );
            obj.hasOwnProperty("configurable") && ( desc.configurable = !!obj.configurable );
            obj.hasOwnProperty("writable") && ( desc.writable = !!obj.writable );
            obj.hasOwnProperty("value") && ( desc.value = obj.value );
            
            if( obj.hasOwnProperty("get") ) {
                if( !__utils.isFunction(obj.get) && typeof obj.get !== 'undefined' ) {
                    throw new TypeError( "Getter must be a callable object" );
                }
                desc.get = obj.get;
            }
            
            if( obj.hasOwnProperty("set") ) {
                if( !__utils.isFunction(obj.set) && typeof obj.set !== 'undefined' ) {
                    throw new TypeError( "Setter must be a callable object" );
                }
                desc.set = obj.set;
            }        
            
            if( (desc.hasOwnProperty("get") || desc.hasOwnProperty("set")) 
                    && (desc.hasOwnProperty("writable") || desc.hasOwnProperty("value")) ) {
                throw new TypeError("Invalid property. A property cannot both have accessors and be writable or have a value");
            }

            return desc;        
        }        
        
        //###
    
    };
    
})();

