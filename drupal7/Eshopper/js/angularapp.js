
'use strict';
angular.module("EcommApp", ['ngRoute'])


        .config(['$routeProvider', '$provide', function ($routeProvider, $provide) {


                $routeProvider
                        .when('/', {
                            templateUrl: 'modules/home/home.html',
                        })

                        .when('/login', {
                            templateUrl: 'modules/login/login.html',
                            controller: 'LoginController'
                        })

                        .when('/category/:termId', {
                            templateUrl: 'modules/category_wise_controller/category_wise_controller.html',
                        })
                        .when('/product/:nid', {
                            templateUrl: 'modules/product_display_page/product_display_page.html',
                            controller: 'PDPController',
                        })

                        .when('/account', {
                            templateUrl: 'modules/user_account/user_account.html',
                            controller: 'AccountController',
                            resolve: {
                                "check": function (Service, $location) {
                                    Service.token_val().then(function (response) {
                                        var token = response.data;
                                        Service.connect(token).then(function (response) {
                                            var user_id = response.data.user.uid;
                                            if (user_id > 0) {

                                            } else {
                                                $location.path('/login');
                                            }
                                        });

                                    });
                                }
                            }
                        })

                        .when('/home', {
                            templateUrl: 'modules/home/home.html',
                        })
                        .when('/cart', {
                            templateUrl: 'modules/view_cart/view_cart.html',
                            controller: 'CartController',
                        })


                        .when('/register', {
                            templateUrl: 'modules/registration/register.html',
                            controller: 'RegisterController'
                        })

                        .otherwise({redirectTo: '/'});
                $provide.value('drupalSettings', {
                    sitePath: 'http://localhost/demo-project/drupal7',
                    endpoint: 'api'
                })
            }])


        .controller('CategoryController', ['$scope', '$http', '$location', 'drupalSettings',
            function ($scope, $http, $location, drupalSettings) {
                var sitePath = drupalSettings.sitePath;
                var sitePath = sitePath + '/' + drupalSettings.endpoint;


                var req = {
                    method: 'GET',
                    url: sitePath + '/category_listing/product_category',
                }

                $http(req).then(function successCallback(response) {

                    $scope.Categories = response.data;
                }, function errorCallback(response) {
                    return response;
                });
            }])


        .run(['$rootScope', '$location', '$http', 'Service',
            function ($rootScope, $location, $http, Service) {
                var token;
                Service.token_val().then(function (response) {
                    token = response.data;
                    Service.connect(token).then(function (response) {
                        var user_id = response.data.user.uid;
                        if (user_id > 0) {
                        } else {
                            $location.path('/');
                        }
                    });

                });
            }]);

