angular.module('ShiftsManagerApp').controller('settingsCtrl', ['$scope', '$http', function ($scope, $http) {

    $scope.modalTitle = "";
    $scope.modalStatus = 1;
    $scope.setModalTitle = function(selectedNumber) {
        if (selectedNumber == 1) {
            $scope.modalTitle = 'הוספת עמדה חדשה';
            $scope.modalStatus = 1;
            deselect();
        }
        else {
            $scope.modalTitle = 'עריכה';
            $scope.modalStatus = 2;
        }
    };

    // GET POSITIONS LIST FROM DB:
    // $http.get('/positions/positionsList').success(function (response) {
    //     $scope.usersList = response;
    // });
}]);