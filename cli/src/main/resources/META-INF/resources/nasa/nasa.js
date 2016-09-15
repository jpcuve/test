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
            $log.log("protocol, host, port, absUrl, url", $location.protocol(), $location.host(), $location.port(), $location.absUrl(), $location.url());
            var base = $location.port() >= 63342 ? ["http://", $location.host(), ":8080"] : [$location.protocol(), "://", $location.host(), ":", $location.port()];
            base.push("/test/api", ep);
            return base.join("");
        }
    }])
    .factory("missionResource", ["$resource", "endPoint", function($resource, endPoint){
        return $resource(endPoint("/missions/:id"));
    }])
    .factory("crewMemberResource", ["$resource", "endPoint", function($resource, endPoint){
        return $resource(endPoint("/crew-members/:id"));
    }])
    .controller("missionController", ["$log", "$scope", "$routeParams", "missionResource", function($log, $scope, $routeParams, missionResource){
        "use strict";
        $log.log("mission id", $routeParams.id);
        $scope.mission = missionResource.get({id: $routeParams.id});
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
    .controller("homeController", ["$scope", "$log", function($scope, $log){
        "use strict";
        $log.log("home controller");
    }])

;