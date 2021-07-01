const moment = require('moment-timezone'); // will help us do all the dates math while considering the timezone
const util = require('./util');

module.exports = {
    getExamData(day, month, year, timezone) {
        const today = moment().tz(timezone).startOf('day');
        const examDate = moment(`${month}/${day}/${year}`, "MM/DD/YYYY").tz(timezone).startOf('day');
        if (today.isAfter(examDate)) {
            examDate.add(1, 'years');
        }
        const daysUntilExam = examDate.startOf('day').diff(today, 'days'); // same day returns 0

        return {
            daysUntilExam: daysUntilExam,
        }
    },
}