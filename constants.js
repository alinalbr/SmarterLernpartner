module.exports = {
    // we now specify which attributes are saved (see the save interceptor below)
    PERSISTENT_ATTRIBUTES_NAMES: ['learnDayStarted','learningTarget', 'subject', 'finishTime', 'reward', 'timeLeft', 'sessionCounter', 'reminderId', 'mood', 'learningDayMood', 'openAfterReminder', 'openAfterBreak', 'learnProgress', 'counter_good_mood', 'counter_bad_mood', 'learningType', 'onboarded'],
    // these are the permissions needed to fetch the first name
    GIVEN_NAME_PERMISSION: ['alexa::profile:given_name:read'],
    // these are the permissions needed to send reminders
    REMINDERS_PERMISSION: ['alexa::alerts:reminders:skill:readwrite']
}