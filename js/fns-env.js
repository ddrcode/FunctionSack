/**
 * @name %(namespace)s.env
 * @namespace Environment test and recognition features
 * @static
 */ 
$NS.env = (function(){
    
    /**
     * List of features available in all versions of ECMAScript
     * @name __ES
     * @static
     * @private
     */
    var __ES = {
            
            // ECMAScript 2 features
            ES2: [
                  {
                      object: __global,
                      keys: ["parseFloat","isNaN","Infinity","NaN","escape",
                             "unescape","eval","parseInt","isFinite","Object","Function",
                             "Array","String","Boolean","Number", "Date", "Math"]
                  },{
                      object: Object.prototype,
                      keys: ["toString","constructor","valueOf"]
                  },{
                      object: Function.prototype,
                      keys: ["toString","constructor"]
                  },{
                      object: Array.prototype,
                      keys: ["constructor","toString","join","reverse","sort"]
                  },{
                      object: String,
                      keys: ["fromCharCode"]
                  },{
                      object: String.prototype,
                      keys: ["constructor","toString","valueOf","charAt","charCodeAt","indexOf",
                             "lastIndexOf","split","substring","toLowerCase","toUpperCase"]
                  },{
                      object: Boolean.prototype,
                      keys: ["constructor","toString","valueOf"]
                  },{
                      object: Number,
                      keys: ["MAX_VALUE","MIN_VALUE","NaN","NEGATIVE_INFINITY","POSITIVE_INFINITY"]
                  },{
                      object: Number.prototype,
                      keys: ["constructor","toString","valueOf"]
                  },{
                      object: Date,
                      keys: ["UTC","parse"]
                  },{
                      object: Date.prototype,
                      keys: ["constructor","toString","toDateString","toTimeString","toLocaleString",
                             "valueOf","getTime","getYear","getFullYear","getUTCFullYear","getMonth","getUTCMonth","getDate",
                             "getUTCDate","getDay","getUTCDay","getHours","getUTCHours","getMinutes",
                             "getUTCMinutes","getSeconds","getUTCSeconds","getMilliseconds",
                             "getUTCMilliseconds","getTimezoneOffset","setTime","setMilliseconds",
                             "setUTCMilliseconds","setSeconds","setUTCSeconds","setMinutes",
                             "setUTCMinutes","setHours","setUTCHours","setDate","setUTCDate","setMonth",
                             "setUTCMonth","setFullYear","setUTCFullYear","toUTCString","toGMTString","setYear"]
                  },{
                      object: Math,
                      keys: ["E","LN10","LN2","LOG2E","LOG10E","PI","SQRT1_2","SQRT2","abs","acos","asin",
                             "atan","atan2","ceil","cos","exp","floor","log","max","min","pow","random",
                             "round","sin","sqrt","tan"]
                  }
               ],

            
            // ECMAScript 3 features
            ES3: [
                    {
                        object: __global,
                        keys: ["decodeURI","encodeURIComponent","undefined","encodeURI","decodeURIComponent",
                               "RegExp","Error","EvalError","RangeError","ReferenceError","SyntaxError",
                               "TypeError","URIError"]
                    },{
                        object: Object.prototype,
                        keys: ["toLocaleString","hasOwnProperty","isPrototypeOf","propertyIsEnumerable"]
                    },{
                        object: Function.prototype,
                        keys: ["call","apply"]
                    },{
                        object: Array.prototype,
                        keys: ["toLocaleString","concat","pop","push","shift","slice","splice","unshift"]
                    },{
                        object: String.prototype,
                        keys: ["concat","localeCompare","match","replace","search","slice",
                               "toLocaleLowerCase","toLocaleUpperCase"]
                    },{
                        object: Number.prototype,
                        keys: ["toLocaleString","toFixed","toExponential","toPrecision"]
                    },{
                        object: Date.prototype,
                        keys: ["toDateString","toTimeString","toLocaleDateString","toLocaleTimeString"]
                    },{
                        object: typeof RegExp === 'function' ? RegExp.prototype : null,
                        keys: ["exec","test","toString"]
                    },{
                        object: typeof Error === 'function' ? Error.prototype : null,
                        keys: ["name","message","toString"]
                    }
                 ],
                 
            
            // ECMAScript 5 features     
            ES5: [
                      {
                          object: __global,
                          keys: ["JSON"]
                      },{
                          object: Object,
                          keys: ["getOwnPropertyNames","getPrototypeOf","keys","create","preventExtensions",
                                 "seal","freeze","isSealed","isFrozen","isExtensible","defineProperty",
                                 "defineProperties","getOwnPropertyDescriptor"]
                      },{
                          object: Function.prototype,
                          keys: ["bind"]
                      },{
                          object: Array,
                          keys: ["isArray"]
                      },{
                          object: Array.prototype,
                          keys: ["indexOf","lastIndexOf","every","some","forEach","filter","map",
                                 "reduce","reduceRight"]
                      },{
                          object: String.prototype,
                          keys: ["trim"]
                      },{
                          object: Date.prototype,
                          keys: ["toISOString","toJSON"]
                      }
                 ],
                 
                 
            hasAllFeatures: function(features) {
                    for(var i=0, ilen=features.length; i < ilen; ++i){
                        var obj =  features[i].object;
                        if( !obj ) {
                            return false;
                        }
                        for(var j=0, jlen=features[i].keys.length; j < jlen; ++j){
                            if( obj.hasOwnProperty ? !obj.hasOwnProperty(features[i].keys[j]) : (typeof obj[features[i].keys[j]] !== 'undefined') ) {
                                return false;
                            }
                        }
                    }
                    return true;
                },
                
                
            findFeature: function(testObj, feature) {
                for(var key in this) {
                    if( typeof this[key].splice !== 'function' || !this.hasOwnProperty(key) ) {
                        continue;
                    }
                    var features = this[key];
                    for(var i=0, ilen=features.length; i < ilen; ++i){
                        var obj =  features[i].object;
                        if( obj !== testObj ) {
                            continue;
                        } 
                        for(var j=0, jlen=features[i].keys.length; j < jlen; ++j){
                            if( features[i].keys[j] === feature ) {
                                return +key.charAt(key.length-1);
                            }
                        }
                    }
                }
                return -1;                
            }
                
        };
    
    
    /**
     * @name __STRICT_MODE_SUPPORT
     * @type boolean
     * @private
     */
    var __STRICT_MODE_SUPPORT = (function(){
            "use strict";
            return !this; 
        })();
    
    
    /**
     * @name __E4X_SUPPORT
     * @type boolean
     * @private
     */
    var __E4X_SUPPORT = (function(){
            try {
                var test = eval("<a href='#'>test</a>");
            } catch(ex){}
            return typeof test === 'xml';
        })();
    
    //###
    
    var env = {
        
            
        /**
         * Checks whether Document Object Model is supported
         * @name $NS.env.DOM
         * @info Checks whether Document Object Model is supported.
         * @type boolean
         * @constant
         */    
        DOM: !!( typeof window !== 'undefined' && typeof document !== 'undefined' && typeof document.getElementById !== 'undefined' ),
        
        
        /**
         * True whether CommonJS functionality is supported. 
         * @name $NS.env.COMMON_JS
         * @info True whether CommonJS functionality is supported.
         * @type boolean
         * @constant
         */
        COMMON_JS: !!(typeof require === 'function' && typeof module === 'object' ),
        
        
        /**
         * @name $NS.env.RHINO
         * @info True if application runs under Rhino.
         * @type boolean 
         * @constant
         */
        RHINO: !!( typeof java === 'object' && java.lang && java.lang.Array && java.util 
                && java.util.HashMap && typeof loadClass === 'function' ),

                
        /**
         * @name $NS.env.NODE_JS
         * @info True if application runs under Node.JS
         * @type boolean
         * @constant
         */
        NODE_JS: !!( typeof process === 'object' && process.on && typeof GLOBAL === 'object' 
                && GLOBAL.setTimeout && typeof require === 'function' ),
        
        
        /**
         * Indicates whether ECMAScript for XML is supported by the JavaScript engine.
         * @name $NS.env.E4X
         * @info Indicates whether ECMAScript for XML is supported by the JavaScript engine.
         * @requires __E4X_SUPPORT
         * @type boolean
         * @constant
         */
        E4X: __E4X_SUPPORT,
        

        /**
         * @name $NS.env.JS_VERSION
         * @info Returns JavaScript version.
         * @type string
         * @requires __E4X_SUPPORT
         * @requires __STRICT_MODE_SUPPORT
         * @requires __ES
         * @constant
         */
        JS_VERSION: (function(){
                var version = (function(){
                    
                    // JS 1.8 test
                    try {
                        var expressionClosure = eval("(function(x) x*x)");
                    } catch(ex) {}
                    
                    if( typeof expressionClosure === 'function' ) {
                        if( typeof JSON === 'object' && !JSON.propertyIsEnumerable("parse") ){
                            return __STRICT_MODE_SUPPORT ? "1.8.5" : "1.8.1";
                        }
                        return "1.8";
                    }

                    // JS 1.7 test
                    try {
                        var letExpression = eval("10*let(x=5) x");
                    } catch(ex){}
                    
                    if( letExpression === 50 ) {
                        return "1.7";
                    }
                    
                    // JS 1.6 test
                    if( __E4X_SUPPORT ) {
                        return "1.6";
                    }
                    
                    if( __ES.hasAllFeatures(__ES.ES3) ) {
                        return "1.5";
                    }
                    
                    // JS1.4 recognition skipped - no new features in comparison to 1.3  
                    // apart support for Netscape Server
                    
                    if( [0,1,2].push(3) === 4 ) {
                        return "1.3";
                    }
                    
                    if( typeof RegExp === 'function' && String.prototype.concat ) {
                        return "1.2";
                    }
                    
                    if( Object.prototype.valueOf && Object.prototype.constructor ) {
                        return "1.1";
                    }
                    
                    return "1.0";
                })(); 
                
                return version;
                
            })(),
            
            
        /**
         * Checks if version of current JS engine is smaller or equal to given attribute
         * @name $NS.env.isVersion
         * @info Checks if version of current JS engine is smaller or equal to given attribute
         * @requires $NS.env.JS_VERSION
         * @nosideeffects
         * @function
         * @param {string} Minimal expected JavaScript version
         * @returns {boolean}
         * @example
         * if(!fs.env.isJSVersion("1.6")) {
         *    alert( "JavaScript in version at least 1.6 is required!" );
         * }
         */    
        isJSVersion: function(version){
                return this.JS_VERSION >= version;
            },
            
        
        /**
         * ECMAScript version of current JavaScript engine 
         * @name $NS.env.ES_VERSION
         * @info ECMAScript version of current JavaScript engine 
         * @type number
         * @requires __ES
         * @constant
         */
        ES_VERSION: (function(){
                
                if( __ES.hasAllFeatures(__ES.ES2) ){
                    if( __ES.hasAllFeatures(__ES.ES3) ) {
                        if( __ES.hasAllFeatures(__ES.ES5) && __STRICT_MODE_SUPPORT ) {
                            return 5;
                        } else {
                            return 3;
                        }
                    } else {
                        return 2;
                    }
                }
            
                return -1;
                
            })(),
            
            
        /**
         * True when the JavaScript engine supports ECMAScript 5 features (without strict mode);
         * false otherwise.
         * @name $NS.env.ECMA_SCRIPT_5_METHODS
         * @info True if JavaScript engine supports all ECMAScript 5 methods (without strict mode).
         * @type boolean 
         * @requires __ES
         * @constant
         */
        ECMA_SCRIPT_5_METHODS: __ES.hasAllFeatures(__ES.ES5),
                

        /**
         * True if the JavaScript engine supports the strict mode; false otherwise
         * @name $NS.env.STRICT_MODE
         * @info True if strict mode is supported.
         * @type boolean
         * @constant
         */
        STRICT_MODE: __STRICT_MODE_SUPPORT,
        
        

        /**
         * True when the JavaScript engine supports ECMAScript 5 features (without strict mode);
         * false otherwise.
         * @name $NS.env.ECMA_SCRIPT_5
         * @info True if current JavaScript engine supports all ECMAScript 5 features
         * @type boolean 
         * @requires __ES
         * @constant
         */        
        ECMA_SCRIPT_5: __ES.hasAllFeatures(__ES.ES5) && __STRICT_MODE_SUPPORT,
            
            
        
        /**
         * Returns version of JavaScript/ECMAScript when feature was introduced
         * @name $NS.env.featureOf
         * @info Returns version of JavaScript/ECMAScript when feature was introduced
         * @requires __ES
         * @nosideeffects
         * @function
         * @param {object} obj
         * @param {string} feature
         * @returns {object}
         */
        getFeatureVersion: function(obj, feature){
            if( !__utils.isObject(obj) ) {
                throw new TypeError( obj+" is not an object" );
            }
            return {
                ES: __ES.findFeature(obj, feature)
            };
        },
                
            
        /**
         * Returns descriptive information about actual JavaScript environment.
         * It can produce text like this:
         * "JavaScript version 1.8.1 with ECMAScript 5 support"
         * @name $NS.env.toString
         * @info Descriptive information about current JavaScript environment.
         * @nosideeffects
         * @function
         * @returns {string} environment description
         */
        toString: function(){
            return "JavaScript version ".concat( this.JS_VERSION, 
                    " with ECMAScript ", this.ECMA_SCRIPT_5 ? "5" : "3", " support" );
        }
            
        //###
            
    };
    
    if( env.ECMA_SCRIPT_5_METHODS ) {
        Object.keys(env).forEach(function(key){
            Object.defineProperty(env, key, {
                writable: false,
                configurable: false
            });
        });
    }
    
    
    return env;

})();
