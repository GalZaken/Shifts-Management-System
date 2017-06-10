angular.module('ShiftsManagerApp').controller('homeCtrl', ['$scope', '$http', function ($scope, $http) {

    $scope.adminComment = "";

    // GET THE USER SESSION:
    $scope.currentUser = {};
    getCurrentUser();

    function getCurrentUser() {
        // GET CURRENT USER OBJECT:
        $http.get('users/currentUser').success(function (response) {
            $scope.currentUser = response;
        });
    };

    $scope.updateAdminComment = function() {
        var adminComment = $scope.adminComment;
        // push adminComment to DB

        $scope.displayedComment = adminComment;
    }

    $scope.isAdmin = function() {
        if ($scope.currentUser.isAdmin) {
            console.log($scope.currentUser);
            console.log($scope.currentUser.isAdmin);
            console.log("in func");
            return true;
        }
        else
            return false;
    }
}]);