'use strict';

var path = require('path');
var fs = require('fs');

module.exports = function(source, sourceMap) {
    // /foo/bar/file.js
    var srcFilepath = this.resourcePath;
    // /foo/bar/file.js -> file
    var srcFilename = path.basename(srcFilepath, path.extname(srcFilepath));
    // /foo/bar/file.js -> /foo/bar
    var srcDirpath = path.dirname(srcFilepath);
    // /foo/bar -> bar
    var srcDirname = srcDirpath.split(path.sep).pop();

    if (this.cacheable) {
        this.cacheable();
    }

    var inject = '';

    var passes = (/require\('\.\/(.*)\.html'\)/).test(source);

    if (passes) {
        inject = '\n/* Injected by absolut-loader */\n';

        // RegExp that will match every .html file
        var match = /require\('\.\/(\S*\.html)\'\)/g;

        // Result after match
        var result = [];

        // Array of html filenames
        var baggageFiles = [];

        while((result = match.exec(source)) !== null) {
            baggageFiles.push(result[1]);
        }

        baggageFiles.map(function(baggageFile) {
            try {
                // check if absoluted from srcDirpath + baggageFile path exists
                var resolve = path.resolve(srcDirpath, baggageFile);

                var stats = fs.statSync(resolve);

                if (stats.isFile()) {
                    // and require
                    inject += 'require(\'./' + baggageFile + '\');\n';
                    inject += '\n';
                }
            } catch (e) {
                console.log("An error occurred while trying to resolve a file path:\n", e); //TODO (denise) remove log
            }
        });

    }

    return inject + source;
};
