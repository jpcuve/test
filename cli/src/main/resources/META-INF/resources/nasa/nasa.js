/**
 * Created by jpc on 13-09-16.
 */
/*global angular*/
/*global $*/
angular.module("nasa", ["ngResource", "ngRoute"])
    .constant("constant", {
        mapToIds: function(entityArray){
            return entityArray.reduce(function(prevValue, currentValue){
                prevValue[currentValue.id.toString()] = currentValue;
                return prevValue;
            }, {});
        }
    })
    .config(["$resourceProvider", function($resourceProvider){
        $resourceProvider.defaults.stripTrailingSlashes = false;
    }])
    .config(["$routeProvider", function($routeProvider){
        $routeProvider
            .when("/missions/:id", { templateUrl: "view-mission.html"})
            .when("/missions", { templateUrl: "view-missions.html"})
            .when("/crew-members", { templateUrl: "view-crew-members.html"})
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
            mission: $resource(endPoint("/missions/:id")),
            crewMember: $resource(endPoint("/crew-members/:id"))
        }
    }])
    .controller("missionController", ["$log", "$scope", "$routeParams", "$location", "res", function($log, $scope, $routeParams, $location, res){
        "use strict";
        $log.log("mission controller", $routeParams.id);

        $scope.del = function(){
            res.mission.remove({id: $routeParams.id});
            $scope.cancel();
        };

        $scope.load = function(){
            $scope.mission = parseInt($routeParams.id) ? res.mission.get({id: $routeParams.id}) : {};
        };

        $scope.save = function(){
            res.mission.save($scope.mission);
            $scope.cancel();
        };

        $scope.edit = function(){
            $scope.rw = true;
        };

        $scope.cancel = function(){
            $location.path("/missions");
        };

        $scope.load();
    }])
    .controller("missionsController", ["$log", "$scope", "constant", "res", function($log, $scope, constant, res){
        "use strict";
        $log.log("missions controller");

        $scope.missions = res.mission.query(function(missions){
            res.crewMember.query(function(crewMembers){
                var map = constant.mapToIds(crewMembers);
                missions.forEach(function (mission) {
                    mission.crewMembers = mission.crewMemberIds.map(function(id){
                        return map[id.toString()];
                    });
                });
            });
        });
    }])
    .controller("crewMembersController", ["$log", "$scope", "constant", "res", function($log, $scope, constant, res){
        "use strict";
        $scope.crewMembers = res.crewMember.query(function(crewMembers){
            res.mission.query(function(missions){
                var map = constant.mapToIds(missions);
                crewMembers.forEach(function (crewMember) {
                    crewMember.missions = crewMember.missionIds.map(function (id) {
                        return map[id.toString()];
                    })
                })
            })
        });
    }])
    .controller("homeController", ["$scope", "$log", function($scope, $log){
        "use strict";
        $log.log("home controller");
    }])

;