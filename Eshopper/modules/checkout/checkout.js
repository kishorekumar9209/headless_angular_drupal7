'use strict';
angular.module("EcommApp")
        .controller('OrderCompleteController', ['$scope', '$http', '$location', 'drupalSettings', '$routeParams', '$rootScope', 'Service',
            function ($scope, $http, $location, drupalSettings, $routeParams, $rootScope, Service) {
                var sitePath = drupalSettings.sitePath;
                var restPath = sitePath + '/' + drupalSettings.endpoint;
                $scope.BillingOrderSave = function () {
                    console.log('biillin order save');
                    Service.token_val().then(function (response) {
                        var token = response.data;
                        Service.connect(token).then(function (response) {
                            var user_id = response.data.user.uid;
                            var fname = $scope.firstname;
                            var lname = $scope.lastname;
                            var add1 = $scope.address1;
                            var add2 = $scope.address2;
                            var state = $scope.state;
                            var country = $scope.country;
                            var zip = $scope.zip;
                            $scope.sitepath = sitePath
                            $scope.result = Service.BillingOrderStatus(token, user_id, fname, lname, add1, add2, state, country, zip);

                        });

                    });
                    $location.path('/order-complete');
                }
            }])
