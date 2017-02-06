angular.module('ShiftsManagerApp', ['ngRoute'])
/* ROUTE Configuration */
    .config(function ($routeProvider, $locationProvider) {
        $routeProvider
            .when('/', {
                controller: 'homeCtrl',
                templateUrl: 'partials/home.ejs'
            })
            .when('/schedule', {
                controller: 'scheduleCtrl',
                templateUrl: 'partials/schedule.ejs'
            })
            .when('/employees', {
                controller: 'employeesCtrl',
                templateUrl: 'partials/employees.ejs'
            })
            .when('/profile', {
                controller: 'profileCtrl',
                templateUrl: 'partials/profile.ejs'
            })
            .when('/settings', {
                controller: 'settingsCtrl',
                templateUrl: 'partials/settings.ejs'
            })
            .otherwise({redirectTo: '/'});

        $locationProvider.html5Mode(true);
    });