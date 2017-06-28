angular.module('ShiftsManagerApp').controller('homeCtrl', ['$scope', '$http', function ($scope, $http) {

    const DAYS_IN_WEEK = 7;

    $scope.displayedComment = "";

    //NEED TO GET COMMENT FROM DB
    $scope.adminComment = {};
    getAdminComment();

    // GET THE USER SESSION:
    $scope.currentUser = {};
    getCurrentUser();

    //SET CURRENT AND NEXT WEEK DATES
    setDates();
    $scope.currentWeekDaysArray = setScheduleDaysArray(new Date($scope.currentWeekStartDateString));
    $scope.nextWeekDaysArray = setScheduleDaysArray(new Date($scope.nextWeekStartDateString));

    //GET SCHEDULE'S
    getCurrentSchedule();
    getNextSchedule()

    function getCurrentUser() {
        // GET CURRENT USER OBJECT:
        $http.get('users/currentUser').success(function (response) {
            $scope.currentUser = response;
        }).then(function (data) {
            // console.log("$scope.currentUser: " + $scope.currentUser.username);
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

    //////////////////////////////
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

    function setDates(){

        // CURRENT WEEK:
        $scope.currentWeekStartDateString;
        $scope.currentWeekEndDateString;

        var now = new Date();
        var currentWeekFirstDay = now.getDate() - now.getDay();
        var currentWeekLastDay = currentWeekFirstDay + 6;

        $scope.currentWeekStartDate = new Date(now.setDate(currentWeekFirstDay));
        $scope.currentWeekStartDateString = getStringDate($scope.currentWeekStartDate);
        $scope.currentWeekEndDate = new Date(now.setDate(currentWeekLastDay));
        $scope.currentWeekEndDateString = getStringDate($scope.currentWeekEndDate);

        //NEXT WEEK:
        $scope.nextWeekStartDateString;
        $scope.nextWeekEndDateString;

        var nextWeekFirstDay = currentWeekLastDay + 1;
        var nextWeekLastDay = nextWeekFirstDay + 6;

        now = new Date();
        $scope.nextWeekStartDate = new Date(now.setDate(nextWeekFirstDay));
        $scope.nextWeekStartDateString = getStringDate($scope.nextWeekStartDate);
        now = new Date();
        $scope.nextWeekEndDate = new Date(now.setDate(nextWeekLastDay));
        $scope.nextWeekEndDateString = getStringDate($scope.nextWeekEndDate);

        // console.log("$scope.currentWeekStartDateString; " + $scope.currentWeekStartDateString);
        // console.log("$scope.currentWeekEndDateString; " + $scope.currentWeekEndDateString);
        // console.log("$scope.nextWeekStartDateString; " + $scope.nextWeekStartDateString);
        // console.log("$scope.nextWeekEndDateString; " + $scope.nextWeekEndDateString);
    }

    function setScheduleDaysArray(startDateString) {

        var daysArray = new Array(7);
        var currentStartDate = new Date(startDateString);
        var firstDayOfWeek = currentStartDate.getDate();

        for (var i=0; i<7; i++) {

            var newDate = new Date(currentStartDate.setDate(firstDayOfWeek + i));
            var day = newDate.getDate();
            var month = newDate.getMonth() + 1;
            var year = newDate.getFullYear();

            // console.log("Day " + (i+1) + ": " + day + "." + month + "." + year);
            daysArray[i] = (day + "." + month + "." + year);
        }
        return daysArray;
    }

    function getCurrentSchedule() {
        if($scope.currentUser.isAdmin)
            return;

        $http.get('schedules/currentSchedule/' + $scope.currentWeekStartDateString + "/" + $scope.currentWeekEndDateString).success(function(response) {
            $scope.currentSchedule = response;
        }).then(function(data) {

            if (!$scope.currentSchedule.published)
                return;

            $scope.morningShift = ["", "", "", "", "", "", ""];
            $scope.eveningShift = ["", "", "", "", "", "", ""];
            $scope.nightShift = ["", "", "", "", "", "", ""];


            // SET MORNING SHIFTS BY RUNNING ON CURRENT SCHEDULE MORNING SHIFTS
            for(var i=0; i<$scope.currentSchedule.morningShift.positionsArray.length; i++) { // i represents the position in morning shift

                var currentPosition = $scope.currentSchedule.morningShift.positionsArray[i];
                for (var j=0; j<currentPosition.shiftsArray.length; j++) { // j represents the day of the week

                    var currentShift = currentPosition.shiftsArray[j];
                    for (var k=0; k<currentShift.guardsArray.length; k++) { // k represents the shift in guards array

                        if(currentShift.guardsArray[k]._id == $scope.currentUser._id)
                            $scope.morningShift[j] = currentPosition.positionName;
                    }
                }
            }

            // SET EVENING SHIFTS BY RUNNING ON CURRENT SCHEDULE MORNING SHIFTS
            for(var i=0; i<$scope.currentSchedule.eveningShift.positionsArray.length; i++) { // i represents the position in morning shift

                var currentPosition = $scope.currentSchedule.eveningShift.positionsArray[i];
                for (var j=0; j<currentPosition.shiftsArray.length; j++) { // j represents the day of the week

                    var currentShift = currentPosition.shiftsArray[j];
                    for (var k=0; k<currentShift.guardsArray.length; k++) { // k represents the shift in guards array

                        if(currentShift.guardsArray[k]._id == $scope.currentUser._id)
                            $scope.eveningShift[j] = currentPosition.positionName;
                    }
                }
            }

            // SET NIGHT SHIFTS BY RUNNING ON CURRENT SCHEDULE MORNING SHIFTS
            for(var i=0; i<$scope.currentSchedule.nightShift.positionsArray.length; i++) { // i represents the position in morning shift

                var currentPosition = $scope.currentSchedule.nightShift.positionsArray[i];
                for (var j=0; j<currentPosition.shiftsArray.length; j++) { // j represents the day of the week

                    var currentShift = currentPosition.shiftsArray[j];
                    for (var k=0; k<currentShift.guardsArray.length; k++) { // k represents the shift in guards array

                        if(currentShift.guardsArray[k]._id == $scope.currentUser._id)
                            $scope.nightShift[j] = currentPosition.positionName;
                    }
                }
            }



        });

    }

    function getNextSchedule(){
        if($scope.currentUser.isAdmin)
            return;

        $http.get('schedules/currentSchedule/' + $scope.nextWeekStartDateString + "/" + $scope.nextWeekEndDateString).success(function(response) {
            $scope.nextSchedule = response;
        }).then(function(data) {
            if (!$scope.nextSchedule.published)
                return;

            $scope.nextMorningShift = ["", "", "", "", "", "", ""];
            $scope.nextEveningShift = ["", "", "", "", "", "", ""];
            $scope.nextNightShift = ["", "", "", "", "", "", ""];


            // SET MORNING SHIFTS BY RUNNING ON CURRENT SCHEDULE MORNING SHIFTS
            for(var i=0; i<$scope.nextSchedule.morningShift.positionsArray.length; i++) { // i represents the position in morning shift

                var currentPosition = $scope.nextSchedule.morningShift.positionsArray[i];
                for (var j=0; j<currentPosition.shiftsArray.length; j++) { // j represents the day of the week

                    var currentShift = currentPosition.shiftsArray[j];
                    for (var k=0; k<currentShift.guardsArray.length; k++) { // k represents the shift in guards array

                        if(currentShift.guardsArray[k]._id == $scope.currentUser._id)
                            $scope.nextMorningShift[j] = currentPosition.positionName;
                    }
                }
            }

            // SET EVENING SHIFTS BY RUNNING ON CURRENT SCHEDULE MORNING SHIFTS
            for(var i=0; i<$scope.nextSchedule.eveningShift.positionsArray.length; i++) { // i represents the position in morning shift

                var currentPosition = $scope.nextSchedule.eveningShift.positionsArray[i];
                for (var j=0; j<currentPosition.shiftsArray.length; j++) { // j represents the day of the week

                    var currentShift = currentPosition.shiftsArray[j];
                    for (var k=0; k<currentShift.guardsArray.length; k++) { // k represents the shift in guards array

                        if(currentShift.guardsArray[k]._id == $scope.currentUser._id)
                            $scope.nextEveningShift[j] = currentPosition.positionName;
                    }
                }
            }

            // SET NIGHT SHIFTS BY RUNNING ON CURRENT SCHEDULE MORNING SHIFTS
            for(var i=0; i<$scope.nextSchedule.nightShift.positionsArray.length; i++) { // i represents the position in morning shift

                var currentPosition = $scope.nextSchedule.nightShift.positionsArray[i];
                for (var j=0; j<currentPosition.shiftsArray.length; j++) { // j represents the day of the week

                    var currentShift = currentPosition.shiftsArray[j];
                    for (var k=0; k<currentShift.guardsArray.length; k++) { // k represents the shift in guards array

                        if(currentShift.guardsArray[k]._id == $scope.currentUser._id)
                            $scope.nextNightShift[j] = currentPosition.positionName;
                    }
                }
            }



        });

    }





}]);