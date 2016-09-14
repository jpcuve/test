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
    .factory("missionResource", ["$resource", function($resource){
        return $resource("http://localhost:8080/test/api/missions/:id");
    }])
    .factory("crewMemberResource", ["$resource", function($resource){
        return $resource("http://localhost:8080/test/api/crew-members/:id");
    }])
    .controller("homeController", ["$scope", "$log", "$resource", "$interval", function($scope, $log, $resource, $interval){
        "use strict";
        $log.log("home controller");
    }])
    .controller("missionsController", ["$scope", "$log", "missionResource", function($scope, $log, missionResource){
        "use strict";
        $log.log("missions controller");
        $scope.missions = missionResource.query();
        $scope.crewMembers = missionResource.query;
    }])
;