angular.module('ShiftsManagerApp').controller('homeCtrl', ['$scope', '$http', function ($scope, $http) {
    // GET THE USER SESSION:
    $scope.currentUser = {};
    var getCurrentUser = function() {
        // GET CURRENT USER OBJECT:
        $http.get('users/currentUser').success(function (response) {
            currentUser = response;
            console.log($scope.currentUser);
        });
    }();

    $scope.updateAdminComment = function() {
        var adminComment = $scope.adminComment;
        // push adminComment to DB

        $scope.displayedComment = adminComment;
    }
}]);