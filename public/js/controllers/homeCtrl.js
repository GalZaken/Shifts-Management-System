angular.module('ShiftsManagerApp').controller('homeCtrl', ['$scope', '$http', function ($scope, $http) {

    //NEED TO GET COMMENT FROM DB
    $scope.adminComment = {};
    getAdminComment();

    // GET THE USER SESSION:
    $scope.currentUser = {};
    getCurrentUser();

    function getCurrentUser() {
        // GET CURRENT USER OBJECT:
        $http.get('users/currentUser').success(function (response) {
            $scope.currentUser = response;
        });
    };

    function getAdminComment() {
        // GET CURRENT USER OBJECT:
        $http.get('comment/adminComment').success(function (response) {
            $scope.adminComment = response;
        });
    };

    $scope.updateAdminComment = function() {
        var adminComment = $scope.adminComment.comment;
        // push adminComment to DB

        $http.put('/comment/adminComment/:id' + $scope.adminComment.id, adminComment).then(function(response) {
            console.log(response);
            getAdminComment();
        });

        $scope.displayedComment = adminComment;
    }

    $scope.isAdmin = function() {
        if ($scope.currentUser.isAdmin)
            return true;
        else
            return false;
    }
}]);