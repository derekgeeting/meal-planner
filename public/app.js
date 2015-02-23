angular.module('app', [
  'ngRoute',
  'LocalStorageModule',
  'app.plan',
  'app.meals',
  'app.grocery',
  'app.auth'
]).
config(['$routeProvider', '$httpProvider', function($routeProvider, $httpProvider) {
  $routeProvider.otherwise({redirectTo: '/plan'});
  $httpProvider.interceptors.push('authInterceptor');
}]).
factory('authInterceptor', ['$rootScope', '$q', 'localStorageService', '$location', function ($rootScope, $q, localStorageService, $location) {
  return {
    request: function (config) {
      config.headers = config.headers || {};
      if (localStorageService.get('token')) {
        config.headers.Authorization = 'Bearer ' + localStorageService.get('token');
      }
      return config;
    },
    response: function (response) {
      if (response.status === 401) {
        // handle the case where the user is not authenticated
      }
      return response || $q.when(response);
    },
    responseError: function(rejection) {
      if(rejection.status===401) {
        $location.path('/login');
      }
      return $q.reject(rejection);
    }
  };
}]).
run(['$rootScope', '$http', '$location', 'localStorageService', function($rootScope, $http, $location, localStorageService) {

  $rootScope.setLoggedInUser = function(user) {
    $rootScope.user = user;
    $rootScope.loggedIn = true;
    $rootScope.$broadcast('login');
  }

  $rootScope.logout = function() {
    localStorageService.remove('token');
    $rootScope.loggedIn = false;
    $rootScope.user = {};
    $rootScope.$broadcast('logout');
    $location.path('/login');
  }

  $rootScope.isActive = function(path) {
    return $location.path().substr(0,path.length)===path;
  }
  
  $http.get('/api/user').
    success(function(data,status,headers,config) {
      $rootScope.setLoggedInUser(data.user);
    }
  );
}]);