angular.module('ShiftsManagerApp', ['ngRoute', 'ngMessages'])
/* ROUTE Configuration */
    .config(function ($routeProvider) {
        $routeProvider
            .when('/', {
                // controller: 'homeCtrl',
                templateUrl: 'partials/home.ejs'
            })
            .when('/schedule', {
                // controller: 'scheduleCtrl',
                templateUrl: 'partials/schedule.ejs'
            })
            .when('/employees', {
                // controller: 'employeesCtrl',
                templateUrl: 'partials/employees.ejs'
            })
            .otherwise({redirectTo: '/'});
    });