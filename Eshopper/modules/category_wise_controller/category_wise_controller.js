'use strict';
console.log('product');
angular.module("EcommApp")

        .controller('CategoryWiseController', ['$scope', '$http', '$location', 'drupalSettings', '$routeParams', 'Service','$timeout',
            function ($scope, $http, $location, drupalSettings, $routeParams, Service,$timeout) {
                var sitePath = drupalSettings.sitePath;
                var restPath = sitePath + '/' + drupalSettings.endpoint;
                var termId;
                termId = $routeParams.termId;
                $scope.addItem = function (pid, pname) {
                    $scope.message = pname;
                    $scope.showMessage = true;
                    // Simulate 2 seconds loading delay
                    $timeout(function () {
                        // Loadind done here - Show message for 3 more seconds.
                        $timeout(function () {
                            $scope.showMessage = false;
                        }, 3000);

                    }, 2000);
                    Service.token_val().then(function (response) {
                        var token = response.data;
                        Service.connect(token).then(function (response) {
                            var user_id = response.data.user.uid;
                            $scope.result = Service.addCart(token, pid, user_id);
                        });

                    });
                };
                var req = {
                    method: 'GET',
                    url: restPath + '/category_wise_listing/product_display?tid=' + termId,
                }

                $http(req).then(function successCallback(response) {


                    $scope.products = response.data;

                }, function errorCallback(response) {
                    console.log(response);
                    return response;
                });

            }])