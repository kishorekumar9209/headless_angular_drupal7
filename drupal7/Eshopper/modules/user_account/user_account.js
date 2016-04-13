'use strict';
angular.module("EcommApp")
        .controller('AccountController', ['$scope', '$http', '$location', 'drupalSettings', '$routeParams', '$rootScope', 'Service',
            function ($scope, $http, $location, drupalSettings, $routeParams, $rootScope, Service) {
                var sitePath = drupalSettings.sitePath;
                var restPath = sitePath + '/' + drupalSettings.endpoint;
                Service.token_val().then(function (response) {
                    var token = response.data;
                    Service.connect(token).then(function (response) {
                        var user_id = response.data.user.uid;
                        if (user_id > 0) {
                            var req = {
                                method: 'GET',
                                url: restPath + '/user/' + user_id,
                            }
                            $http(req).then(function successCallback(response) {
                                $scope.FirstName = response.data.field_first_name.und[0].value;
                                $scope.LastName = response.data.field_last_name.und[0].value;
                                $scope.MobileNumber = response.data.field_mobile_number.und[0].value;
                            }, function errorCallback(response) {
                                return response;
                            });
                        }
                    });

                });
            }])