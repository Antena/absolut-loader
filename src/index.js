'use strict';

var path = require('path'),
	fs = require('fs');

module.exports = function(source, sourceMap) {

	// https://webpack.github.io/docs/how-to-write-a-loader.html#flag-itself-cacheable-if-possible
	if (this.cacheable) {
		this.cacheable();
	}

	var inject = '',
		srcFilepath = this.resourcePath,
		srcDirpath = path.dirname(srcFilepath),
		matchesRequireHtmlPattern = (/require\('\.\/(.*)\.html'\)/).test(source);

	if (matchesRequireHtmlPattern) {
		inject = '\n/* Injected by absolut-loader */\n';

		var match = /require\('\.\/(\S*\.html)\'\)/g,		// RegExp that will match every .html file
			result = [],
			htmlFiles = [];

		while ((result = match.exec(source)) !== null) {
			htmlFiles.push(result[1]);
		}

		htmlFiles.map(function(htmlFile) {
			try {
				// check if absolute path composed by srcDirpath + htmlFile, is a file that actually exists
				var resolve = path.resolve(srcDirpath, htmlFile),
					stats = fs.statSync(resolve);

				if (stats.isFile()) {
					// and require
					inject += 'require(\'./' + htmlFile + '\');\n';
					inject += '\n';
				}
			} catch (e) {
				console.error("[absolut-loader] An error occurred while trying to resolve a file path:\n", e);
			}
		});
	}

	return inject + source;
};
