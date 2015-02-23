angular.module('app.auth', ['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/login', {
    templateUrl: 'modules/auth/auth.html',
    controller: 'AuthCtrl'
  });
}])

.controller('AuthCtrl', ['$rootScope', '$scope', '$http', 'localStorageService', '$location', function($rootScope, $scope, $http, localStorageService, $location) {
  $scope.user = {};
  $scope.authError = null;

  $scope.login = function() {
    $http.post('/login', $scope.user)
      .success( function(data, status, headers, config) {
        localStorageService.set('token', data.token);
        localStorageService.set('user', data.user);
        $rootScope.setLoggedInUser(data.user);
        $scope.authError = null;
        $location.path('/plan');
      })
      .error( function(data, status, headers, config) {
        localStorageService.remove('token');
        localStorageService.remove('user');
        $scope.authError = data.message;
      });
  }
}]);