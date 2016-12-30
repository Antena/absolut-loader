
/* Injected by absolut-loader */
require('./component-2.html');

require('./some-content.html');

'use strict';

require('./component2.scss');

// @ngInject
module.exports = function($uibModal) {
	return {
		restrict: 'EA',
		scope: {
			config: '='
		},
		templateUrl: require('./component-2.html'),
		controller: 'Component2Controller',
		link: function($scope) {
			var modalInstance;

			var modalScope = $scope.$new();
			modalScope.closeModal = function() {
				modalInstance.close();
			};

			$scope.openModal = function() {
				modalInstance = $uibModal.open({
					animation: true,
					templateUrl: require('./some-content.html'),
					backdrop: 'static',
					size: 'sm',
					keyboard: true,
					scope: modalScope
				});
			};
		}
	};
};
