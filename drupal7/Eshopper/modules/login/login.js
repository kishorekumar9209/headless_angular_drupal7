'use strict';
angular.module("EcommApp")
        .controller('LoginController', ['$scope', '$http', '$location', 'Service',
            function ($scope, $http, $location, Service) {

                Service.token_val().then(function (response) {
                    var token = response.data;
                    console.log(token);
                    Service.connect(token).then(function (response) {
                        var user_id = response.data.user.uid;
                        console.log(user_id);
                        if (user_id > 0) {
                            console.log('logoutbutton');
                            $scope.logoutbutton = true;
                        } else {
                            console.log('loginbutton');
                            $scope.loginbutton = true;
                        }
                    });

                });

                $scope.login = function () {
                    Service.Login($scope.lusername, $scope.lpassword).then(function (success) {
                        console.log(success);
                        var status_text = success.status;
                        if (status_text != '200') {
                            $scope.loginerror = success.statusText;
                        }
                    });
                }
                $scope.register = function () {
                    Service.Register($scope.rusername, $scope.rpassword, $scope.remail).then(function (response) {
                        var status_text = response.status;
                        if (status_text != '200') {
                            $scope.registererror = response.statusText;
                        } else {
                            Service.Login($scope.rusername, $scope.rpassword);
                        }

                    });
                }
                $scope.logout = function () {
                    console.log('logout user');
                    Service.token_val().then(function (response) {
                        var token = response.data;
                        $scope.result = Service.logout(token);
                    });

                }
            }]);