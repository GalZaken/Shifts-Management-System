angular.module('ShiftsManagerApp').controller('scheduleCtrl', ['$scope', '$http', function ($scope, $http) {

    $scope.adminComment = "";

    // GET THE USER SESSION:
    $scope.currentUser = {};
    getCurrentUser();

    $scope.userShifts = new Array();
    $scope.userShifts.push({ shiftName: "בוקר", shifts: [false,false,false,false,false,false,false] });
    $scope.userShifts.push({ shiftName: "צהריים", shifts: [false,false,false,false,false,false,false] });
    $scope.userShifts.push({ shiftName: "ערב", shifts: [false,false,false,false,false,false,false] });

    function getCurrentUser() {
        // GET CURRENT USER OBJECT:
        $http.get('users/currentUser').success(function (response) {
            $scope.currentUser = response;
        });
    };

    $scope.isAdmin = function() {
        if ($scope.currentUser.isAdmin)
            return true;
        else
            return false;
    }

    $scope.setSelected = function(index) {
        $scope.selected = this.shift;
        if ($scope.selected.shifts[index])
            $scope.selected.shifts[index] = false;
        else
            $scope.selected.shifts[index] = true;
    }
}]);