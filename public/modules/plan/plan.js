angular.module('app.plan', ['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/plan', {
    templateUrl: 'modules/plan/plan.html',
    controller: 'MealPlanCtrl'
  });
}])

.controller('MealPlanCtrl', ['$rootScope', '$scope', '$http', function($rootScope, $scope, $http) {
    $scope.days = ['Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];

    $scope.deletePlan = function(day, index) {
      $http.delete('/api/plan/'+day+'/'+index)
        .success( function(data) {
          console.log('deleted:',data);
          $rootScope.user = data.user;
        }
      );
    }
}]);