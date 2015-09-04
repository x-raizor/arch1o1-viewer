
/**
 * Letters page application controller
 */
var archCentro = angular.module('archCentro', []);


archCentro.controller('archCentroCtrl', function ($scope, $http) {

    $http.get('data/letters.json')  // fetch JSON
        .success(function(data) {
            $scope.letters = data;
        });
});


archCentro.filter('range', function() {
/**
 * Range filter by Gloopy:
 * <div ng-repeat="n in [] | range:100">
 *    do something
 * </div>
 */
    return function(input, total) {
        total = parseInt(total);
        for (var i=0; i<total; i++)
            input.push(i);
        return input;
    };
});