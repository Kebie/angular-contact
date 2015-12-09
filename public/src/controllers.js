angular.module('ContactsApp')
	.controller('ListController', function($scope, Contact, $location){
		$scope.contacts = Contact.query();
		$scope.fields = ['firstName', 'lastName'];

		$scope.sort = function (field) {
			$scope.sort.field = field;
			$scope.sort.order = !$scope.sort.order; //sort by opposite of what the boolean is at
		};

		$scope.sort.field = 'firstName';
		$scope.sort.order = false;

		$scope.show = function (id) {
			$location.url('/contact/' + id); //when they click on a row change the location
		}

	})
	.controller('NewController', function($scope, Contact, $location){
		$scope.contact = new Contact({
			firstName: ['', 'text'],
			lastName: ['', 'text'],
			email: ['', 'email'],
			homePhone: ['', 'tel'],
			cellPhone: ['', 'tel'],
			birthday: ['', 'date'],
			website: ['', 'url'],
			address: ['', 'text']
		});


		$scope.save = function () {
			if ($scope.newContact.$invalid) {
				$scope.$broadcast('record:invalid'); 
			} else {
				$scope.contact.$save();
				$location.url('/contacts');
			}
		};

	});