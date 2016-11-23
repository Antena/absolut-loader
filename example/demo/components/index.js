'use strict';

var angular = require('angular');

var ngModule = angular.module('components', [
	require('./component-one/index.js'),
	require('./component-two/index.js')
]);

module.exports = ngModule.name;
