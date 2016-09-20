/**
 * Created by jpc on 13-09-16.
 */
/*global angular*/
/*global $*/
angular.module("nasa", ["ngResource", "ngRoute"])
    .constant("constant", {
    })
    .config(["$resourceProvider", function($resourceProvider){
        $resourceProvider.defaults.stripTrailingSlashes = false;
    }])
    .config(["$routeProvider", function($routeProvider){
        $routeProvider
            .when("/missions/:id", { templateUrl: "view-mission-item.html"})
            .when("/crew-members/:id", { templateUrl: "view-crew-member-item.html"})
            .when("/missions", { templateUrl: "view-mission-list.html"})
            .when("/crew-members", { templateUrl: "view-crew-member-list.html"})
            .when("/", { templateUrl: "view-home.html"})
            .otherwise({ redirectTo: "/"})
    }])
    .factory("endPoint", ["$log", "$location", function($log, $location){
        return function(ep){
            "use strict";
            var base = $location.port() >= 63342 ? ["http://", $location.host(), ":8080"] : [$location.protocol(), "://", $location.host(), ":", $location.port()];
            base.push("/test/api", ep);
            return base.join("");
        }
    }])
    .factory("res", ["$resource", "endPoint", function($resource, endPoint){
        return {
            missionResource: $resource(endPoint("/missions/:id")),
            crewMemberResource: $resource(endPoint("/crew-members/:id"))
        }
    }])
    .controller("crewMemberController", ["$log", "$scope", "$routeParams", "$location", "res", function($log, $scope, $routeParams, $location, res){
        "use strict";

        $scope.del = function(){
            res.crewMemberResource.remove({id: $routeParams.id}, function () {
                $scope.cancel();
            });
        };

        $scope.load = function(){
            if ($scope.rw = (parseInt($routeParams.id) === 0)){
                $scope.crewMember = {};
                $scope.temp = {
                    assignments: {}
                };
            } else {
                $scope.crewMember = res.crewMemberResource.get({id: $routeParams.id}, function(m){
                    $scope.temp = {
                        assignments: (m.missionIds ? m.missionIds.reduce(function(acc, id){
                            acc[id] = true;
                            return acc;
                        }, {}) : {})
                    };
                });
            }
            $scope.missions = res.missionResource.query();
        };

        $scope.save = function(){
            $scope.crewMember.missionIds = Object.keys($scope.temp.assignments).filter(function(key){
                return $scope.temp.assignments[key];
            });
            res.crewMemberResource.save($scope.crewMember, function(){
                $scope.cancel();
            });
        };

        $scope.edit = function(){
            $scope.rw = true;
        };

        $scope.cancel = function(){
            $location.url("/crew-members");
        };

        $scope.load();
    }])
    .controller("missionController", ["$log", "$scope", "$routeParams", "$location", "res", function($log, $scope, $routeParams, $location, res){
        "use strict";

        $scope.del = function(){
            res.missionResource.remove({id: $routeParams.id}, function () {
                $scope.cancel();
            });
        };

        $scope.load = function(){
            if ($scope.rw = (parseInt($routeParams.id) === 0)){
                $scope.mission = {};
                $scope.temp = {
                    assignments: {}
                };
            } else {
                $scope.mission = res.missionResource.get({id: $routeParams.id}, function(m){
                    $scope.temp = {
                        assignments: (m.crewMemberIds ? m.crewMemberIds.reduce(function(acc, id){
                            acc[id] = true;
                            return acc;
                        }, {}) : {}),
                        start: m.missionStart && new Date(m.missionStart),
                        end: m.missionEnd && new Date(m.missionEnd)
                    };
                });
            }
            $scope.crewMembers = res.crewMemberResource.query();
        };

        $scope.save = function(){
            $scope.mission.crewMemberIds = Object.keys($scope.temp.assignments).filter(function(key){
                return $scope.temp.assignments[key];
            });
            $scope.mission.missionStart = $scope.temp.start && $scope.temp.start.toISOString().substr(0, 10);
            $scope.mission.missionEnd = $scope.temp.end && $scope.temp.end.toISOString().substr(0, 10);
            res.missionResource.save($scope.mission, function(){
                $scope.cancel();
            });
        };

        $scope.edit = function(){
            $scope.rw = true;
        };

        $scope.cancel = function(){
            $location.url("/missions");
        };

        $scope.load();
    }])
    .controller("missionsController", ["$log", "$scope", "res", function($log, $scope, res){
        "use strict";
        $scope.missions = res.missionResource.query(function(missions){
            res.crewMemberResource.query(function(crewMembers){
                var map = crewMembers.reduce(function(acc, crewMember){
                    acc[crewMember.id] = crewMember;
                    return acc;
                }, {});
                missions.forEach(function (mission) {
                    mission.crewMembers = mission.crewMemberIds.map(function(id){
                        return map[id];
                    });
                });
            });
        });
    }])
    .controller("crewMembersController", ["$log", "$scope", "res", function($log, $scope, res){
        "use strict";
        $scope.crewMembers = res.crewMemberResource.query(function(crewMembers){
            res.missionResource.query(function(missions){
                var map = missions.reduce(function(acc, mission){
                    acc[mission.id] = mission;
                    return acc;
                }, {});
                crewMembers.forEach(function (crewMember) {
                    crewMember.missions = crewMember.missionIds.map(function (id) {
                        return map[id];
                    })
                });
            })
        });
    }])
    .controller("homeController", ["$scope", "$log", function($scope, $log){
        "use strict";
        $log.log("home controller");
    }])

;