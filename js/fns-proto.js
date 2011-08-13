/**
 * Non-standard extensions of standard-prototypes. In contract to {@link fs.es5}
 * module which provides ECMAScript 5-compliant prototype extensions.  
 * 
 * Provided features:<ul>
 * <li>{@link Array#contains}</li>
 * <li>{@link Array#diff}</li>
 * <li>{@link Array#removeAll}</li>
 * <li>{@link Array#first}</li>
 * <li>{@link Array#invoke}</li>
 * <li>{@link Array#uniquePush}</li>
 * </ul>
 * 
 * @name %(namespace)s.proto
 * @namespace Useful enhancements of standard prototypes
 * @static
 * @type {Object}
 */
(function(){
	
	var $AP = Array.prototype;	

	
	/**
	 * @name Array.prototype.contains
	 * @info Checks whether array contains an element
	 * @see $NS.proto
	 * @nosideeffects
	 * @function
	 * @param elem
	 * @returns {Boolean}
	 */
	$AP.contains = function(elem) {
		for(var i=0, len=this.length; i < len; ++i){
			if( this[i] === elem ) {
				return true;
			}
		}
		return false;
	};
	
	
	/**
	 * @name Array.prototype.diff
	 * @requires Array.prototype.contains
	 * @info Return difference between two arrays
	 * @see $NS.proto
	 * @nosideeffects
	 * @function
	 * @param arr
	 * @returns {Array}
	 */
	$AP.diff = function(arr){
		var result = [];
		for(var i=0, len=this.length; i < len; ++i){
			!arr.contains(this[i]) && result.push(this[i]);
		}
		return result;
	};
	
	
	/**
	 * @name Array.prototype.removeAll
	 * @info Removes from an array elements for which callback function returned true
	 * @see $NS.proto
	 * @function
	 */
	$AP.removeAll = function(item) {
		var found = 0;
		
		if( this.length < 1 ) {
			return;
		}
		
		for(var i=this.length-1; i >= 0; --i) {
			if(this[i] === item) {
				this.splice(i,1);
				++found;
			}
		}
		
		return found;
	};
	
	
	/**
	 * @name Array.prototype.first
	 * @info Returns first element for which callback function returned true
	 * @see $NS.proto
	 * @nosideeffects
	 * @function
	 */
	$AP.first = function(callback){
		
		if( !__utils.isFunction(callback) ) {
			throw new TypeError( callback + " is not a function" );
		}
	
		var thisArg = arguments[1]; 
		for(var i=0, len=this.length; i < len; ++i) {
			if( this.hasOwnProperty(String(i)) ) {
				if( callback.call(thisArg, this[i], i, this) ) {
					return this[i];
				}
			}
		}
	
		return void 0;
	};	
	
	
	/**
	 * @name Array.prototype.invoke
	 * @info Invokes method of each array element and returns an array of results
	 * @see $NS.proto
	 * @function
	 * @example [[1,2,3],["a","b"]].invoke("join",""); //returns ["123","ab"]
	 */
	$AP.invoke = function(methodName, param1 /*,...*/){
        var args = $AP.slice.call(arguments, 1),
            len = this.length,
            results = new Array(len);
        
        for(var i=0; i < len; ++i) {
            if( this.hasOwnProperty(String(i)) ) {
                results[i] = this[i][methodName].apply(this[i], args);
            }
        }
        
        return results;	    
	};
	
	
    /**
     * @name Array.prototype.uniquePush
     * @info Push element to an array only if it doesn't already exits there
     * @see $NS.proto
     * @requires Array.prototype.contains 
     * @function
     */
    $AP.uniquePush = function(elem){
        if( !this.contains(elem) ) {
            this.push(elem);
            return true;
        }
        return false;
    };	

	
	//###
	

})();