/* 
 *App engine
 */

// Angular application make up
var instareqApp = angular.module('instareqApp', ['wu.masonry']); //'wu.masonry'  'ngRoute'

instareqApp.directive('whenScrolled', function() {
    return function(scope, element, attr) {
        var raw = element[0];
        
        element.bind('scroll', function() {
            if (raw.scrollTop + raw.offsetHeight >= raw.scrollHeight) {
                scope.$apply(attr.whenScrolled);
            }
        });
    };
});

instareqApp.controller('instareqAppCtrl', function ($scope, $location) {

    $scope.userFilter = function (item) { // filter
         return item.user.username == $scope.username;
    }

    $scope.showPreloader = function() {
        $scope.isPreloading = true;
        $scope.hasNext = false;
    }
    
    $scope.hidePreloader = function() {
        $scope.isPreloading = false;
        $scope.hasNext = true;
        $scope.$apply(); 
    }

    $scope.getNewFeed = function(tag) { 
    // Instafeed make up
        $scope.feed = new Instafeed({
            mock: false,
            get: 'tagged',
            tagName: tag,
            sortBy: 'most-recent',
            limit: 60,
            resolution: 'low_resolution',
            clientId: 'dabeabe631524457856e21f68df1d717',
            after: function() {
                // disable button if no more results to load
                if (!this.hasNext()) {
                    $scope.hasNext = false;
                    $scope.isPreloading = false;
                    $scope.$apply(); 
                } else {
                    $scope.showPreloader();
                    $scope.feed.next(); // load new data
                    $scope.$apply(); 
                }
            },
            /*filter: function(item) {
                return item.tags.indexOf('architecture1o1') >= 0;
            },*/
            success: function(data) {
                Array.prototype.push.apply($scope.data, data.data); // join data
                $scope.hidePreloader();
                $scope.$apply(); // force updte because it runs outside Angular's world
            }
        });
        $scope.feed.run();
    }


    $scope.loadNext = function() {
        $scope.showPreloader();
        $scope.feed.next(); // load new data
    }

    $scope.newRequest = function() {
        $scope.showPreloader();
        $scope.data.length = 0;
        $scope.getNewFeed($scope.tagUri);
    }

    // initiate
    $scope.tagUri = 'todaysky';
    $scope.username = 'petronela_nita';  // stefi_idlab
    $scope.isPreloading = true;
    $scope.hasNext = false;
    $scope.feed;
    $scope.data = [];

    $scope.newRequest($scope.tagUri);
});



