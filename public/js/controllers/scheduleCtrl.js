angular.module('ShiftsManagerApp').controller('scheduleCtrl', ['$scope', '$http', function ($scope, $http) {

    const DAYS_IN_WEEK = 7;

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

    // Init schedule:
    setCurrentWeekDates();
    getCurrentWeekSchedule();

    function setCurrentWeekDates() {

        var now = new Date();
        var currentWeekFirstDay = now.getDate() - now.getDay();
        var currentWeekLastDay = currentWeekFirstDay + 6;

        $scope.currentWeekStartDate = new Date(now.setDate(currentWeekFirstDay));
        $scope.currentWeekStartDateString = getStringDate($scope.currentWeekStartDate);
        $scope.currentWeekEndDate = new Date(now.setDate(currentWeekLastDay));
        $scope.currentWeekEndDateString = getStringDate($scope.currentWeekEndDate);
    }

    function getStringDate(date) {
        // Function for returning String format "2015-03-25" (YYYY-MM-DD) of Data object:
        var dd = date.getDate();
        var mm = date.getMonth() + 1; //January is 0!
        var yyyy = date.getFullYear();

        if(dd < 10)
            dd = '0' + dd;

        if(mm < 10)
            mm = '0' + mm;

        return yyyy + '-' + mm + '-' + dd;
    }

    function getCurrentWeekSchedule() {

        $http.get('schedules/currentSchedule/' + $scope.currentWeekStartDateString + "/" + $scope.currentWeekEndDateString).success(function(response) {
            $scope.currentSchedule = response;
        }).then(function(data) {
            // Set current schedule days array:
            setCurrentScheduleDaysArray($scope.currentSchedule.startDateString);
        });
    }

    function setCurrentScheduleDaysArray(startDateString) {

        $scope.currentScheduleDaysArray = new Array(DAYS_IN_WEEK);
        var currentStartDate = new Date(startDateString);
        var firstDayOfWeek = currentStartDate.getDate();

        for (var i=0; i<DAYS_IN_WEEK; i++) {

            var newDate = new Date(currentStartDate.setDate(firstDayOfWeek + i));
            var day = newDate.getDate();
            var month = newDate.getMonth() + 1;
            var year = newDate.getFullYear();

            console.log("Day " + (i+1) + ": " + day + "." + month + "." + year);
            $scope.currentScheduleDaysArray[i] = (day + "." + month + "." + year);
        }
    }

    $scope.showPreviousWeekSchedule = function () {

        var currentWeekStartDate = new Date($scope.currentSchedule.startDateString);
        var currentWeekEndDate = new Date($scope.currentSchedule.endDateString);

        var prevWeekFirstDay = currentWeekStartDate.getDate() - 7; // First day of previous week.
        var prevWeekLastDay = currentWeekEndDate.getDate() - 7; // Last day of previous week.

        var prevWeekStartDate = new Date(currentWeekStartDate.setDate(prevWeekFirstDay));
        var prevWeekEndDate = new Date(currentWeekEndDate.setDate(prevWeekLastDay));

        // console.log("prevWeekStartDate: " + prevWeekStartDate);
        // console.log("prevWeekEndDate: " + prevWeekEndDate);

        var prevWeekStartDateString = prevWeekStartDate.toISOString().substring(0, 10);
        var prevWeekEndDateString = prevWeekEndDate.toISOString().substring(0, 10);

        // console.log("prevWeekStartDateString: " + prevWeekStartDateString);
        // console.log("prevWeekEndDateString: " + prevWeekEndDateString);

        $http.get('schedules/schedule/' + prevWeekStartDateString + "/" + prevWeekEndDateString).success(function(response) {
            if (!response)
                return;
            else {
                $scope.currentSchedule = response;
                setCurrentScheduleDaysArray($scope.currentSchedule.startDateString);
            }
        });
    }

    $scope.showNextWeekSchedule = function() {

        var currentWeekStartDate = new Date($scope.currentSchedule.startDateString);
        var currentWeekEndDate = new Date($scope.currentSchedule.endDateString);

        var nextWeekFirstDay = currentWeekStartDate.getDate() + 7; // First day of next week.
        var nextWeekLastDay = currentWeekEndDate.getDate() + 7; // Last day of next week.

        var nextWeekStartDate = new Date(currentWeekStartDate.setDate(nextWeekFirstDay));
        var nextWeekEndDate = new Date(currentWeekEndDate.setDate(nextWeekLastDay));

        // console.log("nextWeekStartDate: " + nextWeekStartDate);
        // console.log("nextWeekEndDate: " + nextWeekEndDate);

        var nextWeekStartDateString = nextWeekStartDate.toISOString().substring(0, 10);
        var nextWeekEndDateString = nextWeekEndDate.toISOString().substring(0, 10);

        // console.log("nextWeekStartDateString: " + nextWeekStartDateString);
        // console.log("nextWeekEndDateString: " + nextWeekEndDateString);

        $http.get('schedules/schedule/' + nextWeekStartDateString + "/" + nextWeekEndDateString).success(function(response) {
            if (!response)
                return;
            else {
                $scope.currentSchedule = response;
                setCurrentScheduleDaysArray($scope.currentSchedule.startDateString);
            }
        });
    }

    // --------------------------------------

    $scope.positions = new Array();
    $scope.positions.push({ positionName: "Pos1", guardsArray: ["Yossi"] });
    $scope.positions.push({ positionName: "Pos2", guardsArray: ["Eli"] });
    $scope.positions.push({ positionName: "Pos3", guardsArray: ["Tomer"] });
    $scope.positions.push({ positionName: "Pos4", guardsArray: ["Assaf"] });
    $scope.positions.push({ positionName: "Pos5", guardsArray: ["Danny"] });
}]);