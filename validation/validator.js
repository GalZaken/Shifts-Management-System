exports.validateEmployeePost = function(employee){
    if(employee == null || employee == {})
        return false;
    if(Object.keys(employee).length != 13)
        return false;

    if(!employee.hasOwnProperty("username"))
        return false;
    if(!employee.hasOwnProperty("password"))
        return false;
    if(!employee.hasOwnProperty("firstname"))
        return false;
    if(!employee.hasOwnProperty("lastname"))
        return false;
    if(!employee.hasOwnProperty("idNumber"))
        return false;
    if(!employee.hasOwnProperty("email"))
        return false;
    if(!employee.hasOwnProperty("phoneNumber"))
        return false;
    if(!employee.hasOwnProperty("role"))
        return false;
    if(!employee.hasOwnProperty("status"))
        return false;
    if(!employee.hasOwnProperty("priority"))
        return false;
    if(!employee.hasOwnProperty("minShifts"))
        return false;
    if(!employee.hasOwnProperty("isAdmin"))
        return false;
    if(!employee.hasOwnProperty("userShifts"))
        return false;

    return true;
};

exports.validatePositionPost = function(position){
    if(position == null || position == {})
        return false;
    if(Object.keys(position).length != 5)
        return false;

    if(!position.hasOwnProperty("positionName"))
        return false;
    if(!position.hasOwnProperty("shiftsArray"))
        return false;
    if(!position.hasOwnProperty("inMorning"))
        return false;
    if(!position.hasOwnProperty("inEvening"))
        return false;
    if(!position.hasOwnProperty("inNight"))
        return false;

    return true;
};

exports.validateSchedulePost = function(schedule) {
    if(schedule == null || schedule == {})
        return false;
    if(Object.keys(schedule).length != 8)
        return false;

    if(!schedule.hasOwnProperty("published"))
        return false;
    if(!schedule.hasOwnProperty("startDateString"))
        return false;
    if(!schedule.hasOwnProperty("startDate"))
        return false;
    if(!schedule.hasOwnProperty("endDateString"))
        return false;
    if(!schedule.hasOwnProperty("endDate"))
        return false;
    if(!schedule.hasOwnProperty("morningShift"))
        return false;
    if(!schedule.hasOwnProperty("eveningShift"))
        return false;
    if(!schedule.hasOwnProperty("nightShift"))
        return false;

    return true;
};