'use strict';

var angular = require('angular');

/* Demo App initialization */
var app = angular.module('app', [
	require('./components/index.js')
]);

app.controller('DemoController', require('./demo-controller'));

