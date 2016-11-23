'use strict';

var angular = require('angular');
var ngModule = angular.module('components.component-one', []);

ngModule.directive('componentOne', require('./component-one-directive'));

module.exports = ngModule.name;
