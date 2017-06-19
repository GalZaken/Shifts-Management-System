angular.module('ShiftsManagerApp').controller('scheduleCtrl', ['$scope', '$http', function ($scope, $http) {

    // --------------------- REGULAR USER: --------------------- //

    // GET THE USER SESSION:
    $scope.currentUser = {};
    $http.get('users/currentUser').success(function(response) {
        $scope.currentUser = response;
    }).then(function(response) {
        if ($scope.currentUser.isAdmin)
            return;

        $scope.userShifts = new Array();
        $scope.userShifts.push($scope.currentUser.userShifts.morning);
        $scope.userShifts.push($scope.currentUser.userShifts.evening);
        $scope.userShifts.push($scope.currentUser.userShifts.night);
    });

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

    $scope.updateUserShifts = function() {
        // CHECK IF SHIFTS FILLED ACCORDING TO USER MIN SHIFTS:
        if (!shiftsValid()) {
            alert("מינום המשמרות להזנה: " + $scope.currentUser.minShifts);
            return;
        }

        // UPDATE USER IN DB:
        var updatedUser = $scope.currentUser;
        $http.put('/users/usersList/' + updatedUser._id, updatedUser).then(function(response) {
            // console.log(response.data);
        });
        alert("המשמרות הוזנו בהצלחה");
    }

    function shiftsValid() {
        var counter = 0;
        for (var i=0; i<$scope.userShifts[0].shifts.length; i++) {
            if ($scope.userShifts[0].shifts[i] || $scope.userShifts[1].shifts[i] || $scope.userShifts[2].shifts[i])
                counter++;
        }

        if (counter < $scope.currentUser.minShifts)
            return false;
        else
            return true;
    }
    // --------------------- END OF REGULAR USER: --------------------- //



    // ---------------------     ADMIN USER:     --------------------- //

    $(document).on('click', '.panel-heading span.clickable', function(e){
        var $this = $(this);
        if(!$this.hasClass('panel-collapsed')) {
            $this.parents('.panel').find('.panel-body').slideUp();
            $this.addClass('panel-collapsed');
            $this.find('i').removeClass('glyphicon-chevron-up').addClass('glyphicon-chevron-down');
        } else {
            $this.parents('.panel').find('.panel-body').slideDown();
            $this.removeClass('panel-collapsed');
            $this.find('i').removeClass('glyphicon-chevron-down').addClass('glyphicon-chevron-up');
        }
    })

    // Set Start And End Dates:
    setCurrentDates();

    // Get current schedule:
    $http.get('schedules/dates/' + $scope.currentFirstDay + "/" + $scope.currentLastDay).success(function(response) {
        $scope.currentSchedule = response;
    }).then(function(response) {

        console.log("Schedule start date: " + $scope.currentSchedule.startDate);
        console.log("Schedule end date: " + $scope.currentSchedule.endDate);
    });

    function setCurrentDates() {
        // Get startDate and endDate for the new schedule:
        var currentDate = new Date(); // Get current date
        var firstDayOfWeek = currentDate.getDate() - currentDate.getDay(); // First day is the day of the month - the day of the week
        var lastDayOfWeek = firstDayOfWeek + 6; // Last day is the first day + 6

        $scope.currentFirstDay = firstDayOfWeek;
        $scope.currentLastDay = lastDayOfWeek;
        $scope.currentMonth = currentDate.getMonth() + 1;
        $scope.currentYear = currentDate.getFullYear();

        $scope.currentStartDate = new Date(currentDate.setDate(firstDayOfWeek));
        $scope.currentEndDate = new Date(currentDate.setDate(lastDayOfWeek));
    }

    $scope.positions = new Array();
    $scope.positions.push({ positionName: "Pos1", guardsArray: ["Yossi"] });
    $scope.positions.push({ positionName: "Pos2", guardsArray: ["Eli"] });
    $scope.positions.push({ positionName: "Pos3", guardsArray: ["Tomer"] });
    $scope.positions.push({ positionName: "Pos4", guardsArray: ["Assaf"] });
    $scope.positions.push({ positionName: "Pos5", guardsArray: ["Danny"] });
}]);