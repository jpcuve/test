/**
 * Created by jpc on 13-09-16.
 */
/*global angular*/
/*global $*/
angular.module("nasa", ["ngResource"])
    .constant()
    .config(["$resourceProvider", function($resourceProvider){
        $resourceProvider.defaults.stripTrailingSlashes = false;
    }])
    .directive("nasaMenu", ["$log", function($log){
        return {
            restrict: "E",
            templateUrl: "template-menu.html"
        }
    }])
    .controller("homeController", ["$scope", "$log", "$resource", "$interval", function($scope, $log, $resource, $interval){
        "use strict";
        $log.log("home controller");
    }])
;