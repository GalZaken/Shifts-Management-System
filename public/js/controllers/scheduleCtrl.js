angular.module('ShiftsManagerApp').controller('scheduleCtrl', ['$scope', '$http', function ($scope, $http) {

    const DAYS_IN_WEEK = 7;

    // --------------------- REGULAR USER: --------------------- //

    setNextScheduleDaysArray();

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

        setNextScheduleDaysArray();
    });

    $scope.isAdmin = function() {
        if ($scope.currentUser.isAdmin)
            return true;
        else
            return false;
    }

    $scope.setSelected = function(index) {

        if ($scope.isAdmin())
            return;

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

    function setNextScheduleDaysArray() {

        $scope.nextScheduleDaysArray = new Array(DAYS_IN_WEEK);

        var currentDate = new Date();
        var currentFirstDay = currentDate.getDate() - currentDate.getDay();

        // console.log("currentDate: " + currentDate);
        // console.log("currentFirstDay: " + currentFirstDay);

        var nextStartDate = new Date(currentDate.setDate(currentFirstDay + DAYS_IN_WEEK));
        var firstDayOfWeek = nextStartDate.getDate();

        // console.log("nextStartDate: " + nextStartDate);
        // console.log("firstDayOfWeek: " + firstDayOfWeek);

        for (var i=0; i<DAYS_IN_WEEK; i++) {

            var newDate = new Date(nextStartDate.setDate(firstDayOfWeek + i));
            var day = newDate.getDate();
            var month = newDate.getMonth() + 1;
            var year = newDate.getFullYear();

            // console.log("Day " + (i+1) + ": " + day + "." + month + "." + year);
            $scope.nextScheduleDaysArray[i] = (day + "." + month + "." + year);
        }
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
    $scope.currentSchedule = {};

    $scope.employeesList = [];
    $scope.activeEmployeesList = [];
    $scope.pendingEmployeesList = [];

    $scope.positionsArray = [];
    $scope.morningShiftPositionsArray = [];
    $scope.eveningShiftPositionsArray = [];
    $scope.nightShiftPositionsArray = [];

    $scope.selectedGuard = null;

    setCurrentWeekDates();
    getCurrentWeekSchedule();
    getEmployeesList();
    getAdminConfiguration();

    $scope.showPreviousWeekSchedule = function () {

        var currentWeekStartDate = new Date($scope.currentSchedule.startDateString);
        var currentWeekEndDate = new Date($scope.currentSchedule.endDateString);

        var prevWeekFirstDay = currentWeekStartDate.getDate() - DAYS_IN_WEEK; // First day of previous week.
        var prevWeekLastDay = currentWeekEndDate.getDate() - DAYS_IN_WEEK; // Last day of previous week.

        var prevWeekStartDate = new Date(currentWeekStartDate.setDate(prevWeekFirstDay));
        var prevWeekEndDate = new Date(currentWeekEndDate.setDate(prevWeekLastDay));

        // console.log("prevWeekStartDate: " + prevWeekStartDate);
        // console.log("prevWeekEndDate: " + prevWeekEndDate);

        var prevWeekStartDateString = getStringDate(prevWeekStartDate);
        var prevWeekEndDateString = getStringDate(prevWeekEndDate);

        // console.log("prevWeekStartDateString: " + prevWeekStartDateString);
        // console.log("prevWeekEndDateString: " + prevWeekEndDateString);

        $http.get('schedules/schedule/' + prevWeekStartDateString + "/" + prevWeekEndDateString).success(function(response) {
            if (response) {
                $scope.currentSchedule = response;
                setCurrentScheduleDaysArray($scope.currentSchedule.startDateString);
            }
        });

        setCurrentSchedulePositionsArrays();
    }

    $scope.showNextWeekSchedule = function() {

        var currentWeekStartDate = new Date($scope.currentSchedule.startDateString);
        var currentWeekEndDate = new Date($scope.currentSchedule.endDateString);

        var nextWeekFirstDay = currentWeekStartDate.getDate() + DAYS_IN_WEEK; // First day of next week.
        var nextWeekLastDay = currentWeekEndDate.getDate() + DAYS_IN_WEEK; // Last day of next week.

        var nextWeekStartDate = new Date(currentWeekStartDate.setDate(nextWeekFirstDay));
        var nextWeekEndDate = new Date(currentWeekEndDate.setDate(nextWeekLastDay));

        // console.log("nextWeekStartDate: " + nextWeekStartDate);
        // console.log("nextWeekEndDate: " + nextWeekEndDate);

        var nextWeekStartDateString = getStringDate(nextWeekStartDate);
        var nextWeekEndDateString = getStringDate(nextWeekEndDate);

        // console.log("nextWeekStartDateString: " + nextWeekStartDateString);
        // console.log("nextWeekEndDateString: " + nextWeekEndDateString);

        $http.get('schedules/schedule/' + nextWeekStartDateString + "/" + nextWeekEndDateString).success(function(response) {

            if (response) {
                $scope.currentSchedule = response;
                setCurrentScheduleDaysArray($scope.currentSchedule.startDateString);
                setCurrentSchedulePositionsArrays();
            }
        });
    }

    $scope.setShifts = function() {

        var availableWorkersPerDaysArray = new Array(DAYS_IN_WEEK);
        for (var i=0; i<DAYS_IN_WEEK; i++) {
            var currentDayAvailableWorkersObj = {
                availableToWorkInMorning: new Array(),
                availableToWorkInEvening: new Array(),
                availableToWorkInNight: new Array(),

                availableWorkersInDay: new Array()
            };
            availableWorkersPerDaysArray[i] = currentDayAvailableWorkersObj;
        }

        // Set available workers arrays per shift:
        for (var i=0; i<$scope.activeEmployeesList.length; i++) { // i represents the current employee user
            for (var j=0; j<DAYS_IN_WEEK; j++) { // j represents the day in the week; 0 - Sun, 6 Sat.

                var currentDayAvailableWorkersObj = availableWorkersPerDaysArray[j];
                var isAvailable = false; // flag for available to work in day j;

                if ($scope.activeEmployeesList[i].userShifts.morning.shifts[j]) {
                    // if the current employee wants to work on morning in day j:
                    currentDayAvailableWorkersObj.availableToWorkInMorning.push($scope.activeEmployeesList[i]);
                    isAvailable = true;
                }

                if ($scope.activeEmployeesList[i].userShifts.evening.shifts[j]) {
                    // if the current employee wants to work on evening in day j:
                    currentDayAvailableWorkersObj.availableToWorkInEvening.push($scope.activeEmployeesList[i]);
                    isAvailable = true;
                }

                if ($scope.activeEmployeesList[i].userShifts.night.shifts[j]) {
                    // if the current employee wants to work on night in day j:
                    currentDayAvailableWorkersObj.availableToWorkInNight.push($scope.activeEmployeesList[i]);
                    isAvailable = true;
                }

                // In case that the worker is available to work in day j, push to matching array:
                if (isAvailable)
                    currentDayAvailableWorkersObj.availableWorkersInDay.push($scope.activeEmployeesList[i]);
            }
        }

        // Sort available workers arrays per day by priority:
        for (var i=0; i<DAYS_IN_WEEK; i++)
            availableWorkersPerDaysArray[i].availableWorkersInDay.sort(sortByPriority);

        // Print Available Objects:

        // for (var i=0; i<DAYS_IN_WEEK; i++) {
        //
        //     var currentDayAvailableWorkersObj = availableWorkersPerDaysArray[i];
        //
        //     console.log("Day " + i);
        //
        //     console.log("Available to work in morning: ");
        //     var str = "";
        //     for (var j=0; j<currentDayAvailableWorkersObj.availableToWorkInMorning.length; j++) {
        //         str += currentDayAvailableWorkersObj.availableToWorkInMorning[j].username;
        //         if (j < currentDayAvailableWorkersObj.availableToWorkInMorning.length-1)
        //             str += ", ";
        //     }
        //     console.log(str);
        //
        //     console.log("Available to work in evening: ");
        //     var str = "";
        //     for (var j=0; j<currentDayAvailableWorkersObj.availableToWorkInEvening.length; j++) {
        //         str += currentDayAvailableWorkersObj.availableToWorkInEvening[j].username;
        //         if (j < currentDayAvailableWorkersObj.availableToWorkInEvening.length-1)
        //             str += ", ";
        //     }
        //     console.log(str);
        //
        //     console.log("Available to work in night: ");
        //     var str = "";
        //     for (var j=0; j<currentDayAvailableWorkersObj.availableToWorkInNight.length; j++) {
        //         str += currentDayAvailableWorkersObj.availableToWorkInNight[j].username;
        //         if (j < currentDayAvailableWorkersObj.availableToWorkInNight.length-1)
        //             str += ", ";
        //     }
        //     console.log(str);
        // }

        // Algorithm:

        for (var indexOfPriority=0; indexOfPriority<3; indexOfPriority++) {

            if ($scope.priorityArray[indexOfPriority].shiftName == "Night") {
                console.log("in Night");
                // Night Shift: Running on each position of night shift:
                for (var i=0; i<$scope.currentSchedule.nightShift.positionsArray.length; i++) {
                    // Running on each shift of position[i]:
                    for (var j=DAYS_IN_WEEK-1; j>=0; j--) {

                        var newShift = { guardsArray: new Array() };
                        console.log("Day " + j + ":");

                        var currentDayAvailableWorkersObj = availableWorkersPerDaysArray[j];
                        for (var k=0; k<currentDayAvailableWorkersObj.availableWorkersInDay.length; k++) {

                            var currentAvailableWorker = currentDayAvailableWorkersObj.availableWorkersInDay[k];
                            var availableWorkersToNightArray = currentDayAvailableWorkersObj.availableToWorkInNight;

                            if (availableWorkersToNightArray.length == 0) {
                                console.log("There are no available workers for this shift!");
                                continue;
                            }

                            console.log("Checking if worker " + currentAvailableWorker.username + " is available to work in NIGHT:");
                            if (isAvailableToWork(currentAvailableWorker, availableWorkersToNightArray)) {
                                newShift.guardsArray.push(currentAvailableWorker);

                                console.log("Selected to shift: " + currentAvailableWorker.username);
                                currentDayAvailableWorkersObj.availableWorkersInDay.splice(k, 1);
                                break;
                            }

                            console.log("Checking for next available worker...");
                        }

                        // Add the shift to schedule:
                        $scope.currentSchedule.nightShift.positionsArray[i].shiftsArray[j] = newShift;
                    }
                }
            }

            if ($scope.priorityArray[indexOfPriority].shiftName == "Evening") {
                console.log("in Evening");
                // Evening Shift: Running on each position of evening shift:
                for (var i=0; i<$scope.currentSchedule.eveningShift.positionsArray.length; i++) {
                    // Running on each shift of position[i]:
                    for (var j=DAYS_IN_WEEK-1; j>=0; j--) {

                        var newShift = { guardsArray: new Array() };
                        console.log("Day " + j + ":");

                        var currentDayAvailableWorkersObj = availableWorkersPerDaysArray[j];
                        for (var k=0; k<currentDayAvailableWorkersObj.availableWorkersInDay.length; k++) {

                            var currentAvailableWorker = currentDayAvailableWorkersObj.availableWorkersInDay[k];
                            var availableWorkersToNightArray = currentDayAvailableWorkersObj.availableToWorkInEvening;

                            if (availableWorkersToNightArray.length == 0) {
                                console.log("There are no available workers for this shift!");
                                continue;
                            }

                            console.log("Checking if worker " + currentAvailableWorker.username + " is available to work in NIGHT:");
                            if (isAvailableToWork(currentAvailableWorker, availableWorkersToNightArray)) {
                                newShift.guardsArray.push(currentAvailableWorker);

                                console.log("Selected to shift: " + currentAvailableWorker.username);
                                currentDayAvailableWorkersObj.availableWorkersInDay.splice(k, 1);
                                break;
                            }

                            console.log("Checking for next available worker...");
                        }

                        // Add the shift to schedule:
                        $scope.currentSchedule.eveningShift.positionsArray[i].shiftsArray[j] = newShift;
                    }
                }
            }

            if ($scope.priorityArray[indexOfPriority].shiftName == "Morning") {
                console.log("in Morning");
                // Morning Shift: Running on each position of morning shift:
                for (var i=0; i<$scope.currentSchedule.morningShift.positionsArray.length; i++) {
                    // Running on each shift of position[i]:
                    for (var j=DAYS_IN_WEEK-1; j>=0; j--) {

                        var newShift = { guardsArray: new Array() };
                        console.log("Day " + j + ":");

                        var currentDayAvailableWorkersObj = availableWorkersPerDaysArray[j];
                        for (var k=0; k<currentDayAvailableWorkersObj.availableWorkersInDay.length; k++) {

                            var currentAvailableWorker = currentDayAvailableWorkersObj.availableWorkersInDay[k];
                            var availableWorkersToNightArray = currentDayAvailableWorkersObj.availableToWorkInMorning;

                            if (availableWorkersToNightArray.length == 0) {
                                console.log("There are no available workers for this shift!");
                                continue;
                            }

                            console.log("Checking if worker " + currentAvailableWorker.username + " is available to work in NIGHT:");
                            if (isAvailableToWork(currentAvailableWorker, availableWorkersToNightArray)) {
                                newShift.guardsArray.push(currentAvailableWorker);

                                console.log("Selected to shift: " + currentAvailableWorker.username);
                                currentDayAvailableWorkersObj.availableWorkersInDay.splice(k, 1);
                                break;
                            }

                            console.log("Checking for next available worker...");
                        }

                        // Add the shift to schedule:
                        $scope.currentSchedule.morningShift.positionsArray[i].shiftsArray[j] = newShift;
                    }
                }
            }
        }

        // ---- END OF Algorithm: ----

        // Update current schedule in DB:
        $http.put('/schedules/' + $scope.currentSchedule._id, $scope.currentSchedule).then(function(response) {
        });

        // ---- END OF Random ----

    } // Need to complete Algorithm

    $scope.isExpired = function() {
        if ($scope.currentSchedule.published) // Schedule is already published.
            return true;
        else
            return false;
    }

    $scope.setPublish = function() {
        $scope.currentSchedule.published = true;
        // Update current schedule in DB:
        $http.put('/schedules/' + $scope.currentSchedule._id, $scope.currentSchedule).then(function(response) {
        });
    }

    $scope.setSelectedToRemove = function() {

        $scope.selectedPosition = this.position;
        $scope.selectedShift = this.shift;
        $scope.selectedDay = $scope.selectedPosition.shiftsArray.indexOf(this.shift);
        $scope.selectedGuardsArray = this.shift.guardsArray;
    }

    $scope.setSelectedToAdd = function(shiftNumber) {

        $scope.selectedPosition = this.position;
        $scope.selectedShift = this.shift;
        $scope.selectedDay = $scope.selectedPosition.shiftsArray.indexOf(this.shift);
        $scope.selectedGuardsArray = this.shift.guardsArray;

        $scope.selectedShift = shiftNumber;

        $scope.availableWorkersToAdd = new Array(); // available by shift
        $scope.availableWorkersToDay = new Array(); // available by day
        $scope.unavailableWorkersToAdd = new Array(); // unavailable

        var day = $scope.selectedDay;

        // Set available workers arrays per shift:
        for (var i=0; i<$scope.activeEmployeesList.length; i++) { // i represents the current employee user

            var isAvailable = false; // flag for available to work in day;

            if ($scope.activeEmployeesList[i].userShifts.morning.shifts[day]) {
                // if the current employee wants to work on morning in day j:
                if (shiftNumber == 1) { // add to available and want
                    $scope.availableWorkersToAdd.push($scope.activeEmployeesList[i]);
                    continue;
                }
                else
                    isAvailable = true;
            }

            if ($scope.activeEmployeesList[i].userShifts.evening.shifts[day]) {
                // if the current employee wants to work on evening in day j:
                if (shiftNumber == 2) { // add to available and want
                    $scope.availableWorkersToAdd.push($scope.activeEmployeesList[i]);
                    continue;
                }
                else
                    isAvailable = true;
            }

            if ($scope.activeEmployeesList[i].userShifts.night.shifts[day]) {
                // if the current employee wants to work on night in day j:
                if (shiftNumber == 3) { // add to available and want
                    $scope.availableWorkersToAdd.push($scope.activeEmployeesList[i]);
                    continue;
                }
                else
                    isAvailable = true;
            }

            // In case that the worker is available to work in day, but not in selected shift:
            if (isAvailable)
                $scope.availableWorkersToDay.push($scope.activeEmployeesList[i]);
            else
                $scope.unavailableWorkersToAdd.push($scope.activeEmployeesList[i]);
        }

        // remove occurrence of currently guards:
        removeOccurrenceOfSelectedGuards();

        // sort each array by priority:
        $scope.availableWorkersToAdd.sort(sortByPriority);
        $scope.availableWorkersToDay.sort(sortByPriority);
        $scope.unavailableWorkersToAdd.sort(sortByPriority);
        $scope.pendingEmployeesList.sort(sortByPriority);
    }

    $scope.removeSelected = function(id) {
        $scope.selectedGuard = this.guard;
        var indexOfGuardToRemove = $scope.selectedGuardsArray.indexOf($scope.selectedGuard);
        $scope.selectedGuardsArray.splice(indexOfGuardToRemove, 1);
    }

    $scope.restoreSelected = function(operationNumber) {

        // operationNumber = 1 -> Remove
        // operationNumber = 2 -> Add

        if ($scope.selectedGuard == null)
            return;

        if (operationNumber == 1)
            $scope.selectedGuardsArray.push($scope.selectedGuard);
        else if (operationNumber == 2)
            $scope.selectedGuardsArray.pop();

        $scope.selectedGuard = null;
    }

    $scope.updateSchedule = function() {
        $http.put('/schedules/' + $scope.currentSchedule._id, $scope.currentSchedule).then(function(response) {
            getCurrentWeekSchedule();
        });
    }

    $scope.addSelected = function (id) {

        $scope.selectedGuard = this.guard;
        $scope.selectedGuardsArray.push($scope.selectedGuard);

        removeOccurrenceOfSelectedGuards();
    }

    // Get availableWorkersPerShift: Morning, Evening, Night;

    function setCurrentWeekDates() {

        var now = new Date();
        var currentWeekFirstDay = now.getDate() - now.getDay();
        var currentWeekLastDay = currentWeekFirstDay + 6;

        $scope.currentWeekStartDate = new Date(now.setDate(currentWeekFirstDay));
        $scope.currentWeekStartDateString = getStringDate($scope.currentWeekStartDate);
        $scope.currentWeekEndDate = new Date(now.setDate(currentWeekLastDay));
        $scope.currentWeekEndDateString = getStringDate($scope.currentWeekEndDate);
    }

    function getCurrentWeekSchedule() {

        $http.get('schedules/currentSchedule/' + $scope.currentWeekStartDateString + "/" + $scope.currentWeekEndDateString).success(function(response) {
            $scope.currentSchedule = response;
        }).then(function(data) {
            // Set current schedule days array:
            setCurrentScheduleDaysArray($scope.currentSchedule.startDateString);
            setCurrentSchedulePositionsArrays();
        });
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

    function setCurrentScheduleDaysArray(startDateString) {

        $scope.currentScheduleDaysArray = new Array(DAYS_IN_WEEK);
        var currentStartDate = new Date(startDateString);
        var firstDayOfWeek = currentStartDate.getDate();

        for (var i=0; i<DAYS_IN_WEEK; i++) {

            var newDate = new Date(currentStartDate.setDate(firstDayOfWeek + i));
            var day = newDate.getDate();
            var month = newDate.getMonth() + 1;
            var year = newDate.getFullYear();

            // console.log("Day " + (i+1) + ": " + day + "." + month + "." + year);
            $scope.currentScheduleDaysArray[i] = (day + "." + month + "." + year);
        }
    }

    function setCurrentSchedulePositionsArrays() {

        if ($scope.currentSchedule.morningShift.positionsArray.length != 0 ||
            $scope.currentSchedule.eveningShift.positionsArray.length != 0 ||
            $scope.currentSchedule.nightShift.positionsArray.length != 0 )
            return;

        var morningShiftPositionsArray = new Array();
        var eveningShiftPositionsArray = new Array();
        var nightShiftPositionsArray = new Array();

        $http.get('positions/positionsList/').success(function(response) {
            $scope.positionsArray = response;
        }).then(function(data) {
            // console.log($scope.positionsArray);

            for (var i=0; i<$scope.positionsArray.length; i++) {

                var position = {
                    positionName: $scope.positionsArray[i].positionName,
                    shiftsArray: $scope.positionsArray[i].shiftsArray,
                    inMorning: $scope.positionsArray[i].inMorning,
                    inEvening: $scope.positionsArray[i].inEvening,
                    inNight: $scope.positionsArray[i].inNight
                };

                if ($scope.positionsArray[i].inMorning) {
                    morningShiftPositionsArray.push(new Position(position));
                }

                if ($scope.positionsArray[i].inEvening) {
                    eveningShiftPositionsArray.push(new Position(position));
                }

                if ($scope.positionsArray[i].inNight) {
                    nightShiftPositionsArray.push(new Position(position));
                }
            }

            $scope.currentSchedule.morningShift.positionsArray = morningShiftPositionsArray;
            $scope.currentSchedule.eveningShift.positionsArray = eveningShiftPositionsArray;
            $scope.currentSchedule.nightShift.positionsArray = nightShiftPositionsArray;

            // Update current schedule in DB:
            $http.put('/schedules/' + $scope.currentSchedule._id, $scope.currentSchedule).then(function(response) {
            });
        });
    }

    function getEmployeesList() {

        $http.get('/users/usersList/').success(function(response) {
            $scope.employeesList = response;
        }).then(function(data) {

            for (var i=0; i<$scope.employeesList.length; i++) {

                if ($scope.employeesList[i].role != 'Admin') {
                    // Collecting Active Employees:
                    if ($scope.employeesList[i].status == 'active')
                        $scope.activeEmployeesList.push($scope.employeesList[i]);
                    // Collecting Pending Employees:
                    else if ($scope.employeesList[i].status == 'pending')
                        $scope.pendingEmployeesList.push($scope.employeesList[i]);
                    else
                        continue;
                }
            }
        });
    }

    function setRandomShifts() {

        // Night Shift: Running on each position of night shift:
        for (var i=0; i<$scope.currentSchedule.nightShift.positionsArray.length; i++) {
            // Running on each shift of position[i]:
            for (var j=$scope.currentSchedule.nightShift.positionsArray[i].shiftsArray.length-1; j>=0; j--) {
                var newShift = {
                    guardsArray: new Array()
                };

                var randomIndex = Math.floor((Math.random() * ($scope.activeEmployeesList.length)));
                // console.log("RANDOM NUMBER: " + randomIndex);
                // console.log("User Selected: " + $scope.activeEmployeesList[randomIndex].username);

                newShift.guardsArray.push($scope.activeEmployeesList[randomIndex]);
                $scope.currentSchedule.nightShift.positionsArray[i].shiftsArray[j] = newShift;
            }
        }

        // Evening Shift: Running on each position of evening shift:
        for (var i=0; i<$scope.currentSchedule.eveningShift.positionsArray.length; i++) {
            // Running on each shift of position[i]:
            for (var j=$scope.currentSchedule.eveningShift.positionsArray[i].shiftsArray.length-1; j>=0; j--) {
                var newShift = {
                    guardsArray: new Array()
                };

                var randomIndex = Math.floor((Math.random() * ($scope.activeEmployeesList.length)));
                // console.log("RANDOM NUMBER: " + randomIndex);
                // console.log("User Selected: " + $scope.activeEmployeesList[randomIndex].username);

                newShift.guardsArray.push($scope.activeEmployeesList[randomIndex]);
                $scope.currentSchedule.eveningShift.positionsArray[i].shiftsArray[j] = newShift;
            }
        }

        // Morning Shift: Running on each position of morning shift:
        for (var i=0; i<$scope.currentSchedule.morningShift.positionsArray.length; i++) {
            // Running on each shift of position[i]:
            for (var j=$scope.currentSchedule.morningShift.positionsArray[i].shiftsArray.length-1; j>=0; j--) {
                var newShift = {
                    guardsArray: new Array()
                };

                var randomIndex = Math.floor((Math.random() * ($scope.activeEmployeesList.length)));
                // console.log("RANDOM NUMBER: " + randomIndex);
                // console.log("User Selected: " + $scope.activeEmployeesList[randomIndex].username);

                newShift.guardsArray.push($scope.activeEmployeesList[randomIndex]);
                $scope.currentSchedule.morningShift.positionsArray[i].shiftsArray[j] = newShift;
            }
        }
    }

    function isAvailableToWork(worker, shiftArray) {

        for (var i=0; i<shiftArray.length; i++) {
            console.log("worker " + i + " " + shiftArray[i].username);
            if (worker._id == shiftArray[i]._id)
                return true;
        }

        return false;
    }

    function sortByPriority(a, b) {
        if (a.priority > b.priority)
            return 1;
        else if (a.priority < b.priority)
            return -1;
        else
            return 0;
    }

    function removeOccurrenceOfSelectedGuards() {

        for (var i=0; i<$scope.selectedGuardsArray.length; i++) {

            var currentGuard = $scope.selectedGuardsArray[i];

            // Remove instance of existing guard if already exist in availableWorkersToAdd:
            for (var j=0; j<$scope.availableWorkersToAdd.length; j++) {
                if (currentGuard._id == $scope.availableWorkersToAdd[j]._id)
                    $scope.availableWorkersToAdd.splice(j, 1);
            }

            // Remove instance of existing guard if already exist in availableWorkersToDay
            for (var j=0; j<$scope.availableWorkersToDay.length; j++) {
                if (currentGuard._id == $scope.availableWorkersToDay[j]._id)
                    $scope.availableWorkersToDay.splice(j, 1);
            }

            // Remove instance of existing guard if already exist in unavailableWorkersToAdd
            for (var j=0; j<$scope.unavailableWorkersToAdd.length; j++) {
                if (currentGuard._id == $scope.unavailableWorkersToAdd[j]._id)
                    $scope.unavailableWorkersToAdd.splice(j, 1);
            }

            // Remove instance of existing guard if already exist in pendingEmployeesList
            for (var j=0; j<$scope.pendingEmployeesList.length; j++) {
                if (currentGuard._id == $scope.pendingEmployeesList[j]._id)
                    $scope.pendingEmployeesList.splice(j, 1);
            }
        }
    }

    function getAdminConfiguration() {

        $http.get('configuration/').success(function (response) {
            // console.log(response);
            $scope.adminConfiguration = response;
        }).then(function(data) {

            var morningShift = {
                shiftName: "Morning",
                priority: $scope.adminConfiguration.morningPriority
            };
            var eveningShift = {
                shiftName: "Evening",
                priority: $scope.adminConfiguration.eveningPriority
            };
            var nightShift = {
                shiftName: "Night",
                priority: $scope.adminConfiguration.nightPriority
            };

            // Set array of priorities (sorted):
            $scope.priorityArray = new Array(3);
            $scope.priorityArray.push(morningShift);
            $scope.priorityArray.push(eveningShift);
            $scope.priorityArray.push(nightShift);
            $scope.priorityArray.sort(sortByPriority);
        });
    }

    // --------------------------------------

    function Position(position) {
        this.positionName = position.positionName;
        this.shiftsArray = new Array(DAYS_IN_WEEK);
        this.inMorning = position.inMorning;
        this.inEvening = position.inEvening;
        this.inNight = position.inNight;
    }
}]);