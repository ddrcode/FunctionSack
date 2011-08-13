// %(namespace)s.core module
(function(){
	
	
	__utils.mixin( $NS, {
		
			/**
			 * @name $NS.mixin
			 * @function
			 * @info Combines multiple objects into one.
			 * 
			 * @param {Object} dst destination object	
			 * @param {Object} src source object (multiple source object allowed)
			 * @returns {Object} dst object
			 */
			mixin: __utils.mixin,
			
			
			/**
			 * Converts an object to an array
			 * @name $NS.toArray
			 * @info Converts given object to an array.
			 * @function
			 * 
			 * @param {Object} obj
			 * @param {number} [idxFrom]
			 * @param {number} [idxTo]
			 * @returns {Array}
			 */
			toArray: (function(){
				if( Array.prototype.slice.call("a")[0] === "a" && [1].slice(void 0, void 0).length === 1 ){
					// modern browsers
					return function(obj, idxFrom, idxTo){
						return Array.prototype.slice.call(obj, idxFrom, idxTo);
					};
				}
				
				// older browsers
				return function(obj, idxFrom, idxTo){
					var args = []; 
					arguments[1] && args.push(arguments[1]) && arguments[2] && args.push(arguments[2]);
					if( Object.prototype.toString.call(obj) === "[object String]" ) {
						return Array.prototype.slice.apply(obj.split(""), args);
					}
					try {
						return Array.prototype.slice.apply(obj, args);
					} catch(ex) {
						if( typeof obj.length === 'number' ) {
							var len = obj.length;
							var arr = new Array( len );
							len = args[1] || len;
							for( var i=args[0] || 0; i < len; ++i ) {
								arr[i] = obj[i];
							}
							return arr;
						}
						return [];
					}
				};
			})(),

			
			/**
			 * Binds the function to a given context and returns a wrapper function.
			 * Practically it 'converts' a method to a function with remembering 
			 * the context.
			 * @name $NS.bind
			 * @info Binds the function to a given context and returns a wrapper function.
			 * @function
			 * 
			 * @param {function} fn Original function 
			 * @param {Object} ctx method's context
			 * @returns {function} wrapped function
			 * 
			 * @example var flatFunction = $NS.bind(myFunction, obj);
			 * var obj = {
			 *    title: "My person title",
			 *    showTitle: function(){
			 *       alert( this.title );
			 *    }
			 * };
			 * document.addEventListener("click",
			 *    $NS.bind( obj.showTitle, document ),
			 *    false);
			 */
			bind: function(fn, ctx){
		        if( !__utils.isFunction(fn) ) {
		            throw new TypeError( "'this' is not a function" );
		        }
		        var args = Array.prototype.slice.call(arguments,2);
		            
		        return function() {
		            return fn.apply( ctx, args.concat(Array.prototype.slice.call(arguments)) );
		        };
			}		
	
			//###	
	
		});
	
})();