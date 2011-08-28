/**
 * The module initialization exits silently when DOM not recognized
 * (no functions will be created in such case). Thanks to it the
 * module can be loaded to non-DOM environments like Rhino or Node.
 * However if it is planned to be used together with DOM emulators
 * like JS-DOM or EnvJS - the emulators must be loaded before
 * FunctionSack. 
 * @name %(namespace)s.dom
 * @namespace Essential DOM and events manipulation
 * @static
 */ 
$NS.dom = (function(){

    // exit if DOM is not supported
    // note: JS-DOM and other DOM emulators should be loaded before FunctionSack
    if( typeof document === 'undefined' || typeof document.createElement === 'undefined' ) {
        return {};
    }

    var __D = document,
        __slice = Array.prototype.slice,
        __elem = function(el) {
            return typeof el === 'string' ? $NS.dom.byId(el) : el;
        }
    ;
    
    
    return {
    
        /**
         * Returns an element (or elements) of a given ID (or IDs).
         * When only one attribute passed function return an element. 
         * For more than one attribute it will return an array of elements. 
         * @name $NS.dom.byId
         * @info Returns DOM element(s) of given ID(s)
         * @function
         * @param {string} is element's id
         * @returns {Element|Array} HTML element or null
         * @example $NS.dom.byId('myElem')
         */
        byId: function(id) {
            if( arguments.length < 2 ) {
                return __D.getElementById(id);
            }
            var arr = [];
            for(var i=0, len=arguments.length; i < len; ++i) {
                arr.push( __D.getElementById(arguments[i]) );
            }
            return arr;
        },
        
        
        /**
         * Returns list of element selected by tag name
         * @name $NS.dom.byTagName
         * @info Returns list of elements of given tag name
         * @function
         * @param {Object} tagName
         * @returns {NodeList} list of nodes
         * @example $NS.dom.byTagName('head')
         */
        byTagName: function(tagName){
            return __D.getElementsByTagName(tagName);
        },
        
        
        /**
         * This function is mostly useful for libraries and util functions
         * than for direct use. Thanks to it there possible to avoid recognition
         * if someone passed to our code a DOM element or its ID - exactly the 
         * same way like in most of functions in this module.
         * 
         * @name $NS.dom.getElement
         * @info Accepts string or HTML element as parameter; when string passed works like dom.byId
         * @function
         * @param {string|Element} el DOM element or its ID
         * @returns {Element} DOM element
         * 
         * @example 
         *   function validateFormElement(elem) {
         *      elem = fs.dom.getElement(elem);
         *      // your code here
         *   }
         *   // usage (both examples work the same way):
         *   validateFormElement("firstname");
         *   validateFormElement(fs.dom.byId("firstname"));
         */
        getElement: __elem,

        
        /**
         * Creates a DOM element object base on input parameters.
         * 
         * @name $NS.dom.create
         * @info creates new DOM element
         * @function
         * @param {string} tag A name of the element
         * @param {Object} [params] The element attributes; optional
         * @param {string|Node} [body] A body of the element; optional
         * @returns {Element} created element
         * 
         * @example $NS.dom.create('div')
         * @example $NS.dom.create('div', {id: 'main', 'class': 'big'}, 'Some text here')
         * @example $NS.dom.create('div', {}, $NS.dom.create('img', {src: 'myimg.png'}) )
         */
        create: function(tag, params, body) {
            var node = __D.createElement( tag );
            for(var param in params) { if(params.hasOwnProperty(param)) {
                node.setAttribute( param, params[param] );
            }}
            if( arguments.length > 2 ){
                var bodyElements = Array.prototype.slice.call(arguments, 2);
                while( !!(body=bodyElements.shift()) ){
                    if( typeof body === 'object' && body.appendChild ) {
                        node.appendChild( body );
                    } else {
                        node.appendChild( __D.createTextNode(body) );
                    }
                }
            }
            return node;
        },


        /**
         * Appends given node to parent. Can be easy combined with
         * $NS.dom.create function.
         * @name $NS.dom.append 
         * @info Appends DOM element(s) to a given element 
         * @function
         * @param {string|Node} parent node or its id
         * @param {Node} an element to be added
         * @example $NS.dom.append('menu', $NS.dom.create('div'))
         */
        append: function(elem /*, childNodes ... */) {
            var parentNode = __elem( elem ),
                childNodes = __slice.call( arguments, 1 ),
                node;
            
            while( !!(node = childNodes.shift()) ) {
                parentNode.appendChild( node );
            }
        },


        /**
         * Removes DOM element
         * @name $NS.dom.remove
         * @info Removes DOM element
         * @function
         * @example $NS.dom.remove('myplace')
         * @example $NS.dom.remove($NS.dom.byId('myplace'))
         * @param {string | Element} elem A DOM element or its id
         */
        remove: function(elem) {
            var node = __elem( elem );
            node && node.parentNode && node.parentNode.removeChild(node);
        },


        /**
         * Removes all children from given DOM node.
         * @name $NS.dom.removeChildNodes
         * @info Removes all children of given DOM element
         * @function
         * @param {string | Element} elem A DOM element or its id
         * @example $NS.dom.removeChildNodes('myplace')
         * @example $NS.dom.removeChildNodes($NS.dom.byId('myplace'))
         */
        removeChildNodes: function(elem){
            var node = __elem( elem );
            while(node.hasChildNodes()){
                node.removeChild(node.firstChild);
            }
        },


        /**
         * Safely removes DOM element - to avoid memory leaks on older browsers.
         * The method recursively removes all children of given node and at the
         * end removes the node itself. 
         * @name $NS.dom.destroy
         * @info Safely (recursively) removes DOM element
         * @function
         * @param {string | Element} elem  A DOM element or its id
         * @example $NS.dom.destroy('menu')
         * @example $NS.dom.destroy($NS.dom.byId('menu'))
         */
        destroy: function(elem) {
            var node = __elem( elem );
            while( node && node.hasChildNodes() ) {
                this.destroy( node.firstChild );
            }
            this.remove(node);
        },


        /**
         * Checks if the given element has a CSS class
         * @name $NS.dom.hasClass
         * @info Checks if the given element has a CSS class
         * @function
         * @param {string | Element} elem A DOM element or its id
         * @param {string} className A CSS class name
         * @returns {boolean} 
         */
        hasClass: function(elem, className) {
            var node = __elem( elem );
            var pattern = new RegExp("(\\s|^)("+className+")(\\s|$)");
            return pattern.test( node.className );
        },
        
        
        /**
         * Adds new CSS class (or classes) to given element. The class
         * won't be added if already exist. 
         * @name $NS.dom.addClass
         * @info Adds new CSS class(es) to a given element.
         * @requires $NS.dom.hasClass
         * @function
         * @param {string | Element} elem A DOM element or its id
         * @param {string} class1 A CSS class name
         * @returns {number} number of classes added to the element
         */
        addClass: function(elem, class1 /*, ...*/) {
            var node = __elem( elem ),
                args = __slice.call( arguments, 1 ),
                newClasses = [];
            
            for(var i=0, len=args.length; i < len; ++i) {
                this.hasClass(node, args[i]) || newClasses.push(args[i]);
            }
            
            if( newClasses.length ) {
                node.className += (node.className.length ? " " : "") + newClasses.join(" ");
            }
            
            return newClasses.length;
        },
        
        
        /**
         * Removes CSS class (or classes) from a given element
         * @name $NS.dom.removeClass
         * @info Removes CSS class from given element.
         * @function
         * @param {string | Element} elem DOM element or its id
         * @param {string} class1 A CSS class name
         * @returns {number} number of removed CSS classes
         */    
        removeClass: function(elem, class1 /*,...*/) {
            var node = __elem( elem ),
                args = __slice.call( arguments, 1 ),
                classes = node.className.split(/\s+/),
                alen = args.length,
                result = 0;
            
            while( alen-- ) {
                for( var i=classes.length-1; i >= 0; --i ) {
                    if( args[alen] === classes[i] ) {
                        classes.splice( i, 1 );
                        ++result;
                    }
                }
            }
            
            node.className = classes.join(" ");
            return result;
        },
        
        
        /**
         * Replaces CSS class with another one
         * @name $NS.dom.replaceClass
         * @info Replaces CSS class with another one
         * @function
         */
        replaceClass: function(elem, srcClass, dstClass) {
            var e = __elem( elem );
            this.hasClass( e, srcClass ) && this.removeClass( e, srcClass );
            this.addClass( e, dstClass );
        },
        
        
        /**
         * Hides DOM element(s)
         * @name $NS.dom.hide
         * @info Hides DOM element
         * @function
         * @param {string | Element} elem A DOM element or its id
         */
        hide: function(/* ... */) {
            var args = __slice.call( arguments ),
                node;
            
            while( !!(node = args.shift()) ) {
                node = __elem( node );
                if( node.style.display !== 'none' ) {
                    node.__lastDisplay = node.style.display;
                    node.style.display = "none";
                }
            }
        },
        
        
        /**
         * Shows the hidden element(s)
         * @name $NS.dom.show
         * @info Shows hidden DOM element
         * @function
         * @param elem {string | element} DOM element or its id
         */
        show: function(elem) {
            var args = __slice.call( arguments ),
                node;
            
            while( !!(node = args.shift()) ) {
                node = __elem(node);
                node.style.display = node.__lastDisplay || "";
            }
        },

        
        /**
         * Sets text for the node
         * TODO: basic xss prevention removing script tags
         * @name $NS.dom.setText
         * @info Set text to a DOM element.
         * @function
         * @param {Object} elem
         * @param {String} text
         * @param {String} [defaultValue]
         */
        setText: function(elem, text, defaultValue){
            var node = __elem( elem );
            var f;
            if( "textContent" in node ) {
                f = function(elem, text, defaultValue){
                    var node = __elem( elem );
                    node.textContent = text;
                };
            } else if( "innerText" in node ) {
                f = function(elem, text, defaultValue){
                    var node = __elem( elem );
                    node.innerText = text;
                };
            } else {
                f = function(elem, text, defaultValue){
                    var node = __elem( elem );
                    while(node.hasChildNodes()){
                        node.removeChild(node.firstChild);
                    }
                    node.appendChild(document.createTextNode(text));
                };
            }
            this.setText = f;
            return f.apply(this, arguments);
        },
            
        
        /**
         * Function sets HTML for the element
         * @name $NS.dom.setHTML
         * @info Sets HTML to an element
         * @function
         * @param {Object} elem
         * @param {String} html
         * @param {String} [defaultValue]
         */
        setHTML: function(elem,html,defaultValue){
            var node = __elem( elem );
            if(node){
                node.innerHTML = html || defaultValue || "";
            }
        },
        
        
        /**
         * Get/set CSS style attribute
         * @name $NS.dom.style
         * @info get/set CSS style attribute
         * @requires $NS.str.camelize
         * @requires $NS.toArray
         * @function
         * 
         * @param {Element|string|Array} elem DOM element or its ID (or an array of elements or IDs)
         * @param {string|Object} propertyName A name of style property
         * @param {string} [value] A value of style property
         * @returns {string|Array}
         * 
         * @example var bgcolor = $NS.dom.style("menu","background-color");
         * @example $NS.dom.style(myMenu, "display", "none");
         */
        style: function(elems, propertyName, value){
            elems = $NS.toArray(elems);
            var results = new Array( elems.length ),
                isObj = __utils.isObject(arguments[1]),
                i = null;
            
            if( isObj ) {
                var obj = {};
                for( i in propertyName ) { if(propertyName.hasOwnProperty(i)) {
                    obj[ $NS.str.camelize(i) ] = propertyName[i];
                }}
                propertyName = obj;
            } else {
                propertyName = $NS.str.camelize( propertyName );
            }
            
            for( var i=0, len=elems.length; i < len; ++i ) {
                var elem = __elem( elems[i] );
                if( isObj) {
                    __utils.mixin(elem.style, arguments[1]);
                    results[i] = arguments[1];
                } else {
                    results[i] = ( arguments.length < 3
                            ? elem.style[propertyName]
                            : (elem.style[propertyName] = value) );
                }
            }
            return results.length === 1 ? results[0] : results;
        },
        
        
        /**
         * Adds given function as a listener to a DOM element
         * @name $NS.dom.addListener
         * @requires $NS.toArray 
         * @info Adds given function as a listener to a DOM element
         * @function
         * @see $NS.dom.listenOnce
         * 
         * @param {Element|string|Array} elem DOM Element or its ID. 
         * @param {string} eventName Name of an event without "on" prefix (eg. "click") 
         * @param {function} handler Event listener function
         * @param {boolean} [capturing=false] enables capturing phase
         * @returns {function} Event listener; in most of the cases result is equal to 'handler'
         *          attribute, although on older IE versions (where only attachEvent is available),
         *          the handler must be wrapped with another function. addListener returns the real
         *          event listener in this case.
         *          
         * @example $NS.dom.addListener('menu', 'click', function(event){ ... });
         * @example $NS.dom.addListener(document.getElementsByTagName('input'),'blur',validator);
         */
        addListener: (function() {
            if( window.addEventListener ) {
                return function(elems, eventName, handler, capturing) {
                    elems = $NS.toArray(elems);
                    for(var i=0, len=elems.length; i < len; ++i){
                        var elem = __elem(elems[i]);
                        elem.addEventListener(eventName, handler, !!capturing);
                    }
                    return handler;
                };
            }
                
            // TODO stop propagation and capturing
            if( window.attachEvent ) {
                return function(elems, eventName, handler) {
                    elems = $NS.toArray(elems);
                    var ieHandler = function(){
                        handler.call( window.event.srcElement, window.event );
                    };
                    for(var i=0, len=elems.length; i < len; ++i){
                        elem = __elem(elems[i]);
                        elem.attachEvent( "on"+eventName, ieHandler );
                    }
                    return ieHandler;
                };
            }
                
            return function(elems, eventName, handler) {
                elems = $NS.toArray(elems);
                for(var i=0, len=elems.length; i < len; ++i){
                    var elem = __elem(elems[i]);
                    elem[ "on"+eventName ] = handler;
                }
                return handler;
            };
        })(),
        
        
        /**
         * Adds listener for single time execution. The event listener will be 
         * automatically removed after first execution.
         * @name $NS.dom.listenOnce
         * @info Adds listener for one time execution.
         * @requires $NS.dom.addListener
         * @requires $NS.toArray
         * @requires $NS.bind
         * @function
         * @see $NS.dom.addListener
         * 
         * @param {Element|string|Array} elem DOM Element or its ID or array of them. 
         * @param {string} eventName Name of an event without "on" prefix (eg. "click") 
         * @param {function} handler Event listener function
         * @param {boolean} [capturing=false] enables capturing phase
         * @returns {function} Event listener
         */
        listenOnce: function(elems, eventName, handler, capturing){
            elems = $NS.toArray(elems);
            function fh(event){
                    handler.call(this, event);
                    $NS.dom.removeListener(this, eventName, fh, capturing);
                };
            for(var i=0, len=elems.length; i < len; ++i){
                var elem = __elem(elems[i]);
                this.addListener(elem, eventName, fh.bind(elem), capturing);
            }
            return fh;
        },
        
        
        /**
         * Removes event listener from given DOM element 
         * @name $NS.dom.removeListener
         * @info Removes event listener from given DOM element 
         * @function
         */
        removeListener: (function(){
            if( window.removeEventListener ) {
                return function(elem, eventName, handler, capturing) {
                    elem = __elem(elem);
                    elem.removeEventListener(eventName, handler, !!capturing);
                };
            }
            
            if( window.detachEvent ) {
                return function(elem, eventName, handler) {
                    elem = __elem(elem);
                    elem.detachEvent( "on"+eventName, handler );
                };
            }
            
            return function(elem, eventName){
                elem = __elem(elem);
                elem[ "on"+eventName ] = null;
            };
        })(),
        
        
        /**
         * Triggers an event
         * @name $NS.dom.dispatchEvent
         * @info Triggers an event
         * @function
         */
        dispatchEvent: (function(){
            if(document.createEvent) {
                return function(elem, eventName, eventData){
                    var myEvent = document.createEvent( "Event" );
                    elem = __elem(elem);
                    myEvent.initEvent( eventName, true, true );
                    eventData && __utils.mixin( myEvent, eventData );
                    elem.dispatchEvent( myEvent );
                };
            } else if(document.createEventObject) {
                return function(elem, eventName, eventData){
                    var myEvent = document.createEventObject(window.event);
                    elem = __elem(elem);
                    eventData && __utils.mixin( myEvent, eventData );
                    elem.fireEvent("on"+eventName, myEvent);
                };
            } else {
                return function(){
                    throw new Error("Event dispatching is not supported");
                };
            }
        })()
    
        //###
    
    };
    
})();