
angular.module("mainApp", ['ngRoute'])

 
.config(['$routeProvider','$provide', function ($routeProvider,$provide) {

    $routeProvider
        .when('/login', {
            templateUrl: 'modules/login/login.html',
            controller: 'LoginController',
        })
 
        .when('/home', {
           
     templateUrl: 'modules/home/home.html',
     controller: 'HomeController',
        })
        
        .when('/register', {
           
     templateUrl: 'modules/registration/register.html',
     controller: 'RegisterController',
        })
 
        .otherwise({ redirectTo: '/' });
  $provide.value('drupalSettings', {
        sitePath: 'http://localhost/demo-project/drupal7',
        endpoint: 'api'
    })
}])



 
.run(['$rootScope', '$location', '$http','Service',
    function ($rootScope, $location, $http, Service) {
         var token;
         Service.token_val().then(function(response){
          token = response.data;
          Service.connect(token).then(function(response){
             var user_id = response.data.user.uid;
             
             if(user_id > 0){
                 $location.path('/home');
             }
             else{
                 $location.path('/login');
             }
          });
          
         });
    }]);



