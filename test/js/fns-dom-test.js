module('fns.dom module');



test('Function: byId', 6, function() {
	ok( fns.dom.byId('test'), "can access 'test' element" );
	ok( fns.dom.byId('test').innerHTML, "'test' element is a node" );
	equals( fns.dom.byId('test2'), null, "function invocation with non-existing id" );
    dom = fns.dom.byId("test", "testRemove");
    ok( Object.prototype.toString.call(dom) === "[object Array]" );
    ok( dom.length === 2 );
    ok( dom[0] === fns.dom.byId("test") );	
});


test('Function: create', 4, function() {
	var $ = fns.dom.byId;
	var dom =  fns.dom.create('br');
	$('test').appendChild(dom)
	ok( $('test').innerHTML.match(/\<br/i), 'can create br tag with 1-argument create function' );
	
	dom = fns.dom.create('input', {id: 'test-input', type: 'button', value: 'Test'} );
	$('test').appendChild( dom );
	ok( $('test-input'), 'can create a button with 2-arguments create function' );
	
	dom = fns.dom.create('div', {id: 'test-dom'}, "Create function test" );
	$('test').appendChild( dom );
	ok( $('test-dom'), 'can create dom wih body using 3-arguments create function' );
	
	dom = fns.dom.create('div', {id: 'test-level1'}, 
	fns.dom.create('span', {id: 'test-level2'}, "Cascade" ) );
	$('test').appendChild( dom );
	ok( $('test-level1') && $('test-level2'), 'can create dom-tree with create method' );
	
});


test('Function: append', 2, function() {
	var $ = fns.dom.byId;
	
	fns.dom.append('test', fns.dom.create('span',{id:'test-appended1'},'Appended text (id)'));
	ok( $('test-appended1'), 'can add a child to an element with append function - id access' );

	fns.dom.append(fns.dom.byId('test'), fns.dom.create('span',{id:'test-appended2'},'Appended text (object)'));
	ok( $('test-appended2'), 'can add a child to an element with append function - object access' );
});


test('Function: remove', 3, function() {
	var $ = fns.dom.byId;
	
	fns.dom.remove('test-appended1');
	equals( $('test-appended1'), null, 'DOM element removed with remove(string) function' );
	
	fns.dom.remove( $('test-appended2') );
	equals( $('test-appended2'), null, 'DOM element removed with remove(Node) function' );
	
	equals( true, (function() {
			try {
				fns.dom.remove( 'non-existing-node' );
				return true;
			} catch(e) { return false; }
		})(), 'calling remove function on non-existing node doesn\'t cause any error');
});

test('Function: removeChildNodes', 2, function() {
	var $ = fns.dom.byId;
	
	fns.dom.append('testRemove', fns.dom.create('span',{id:'test-appended1'},'Appended text (id)'));
	fns.dom.append('testRemove', fns.dom.create('span',{id:'test-appended2'},'Appended text (object)'));
	
	var testElem = $('testRemove');
	
	ok(testElem.childNodes.length > 0,'Nodes appended to test element');
	
	fns.dom.removeChildNodes(testElem);
	
	ok(testElem.childNodes.length === 0,'Nodes removed from test element');
	
});


test('Function: destroy', 4, function() {
	var $ = fns.dom.byId;
	
	fns.dom.destroy( 'test-dom' );
	ok( fns.dom.byId('test-dom') == null, "DOM element removed with destroy(string) function" );
	
	var br = fns.dom.create('br', { id: "destroy-test" });
	fns.dom.append( 'test', br );
	fns.dom.destroy( $('destroy-test') );
	equals( $('destroy-test'), null, 'DOM element removed with destroy(Node) function' );
	
	fns.dom.destroy( $('test-level1') );
	ok( !($('test-level1') || $('test-level2')), 'DOM element removed together with its children' );
	
	equals( true, (function() {
		try {
			fns.dom.destroy( 'non-existing-node' );
			return true;
		} catch(e) { return false; }
	})(), 'calling destroy function on non-existing node doesn\'t cause any error');
});


test('Function: hasClass', 4, function() {
	equals( fns.dom.hasClass('test', 'testPane'), true, "Does 'test' have 'testPane' css class (id version)?" );
	equals( fns.dom.hasClass('test', 'non-existing-class'), false, "Does 'test' have 'non-existing-class' css class (id version)?" );

	var test = fns.dom.byId('test');
	equals( fns.dom.hasClass(test, 'testPane'), true, "Does 'test' have 'testPane' css class (node version)?" );
	equals( fns.dom.hasClass(test, 'non-existing-class'), false, "Does 'test' have 'non-existing-class' css class (node version)?" );	
	
});


test('Function: addClass', 6, function() {
	var q = fns.dom.addClass('test', 'test1');
	equals( fns.dom.hasClass('test', 'test1'), true, "'test1' CSS class added (id version)" );
	equals( q, 1, "Function output check - number of added classes" );
	
	fns.dom.addClass(fns.dom.byId('test'), 'test2');
	equals( fns.dom.hasClass('test', 'test2'), true, "'test2' CSS class added (node version)" );
	
	q = fns.dom.addClass(fns.dom.byId('test'), 'test2');
	equals( q, 0, "Attempt to add 'test2' class again. Number of added classes" );
	
	q = fns.dom.addClass('test', 'test3', 'test4', 'test5');
	equals( q, 3, "Adding multiple CSS classes" );
	
	var classes = fns.dom.byId('test').className;
	equals( classes, 'testPane test1 test2 test3 test4 test5', "Checks the order of added CSS classes" );
});


test('Function: removeClass', 5, function() {
	var q = fns.dom.removeClass('test', 'test3');
	ok( fns.dom.hasClass('test', 'test3') === false, "'test3' CSS class has been removed (id version)" );
	equals( q, 1, "'removeClass' function output check - number of removed classes" );
	
	fns.dom.removeClass(fns.dom.byId('test'), 'test4');
	ok( fns.dom.hasClass('test', 'test4') === false, "'test4' CSS class has been removed (node version)" );
	
	q = fns.dom.removeClass('test', 'test1', 'test2', 'test5');
	equals( q, 3, "Removig multiple CSS classes" );
	
	var classes = fns.dom.byId('test').className;
	equals( classes, 'testPane', "Checks remaing CSS classes after removal" );	
});


test('Function: addEvent/removeEvent', function() {
	var executionCount = 0;
	var input = fns.dom.byId('test-input');
	var handler = fns.dom.addListener(input,'click', function(e){
		ok(true, "Event 'click' registered for 'test-input' element (node version)");
		ok(e, "Event handler parameter is defined");
		++executionCount;
	});
	jQuery(input).trigger('click');
	
	fns.dom.removeListener(input,'click', handler );
	jQuery(input).trigger( 'click' );
	ok( executionCount === 1, "Event handler removed from 'test-input' element (node version)" );
});
