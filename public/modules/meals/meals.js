angular.module('app.meals', ['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/meals', {
    templateUrl: 'modules/meals/meals.html',
    controller: 'MealsCtrl'
  });
}])

.controller('MealsCtrl', ['$scope', function($scope) {
}]);