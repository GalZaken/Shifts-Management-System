angular.module('ShiftsManagerApp').controller('homeCtrl', ['$scope', '$http', function ($scope, $http) {

    $scope.updateAdminComment = function() {
        var adminComment = $scope.adminComment;
        // push adminComment to DB
        console.log(adminComment);
        $scope.displayedComment = adminComment;
    }
}]);