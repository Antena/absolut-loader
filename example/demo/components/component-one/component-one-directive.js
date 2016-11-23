'use strict';

// @ngInject
module.exports = function() {

	return {
		scope: {
			name: '=',
			placeholderName: '='
		},
		restrict: 'EA',
		templateUrl:  require('./component-one.html')
	};
};
