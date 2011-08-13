/**
 * @name %(namespace)s.bom
 * @namespace Provides object access and manipulation functions
 * @static
 */ 
$NS.bom = (function($NS){
	
/*
 * Proposals:
 * Copty to clipboard () 
 */
	
	return {
		
		/**
		 * Returns object representation of query string
		 * @name $NS.bom.parseQueryString
		 * @info returns object representation of query string
		 * @requires $NS.str.unescapeURI
		 * @function
		 * @param {string} [queryString] A query string; if not specified window.location.search will be taken
		 * @returns {Object} A map of query parameters
		 */
		parseQueryString: function(queryString) {
		    var params = {},
	            query = (queryString || window.location.search || "").replace(/^\?/,""),
	            pattern = /([^&=]+)=?([^&]*)/g,
	            tmp = null;
		    while( !!(tmp = pattern.exec(query)) ) {
		            params[ $NS.str.unescapeURI(tmp[1]) ] = $NS.str.unescapeURI( tmp[2] );
		    }
		    return params;
		}		
		
		//###
		
	};
	
})();




