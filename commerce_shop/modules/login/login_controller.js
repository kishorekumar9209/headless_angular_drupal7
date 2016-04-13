'use strict';
angular.module('mainApp')
        .controller('LoginController', ['$scope', '$http', '$location', 'Service',
            function ($scope, $http, $location, Service) {
                $scope.login = function () {
                    Service.Login($scope.username, $scope.password).then(function (success) {
console.log(success);
                        var status_text = success.status;
                        if (status_text != '200') {
                            $scope.error = success.statusText;
                        }
                    });
                }


            }]);