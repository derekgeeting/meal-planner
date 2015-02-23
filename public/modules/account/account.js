angular.module('app.account', ['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/account', {
    templateUrl: 'modules/account/account.html',
    controller: 'AccountCtrl'
  });
}])

.controller('AccountCtrl', ['$rootScope', '$scope', '$http', 'localStorageService', '$location', function($rootScope, $scope, $http, localStorageService, $location) {
  
}]);