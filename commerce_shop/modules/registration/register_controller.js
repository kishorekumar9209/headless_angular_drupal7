'use strict';
angular.module('mainApp')
        .controller('RegisterController', ['$scope', '$http', '$location', 'Service',
            function ($scope, $http, $location, Service) {
                $scope.register = function () {

                    Service.Register($scope.username, $scope.password,  $scope.email).then(function (response) {
                       var status_text = response.status;
                        if (status_text != '200') {
                            $scope.error = response.statusText;
                        }
                        else{
                        Service.Login($scope.username, $scope.password);
                    }
                        
                    });

                }
            }]);