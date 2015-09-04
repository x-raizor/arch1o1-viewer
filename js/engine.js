/* 
 *App engine
 */

 // TODO: Mark selected week and day
 // TODO: Fit for 21 weeks
var weeks = [
        {
            'number': 1,
            'shortname': 'Pictures',
            'name': 'Taking pictures',
            'days': ['RelativeSizeOfThings', '50000YearsAgo', 'ThingsWithNoName', 'TVWithoutSignal', 'MusicWithoutSound']
        }, {
            'number': 2,
            'shortname': 'Sketches',
            'name': 'Learning to sketch',
            'days': ['QuestionWithoutAnswer', 'DoorsOfPerception', 'SomePeopleTheyKnowThings', 'DaytimeNighttime', 'PlayItByTrust']
        }, {
            'number': 3,
            'shortname': 'Collages',
            'name': 'Making collages',
            'days': ['RomanceInManyDimensions', 'InsideNoOutside', 'WhatMakesTheDesert', 'StealingThingsIs', 'BrianEnoSays']
        }, {
            'number': 4,
            'shortname': 'Weather',
            'name': 'Observing the Weather',
            'days': ['ExcuseMeWhile', 'MySunMachine', 'SomePeopleWalk', 'MyBusinessIs', 'VoyageDansLalune']
        }, {
            'number': 5,
            'shortname': 'Diagrams',
            'name': 'Shaping Diagrams',
            'days': ['YourMindWill', 'YouGottaHave', 'OnesDestination', 'IfYouStartToThink', 'BeSureYou']
        }, {
            'number': 6,
            'shortname': 'Maps',
            'name': 'Drawing maps',
            'days': ['ALineIsADot', 'YouCantCriticize', 'HumanBehaviourFlows', 'NoManIs', 'ThisWorldIs']
        }, {
            'number': 7,
            'shortname': 'History',
            'name': 'History of Place / History of Space',
            'days': ['WeAllShineOn', 'NothingIsBuilt', 'NoCowOnTheIce', 'YouGetUp', 'ThereIsNothing']
        }, {
            'number': 8,
            'shortname': 'Proportions',
            'name': 'Proportions',
            'days': ['ThePrimaryFactor', 'TheSimplestWay', 'TheEggHas', 'ItIsNotHow', 'ThereIsNoExcellent']
        }, {
            'number': 9,
            'shortname': 'Measurements',
            'name': 'Taking measurements',
            'days': ['ThereIsNoNeed', 'AdversityIs', 'OurLifeIs', 'NotAllThose', 'IllPaintYou']
        }, {
            'number': 10,
            'shortname': 'Concepts',
            'name': 'Conceptual Models',
            'days': ['TheValueOf', 'BeholdHuman', 'MaybeThe', 'YabbaDabba', 'WhoWouldBelieve']
        }, {
            'number': 11,
            'shortname': 'Papers',
            'name': 'Papercut Models',
            'days': ['ThroughSpace', 'BeforeIMake', 'AllTheRivers', 'WhatsThatScreaming', 'IfItHadBeen']
        }, {
            'number': 12,
            'shortname': 'Digital space',
            'name': 'Building (digital) space',
            'days': ['MarbleIsNot', 'RetainYour', 'IWouldRather', 'TheeGoIs', 'ToGatherHoney']
        }
        
];


// Angular application make up
var archApp = angular.module('archApp', ['ngRoute']); //'wu.masonry'  'ngRoute'

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
      // when('/talks', {
      //   templateUrl: 'talks.html',
      //   controller: 'archAppCtrl'
      // }).
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



var archTalkApp = angular.module('archTalkApp', ['wu.masonry']);
archTalkApp.controller('archTalkCtrl', function ($scope, $location) {

    $scope.skipLeft = function (item) { // filter
        return item.tags.indexOf("architectureporn") < 0;
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
            resolution: 'thumbnail',
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
                return item.comments.data.length > 5;
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

    
    // initiate
    $scope.checkTag = 'Architecture1o1';
    $scope.isPreloading = true;
    $scope.hasNext = false;
    $scope.weeks = weeks;
    $scope.feed;
    $scope.data = [];

    $scope.showPreloader();
    $scope.getNewFeed($scope.checkTag);
});

$(function(){

    var $insta = $('#insta');
    var $window = $(window).on('resize', function(){
       //var height = $(this).height() - $header.height() + $footer.height();
       var height = $(window).height();
       $insta.height(height);
    }).trigger('resize'); // on page load

});
