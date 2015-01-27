/* 
 *App engine
 */
var weeks = [
        {
            'number': 1,
            'name': 'Taking pictures',
            'days': ['RelativeSizeOfThings', '50000YearsAgo', 'ThingsWithNoName', 'TVWithoutSignal', 'MusicWithoutSound']
        }, {
            'number': 2,
            'name': 'Learning to sketch',
            'days': ['QuestionWithoutAnswer', 'DoorsOfPerception', 'SomePeopleTheyKnowThings', 'DaytimeNighttime', 'PlayItByTrust']
        }, {
            'number': 3,
            'name': 'Making collages',
            'days': ['RomanceInManyDimensions', 'InsideNoOutside', 'WhatMakesTheDesert', 'StealingThingsIs', 'BrianEnoSays']
        }, {
            'number': 4,
            'name': 'Observing the Weather',
            'days': ['ExcuseMeWhile', 'MySunMachine', 'SomePeopleWalk', 'MyBusinessIs', 'VoyageDansLalune']
        }
];


// Angular application make up
var archApp = angular.module('archApp', ['ngRoute', 'wu.masonry']); //'wu.masonry'  'ngRoute'

archApp.config(function($routeProvider) {
    $routeProvider.
      when('/', {
        templateUrl: 'index.html',
        controller: 'archAppCtrl'
      }).
      when('/:tagUri', {
        templateUrl: 'index.html',
        controller: 'archAppCtrl'
      }).
      otherwise({
        redirectTo: '/'
      });
});

archApp.directive('whenScrolled', function() {
    return function(scope, element, attr) {
        var raw = element[0];
        
        element.bind('scroll', function() {
            if (raw.scrollTop + raw.offsetHeight >= raw.scrollHeight) {
                scope.$apply(attr.whenScrolled);
            }
        });
    };
});

archApp.controller('archAppCtrl', function ($scope, $location) {

    $scope.skipOrgs = function (item) { // filter
        return (item.user.username != 'design1o1top' && item.user.username != 'design1o1');
    }

    $scope.toggleMenu = function (item) { 
        angular.element("ul").addClass('show'); 
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
            mock: true,
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
                }
            },
            filter: function(item) {
                return item.tags.indexOf('Architecture1o1') >= 0;
            },
            success: function(data) {
                //$scope.showPreloader();
                Array.prototype.push.apply($scope.data, data.data); // join data
                $scope.$apply(); // force updte because it runs outside Angular's world
                $scope.hidePreloader();
            }
        });
        $scope.feed.run();
    }


    $scope.loadNext = function() {
        $scope.showPreloader();
        $scope.feed.next(); // load new data
    }

    $scope.switchDay = function(day) {
        $scope.showPreloader();
        $scope.data.length = 0;
        $scope.getNewFeed(day);
    }

    // initiate
    $scope.checkTag = 'Architecture1o1';
    $scope.isPreloading = true;
    $scope.hasNext = false;
    $scope.weeks = weeks;
    $scope.feed;
    $scope.data = [];
    
    var tagDefault = weeks[weeks.length-1]['days'][weeks[weeks.length-1]['days'].length-1]; //"BrianEnoSays";

    var tagUri = $location.path().substring(1); // trim slash in the beginning
    if (tagUri == '') {
        tagUri = tagDefault;
        $location.url(tagDefault);
    }
    $scope.switchDay(tagUri);
});

