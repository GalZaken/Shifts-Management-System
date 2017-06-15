angular.module('ShiftsManagerApp').controller('employeesCtrl', ['$scope', '$http', function($scope, $http) {
    // EMPLOYEES CONTROLLER:

    $scope.modalTitle = "";
    $scope.modalStatus = 1;
    $scope.user = {};
    $scope.usersList = {};

    // GET THE USER SESSION:
    $scope.currentUser = {};
    getCurrentUser();

    function getCurrentUser() {
        // GET CURRENT USER OBJECT:
        $http.get('users/currentUser').success(function (response) {
            $scope.currentUser = response;
        });
        console.log($scope.currentUser);
    };

    $scope.isAdmin = function() {
        if ($scope.currentUser.isAdmin)
            return true;
        else
            return false;
    };

    var refresh = function() {
        // GET USERS LIST FROM DB:
        $http.get('/users/usersList').success(function (response) {
            $scope.usersList = response;
        });
    };
    refresh();

    $scope.setModalTitle = function(selectedNumber) {
        if (selectedNumber == 1) {
            $scope.modalTitle = 'הוספת עובד חדש';
            $scope.modalStatus = 1;
            deselect();
        }
        else {
            $scope.modalTitle = 'עריכה';
            $scope.modalStatus = 2;
        }
    };

    $scope.addUser = function() {
        // ADD NEW USER INTO DB:
        newUser = createUserObject();
        console.log(newUser);

        $http.post('/users/usersList', newUser).then(function(response) {
            console.log(response);
            deselect(); // CLEAR FIELDS.
            refresh();
        });
    };

    $scope.remove = function(id) {
        // REMOVE USER FROM DB:
        $http.delete('/users/usersList/' + id).then(function(response) {
            refresh();
        });
    };

    $scope.removeSelected = function() {
        // REMOVE USER FROM DB:
        $http.delete('/users/usersList/' + selectedUserID).then(function(response) {
            refresh();
        });
    }

    $scope.edit = function(id) {
        // EDIT USER:
        $scope.setModalTitle(2);
        var user = {};

        // GET USER FROM DB:
        $http.get('/users/usersList/' + id).success(function (response) {
            console.log(response);
            user = response;
            $scope.user = user;

            $scope.username = user.username;
            $scope.firstname = user.firstname;
            $scope.lastname = user.lastname;
            $scope.idNumber = user.idNumber;
            $scope.email = user.email;
            $scope.phoneNumber = user.phoneNumber;
            $scope.selectedRoleValue = user.selectedRoleValue;
            $scope.selectedStatusValue = user.selectedStatusValue;
            $scope.selectedPriorityValue = user.selectedPriorityValue;
            $scope.selectedMinShiftsValue = user.selectedMinShiftsValue;
        });

        console.log($scope.user);
    };

    $scope.update = function(id) {
        // UPDATE USER IN DB:
        var updatedUser = createUserObject();
        updatedUser._id = $scope.user._id;
        updatedUser.password = $scope.user.password;

        $http.put('/users/usersList/' + id, updatedUser).then(function(response) {
            console.log(response);
            refresh();
            getCurrentUser();
        });
    };

    $scope.selectUserID = function(id) {
        selectedUserID = id;
    };

    function createUserObject() {

        var isAdmin = false;
        var userShifts = {
            morning: {
                shiftName: "Morning",
                shifts: [false, false, false, false, false, false, false]
            },
            evening: {
                shiftName: "Evening",
                shifts: [false, false, false, false, false, false, false]
            },
            night: {
                shiftName: "Night",
                shifts: [false, false, false, false, false, false, false]
            }
        };

        // if user object is admin:
        if (!$scope.selectedRoleValue || $scope.selectedRoleValue == 'Admin') {
            isAdmin = true;
            userShifts = {};
        }

        return {
            username: $scope.username,
            password: $scope.idNumber,
            firstname: $scope.firstname,
            lastname: $scope.lastname,
            idNumber: $scope.idNumber,
            email: $scope.email,
            phoneNumber: $scope.phoneNumber,
            role: $scope.selectedRoleValue,
            status: $scope.selectedStatusValue,
            priority: $scope.selectedPriorityValue,
            minShifts: $scope.selectedMinShiftsValue,
            isAdmin: isAdmin,
            userShifts: userShifts
        };
    }

    function deselect() {
        $scope.username = "";
        $scope.firstname = "";
        $scope.lastname = "";
        $scope.idNumber = "";
        $scope.email = "";
        $scope.phoneNumber = "";
        $scope.selectedRoleValue = "";
        $scope.selectedStatusValue = "";
        $scope.selectedPriorityValue = "";
        $scope.selectedMinShifts = "";
    }

    // function isSelected(selectedNumber) {
    //     if (selectedButton == selectedNumber)
    //         return true;
    //     else
    //         return false;
    // }
}]);