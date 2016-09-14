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
    .controller("missionsController", ["$log", "$scope", "constant", "missionResource", "crewMemberResource", function($log, $scope, constant, missionResource, crewMemberResource){
        "use strict";
        $scope.missions = missionResource.query(function(missions){
            crewMemberResource.query(function(crewMembers){
                var map = constant.mapToIds(crewMembers);
                angular.forEach(missions, function (mission) {
                    mission.crewMembers = mission.crewMemberIds.map(function(id){
                        return map[id.toString()];
                    });
                });
            });
        });
    }])
    .controller("crewMembersController", ["$log", "$scope", "constant", "crewMemberResource", "missionResource", function($log, $scope, constant, crewMemberResource, missionResource){
        "use strict";
        $scope.crewMembers = crewMemberResource.query(function(crewMembers){
            missionResource.query(function(missions){
                var map = constant.mapToIds(missions);
                angular.forEach(crewMembers, function (crewMember) {
                    crewMember.missions = crewMember.missionIds.map(function (id) {
                        return map[id.toString()];
                    })
                })
            })
        });
    }])

;