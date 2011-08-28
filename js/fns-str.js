/**
 * @name %(namespace)s.str
 * @namespace Module provides set of functions for string manipulation
 * @static
 */
$NS.str = (function(){

    return {
        
        
        /**
         * @name $NS.str.escapeHTML
         * @info Escapes HTML special characters in a string
         * @function
         * 
         * @param {string} str
         * @returns {string}
         */
        escapeHTML: (function(){
            
            var __MAP = {
                    '&': '&amp;',
                    '<': '&lt;',
                    '>': '&gt;',
                    '\\': '\\\\',
                    '"': '\"'
                },
            
                __replaceFn = function(c) {
                    return __MAP[c];
                },
                
                __pattern = /[<>&]/g
            ;
            
            return function(str) {
                return String(str).replace( __pattern, __replaceFn );
            };
            
        })(),
        
        
        /**
         * @name $NS.str.unescapeHTML
         * @info Unescapes HTML special characters from a string
         * @function
         * 
         * @param {string} str
         * @returns {string}
         */
        unescapeHTML: (function(){
            
            var __MAP = {
                    '&lt;': '<',
                    '&gt;': '>',
                    '&amp;': '&',
                    '\"': '"',
                    '\\\\': '\\'
                },
            
                __replaceFn = function(c) {
                    return __MAP[c];
                },
                
                __pattern = /&gt;|&lt;|&amp;/g
            ;
            
            return function(str) {
                return String(str).replace( __pattern, __replaceFn );
            };
            
        })(),
        
        
        /**
         * @name $NS.str.unescapeURI
         * @info Returns decoded URI string (fixes problems with standard decodeURIComponent)
         * @function
         * 
         * @param {string} uri URI string
         * @returns {string}
         */
        unescapeURI: function(uri){
            return decodeURIComponent( uri.replace(/\+/g, " ") );
        },
        
        
        /**
         * @name $NS.str.escapeURI
         * @info Delegation of standard encodeURIComponent (for coherent convention with unescapeURI)
         * @function
         * 
         * @param {string} str a string
         * @returns {string} Escaped URI string 
         */
        escapeURI: function(str) {
            return encodeURIComponent( str );
        },
        
        
        /**
         * @name $NS.str.trim
         * @info Trims the string from left and right side.
         * @function
         * 
         * @param {string} input string; in non-string passed it will be converted to string
         * @returns {string} trimmed string
         */
        trim: (function(){
            var __LTRIM = /^\s\s*/,
                __RTRIM = /\s\s*$/;
            
            return function(str){
                return String(str).replace(__LTRIM, '').replace(__RTRIM, '');
            };
        })(),
        
        
        /**
         * Produces formated string for {param}-style templates.
         * 
         * @name $NS.str.format
         * @requires $NS.obj.access
         * @info Produces formated string for {param}-style templates
         * @function
         * 
         * @param {string} str Template string
         * @param {Object|string} data Object with parameters or list of values (multiple attributes of the function) 
         * @returns {string} Formatted text.
         * 
         * @example $NS.str.format("Hello, I'm {0}, age {1}", "David", 34);
         * @example $NS.str.format("Hello, I'm {0}, age {1}", ["David", 34]);
         * @example $NS.str.format("Hello, I'm {name}, age {age}", {name: "David", age:34});
         */
        format: function(str, data) {
            var args = String(str).replace(/\{\{|\}\}/g,'').match(/\{[^{}]+\}/g) || [],
                params = arguments.length > 2 ? Array.prototype.slice.call(arguments, 1) : (typeof data === 'object' ? data : [data]);
            
            for( var arg; !!(arg=args.shift()); ) {
                var name = arg.substr(1, arg.length-2);
                str = str.replace( arg, $NS.obj.access(params, name) );
            }
            
            return str ? str.replace(/\{\{/g,"{").replace(/\}\}/g,"}") : str;
        },
        
        
        /**
         * Repeats string n-times.
         * 
         * @name $NS.str.repeat
         * @info Repeats string n-times.
         * @function
         * 
         * @param {string} str
         * @param {number} [times=1]
         * @returns {string}
         */
        repeat: function(str,times) {
            var res = str;
            times = isNaN(times) ? 0 : times;
            while( --times > 0 ) {
                res += str;
            }
            return res;
        },
        
        
        /**
         * Returns reversed string.
         * 
         * @name $NS.str.reverse
         * @info Returns reversed string.
         * @function
         * 
         * @param {string} str
         * @returns {string} Reversed string.
         */
        reverse: function(str) {
            return String(str).split('').reverse().join('');
        },
        
        
        /**
         * Looks if given text contains a phrase and returns a boolean.
         * 
         * @name $NS.str.contains
         * @info Checks whether string contains given phrase.
         * @nosideeffects
         * @function
         * 
         * @param {string} str A string for test.
         * @param {string} searchStr A phrase to find in the string. 
         * @returns {boolean} True if searchStr found in the str, false otherwise.
         */
        contains: function(str, searchStr) {
            return String(str).indexOf(searchStr) >= 0;
        },
        
        
        /**
         * Makes a string camel-case
         * @name $NS.str.camelize
         * @info Makes a string camel case
         * @function
         * @param {string} str A string
         * @returns {string} camelized string
         * @example $NS.str.camelize('this-is_a_test') === 'thisIsATest';
         */
        camelize: (function(){
            var __pattern = /[_\-][a-z]/g,
                __camelizer = function(x){ return x.charAt(1).toUpperCase(); };
            return function(str) {
                return String(str).replace( __pattern, __camelizer ); 
            };
        })()
        
        //###
        
    };

})();
