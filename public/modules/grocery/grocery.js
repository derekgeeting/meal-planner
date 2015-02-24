angular.module('app.grocery', ['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/grocery', {
    templateUrl: 'modules/grocery/grocery.html',
    controller: 'GroceryCtrl'
  });
}])

.controller('GroceryCtrl', ['$rootScope', '$scope', function($rootScope, $scope) {

  $scope.getList = function() {
    $scope.types = _($rootScope.user.plan).values().flatten().pluck('ingredients').flatten().pluck('category').uniq().value();
    $scope.itemsByCategory = _($rootScope.user.plan).values().flatten().pluck('ingredients').flatten().groupBy(function(o){return o.category}).value();
  }

  $scope.getList();
}]);