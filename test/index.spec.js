'use strict';

var path = require('path'),
	fs = require('fs'),
	should = require("should"),
	absolutLoader = require("../");

describe("basic functionality", function() {
	it("should process all required htmls in file, but not other requires", function() {
		var inputFilePath = path.resolve(__dirname, 'data', 'component-2-directive.js');
		var inputFile = fs.readFileSync(inputFilePath, 'utf8');
		
		var expected = fs.readFileSync(path.resolve(__dirname, 'data', 'component-2-result.js'), 'utf8');
		
		var loaderContext = {
			resourcePath: inputFilePath
		};
		var result = absolutLoader.call(loaderContext, inputFile);

		result.should.be.eql(expected);
	});
});
