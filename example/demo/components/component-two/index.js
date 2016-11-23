'use strict';

var angular = require('angular');
var ngModule = angular.module('components.component-two', []);

ngModule.directive('componentTwo', require('./component-two-directive'));

module.exports = ngModule.name;
