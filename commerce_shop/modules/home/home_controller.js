'use strict';
angular.module('mainApp')
        .controller('HomeController', ['$scope', '$http', '$location', 'Service',
            function ($scope, $http, $location, Service) {
                $scope.logout = function () {
                    Service.token_val().then(function (response) {
                        var token = response.data;
                        $scope.result = Service.logout(token);
                    });

                }
            }]);