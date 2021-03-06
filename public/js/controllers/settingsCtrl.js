angular.module('ShiftsManagerApp').controller('settingsCtrl', ['$scope', '$http', function ($scope, $http) {

    $scope.selectedPositionID = "";

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

    var refresh = function() {
        // GET POSITIONS LIST FROM DB:
        $http.get('/positions/positionsList').success(function (response) {
            $scope.positionsList = response;
            getAdminConfiguration();
        });
    };
    refresh();

    // Adding position to DB:
    $scope.addPosition = function() {

        // ADD NEW USER INTO DB:
        newPosition = createPositionObject();
        console.log(newPosition);

        $http.post('/positions/', newPosition).then(function(response) {
            console.log(response);
            deselect(); // CLEAR FIELDS.
            refresh();
        });
    };

    $scope.edit = function(id) {
        // EDIT POSITION:
        $scope.setModalTitle(2);
        var position = {};

        // GET USER FROM DB:
        $http.get('/positions/' + id).success(function (response) {

            position = response;
            $scope.position = position;

            $scope.positionName = position.positionName;
            $scope.selectedInMorningValue = position.inMorning ? 1 : 0;
            $scope.selectedInEveningValue = position.inEvening ? 1 : 0;
            $scope.selectedInNightValue = position.inNight ? 1 : 0;
        });
    };

    $scope.update = function(id) {
        // UPDATE USER IN DB:
        var updatePosition = createPositionObject();
        updatePosition._id = $scope.position._id;

        $http.put('/positions/' + id, updatePosition).then(function(response) {
            refresh();
        });
    };

    $scope.removeSelected = function() {
        // REMOVE SELECTED POSITION FROM DB BY ID:
        $http.delete('/positions/' + $scope.selectedPositionID).then(function(response) {
            refresh();
        });
    }

    $scope.selectPositionID = function(id) {
        $scope.selectedPositionID = id;
    };

    $scope.isValid = function() {
        if (!$scope.positionName || $scope.positionName == "")
            return false;

        return true;
    };

    // Private Methods:

    function createPositionObject() {

        return {
            positionName: $scope.positionName,
            shiftsArray: new Array(7),
            inMorning: $scope.selectedInMorningValue == 1,
            inEvening: $scope.selectedInEveningValue == 1,
            inNight: $scope.selectedInNightValue == 1
        };
    }

    function deselect() {
        $scope.positionName = "";
        $scope.selectedInMorningValue = 1;
        $scope.selectedInEveningValue = 1;
        $scope.selectedInNightValue = 1;
    }

    function getAdminConfiguration() {

        $http.get('configuration/').success(function (response) {
            // console.log(response);
            $scope.adminConfiguration = response;

            $scope.selectedMorningPriorityValue = $scope.adminConfiguration.morningPriority;
            $scope.selectedEveningPriorityValue= $scope.adminConfiguration.eveningPriority;
            $scope.selectedNightPriorityValue = $scope.adminConfiguration.nightPriority;
        });
    }

    $scope.updateAdminConfiguration = function() {

        var configuration = {
            morningPriority: $scope.selectedMorningPriorityValue,
            eveningPriority: $scope.selectedEveningPriorityValue,
            nightPriority: $scope.selectedNightPriorityValue
        };

        var id = $scope.adminConfiguration._id;

        // push adminComment to DB
        $http.put('/configuration/' + id, configuration).then(function(response) {
            // console.log(response);
            getAdminConfiguration();
        });
    }
}]);