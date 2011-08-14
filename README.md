FunctionSack
============

FunctionSack is a cross-environment JavaScript toolbox with customized-download
feature. This project contains the source of FunctionSack features, including
simple build tool and unit tests. The documentation and download feature are
available at official [FunctionSack website](http://functionsack.com).

* Project status: beta tests
* Version: 0.5.0beta
* License: [MIT](http://www.opensource.org/licenses/mit-license.php)
* Home webpage: [http://functionsack.com](http://functionsack.com)
* Author: David de Rosier


## Build system

JavaScript files can't be used directly - they must be built with
[Jake](https://github.com/mde/jake) first. JavaScript files are divided into 
modules (ie. core, txt, type). You can build multiple or just a single JS file
into a single output file. Build options:

* before you do your first build - create ```build``` directory in the project
  dir. All build output will be saved there. 
* ```jake help``` - displays build options
* ```jake modules``` - lists the names of existing modules
* ```jake buildall``` - builds all modules to a single file (build/fnsack-full.js).
  It can be parametrized with file name. (However the 'build' directory can't
  be changed in current version).
* ```jake buildmod <modname>``` - builds a single module; build system recognizes
  here dependencies between modules and it builds the output file including them. 
  So ie the 'obj' module will be built together with obj and type modules. When
  more than one module name passed, build system will produce multiple files.
* ```jake build <file> <modules>``` - builds coustom file with selected modules.
  This option does not consider module dependencies and creates an output file
  based on provided module names. The output file does not require extension. 
  

## JSDocs generation

All source files contains documentation in 
[JSDocs](http://code.google.com/p/jsdoc-toolkit/) format. To generate the 
documentation follow the instruction below:

* create a ```doc``` directory in project folder
* install [jsdoc-toolkit](http://code.google.com/p/jsdoc-toolkit/)
* build FunctionSack with ```jake buildall``` instruction (see description above)
* Generate JSDocs with instruction:

  ```
java -jar jsrun.jar app/run.js -a -D="noGlobal:true" -D="title:FunctionSack" 
     -t=./build-files/jsdoc-template -d=./doc -n build/fnsack-full.js
  ```
*  Please note
  * ```jsrun.jar``` and ```app/run.js``` files come from jsdoc-toolkit, so provide the right path
  * -t paramater requires a full path to the JSDoc template instead of the local path
* Information: JSDocs generator uses page template located in 'build-files/jsdoc-template'
  directory. The template base on [Codeview Template](http://www.thebrightlines.com/2010/05/06/new-template-for-jsdoctoolkit-codeview/)
