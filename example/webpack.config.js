var path = require('path');
require("ngtemplate-loader");

var config = {
	context: __dirname,
	entry: {
		'bundle': './demo/app.js'
	},
	output: {
		path: "dist",
		filename: "main.js"
	},
	module: {
		preLoaders: [
			{
				test: /\.js$/,
				loader: 'absolut'
			}
		],
		loaders: [
			{
				test: /\.html$/,
				loader: 'ngtemplate?relativeTo=' + (path.resolve(__dirname, './demo/')) + '/!html'
			}
		]
	},
	resolve: {
		modulesDirectories: ['.', '..', 'node_modules'],
		alias: {
			'absolut-loader': '../src/index.js'
		}
	}
};

module.exports = config;
