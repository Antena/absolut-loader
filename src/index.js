'use strict';

var path = require('path');
var fs = require('fs');

var REQUIRE_HTML_FILE_PATTERN = /require\('\.\/(.*)\.html'\)/;
var CAPTURE_REQUIRE_HTML_FILE_PATTERN = /require\('\.\/(\S*\.html)\'\)/g;
var LOADER_INJECTION_COMMENT = '/* Injected by absolut-loader */';

function findAllRequiredHtmlFilePathsInSource(source) {
	var result = [];
	var matches;

	while ((matches = CAPTURE_REQUIRE_HTML_FILE_PATTERN.exec(source)) !== null) {
		result.push(matches[1]);
	}

	return result;
}

// checks if absolute path composed by srcDirPath + htmlFile, exists and is a file
function requiredFileExists(srcDirPath, htmlFilePath) {
	return fs.statSync(path.resolve(srcDirPath, htmlFilePath)).isFile();
}

module.exports = function(source) {
	var result = source;

	// https://webpack.github.io/docs/how-to-write-a-loader.html#flag-itself-cacheable-if-possible
	if (this.cacheable) {
		this.cacheable();
	}

	var linesOfCodeToInject = [];
	var matchesRequireHtmlPattern = REQUIRE_HTML_FILE_PATTERN.test(source);

	if (matchesRequireHtmlPattern) {
		var webpackConfigResourcePath = path.dirname(this.resourcePath);
		linesOfCodeToInject.push(LOADER_INJECTION_COMMENT);

		findAllRequiredHtmlFilePathsInSource(source).forEach(function(htmlFilePath) {
			try {
				if (requiredFileExists(webpackConfigResourcePath, htmlFilePath)) {
					linesOfCodeToInject.push('require(\'./' + htmlFilePath + '\');');
				}
			} catch (e) {
				console.error("[absolut-loader] An error occurred while trying to resolve a file path:\n", e);
			}
		});

		if (linesOfCodeToInject.length > 0) {
			if (source.indexOf('use strict') === 1) {
				var strictDeclaration = source.split('\n')[0];
				linesOfCodeToInject.unshift(strictDeclaration + '\n');
				source = source.split(strictDeclaration)[1];
			} else {
				linesOfCodeToInject.push('\n');
			}

			result = linesOfCodeToInject.join('\n') + source;
		}
	}

	return result;
};
