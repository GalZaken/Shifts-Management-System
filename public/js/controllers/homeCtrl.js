angular.module('ShiftsManagerApp').controller('homeCtrl', ['$scope', '$http', function ($scope, $http) {

    $scope.displayedComment = "";

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
            // console.log(response);
            $scope.adminComment = response;
            $scope.displayedComment = $scope.adminComment.comment;
        });
    };

    $scope.updateAdminComment = function() {
        var comment = $scope.comment;
        var id = $scope.adminComment._id;

        // push adminComment to DB
        $http.put('/comment/adminComment/' + id, { comment: comment }).then(function(response) {
            // console.log(response);
            getAdminComment();
        });
    }

    $scope.isAdmin = function() {
        if ($scope.currentUser.isAdmin)
            return true;
        else
            return false;
    }
}]);