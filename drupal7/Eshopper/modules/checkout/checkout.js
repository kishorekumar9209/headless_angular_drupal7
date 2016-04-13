'use strict';
angular.module("EcommApp")
        .controller('CheckoutController', ['$scope', '$http', '$location', 'drupalSettings', '$routeParams', '$rootScope', 'Service',
            function ($scope, $http, $location, drupalSettings, $routeParams, $rootScope, Service) {
                var sitePath = drupalSettings.sitePath;
                var restPath = sitePath + '/' + drupalSettings.endpoint;
                Service.token_val().then(function (response) {
                    var token = response.data;
                    Service.connect(token).then(function (response) {
                        var user_id = response.data.user.uid;
                        console.log(user_id);
                        if (user_id > 0) {
                            var req = {
                                method: 'GET',
                                url: restPath + '/checkout/' + user_id,
                            }
                            $http(req).then(function successCallback(response) {
                                $scope.cart_products = response.data;
                                $scope.order_total = response.data[0].order_total;
                                console.log(response.data[0].total);
                            }, function errorCallback(response) {
                                return response;
                            });
                        }
                    });

                });
            }])