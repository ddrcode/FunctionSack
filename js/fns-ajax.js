/**
 * @name %(namespace)s.ajax
 * @namespace Essentail AJAX support
 * @static
 */ 
$NS.ajax = (function($NS){
    
    var __getAjaxObject = function(){
        if( typeof XMLHttpRequest !== 'undefined' ) {
            return new XMLHttpRequest();
        } else if(typeof ActiveXObject !== 'undefined') {
            return new ActiveXObject('Microsoft.XMLHTTP');
        }
        throw new Error("AJAX not supported");
    };

    return {
        
        /**
         * Asynchronously loads data as a plain text. 
         * Configuration object: url, onError, params, method
         * @name $NS.ajax.loadSync
         * @info Asynchronously loads data as a plain text. 
         * @function
         * @param {Object} conf A configuration object
         * @returns {string} Server output
         */
        loadSync: function(conf) {
            var request = __getAjaxObject();  
            request.open( 'GET', conf.url, false );
            if( request.overrideMimeType ) {
                request.overrideMimeType("text/plain; charset=utf-8");
            }
            // request.setRequestHeader("Content-Type","application/x-www-form-urlencoded"); // add for post
            request.send(null);  
            if( request.status === 0 || request.status === 200 ) {
                return request.responseText; 
            } else { 
                conf.onError && conf.onError( request.status );
            }
        }
    
        //###
    };

})();