angular.module('app.grocery', ['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/grocery', {
    templateUrl: 'modules/grocery/grocery.html',
    controller: 'GroceryCtrl'
  });
}])

.controller('GroceryCtrl', ['$rootScope', '$scope', '$http', function($rootScope, $scope, $http) {

  $scope.updateList = function() {
    //get all items
    var uncheckedIngredients = [];
    var allMeals = _($rootScope.user.plan).values().flatten().value();
    _.each(allMeals, function(m) {
      _.each(m.ingredients, function(i) {
        i.mealId = m._id;
        uncheckedIngredients.push(i);
      });
    });

    var checkedIngredients = [];
    if($rootScope.user.list && $rootScope.user.list.plan) {
      _.each($rootScope.user.list.plan, function(ingredient) {
        //these are checked
        checkedIngredients.push(ingredient);
        //remove from the unchecked ingredients list
        _.remove(uncheckedIngredients, function(i) {
          return i.qty==ingredient.qty && i.name==ingredient.name && i.qtyType==ingredient.qtyType && i.category==ingredient.category && i.mealId==ingredient.mealId;
        });
      });
    }

    //divy up the oneoff ingredients
    if($rootScope.user.list && $rootScope.user.list.oneoff) {
      _.each($rootScope.user.list.oneoff, function(ingredient) {
        //these are checked
        (ingredient.checked?checkedIngredients:uncheckedIngredients).push(ingredient);
      });
    }

    $scope.uncheckedIngredients = uncheckedIngredients;
    $scope.checkedIngredients = checkedIngredients;

    $scope.categories = _(uncheckedIngredients).pluck('category').uniq().value();
    $scope.uncheckedIngredientsByCategory = _(uncheckedIngredients).groupBy(function(o){return o.category}).value();
  }

  $scope.check = function(category,ingredient,index) {
    console.log('check',category,ingredient,index);
    ingredient.checked = true;
    $scope.uncheckedIngredientsByCategory[category].splice(index,1);
    $http.post('/api/list/check', {ingredient: ingredient})
      .success(function(data) {
        console.log('saved:',data);
        $rootScope.user = data.user;
        $scope.updateList();
      }
    );
  }

  $scope.uncheck = function(category,ingredient,index) {
    console.log('uncheck',category,ingredient,index);
    ingredient.checked = false;
    $scope.checkedIngredients.splice(index,1);
    $http.post('/api/list/check', {ingredient: ingredient})
      .success(function(data) {
        console.log('saved:',data);
        $rootScope.user = data.user;
        $scope.updateList();
      }
    );
  }

  $scope.updateList();
}]);