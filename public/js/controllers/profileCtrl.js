angular.module('ShiftsManagerApp').controller('profileCtrl', ['$scope', '$http', function ($scope, $http) {

    // GET THE USER SESSION:
    $scope.currentUser = {};
    getCurrentUser();

    function getCurrentUser() {
        // GET CURRENT USER OBJECT:
        $http.get('users/currentUser').success(function (response) {
            $scope.currentUser = response;
        });
    };
}]);