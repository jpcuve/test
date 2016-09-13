/**
 * Created by jpc on 13-09-16.
 */
/*global angular*/
/*global $*/
angular.module("nasa", ["ngResource", "ngRoute"])
    .constant()
    .config(["$resourceProvider", function($resourceProvider){
        $resourceProvider.defaults.stripTrailingSlashes = false;
    }])
    .config(["$routeProvider", function($routeProvider){
        $routeProvider
            .when("/", { templateUrl: "view-home.html"})
            .when("/missions", { templateUrl: "view-missions.html"})
            .when("/crew-members", { templateUrl: "view-crew-members.html"})
            .otherwise({ redirectTo: "/"})
    }])
    .controller("homeController", ["$scope", "$log", "$resource", "$interval", function($scope, $log, $resource, $interval){
        "use strict";
        $log.log("home controller");
        var resource = $resource("http://localhost:8080/test-web-1.1/api/",{},{"get": { "url": "mission-names", "isArray" : true }});
        $scope.missionNames = resource.get();

    }])
;