var express = require('express');
var chai = require('chai');
var expect = chai.expect; // we are using the "expect" style of Chai
var validation = require('./../validation/validator');

// Running: node app in gitbash, then npm test in other gitbash

describe('Server posts requests', function() {

    it('Employee post', function() {
        var contact1 = {};
        var valid = validation.validateEmployeePost(contact1);
        expect(valid).to.be.eql(false);

        var contact2 = null;
        valid = validation.validateEmployeePost(contact2);
        expect(valid).to.be.eql(false);

        var contact3 = {
            firstName: ["", "text"],
            lastName:  ["", "text"],
            email:     ["", "email"],
            homePhone: ["", "tel"],
            cellPhone: ["", "tel"],
            address:   ["", "text"]
        };
        valid = validation.validateEmployeePost(contact3);
        expect(valid).to.be.eql(false);

        var contact4 = {
            test: ["", "text"],
            lastName:  ["", "text"],
            email:     ["", "email"],
            homePhone: ["", "tel"],
            cellPhone: ["", "tel"],
            birthday:  ["", "date"],
            website:   ["", "url"],
            address:   ["", "text"]
        };
        valid = validation.validateEmployeePost(contact4);
        expect(valid).to.be.eql(false);

        var contact5 = {
            test: ["", "text"],
            lastName:  ["", "text"],
            email:     ["", "email"],
            homePhone: ["", "tel"],
            cellPhone: ["", "tel"],
            birthday:  ["", "date"],
            website:   ["", "url"],
            address:   ["", "text"],
            aaa: []
        };
        valid = validation.validateEmployeePost(contact5);
        expect(valid).to.be.eql(false);

        var contact6 = {
            username: "",
            password: "",
            firstname: "",
            lastname: "",
            idNumber: "",
            email: "",
            phoneNumber: "",
            role: "",
            status: "",
            priority: "",
            minShifts: "",
            isAdmin: "",
            userShifts: {}
        };
        valid = validation.validateEmployeePost(contact6);
        expect(valid).to.be.eql(true);
    });

    it('Position posts', function() {
        var pos1 = {};
        var valid = validation.validatePositionPost(pos1);
        expect(valid).to.be.eql(false);

        var pos2 = null;
        valid = validation.validatePositionPost(pos2);
        expect(valid).to.be.eql(false);

        var pos3 = {
            positionName: ""
        };
        valid = validation.validatePositionPost(pos3);
        expect(valid).to.be.eql(false);

        var pos4 = {
            positionName: "",
            test: []
        };
        valid = validation.validatePositionPost(pos4);
        expect(valid).to.be.eql(false);

        var pos5 = {
            positionName: "",
            shiftsArray: [],
            aaa: ""
        };
        valid = validation.validatePositionPost(pos5);
        expect(valid).to.be.eql(false);

        var pos6 = {
            positionName: "",
            shiftsArray: [],
            inMorning: Boolean,
            inEvening: Boolean,
            inNight: Boolean
        };
        valid = validation.validatePositionPost(pos6);
        expect(valid).to.be.eql(true);
    });

    it('Schedule post', function() {
        var schedule1 = {};
        var valid = validation.validateSchedulePost(schedule1);
        expect(valid).to.be.eql(false);

        var schedule2 = null;
        valid = validation.validateSchedulePost(schedule2);
        expect(valid).to.be.eql(false);

        var schedule3 = {
            name: "",
            toDate: "",
            description: ""
        };
        valid = validation.validateSchedulePost(schedule3);
        expect(valid).to.be.eql(false);

        var schedule4 = {
            name: "",
            test: "",
            fromDate: "",
            description: ""
        };
        valid = validation.validateSchedulePost(schedule4);
        expect(valid).to.be.eql(false);

        var schedule5 = {
            name: "",
            toDate: "",
            fromDate: "",
            description: "",
            aaa: ""
        };
        valid = validation.validateSchedulePost(schedule5);
        expect(valid).to.be.eql(false);

        var schedule6 = {
            published: "",
            startDateString: "",
            startDate: "",
            endDateString: "",
            endDate: "",
            morningShift: "",
            eveningShift: "",
            nightShift: ""
        };
        valid = validation.validateSchedulePost(schedule6);
        expect(valid).to.be.eql(true);
    });
});