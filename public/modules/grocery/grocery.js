angular.module('app.grocery', ['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/grocery', {
    templateUrl: 'modules/grocery/grocery.html',
    controller: 'GroceryCtrl'
  });
}])

.controller('GroceryCtrl', ['$scope', function($scope) {
}]);