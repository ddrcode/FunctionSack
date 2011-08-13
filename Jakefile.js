var builder = require("./build-files/jsbuilder"),
    sys = require("sys"),
    fs = require("fs"),
    util = require("util"),
    
    config = (function(){
            var file = fs.readFileSync("./config.json", "utf-8");
            var obj = JSON.parse( file );
            return Object.freeze( obj );
        })()
;






desc( "Default operation" );
task( "default", function(){
    var rs = fs.createReadStream("./build-files/help.txt", {encoding: 'utf-8'});
    rs.pipe(process.stdout);
} );



desc("Help screen");
task("help",["default"], function(){});



desc( "displays FunctionSack version" );
task("version", function(){
    sys.puts( "FunctionSack Source version " +config.version );
    sys.puts( "Copyright (c) 2011 David de Rosier. All rights reserved." );
});



desc( "Display module names" );
task( "modules", function(){
    console.log( config.modules.join("\n") );
});



desc( "Displays modules and their dependencies" );
task( "dependencies", function(){
    Object.keys(config.dependencies).forEach(function(dep){
        var deps = builder.getDependentModules(config, dep);
        console.log( dep.concat(": \t" + deps.join(", ") ) );
    });
});


desc( "Build specified file(s)" );
task( "build", function(file){
	var mods = Array.prototype.slice.call(arguments,1).filter(function(module){
			if( config.modules.indexOf(module) < 0 ) {
				console.log( "Cannot find module: " + module );
				return false;
			} 
			return true;
		});
	mods.sort(function(a,b){
			return config.modules.indexOf(a) - config.modules.indexOf(b);
		});
	file = file.indexOf(".js") > 0 ? file : file+".js";
	builder.build( config, mods, file );
});



desc( "Builds all files" );
task( "buildall", function(){
    builder.build( config, config.modules, "fnsack-full.js" );
});



desc( "Builds a module (considering the dependencies)" );
task( "buildmod", function(){
    Array.prototype.slice.call(arguments).forEach(function(mod){
            var mods = builder.getDependentModules(config, mod);
            mods.push( mod );
            builder.build( config, mods, config.FILE_PREFIX+mod+"-full.js" );
        });
});
