angular.module('ContactsApp')
	.value('FieldTypes', {
		text: ['Text', 'should be text'],
		email: ['Email', 'should be an email address'],
		number: ['Number', 'should be a number'],
		date: ['Date', 'should be a date'],
		datetime: ['Datetime', 'should be a datetime'],
		time: ['Time', 'should be a time'],
		month: ['Month', 'should be a month'],
		week: ['Week', 'should be a week'],
		url: ['URL', 'should be a url'],
		tel: ['Phone Number', 'should be a phone number'],
		color: ['Color', 'should be a color']
	})
	.directive('formField', function($timeout, FieldTypes){
		// Runs during compile
		return {
			scope: {
				record: '=',
				field: '@',
				live: '@',
				required: '@' 
			}, 
			restrict: 'EA', // E = Element, A = Attribute, C = Class, M = Comment
			templateUrl: 'views/formField.html',
			replace: true,
			link: function($scope, element, attr) {
				

				$scope.$on('record:invalid', function () {
					$scope[$scope.field].$setDirty();

				});

				$scope.types = FieldTypes;
				$scope.remove = function (field) {
					delete $scope.record[field];
					$scope.blurUpdate();
				};

				$scope.blurUpdate = function () {
					if ($scope.live !== 'false') {
						$scope.record.$update(function (updatedRecord) {
							$scope.record = updatedRecord;
						});
					}
				};
					
				var saveTimeout;
				$scope.update = function () {
					$timeout.cancel(saveTimeout);
					saveTimeout = $timeout($scope.blurUpdate, 1000);
				};
				
			}
		};
	})
	.directive('newField', function($filter, FieldTypes){
		// Runs during compile
		return {
			scope: {
				record: '=',
				live: '@'
			}, // {} = isolate, true = child, false/undefined = no change
			require: '^form', // Array = multiple requires, ? = optional, ^ = check parent elements
			restrict: 'EA', // E = Element, A = Attribute, C = Class, M = Comment
			template: 'views/new-field.html',
			replace: false,
			link: function($scope, element, attr, form) {
				$scope.types = FieldTypes;
				$scope.field = {};

				$scope.show = function (type) {
					$scope.field.type = type;
					$scope.display = true;
				};

				$scope.remove = function () {
					$scope.field = {};
					$scope.display = false;
				};

				$scope.add = function () {
					if (form.newField.$valid){
						$scope.record[$filer('camelCase')($scope.field.name)] = [$scope.field.value, $scope.field.type];
						$scope.remove();
						if ($scope.live !== 'false') {
							$scope.record.$update(function (updatedRecord) {
								$scope.record = updatedRecord;
							});
						};
					};
				};
			}
		};
	});