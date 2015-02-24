angular.module('app.meals', ['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/meals', {
    templateUrl: 'modules/meals/meals.html',
    controller: 'MealsCtrl'
  });
}])

.controller('MealsCtrl', ['$scope', '$http', function($scope, $http) {
  $scope.meals = [];
  $scope.meal = {};
  $scope.ingredient = {};
  $scope.showIngredientForm = false;
  $scope.showMealForm = false;
  $scope.categories = ['produce','dairy','butcher','bulk items','bakery','frozen','canned','household','other'];
  $scope.qtyTypes = ['tsp','tbs','oz','lb','c','pt','qt','gal','liter','qtr','half','whole'].sort();

  $scope.saveIngredient = function() {
    $scope.meal.ingredients = ($scope.meal.ingredients||[]).concat($scope.ingredient);
    $scope.ingredient = {};
    $scope.showIngredientForm = false;
  }

  $scope.cancelIngredient = function() {
    $scope.ingredient = {};
    $scope.showIngredientForm = false;
  }

  $scope.saveMeal = function() {
    //$scope.meals = $scope.meals.concat($scope.meal);
    $http.post('/api/meals', $scope.meal)
      .success( function(data, status) {
        console.log('saved',data);
        $scope.loadMeals();
      })
      .error( function(data, status) {
        console.log('Error',data,status);
      }
    );
    $scope.meal = {};
    $scope.showMealForm = false;
  }

  $scope.cancelMeal = function() {
    $scope.meal = {};
    $scope.showMealForm = false;
  }

  $scope.deleteMeal = function(meal) {
    $http.delete('/api/meals/'+meal._id)
      .success( function(data) {
        console.log('deleted:',data);
      }
    );
  }

  $scope.loadMeals = function() {
    $http.get('/api/meals')
      .success( function(data) {
        $scope.meals = data.meals;
      }
    );
  }

  $scope.loadMeals();
}]);