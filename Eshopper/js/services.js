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
                factory.Login = function (username, password, token) {
                    var req = {
                        method: 'POST',
                        url: restPath + '/user/login',
                        headers: {'X-CSRF-Token': token},
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

                factory.addCart = function (token, pid, uid,quantity) {
                    var req = {
                        method: 'POST',
                        url: restPath + '/cart',
                        headers: {'X-CSRF-Token': token},
                        data: {uid: uid,
                            pid: pid,
                            quantity :quantity,
                        }
                    }
                    $http(req).then(function successCallback(response) {
                        console.log(response);
                    }, function errorCallback(response) {
                        console.log(response);
                    });

                }
                factory.DisplayCartProduct = function (uid) {
                    var req = {
                        method: 'GET',
                        url: restPath + '/cart/' + uid,
                    }
                    return $http(req).then(function successCallback(response) {
                        console.log(response);
                        return response;
                    }, function errorCallback(response) {
                        console.log(response);
                    });
                }
                factory.UpdateOrder = function (uid, token) {
                    console.log(uid);
                    var req = {
                        method: 'POST',
                        url: restPath + '/cart/update',
                        headers: {'X-CSRF-Token': token},
                        data: {uid: uid,
                        }
                    }
                    $http(req).then(function successCallback(response) {
                        console.log(response);
                    }, function errorCallback(response) {
                        console.log(response);
                    });

                }


                factory.BillingOrderStatus = function (token, user_id, fname, lname, add1, add2, state, country, zip) {
                    console.log(country);
                    var req = {
                        method: 'POST',
                        url: restPath + '/cart/billing_profile_create',
                        headers: {'X-CSRF-Token': token},
                        data: {uid: user_id,
                            fname: fname,
                            lname: lname,
                            add1: add1,
                            add2: add2,
                            state: state,
                            country: country,
                            zip: zip,
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