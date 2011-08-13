var fs         = require("fs"),
    path       = require("path")
;


var builder = {
    
    getTemplate: function(dir, file){
        return fs.readFileSync( path.join(dir, file), "utf-8" );
    },
    
    
    readSourceFiles: function(dir, filePrefix, modules) {
        return modules.map(function(moduleName){
                return fs.readFileSync( path.join(dir, filePrefix+moduleName+".js"), "utf-8" );
            }).join("\n");
    },
    
    
    applyTemplate: function(template, namespace, code) {
        return template
                    .replace("%(code)s", code)
                    .replace(/\%\(namespace\)s/g, namespace)
                    .replace(/\/\/\#.+\n/g,"")
                    .replace(/\@name\s+\$NS/g, "@name "+namespace)
                    .replace(/\@requires\s+\$NS/g, "@requires "+namespace)
                    .replace(/\@see\s+\$NS/g, "@see "+namespace)
                    .replace(/\t/g, "    ")
                    ;
    },
    
    
    build: function(config, modules, outFile) {
        var template = this.getTemplate( config.TEMPLATES_DIR, config.MAIN_TEMPLATE_FILE );
        var code = this.readSourceFiles(config.SRC_DIR, config.FILE_PREFIX, modules);
        code = this.applyTemplate(template, config.DEFAULT_NAMESPACE, code);
        fs.writeFileSync( path.join(config.OUT_DIR, outFile), code, "utf-8" );
    },
    

    
    getDependentModules: function(config, module) {
        if( !config.dependencies[module] ) {
            return [];
        }
        var res = [];
        config.dependencies[module].forEach(function(md){
            res = res.concat( this.getDependentModules(config, md) );
                res.push(md);
            }, this);
        return res; 
    }
        
};


Object.keys(builder).forEach(function(key){
        exports[key] = builder[key];
    });