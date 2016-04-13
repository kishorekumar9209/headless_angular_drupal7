'use strict';
angular.module("EcommApp")
        .controller('PDPController', ['$scope', '$http', '$location', 'drupalSettings', '$routeParams', 'Service','$timeout',
            function ($scope, $http, $location, drupalSettings, $routeParams, Service,$timeout) {
                var sitePath = drupalSettings.sitePath;
                var restPath = sitePath + '/' + drupalSettings.endpoint;
                var nid;
                nid = $routeParams.nid;
                console.log($location.search());
    
                $scope.addItem = function (pid,pname) {
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
                            console.log(user_id);
                            $scope.result = Service.addCart(token, pid, user_id);


                        });

                    });
                };

                var req = {
                    method: 'GET',
                    url: restPath + '/product_display_page/product_display?nid=' + nid,
                }

                $http(req).then(function successCallback(response) {
                    
   
                           $scope.products = response.data[0];
                           console.log($scope.products);

                }, function errorCallback(response) {
                    console.log(response);
                    return response;
                });
            }])