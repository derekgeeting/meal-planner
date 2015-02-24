angular.module('app.meals', ['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/meals', {
    templateUrl: 'modules/meals/meals.html',
    controller: 'MealsCtrl'
  });
}])

.controller('MealsCtrl', ['$rootScope', '$scope', '$http', function($rootScope, $scope, $http) {
  $scope.meals = [];
  $scope.meal = {};
  $scope.ingredient = {};
  $scope.showIngredientForm = false;
  $scope.showMealForm = false;
  $scope.categories = ['produce','dairy','butcher','bulk items','bakery','frozen','canned','household','spices','condiments','dry goods','drinks','snacks','baking','health'];
  $scope.qtyTypes = ['tsp','tbs','oz','lb','c','pt','qt','gal','liter','qtr','half','whole','box','can'].sort();
  $scope.days = ['Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];

  $scope.saveIngredient = function() {
    $scope.meal.ingredients = ($scope.meal.ingredients||[]).concat($scope.ingredient);
    $scope.ingredient = {};
    $scope.showIngredientForm = false;
  }

  $scope.cancelIngredient = function() {
    $scope.ingredient = {};
    $scope.showIngredientForm = false;
  }

  $scope.saveMeal = function(cb) {
    //$scope.meals = $scope.meals.concat($scope.meal);
    $http.post('/api/meals', $scope.meal)
      .success( function(data, status) {
        console.log('saved',data);
        $scope.loadMeals();
        if(cb) {
          cb(data.meal);
        }
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

  $scope.addToDay = function(mealId, day) {
    $http.post('/api/plan', {
      day: day,
      meal: mealId
    })
      .success( function(data, status) {
        console.log('saved meal plan',data);
        $rootScope.user = data.user;
      })
      .error( function(data, status) {
        console.log('Error',data,status);
      }
    );
  }

  $scope.saveAndAdd = function(day) {
    var mealId = $scope.meal._id;
    $scope.saveMeal( function(meal) {
      $scope.addToDay(meal._id, day);
    });
  }

  $scope.loadMeals();
}]);