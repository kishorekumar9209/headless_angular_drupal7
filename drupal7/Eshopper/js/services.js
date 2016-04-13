'use strict';
angular.module('EcommApp')

        .factory('Service', ['$http', '$location', 'drupalSettings', function ($http, $location, drupalSettings) {
                var factory = {};
                var sitePath = drupalSettings.sitePath;
                var restPath = sitePath + '/' + drupalSettings.endpoint;

                factory.token_val = function () {
                    var req = {
                        method: 'POST',
                        url: sitePath + '/services/session/token',
                    }

                    return $http(req).then(function successCallback(response) {
                        return response;
                    }, function errorCallback(response) {
                        return response;
                    });

                };
                factory.connect = function (token) {

                    var req = {
                        method: 'POST',
                        url: restPath + '/system/connect',
                        headers: {'X-CSRF-Token': token}
                    }

                    return $http(req).then(function successCallback(response) {
                        return response;
                    }, function errorCallback(response) {
                        return response;
                    });

                };

                factory.Register = function (username, password, email) {

                    var req = {
                        method: 'POST',
                        url: restPath + '/user/register',
                        data: {name: username,
                            pass: password,
                            mail: email,
                        }
                    }

                    return $http(req).then(function successCallback(response) {
                        return response;
                    }, function errorCallback(response) {
                        return response;
                    });

                };
                factory.Login = function (username, password) {

                    var req = {
                        method: 'POST',
                        url: restPath + '/user/login',
                        data: {username: username,
                            password: password,
                        }
                    }

                    return $http(req).then(function successCallback(response) {
                        $location.path('/home');
                        return response;
                    }, function errorCallback(response) {
                        return response;
                    });

                };


                factory.logout = function (token) {
                    var req = {
                        method: 'POST',
                        url: restPath + '/user/logout',
                        headers: {'X-CSRF-Token': token}
                    }
                    return $http(req).then(function successCallback(response) {
                        $location.path('/login');
                    }, function errorCallback(response) {
                        return response;
                    });

                };

                factory.addCart = function (token, pid, uid) {
                    var req = {
                        method: 'POST',
                        url: restPath + '/cart',
                        headers: {'X-CSRF-Token': token},
                        data: {uid: uid,
                            pid: pid,
                        }
                    }
                    $http(req).then(function successCallback(response) {
                        console.log(response);
                    }, function errorCallback(response) {
                        console.log(response);
                    });

                }
                return factory;
            }]);