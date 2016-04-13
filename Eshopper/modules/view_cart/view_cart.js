'use strict';
angular.module("EcommApp")
        .controller('CartController', ['$scope', '$http', '$location', 'drupalSettings', '$routeParams', '$rootScope', 'Service',
            function ($scope, $http, $location, drupalSettings, $routeParams, $rootScope, Service) {

                $scope.myBoolean = false;
                var sitePath = drupalSettings.sitePath;
                var restPath = sitePath + '/' + drupalSettings.endpoint;
                Service.token_val().then(function (response) {
                    var token = response.data;
                    Service.connect(token).then(function (response) {
                        var user_id = response.data.user.uid;
                        console.log(user_id);

                        $scope.cart_products = null;
                        $scope.order_total = null;
                        if (user_id > 0) {
                            $scope.CartProduct = Service.DisplayCartProduct(user_id);
                            Service.DisplayCartProduct(user_id).then(function (success) {
                                if (success.data) {
                                    $scope.cart_products = success.data;
                                    $scope.order_total = success.data[0].order_total;
                                }
                            });
                        }
                    });

                });
            }])
        .controller('OrderStatusController', ['$scope', '$http', '$location', 'drupalSettings', '$routeParams', '$rootScope', 'Service',
            function ($scope, $http, $location, drupalSettings, $routeParams, $rootScope, Service) {
                var sitePath = drupalSettings.sitePath;
                var restPath = sitePath + '/' + drupalSettings.endpoint;
                $scope.UpdateOrder = function () {
                    Service.token_val().then(function (response) {
                        var token = response.data;
                        Service.connect(token).then(function (response) {
                            var user_id = response.data.user.uid;
                            $scope.result = Service.UpdateOrder(user_id,token);
                        });

                    });
                }
            }])
