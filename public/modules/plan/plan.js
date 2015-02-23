angular.module('app.plan', ['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/plan', {
    templateUrl: 'modules/plan/plan.html',
    controller: 'MealPlanCtrl'
  });
}])

.controller('MealPlanCtrl', ['$scope', '$http', function($scope, $http) {
}]);