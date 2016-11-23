'use strict';

// @ngInject
module.exports = function() {

	return {
		scope: {
			name: '='
		},
		restrict: 'EA',
		templateUrl: require('./component-two.html')
	};
};
