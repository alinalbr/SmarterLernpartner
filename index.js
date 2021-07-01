const Alexa = require('ask-sdk-core');
const util = require('./util'); 
const interceptors = require('./interceptors');
const constants = require('./constants'); 
const moment = require('moment-timezone'); 
const i18n = require('i18next')
const logic = require('./logic'); 


//Intent, welcher getriggert wird, wenn Session gestartet wird
const LaunchRequestHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'LaunchRequest';
    },
    handle(handlerInput) {
        const sessionAttributes = handlerInput.attributesManager.getSessionAttributes();
        const learningTarget = sessionAttributes['learningTarget'];
        const finishTime = sessionAttributes['finishTime'];
        const reward = sessionAttributes['reward'];
        const name = sessionAttributes['name'] || '';
        const subject = sessionAttributes['subject'];
        const sessionCounter = sessionAttributes['sessionCounter'];
        const onboarded = sessionAttributes['onboarded'];
        let speechText = '';

        const learningTargetAvailable = subject && learningTarget && finishTime && reward;
        const openAfterReminder = sessionAttributes['openAfterReminder'];
        const openAfterBreak = sessionAttributes['openAfterBreak'];

        sessionAttributes['openAfterReminder'] = false;
        sessionAttributes['openAfterBreak'] = false;
        
       
        //Der Fall, dass alle Infos gespeichert wurden
        if(learningTargetAvailable) {
            if(openAfterReminder) {
                return handlerInput.responseBuilder
                    .speak(''+ name +', wie war deine letzte Lernphase?')
                    .reprompt(handlerInput.t('REPROMPT_MSG'))
                    .getResponse();
            } else if(openAfterBreak) {
                return handlerInput.responseBuilder
                    .speak(''+ name +', bist du bereit für deine nächste Lernphase? Dann sage: Starte Fortsetzung')
                    .reprompt(handlerInput.t('REPROMPT_MSG'))
                    .getResponse();
                
            }else {
                return SayLearningTargetIntentHandler.handle(handlerInput);
            }      
        }
        
        // Der Fall, dass das Fach gespeichert wurde aber der Rest nicht
        if (subject){
            
            if (!learningTarget) {
                speechText += "Es sieht so aus, als hättest du mir noch nicht verraten, was dein Lernziel für "+ subject + " heute ist.";
                return handlerInput.responseBuilder
                    .speak(speechText)
                    .addDelegateDirective({
                        name: 'LearningTargetIntent',
                        confirmationStatus: 'NONE',
                        slots: {
                            "learningTarget": {
                                "name": "learningTarget",
                                "resolutions": {},
                                "confirmationStatus": "NONE"
                            }
                            
                        }
                    })
                    .getResponse();
            }
            
            if (!finishTime) {
                speechText += "Es sieht so aus, als hättest du mir noch nicht verraten, bis wie viel Uhr du heute in " + subject + " lernen möchtest.";
                return handlerInput.responseBuilder
                    .speak(speechText)
                    .addDelegateDirective({
                        name: 'FinishTimeIntent',
                        confirmationStatus: 'NONE',
                        slots: {
                            "time": {
                                "name": "time",
                                "resolutions": {},
                                "confirmationStatus": "NONE"
                            }
                            
                        }
                    })
                    .getResponse();
            }
            
            if(!reward) {
                speechText += "Es sieht so aus, als hättest du mir noch nicht verraten, mit was du dich heute belohnen möchtest.";
                return handlerInput.responseBuilder
                    .speak(speechText)
                    .addDelegateDirective({
                        name: 'RewardIntent',
                        confirmationStatus: 'NONE',
                        slots: {
                            "reward": {
                                "name": "reward",
                                "resolutions": {},
                                "confirmationStatus": "NONE"
                            }
                        }
                    })
                    .getResponse();
            }
            
        }

        //Der Fall, dass noch gar nichts vorhanden ist.
        speechText = !onboarded ? handlerInput.t('ONBOARDING', {name: name}) :  handlerInput.t('WELCOME_BACK_MSG', {name: name});
       
        return handlerInput.responseBuilder
            .speak(speechText)
            /*.addDelegateDirective({
                name: 'StructLearningDayIntent',
                confirmationStatus: 'NONE',
                slots: {
                    "subject": {
                        "name": "subject",
                        "resolutions": {},
                        "confirmationStatus": "NONE"
                    }
                }
            })*/
            .reprompt(speechText)
            .getResponse();
    }
};

//Intent, um Lernfach für den Tag zu speichern
const StructLearningDayIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'StructLearningDayIntent';
    },
    handle(handlerInput) {
        const {attributesManager, requestEnvelope} = handlerInput;
        const sessionAttributes = attributesManager.getSessionAttributes();
        const {intent} = requestEnvelope.request;
        let speechText = '';
        

        //if (intent.confirmationStatus === 'CONFIRMED') {
            const subject = Alexa.getSlotValue(requestEnvelope, 'subject');
            sessionAttributes['subject'] = subject;


            const learnProgressLastSession = sessionAttributes['learnProgressLastSession'+subject];
            const learningProgressAverage = sessionAttributes['learningProgressAverage'+subject];
            const countLearningDays = sessionAttributes['countLearningDays'+subject];
            if(learnProgressLastSession) {
                speechText += 'Kurze Erinnerung, du hast das Fach '+ subject +' bereits an ' + countLearningDays + ' Tagen gelernt, dein letzter Lernfortschritt lag dabei, bei ' + learnProgressLastSession + ' Prozent. In den bisherigen ' + countLearningDays + ' Tagen hast du bisher also durchschnittlich ' + learningProgressAverage + ' Prozent von dem benötigten Stoff gelernt. ';
            }
            
            
            const examDay = sessionAttributes['examDay'+subject];
            const examMonth = sessionAttributes['examMonth'+subject]; //MM
            const examYear = sessionAttributes['examYear'+subject]; 
            const examRegistered = examDay && examMonth && examYear;

            if(examRegistered) {
                const examData = logic.getExamData(examDay, examMonth, examYear, 'Europe/Berlin');
                speechText += 'Außerdem schreibst du eine Klausur in diesem Fach in ' + examData.daysUntilExam + ' Tagen.';
            }
            
        
            return handlerInput.responseBuilder
                .speak(speechText)
                .addDelegateDirective({
                    name: 'LearningTargetIntent',
                    confirmationStatus: 'NONE',
                    slots: {
                        "learningTarget": {
                            "name": "learningTarget",
                            "resolutions": {},
                            "confirmationStatus": "NONE"
                        }
                    } 
                })
                .getResponse();
        //}
        /*
        return handlerInput.responseBuilder
            .speak(handlerInput.t('REJECTED_MSG'))
            .reprompt(handlerInput.t('REPROMPT_MSG'))
            .getResponse(); */
    }
};

//Um zu speichern, was das Lerziel in diesem Fach sein wird
const LearningTargetIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'LearningTargetIntent';
    },
    handle(handlerInput) {
        const {attributesManager, requestEnvelope} = handlerInput;
        const sessionAttributes = attributesManager.getSessionAttributes();
        const {intent} = requestEnvelope.request;
        const finishTime = sessionAttributes['finishTime'];

        let speechText = '';

        //if (intent.confirmationStatus === 'CONFIRMED') {
            const learningTarget = Alexa.getSlotValue(requestEnvelope, 'learningTarget');
            sessionAttributes['learningTarget'] = learningTarget;
            
            if(!finishTime){

                return handlerInput.responseBuilder
                    .speak(speechText)
                    .addDelegateDirective({
                        name: 'FinishTimeIntent',
                        confirmationStatus: 'NONE',
                        slots: {
                            "time": {
                                "name": "time",
                                "resolutions": {},
                                "confirmationStatus": "NONE"
                            }
                        }
                    })
                    .getResponse();
                
            }else{
                speechText = 'Super, ich habe dein Lernziel für heute erfolgreich geändert';
                return handlerInput.responseBuilder
                    .speak(speechText)
                    .getResponse();
                
            }
        //}

        return handlerInput.responseBuilder
            .speak(handlerInput.t('REJECTED_MSG'))
            .reprompt(handlerInput.t('REPROMPT_MSG'))
            .getResponse();
    }
};

//Um zu speichern, wann aufgehört wird 
const FinishTimeIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'FinishTimeIntent';
    },
    handle(handlerInput) {
        const {attributesManager, requestEnvelope} = handlerInput;
        const sessionAttributes = attributesManager.getSessionAttributes();
        const {intent} = requestEnvelope.request;
        const reward = sessionAttributes['reward'];
        let speechText = '';

        

        //if (intent.confirmationStatus === 'CONFIRMED') {
            const finishTime = Alexa.getSlotValue(requestEnvelope, 'time');
            sessionAttributes['finishTime'] = finishTime;
    
            if (!reward) {
                //speechText = handlerInput.t('NEXT_STEP_AFTER_FINISHTIME', {finishTime: finishTime});
                
                return handlerInput.responseBuilder 
                    .speak(speechText)
                    .addDelegateDirective({
                        name: 'RewardIntent',
                        confirmationStatus: 'NONE',
                        slots: {
                            "reward": {
                                "name": "reward",
                                "resolutions": {},
                                "confirmationStatus": "NONE"
                            }
                        }
                    })
                    .getResponse();
            }else {
                speechText = 'Super, ich habe deine Abschlusszeit für heute erfolgreich geändert. Sage jetzt noch Starte Lerntag und ich werde dich zu deiner geänderten Uhrzeit an das Ende deines Lerntages erinnern.';
                return handlerInput.responseBuilder
                    .speak(speechText)
                    .reprompt(handlerInput.t('REPROMPT_MSG'))
                    .getResponse();
            } 
        //}

        return handlerInput.responseBuilder
            .speak(handlerInput.t('REJECTED_MSG'))
            .reprompt(handlerInput.t('REPROMPT_MSG'))
            .getResponse();
    }
};

//Um zu speichern, worauf sich der Student freuen kann
const RewardIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'RewardIntent';
    },
    handle(handlerInput) {
        const {attributesManager, requestEnvelope} = handlerInput;
        const sessionAttributes = attributesManager.getSessionAttributes();
        const {intent} = requestEnvelope.request;
        const onboarded = sessionAttributes['onboarded'];

        //if (intent.confirmationStatus === 'CONFIRMED') {
            const reward = Alexa.getSlotValue(requestEnvelope, 'reward');
            sessionAttributes['reward'] = reward;
            let speechText = '';
            
            if(onboarded) {
                speechText = handlerInput.t('NEXT_STEP_AFTER_REWARD', {reward: reward});
            }else { //Wenn man nicht ongeboarded ist, dann wird einem noch vorgeschlagen, den Lerntyp herauszufinden
                speechText = 'Super, vielen Dank. Wenn du möchtest kannst du noch deinen Lerntyp herausfinden, um auf dich abgestimmte Lerntipps zu erhalten. Sage hierfür: Lerntyp herausfinden. Falls du einfach mit deinem Lerntag starten möchtest sage: Starte Lerntag. ';
        //}
            
            return handlerInput.responseBuilder
                .speak(speechText)
                .reprompt(handlerInput.t('REPROMPT_MSG'))
                .getResponse();
        }
    }
};

//Intent um eine Erinnerung zu speichern, wann der Lerntag fertig ist. Reagiert auf "Starte Lerntag"
const RemindFinishTimeHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'RemindFinishTimeIntent';
    },
    async handle(handlerInput) {
        const {attributesManager, serviceClientFactory, requestEnvelope} = handlerInput;
        const sessionAttributes = attributesManager.getSessionAttributes();
        const {intent} = requestEnvelope.request;

        const learningTarget = sessionAttributes['learningTarget'];
        const reward = sessionAttributes['reward'];
        const finishTime = sessionAttributes['finishTime'];
        const name = sessionAttributes['name'] || '';
        const lastMood = sessionAttributes['mood'];
        let speechText = '';
        const finishInformationAvailable = learningTarget && reward && finishTime;
        
        if (finishInformationAvailable){
            try {
                const {permissions} = requestEnvelope.context.System.user;
                if (!(permissions && permissions.consentToken))
                    throw { statusCode: 401, message: 'No permissions available' }; 
                const reminderServiceClient = serviceClientFactory.getReminderManagementServiceClient();
                const remindersList = await reminderServiceClient.getReminders();
                console.log('Current reminders: ' + JSON.stringify(remindersList));
                
                //variables for creating reminder
                const message = 'Du hast endlich dein Lernziel für heute erreicht! Dein Lernziel für heute lautete: ' + learningTarget + '. Zusätzlich möchte ich noch, dass du deinen gesamten Lerntag reflektierst, öffne hierfür den Skill und erzähle mir, wie dein Lerntag war. '; 
                const currentDateTime = moment().tz('Europe/Berlin');
                const triggerTime = "" + currentDateTime.format('YYYY-MM-DDT') + finishTime + ":00";

                let reminderRequest = {
                    requestTime: currentDateTime.format('YYYY-MM-DDTHH:mm:ss'),
                    trigger: {
                        type: 'SCHEDULED_ABSOLUTE',
                        scheduledTime: triggerTime,
                        timeZoneId: 'Europe/Berlin',
                    },
                    alertInfo: {
                        spokenInfo: {
                            content: [{
                                locale: 'de-DE',
                                text: message,
                            }],
                        },
                    },
                  pushNotification: {
                    status: 'ENABLED',
                  }
                }
                
                const reminderResponse = await reminderServiceClient.createReminder(reminderRequest); 
                speechText = handlerInput.t('POST_REMINDER_HELP_MSG'); //User kann an Pausen erinnert werden, wenn er sagt: Erinner mich an Pausen oder Starte Fortsetzung
                
            } catch (error) {
                console.log(JSON.stringify(error));
                switch (error.statusCode) {
                    case 401: // the user has to enable the permissions for reminders, let's attach a permissions card to the response
                        handlerInput.responseBuilder.withAskForPermissionsConsentCard(constants.REMINDERS_PERMISSION);
                        speechText = handlerInput.t('MISSING_PERMISSION_MSG');
                        break;
                    case 403: // devices such as the simulator do not support reminder management
                        speechText = handlerInput.t('UNSUPPORTED_DEVICE_MSG');
                        break;
                    //case 405: METHOD_NOT_ALLOWED, please contact the Alexa team
                    default:
                        speechText = handlerInput.t('REMINDER_ERROR_MSG');
                }
                speechText += handlerInput.t('REPROMPT_MSG');
            }
        } else {
            speechText += handlerInput.t('MISSING_MSG');
            handlerInput.responseBuilder.addDelegateDirective({
                name: 'StructLearningDayIntent',
                confirmationStatus: 'NONE',
                slots: {}
            });
        }

        return handlerInput.responseBuilder 
            .speak(speechText)
            .reprompt(handlerInput.t('REPROMPT_MSG'))
            .getResponse();
    }
};

//Intent, um Klausur-Datum zu speichern und Tage bis dahin auszurechnen und in diesem wird auch ein Reminder erstellt, der 2 Tage vor der Klausur noch mal automatisch erinnert
const RegisterExamIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'RegisterExamIntent';
    },
    handle(handlerInput) {
        const {attributesManager, requestEnvelope} = handlerInput;
        const sessionAttributes = attributesManager.getSessionAttributes();
        const {intent} = requestEnvelope.request;
        let speechText = '';

        if (intent.confirmationStatus === 'CONFIRMED') {
            const examDay = Alexa.getSlotValue(requestEnvelope, 'day');
            const examYear = Alexa.getSlotValue(requestEnvelope, 'year');
            const examMonthSlot = Alexa.getSlot(requestEnvelope, 'month');
            //const subject = Alexa.getSlot(requestEnvelope, 'subject'); Muss gemacht werden, sodass man auch andere Klausuren eintragen kann, diesen Slot muss man noch in Dialogmodell einbauen!!
            const examMonthName = examMonthSlot.value;
            const examMonth = examMonthSlot.resolutions.resolutionsPerAuthority[0].values[0].value.id; //MM
            const subject  = sessionAttributes['subject'];
            
            constants.PERSISTENT_ATTRIBUTES_NAMES.push('examDay'+subject);
            constants.PERSISTENT_ATTRIBUTES_NAMES.push('examMonth'+subject);
            constants.PERSISTENT_ATTRIBUTES_NAMES.push('examMonthName'+subject);
            constants.PERSISTENT_ATTRIBUTES_NAMES.push('examYear'+subject);

            sessionAttributes['examDay'+subject] = examDay;
            sessionAttributes['examMonth'+subject] = examMonth; //MM
            sessionAttributes['examMonthName'+subject] = examMonthName;
            sessionAttributes['examYear'+subject] = examYear;
            
            return SayExamIntentHandler.handle(handlerInput);
        }

        return handlerInput.responseBuilder
            .speak(handlerInput.t('REJECTED_MSG'))
            .reprompt(handlerInput.t('REPROMPT_MSG'))
            .getResponse();
    }
};

//Intent, um Klausur anzusagen 
const SayExamIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'SayExamIntent';
    },
    handle(handlerInput) {
        const sessionAttributes = handlerInput.attributesManager.getSessionAttributes();
        const {attributesManager, serviceClientFactory, requestEnvelope} = handlerInput;

        const subject = sessionAttributes['subject'];
        const examDay = sessionAttributes['examDay'+subject];
        const examMonth = sessionAttributes['examMonth'+subject]; //MM
        const examYear = sessionAttributes['examYear'+subject];
        const name = sessionAttributes['name'] || '';
        let timezone = 'Europe/Berlin';

        let speechText = '';
        const dateAvailable = examDay && examMonth && examYear;
        if (dateAvailable){
            
            constants.PERSISTENT_ATTRIBUTES_NAMES.push('daysLeft'+subject);
            const examData = logic.getExamData(examDay, examMonth, examYear, timezone);
            sessionAttributes['daysLeft'+subject] = examData.daysUntilExam;
            
            speechText = handlerInput.t('DAYS_LEFT_MSG', {name: name, count: examData.daysUntilExam, subject: subject});
            const isExamDay = examData.daysUntilExam === 0;
            //speechText += handlerInput.t('POST_SAY_HELP_MSG');
        } else {
            speechText += handlerInput.t('MISSING_MSG');
            // we use intent chaining to trigger the birthday registration multi-turn
            return handlerInput.responseBuilder
            .speak(speechText)
            .reprompt(handlerInput.t('REPROMPT_MSG'))
            .addDelegateDirective({
                name: 'RegisterExamIntent',
                confirmationStatus: 'NONE',
                slots: {}
            });
        }

        return handlerInput.responseBuilder
            .speak(speechText)
            .reprompt(handlerInput.t('REPROMPT_MSG'))
            .getResponse();
    }
};

const RemindExamIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'RemindExamIntent';
    },
    async handle(handlerInput) {
        const {attributesManager, serviceClientFactory, requestEnvelope} = handlerInput;
        const sessionAttributes = attributesManager.getSessionAttributes();
        const {intent} = requestEnvelope.request;
        const name = sessionAttributes['name'] || '';
        const subject = sessionAttributes['subject'];
        const examDay = sessionAttributes['examDay'+subject];
        const examMonth = sessionAttributes['examMonth'+subject]; //MM
        const examYear = sessionAttributes['examYear'+subject];
        let speechText = '';

        const examDataAvailable = examDay && examMonth && examYear;
        const examData = logic.getExamData(examDay, examMonth, examYear, 'Europe/Berlin');
        
        if (examDataAvailable){
            try {
                const {permissions} = requestEnvelope.context.System.user;
                if (!(permissions && permissions.consentToken))
                    throw { statusCode: 401, message: 'No permissions available' }; 
                const reminderServiceClient = serviceClientFactory.getReminderManagementServiceClient();
                const remindersList = await reminderServiceClient.getReminders();
                console.log('Current reminders: ' + JSON.stringify(remindersList));
                
                //variables for creating reminder
                const message = 'Es sind nun noch 2 Tage bis zu deiner Klausur in ' + subject +' . Gehe jetzt noch mal in dich und überlege, welche Themen du noch ein letztes Mal wiederholen möchtest. Denke aber daran, dir so kurz vor der Klausur keinen Stress zu machen. ';
                const currentDateTime = moment().tz('Europe/Berlin');
                const helperDaysUntilExam = examData.daysUntilExam - 2;
                const triggerTime = currentDateTime.startOf('day').add(helperDaysUntilExam, 'days');
            
                let reminderRequest = {
                    requestTime: currentDateTime.format('YYYY-MM-DDTHH:mm:ss'),
                    trigger: {
                        type: 'SCHEDULED_ABSOLUTE',
                        scheduledTime: triggerTime.format('YYYY-MM-DDTHH:mm:ss'),
                        timeZoneId: 'Europe/Berlin',
                    },
                    alertInfo: {
                        spokenInfo: {
                            content: [{
                                locale: 'de-DE',
                                text: message,
                            }],
                        },
                    },
                  pushNotification: {
                    status: 'ENABLED',
                  }
                }
                

                //const reminderResponse = await reminderServiceClient.createReminder(reminderRequest); 
                speechText = handlerInput.t('EXAM_REMINDER_CREATED_MSG'); //User kann an Pausen erinnert werden, wenn er sagt: Erinner mich an Pausen oder Starte Fortsetzung
                
            } catch (error) {
                console.log(JSON.stringify(error));
                switch (error.statusCode) {
                    case 401: // the user has to enable the permissions for reminders, let's attach a permissions card to the response
                        handlerInput.responseBuilder.withAskForPermissionsConsentCard(constants.REMINDERS_PERMISSION);
                        speechText = handlerInput.t('MISSING_PERMISSION_MSG');
                        break;
                    case 403: // devices such as the simulator do not support reminder management
                        speechText = handlerInput.t('UNSUPPORTED_DEVICE_MSG');
                        break;
                    //case 405: METHOD_NOT_ALLOWED, please contact the Alexa team
                    default:
                        speechText = handlerInput.t('REMINDER_ERROR_MSG');
                }
                speechText += handlerInput.t('REPROMPT_MSG');
            }
        } else {
            speechText += handlerInput.t('MISSING_EXAM_MSG');
            handlerInput.responseBuilder.addDelegateDirective({
                name: 'RegisterExamIntent',
                confirmationStatus: 'NONE',
                slots: {}
            });
        }
        
    return handlerInput.responseBuilder
        .speak(speechText)
        .reprompt(handlerInput.t('REPROMPT_MSG'))
        .getResponse();
        
    }
};


//Intent, um automatisch nach 2 Stunden an Lernpause zu erinnern. Startet, sobald User sagt: "Erinner mich an Pausen" oder nach einer Pause: "Starte Fortsetzung"
const RemindLearningBreakIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'RemindLearningBreakIntent';
    },
    async handle(handlerInput) {
        const {attributesManager, serviceClientFactory, requestEnvelope} = handlerInput;
        const sessionAttributes = attributesManager.getSessionAttributes();
        const {intent} = requestEnvelope.request;
        sessionAttributes['openAfterReminder'] = true;        

        const name = sessionAttributes['name'] || '';
        let speechText = '';

       
        try {
            const {permissions} = requestEnvelope.context.System.user;
            if (!(permissions && permissions.consentToken))
                throw { statusCode: 401, message: 'No permissions available' }; 
            const reminderServiceClient = serviceClientFactory.getReminderManagementServiceClient();
            const remindersList = await reminderServiceClient.getReminders();
            console.log('Current reminders: ' + JSON.stringify(remindersList));

            //variables for creating reminder
            const reminderRequest = {
                trigger: {
                    type: 'SCHEDULED_RELATIVE',
                    offsetInSeconds: '180',
                },
                alertInfo: {
                    spokenInfo: {
                        content: [{
                            locale: 'de-DE',
                            text: 'Es ist Zeit für eine Pause! Doch bevor du in die Pause startest, möchte ich dass du noch mal die vergangenen zwei Stunden reflektierst. Öffne hierfür deinen Lernpartner und erzähle mir wie deine Lernphase war. ',
                        }],
                    },
                },
                pushNotification: {
                    status: 'ENABLED', 
                },
            };

            
            const reminderResponse = await reminderServiceClient.createReminder(reminderRequest); 
            speechText = handlerInput.t('REMINDER_CREATED_MSG', {name: name});

        } catch (error) {
            console.log(JSON.stringify(error));
            switch (error.statusCode) {
                case 401: // the user has to enable the permissions for reminders, let's attach a permissions card to the response
                    handlerInput.responseBuilder.withAskForPermissionsConsentCard(constants.REMINDERS_PERMISSION);
                    speechText = handlerInput.t('MISSING_PERMISSION_MSG');
                    break;
                case 403: // devices such as the simulator do not support reminder management
                    speechText = handlerInput.t('UNSUPPORTED_DEVICE_MSG');
                    break;
                //case 405: METHOD_NOT_ALLOWED, please contact the Alexa team
                default:
                    speechText = handlerInput.t('REMINDER_ERROR_MSG');
            }
        }
            
        //speechText += handlerInput.t('REPROMPT_MSG');
        
    return handlerInput.responseBuilder
        .speak(speechText)
        .reprompt(handlerInput.t('REPROMPT_MSG'))
        .getResponse();
        
    }
};


//Um Tipps für die kommende Pause und nächste Lernphase zu geben, je nach dem wie die Stimmung des Lernenden ist. Reagiert auf: "Meine Stimmung ist gut/schlecht"
const BreakMoodIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'BreakMoodIntent';
    },
    handle(handlerInput) {
        const {attributesManager, requestEnvelope} = handlerInput;
        const sessionAttributes = attributesManager.getSessionAttributes();
        const {intent} = requestEnvelope.request;

        //if (intent.confirmationStatus === 'CONFIRMED') {
            const mood = Alexa.getSlotValue(requestEnvelope, 'mood');
            sessionAttributes['mood'] = mood;
            
            let speechText = '';
            
            if (mood === 'gut') {
                speechText += handlerInput.t('GOOD_MOOD');
                let randomNumber = Math.floor(Math.random() * 3);
                let possibilities = ['relax', 'food', 'meditation'];
                
                if (sessionAttributes['counter_good_mood']) {
                    let old_count = sessionAttributes['counter_good_mood'];
                    sessionAttributes['counter_good_mood'] = old_count + 1;
                }else {
                    sessionAttributes['counter_good_mood'] = 1;
                }

                switch (possibilities[randomNumber]) {
                    case 'relax':
                        speechText += handlerInput.t('RELAX'); 
                        break;
                    case 'food':
                        speechText += handlerInput.t('FOOD'); 
                        break;
                    case 'meditation':
                        speechText += handlerInput.t('MEDITATION'); 
                        break;
                }
                
            }
            
            else if (mood === 'okay') {
                speechText += handlerInput.t('OKAY_MOOD');
                let randomNumber = Math.floor(Math.random() * 6);
                let possibilities = ['relax', 'food', 'meditation', 'concentration', 'activation', 'learningTips'];
                
                if (sessionAttributes['counter_bad_mood']) {
                    let old_count = sessionAttributes['counter_bad_mood'];
                    sessionAttributes['counter_bad_mood'] = old_count + 1;
                } else {
                    sessionAttributes['counter_bad_mood'] = 1;
                }

                switch (possibilities[randomNumber]) {
                    case 'relax':
                        speechText += handlerInput.t('RELAX'); 
                        break;
                    case 'food':
                        speechText += handlerInput.t('FOOD'); 
                        break;
                    case 'meditation':
                        speechText += handlerInput.t('MEDITATION');
                        break;
                    case 'concentration':
                        speechText += handlerInput.t('CONCENTRATION');
                        break;
                    case 'activation':
                        speechText += handlerInput.t('ACTIVATION');
                        break;
                    case 'learningTips':
                        speechText += handlerInput.t('LEARNING_TIPPS');
                        break;
                }
            }
            
            else if (mood === 'schlecht') {
                speechText += handlerInput.t('BAD_MOOD');
                let randomNumber = Math.floor(Math.random() * 6);
                let possibilities = ['relax', 'food', 'meditation', 'concentration', 'activation', 'learningTips'];

                if (sessionAttributes['counter_bad_mood']) {
                    let old_count = sessionAttributes['counter_bad_mood'];
                    sessionAttributes['counter_bad_mood'] = old_count + 1;
                } else {
                    sessionAttributes['counter_bad_mood'] = 1;
                }
                
                switch (possibilities[randomNumber]) {
                    case 'relax':
                        speechText += handlerInput.t('RELAX'); 
                        break;
                    case 'food':
                        speechText += handlerInput.t('FOOD'); 
                        break;
                    case 'meditation':
                        speechText += handlerInput.t('MEDITATION');
                        break;
                    case 'concentration':
                        speechText += handlerInput.t('CONCENTRATION');
                        break;
                    case 'activation':
                        speechText += handlerInput.t('ACTIVATION');
                        break;
                    case 'learningTips':
                        speechText += handlerInput.t('LEARNING_TIPPS');
                        break;
                }

            }else {
                speechText += 'Alles klar, dann habe ich noch ein kleinen Tipp für dich. '
                let randomNumber = Math.floor(Math.random() * 6);
                let possibilities = ['relax', 'food', 'meditation', 'concentration', 'activation', 'learningTips'];

                switch (possibilities[randomNumber]) {
                    case 'relax':
                        speechText += handlerInput.t('RELAX'); 
                        break;
                    case 'food':
                        speechText += handlerInput.t('FOOD'); 
                        break;
                    case 'meditation':
                        speechText += handlerInput.t('MEDITATION');
                        break;
                    case 'concentration':
                        speechText += handlerInput.t('CONCENTRATION');
                        break;
                    case 'activation':
                        speechText += handlerInput.t('ACTIVATION');
                        break;
                    case 'learningTips':
                        speechText += handlerInput.t('LEARNING_TIPPS');
                        break;
                }
                
            }
    
            return handlerInput.responseBuilder //kann man auch zwei Sachen zurück geben? also return hier auch starte pause?
                .speak(speechText)
                .reprompt(handlerInput.t('REPROMPT_MSG'))
                .getResponse();
        //}

        return handlerInput.responseBuilder
            .speak(handlerInput.t('REJECTED_MSG'))
            .reprompt(handlerInput.t('REPROMPT_MSG'))
            .getResponse();
    }
};


//Um Tipps für die kommende Pause und nächste Lernphase zu geben, je nach dem wie die Stimmung des Lernenden ist. Reagiert auf: "Meine Stimmung ist gut/schlecht"
const BreakMoodGoodIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'BreakMoodGoodIntent';
    },
    handle(handlerInput) {
        const {attributesManager, requestEnvelope} = handlerInput;
        const sessionAttributes = attributesManager.getSessionAttributes();
        const {intent} = requestEnvelope.request;

            
        let speechText = '';
        speechText += handlerInput.t('GOOD_MOOD');
        
        let randomNumber = Math.floor(Math.random() * 3);
        let possibilities = ['relax', 'food', 'meditation'];
        
        if (sessionAttributes['counter_good_mood']) {
            let old_count = sessionAttributes['counter_good_mood'];
            sessionAttributes['counter_good_mood'] = old_count + 1;
        }else {
            sessionAttributes['counter_good_mood'] = 1;
        }

        switch (possibilities[randomNumber]) {
            case 'relax':
                speechText += handlerInput.t('RELAX'); 
                break;
            case 'food':
                speechText += handlerInput.t('FOOD'); 
                break;
            case 'meditation':
                speechText += handlerInput.t('MEDITATION'); 
                break;
        }
        
        return handlerInput.responseBuilder 
            .speak(speechText)
            .reprompt(handlerInput.t('REPROMPT_MSG'))
            .getResponse();
        

    }
};





//Um Tipps für die kommende Pause und nächste Lernphase zu geben, je nach dem wie die Stimmung des Lernenden ist. Reagiert auf: "Meine Stimmung ist gut/schlecht"
const BreakMoodBadIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'BreakMoodBadIntent';
    },
    handle(handlerInput) {
        const {attributesManager, requestEnvelope} = handlerInput;
        const sessionAttributes = attributesManager.getSessionAttributes();
        const {intent} = requestEnvelope.request;

            
        let speechText = '';
        speechText += handlerInput.t('BAD_MOOD');
        let randomNumber = Math.floor(Math.random() * 6);
        let possibilities = ['relax', 'food', 'meditation', 'concentration', 'activation', 'learningTips'];

        if (sessionAttributes['counter_bad_mood']) {
            let old_count = sessionAttributes['counter_bad_mood'];
            sessionAttributes['counter_bad_mood'] = old_count + 1;
        } else {
            sessionAttributes['counter_bad_mood'] = 1;
        }
        
        switch (possibilities[randomNumber]) {
            case 'relax':
                speechText += handlerInput.t('RELAX'); 
                break;
            case 'food':
                speechText += handlerInput.t('FOOD'); 
                break;
            case 'meditation':
                speechText += handlerInput.t('MEDITATION');
                break;
            case 'concentration':
                speechText += handlerInput.t('CONCENTRATION');
                break;
            case 'activation':
                speechText += handlerInput.t('ACTIVATION');
                break;
            case 'learningTips':
                speechText += handlerInput.t('LEARNING_TIPPS');
                break;
        }

        return handlerInput.responseBuilder //kann man auch zwei Sachen zurück geben? also return hier auch starte pause?
            .speak(speechText)
            .reprompt(handlerInput.t('REPROMPT_MSG'))
            .getResponse();
        

    }
};


//Intent für Entspannungsübung, hört auf: Starte Entspannung
const RelaxIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'RelaxIntent';
    },
    handle(handlerInput) {
        const {attributesManager, requestEnvelope} = handlerInput;
        const sessionAttributes = attributesManager.getSessionAttributes();
        const {intent} = requestEnvelope.request;
        let speechText = '';
        
        speechText += handlerInput.t('RELAX_EXERCISE');
        
        speechText += ' Nach dieser Entspannungsübung, wünsche ich dir noch eine entspannte Pause. Sage einfach starte Pause und ich werde dich rechtzeitig an das Ende deiner Pause erinnern. ';
        return handlerInput.responseBuilder
                .speak(speechText)
                .reprompt(speechText)
                .getResponse();
    }
};

//Intet für Meditation, hört auf: Starte Mediationsübung
const MeditationIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'MeditationIntent';
    },
    handle(handlerInput) {
        const {attributesManager, requestEnvelope} = handlerInput;
        const sessionAttributes = attributesManager.getSessionAttributes();
        let speechText= '';

        speechText += handlerInput.t('MEDITATION_EXERCISE');
        
        speechText += ' Nach dieser Meditation, wünsche ich dir noch eine entspannte Pause. Sage einfach starte Pause und ich werde dich rechtzeitig an das Ende deiner Pause erinnern. ';
        
        return handlerInput.responseBuilder
            .speak(speechText)
            .reprompt(handlerInput.t('REPROMPT_MSG'))
            .getResponse();
    }
};

//Intent für Aktivierungsübung, hört auf: Starte Aktivierungsübung
const ActivationIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'ActivationIntent';
    },
    handle(handlerInput) {
        const {attributesManager, requestEnvelope} = handlerInput;
        const sessionAttributes = attributesManager.getSessionAttributes();
        const {intent} = requestEnvelope.request;
        let speechText = '';
        
        speechText += handlerInput.t('ACTIVATION_EXERCISE');
        
        speechText += ' Nach dieser kurzen Aktivierungsübung, wünsche ich dir noch eine entspannte Pause und werde dich daran erinnern, sobald es weiter geht. Sage hierfür einfach: Starte Pause';
        return handlerInput.responseBuilder
                .speak(speechText)
                .reprompt(handlerInput.t('REPROMPT_MSG'))
                .getResponse();
    }
};


//Intent für Aktivierungsübung, hört auf: Gebe einen Rezeptidee
const FoodIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'FoodIntent';
    },
    handle(handlerInput) {
        const {attributesManager, requestEnvelope} = handlerInput;
        const sessionAttributes = attributesManager.getSessionAttributes();
        const {intent} = requestEnvelope.request;
        let speechText = '';
        
        speechText += handlerInput.t('FOOD_TIPPS');
        
        speechText += ' Wir sehen uns, sobald die Pause vorbei ist. Bis dahin noch viel Spaß. ';
        return handlerInput.responseBuilder
                .speak(speechText)
                .reprompt(handlerInput.t('REPROMPT_MSG'))
                .getResponse();
    }
};

//Intent für allgemeine Lerntipps, hört auf: Gebe Lerntipps, Motivere mich
const LearningTipsIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'LearningTipsIntent';
    },
    handle(handlerInput) {
        const {attributesManager, requestEnvelope} = handlerInput;
        const sessionAttributes = attributesManager.getSessionAttributes();
        const {intent} = requestEnvelope.request;
        let speechText = '';
        const learningType = sessionAttributes['learningType'];
        
        if (learningType) {
            switch (learningType) {
                case 'visuell':
                    speechText += handlerInput.t('LEARNING_TIPPS_VISUAL');
                    break;
                case 'audio':
                    speechText += handlerInput.t('LEARNING_TIPPS_AUDIO');
                    break;
                case 'kommunikation':
                    speechText += handlerInput.t('LEARNING_TIPPS_COMM');
                    break;
                case 'motorisch':
                    speechText += handlerInput.t('LEARNING_TIPPS_MOTORIC');
                    break;
            }
        } else {
            speechText += handlerInput.t('LEARNING_TIPPS');
        }
        
        //speechText += 'Ich hoffe ich konnte dir einen guten Tipp geben. Wir sehen uns, sobald deine Pause vorbei ist. Wenn du an das Ende deiner Pause erinnert werden willst, sage noch: starte Pause.';
        //Wenn du bereit für eine Pause bist sage starte kurze oder lange Pause
        
        return handlerInput.responseBuilder
                .speak(speechText)
                .reprompt(handlerInput.t('REPROMPT_MSG'))
                .getResponse();
    }
};

//Intent für allgemeine Lerntipps, hört auf: Starte Konzentrationsübung
const ConcentrationIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'ConcentrationIntent';
    },
    handle(handlerInput) {
        const {attributesManager, requestEnvelope} = handlerInput;
        const sessionAttributes = attributesManager.getSessionAttributes();
        const {intent} = requestEnvelope.request;
        let speechText = '';
        
        speechText += handlerInput.t('CONCENTRATION_EXERCISE');
        
        speechText += 'Ich hoffe ich die kleine Konzentrationsübung hat dir gefallen. Wir sehen uns, sobald deine Pause vorbei ist. Wenn du an das Ende deiner Pause erinnert werden willst, sage noch: starte Pause.';
        return handlerInput.responseBuilder
                .speak(speechText)
                .reprompt(handlerInput.t('REPROMPT_MSG'))
                .getResponse();
    }
};

//Um Tipps für den nächsten Tag zu geben, je nach dem wie die Stimmung des Lernenden ist. Reagiert auf: "Mein Lerntag war gut/schlecht"
const FinishMoodIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'FinishMoodIntent';
    },
    handle(handlerInput) {
        const {attributesManager, requestEnvelope} = handlerInput;
        const sessionAttributes = attributesManager.getSessionAttributes();
        const {intent} = requestEnvelope.request;
        sessionAttributes['openAfterReminder'] = false;

        //if (intent.confirmationStatus === 'CONFIRMED') {
            const learningDayMood = Alexa.getSlotValue(requestEnvelope, 'learningDayMood');
            sessionAttributes['learningDayMood'] = learningDayMood;
            let speechText = '';
            const counter_good_mood = sessionAttributes['counter_good_mood'];
            const counter_bad_mood = sessionAttributes['counter_bad_mood'];
            const more_good_moods = (counter_good_mood >= counter_bad_mood) ? false : true;
            
            if (learningDayMood === 'gut') {
                if (more_good_moods) {
                    speechText += 'Das freut mich, dass dein  Lerntag insgesamt gut lief. Über den Tag verteilt waren deine Lernphasen auch überwiegend positiv. Gehe deinen morgigen Tag deshalb genauso an wie heute! Du kannst zum Abschluss noch deinen Lernfortschritt speichern. Sage hierfür einfach: Speichere Lernfortschritt. ';
                }else {
                    speechText += 'Das freut mich, dass dein Lerntag insgesamt gut lief. Über den Tag verteilt waren deine Lernphasen laut deiner Einschätzung eher schlechter, umso besser, dass du mit einem guten Gefühl abschließen konntest. Du kannst zum Abschluss noch deinen Lernfortschritt speichern. Sage hierfür einfach: Speichere Lernfortschritt. '
                }
                
            }
            
            if (learningDayMood === 'okay') {
                speechText = handlerInput.t('OKAY_MOOD_FINISH')
                
            }
            
            if (learningDayMood === 'schlecht') {
                if (more_good_moods) {
                    speechText += 'Mach dir keine Gedanken, dass dein Tag nicht so gut lief. Vielleicht hast du dir heute  zu viel vorgenommen. Über den Tag verteilt waren deine Lernphase überwiegend positiv, also mach dir keine Gedanken. Wenn du möchtest, dann kannst du zum Abschluss noch eine Entspannungsübung machen, um mit einem positiven Gefühl deinen Lerntag abzuschließen. Wichtig ist auch, dass du dir trotzdem deinen Lernfortschritt speicherst. Sage hierfür einfach: Speichere Lernfortschritt.';

                }else {
                    speechText += 'Es ist nicht schlimm, wenn du am Ende deines Lerntages nicht mehr so konzentriert warst oder es nicht mehr so gut lief. Ein häufiger Fehler ist, dass wir uns die Ziele zu hoch stecken. Da dein Lerntag wohl insgesamt überwiegend negativ war, schließe deinen Lerntag doch noch mit etwas positiven ab. Mache zum Beispiel noch eine Entspannungsübung. Außerdem kannst du dich nun auch auf deine Belohnung freuen. Bevor du allerdings ganz aufhörst, speichere noch deinen Lernfortschritt, indem du sagst, speichere Lernfortschritt.'
                }
            }
    
            return handlerInput.responseBuilder
                .speak(speechText)
                .reprompt(handlerInput.t('REPROMPT_MSG'))
                .getResponse();
        //}

        return handlerInput.responseBuilder
            .speak(handlerInput.t('REJECTED_MSG'))
            .reprompt(handlerInput.t('REPROMPT_MSG'))
            .getResponse();
    }
};


//Setzt eine Erinnerung nach 30 Minuten. Reagiert auf Intents: Starte Kurze Pause
const RemindThirtyMinBreakIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'RemindThirtyMinBreakIntent';
    },
    async handle(handlerInput) {
        const {attributesManager, serviceClientFactory, requestEnvelope} = handlerInput;
        const sessionAttributes = attributesManager.getSessionAttributes();
        const {intent} = requestEnvelope.request;
        sessionAttributes['openAfterBreak'] = true;

        const name = sessionAttributes['name'] || '';
        let speechText = '';

        try {
            const {permissions} = requestEnvelope.context.System.user;
            if (!(permissions && permissions.consentToken))
                throw { statusCode: 401, message: 'No permissions available' }; 
            const reminderServiceClient = serviceClientFactory.getReminderManagementServiceClient();
            const remindersList = await reminderServiceClient.getReminders();
            console.log('Current reminders: ' + JSON.stringify(remindersList));

            //variables for creating reminder
            const reminderRequest = {
                trigger: {
                    type: 'SCHEDULED_RELATIVE',
                    offsetInSeconds: '30',
                },
                alertInfo: {
                    spokenInfo: {
                        content: [{
                            locale: 'de-DE',
                            text: 'Deine 30 Minütige Pause ist nun vorbei, wenn du bereit bist weiter zu lernen und deinen Smarten Learnpartner geöffnet hast, sage: Starte Fortsetzung.',
                        }],
                    },
                },
                pushNotification: {
                    status: 'ENABLED', 
                },
            };

            //const reminderResponse = await reminderServiceClient.createReminder(reminderRequest); 
            //console.log('Reminder created with token: ' + reminderResponse.alertToken);
            speechText = handlerInput.t('THIRTY_MIN_PAUSE_STARTS', {name: name});

        } catch (error) {
            console.log(JSON.stringify(error));
            switch (error.statusCode) {
                case 401: // the user has to enable the permissions for reminders, let's attach a permissions card to the response
                    handlerInput.responseBuilder.withAskForPermissionsConsentCard(constants.REMINDERS_PERMISSION);
                    speechText = handlerInput.t('MISSING_PERMISSION_MSG');
                    break;
                case 403: // devices such as the simulator do not support reminder management
                    speechText = handlerInput.t('UNSUPPORTED_DEVICE_MSG');
                    break;
                //case 405: METHOD_NOT_ALLOWED, please contact the Alexa team
                default:
                    speechText = handlerInput.t('REMINDER_ERROR_MSG');
            }
        }
            
    return handlerInput.responseBuilder
        .speak(speechText)
        .getResponse();
        
    }
};

//Setzt eine Erinnerung nach 60 Minuten. Reagiert auf Intents: Starte lange Pause
const RemindSixtyMinBreakIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'RemindSixtyMinIntent';
    },
    async handle(handlerInput) {
        const {attributesManager, serviceClientFactory, requestEnvelope} = handlerInput;
        const sessionAttributes = attributesManager.getSessionAttributes();
        const {intent} = requestEnvelope.request;
        sessionAttributes['openAfterBreak'] = true;


        const name = sessionAttributes['name'] || '';
        let speechText = '';

        try {
            const {permissions} = requestEnvelope.context.System.user;
            if (!(permissions && permissions.consentToken))
                throw { statusCode: 401, message: 'No permissions available' }; 
            const reminderServiceClient = serviceClientFactory.getReminderManagementServiceClient();
            const remindersList = await reminderServiceClient.getReminders();
            console.log('Current reminders: ' + JSON.stringify(remindersList));

            //variables for creating reminder
            const reminderRequest = {
                trigger: {
                    type: 'SCHEDULED_RELATIVE',
                    offsetInSeconds: '60',
                },
                alertInfo: {
                    spokenInfo: {
                        content: [{
                            locale: 'de-DE',
                            text: 'Deine 60 Minütige Pause ist nun vorbei, wenn du bereit bist weiter zu lernen, sage: Starte Fortsetzung.',
                        }],
                    },
                },
                pushNotification: {
                    status: 'ENABLED', 
                },
            };

            //const reminderResponse = await reminderServiceClient.createReminder(reminderRequest); 
            //console.log('Reminder created with token: ' + reminderResponse.alertToken);
            speechText = handlerInput.t('SIXTY_MIN_PAUSE_STARTS');
            
        } catch (error) {
            console.log(JSON.stringify(error));
            switch (error.statusCode) {
                case 401: // the user has to enable the permissions for reminders, let's attach a permissions card to the response
                    handlerInput.responseBuilder.withAskForPermissionsConsentCard(constants.REMINDERS_PERMISSION);
                    speechText = handlerInput.t('MISSING_PERMISSION_MSG');
                    break;
                case 403: // devices such as the simulator do not support reminder management
                    speechText = handlerInput.t('UNSUPPORTED_DEVICE_MSG');
                    break;
                //case 405: METHOD_NOT_ALLOWED, please contact the Alexa team
                default:
                    speechText = handlerInput.t('REMINDER_ERROR_MSG');
            }
        }
            
        speechText += handlerInput.t('REPROMPT_MSG');
        

    return handlerInput.responseBuilder
        .speak(speechText)
        .getResponse();
        
    }
};

//ProgressIntentHandler: reagiert auf Intents: (Speichere Lernfortschritt) In {subject} habe ich heute {progressMessage}, wird dann in SessionAttribute[progress{subjcet}] gespeichert
const ProgressIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'ProgressIntent';
    },
    handle(handlerInput) {
        const {attributesManager, requestEnvelope} = handlerInput;
        const sessionAttributes = attributesManager.getSessionAttributes();
        const subject = sessionAttributes['subject']
        const {intent} = requestEnvelope.request;
        constants.PERSISTENT_ATTRIBUTES_NAMES.push('learningProgressAverage'+subject);
        constants.PERSISTENT_ATTRIBUTES_NAMES.push('learnProgressLastSession'+subject);
        constants.PERSISTENT_ATTRIBUTES_NAMES.push('learnProgressTotal'+subject);
        constants.PERSISTENT_ATTRIBUTES_NAMES.push('countLearningDays'+subject);


        //if (intent.confirmationStatus === 'CONFIRMED') { //Bestägigung für progressMessage für Fach (Fach entstammt aus sessionAttributes['subject']) 
            const progressInPercent = Alexa.getSlotValue(requestEnvelope, 'progressInPercent');
            
            sessionAttributes['learnProgressLastSession'+subject] = progressInPercent;
            let learnProgressBisher = sessionAttributes['learnProgressTotal'+subject]
            
            if (!learnProgressBisher) {
                learnProgressBisher = 0;
            } 
            
            let countLearningDaysBisher = sessionAttributes['countLearningDays'+subject];
            if(!countLearningDaysBisher) {
                countLearningDaysBisher = 0;
            }
            
            const countLearningDaysNeu = countLearningDaysBisher + 1;
            const sum = parseInt(learnProgressBisher) + parseInt(progressInPercent);
            sessionAttributes['learnProgressTotal'+subject] = sum; 
            const learnProgressNeu = sum / countLearningDaysNeu;
            sessionAttributes['learningProgressAverage'+subject] = learnProgressNeu;
            sessionAttributes['countLearningDays'+subject] = countLearningDaysNeu;
            
            handlerInput.attributesManager.setPersistentAttributes(sessionAttributes)

            let speechText = 'Super, ich habe deinen Lernfortschritt für das Fach ' + subject + ' gespeichert. Nun kannst du in deinen Wohlverdienten Feierabend starten. Wenn du fertig bist sage: Beende meinen Lerntag ';
            return handlerInput.responseBuilder
                .speak(speechText)
                .reprompt(handlerInput.t('REPROMPT_MSG'))
                .getResponse();
        //}

        return handlerInput.responseBuilder
            .speak(handlerInput.t('REJECTED_MSG'))
            .reprompt(handlerInput.t('REPROMPT_MSG'))
            .getResponse();
    }
};



//SayProgressIntent: reagiert auf: sage mir lernfortschritt in Fach xy
const SayProgressIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'SayProgressIntent';
    },
    handle(handlerInput) {
        const {attributesManager, requestEnvelope} = handlerInput;
        // the attributes manager allows us to access session attributes
        const sessionAttributes = attributesManager.getSessionAttributes();
        const subject = sessionAttributes['subject'];
        let speechText= '';

        const learnProgressLastSession = sessionAttributes['learnProgressLastSession'+subject];
        const learningProgressAverage = sessionAttributes['learningProgressAverage'+subject];
        const countLearningDays = sessionAttributes['countLearningDays'+subject];
        speechText += 'Du hast das Fach '+ subject +' bereits an ' + countLearningDays + ' Tagen gelernt, dein letzter Lernfortschritt lag dabei, bei ' + learnProgressLastSession + ' Prozent. In den bisherigen ' + countLearningDays + ' Tagen hast du bisher also durchschnittlich ' + learningProgressAverage + ' Prozent von dem benötigten Stoff gelernt. ';
        
        return handlerInput.responseBuilder
            .speak(speechText)
            .reprompt(handlerInput.t('REPROMPT_MSG'))
            .getResponse();
    }
};

//FinishTodayIntentHandler: reagiert auf: "Ich bin heute fertig mit lernen" und löscht dann alle SessionAttribute bis auf progress
const FinishTodayIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'FinishTodayIntent';
    },
    handle(handlerInput) {
        const {attributesManager, requestEnvelope} = handlerInput;
        const sessionAttributes = attributesManager.getSessionAttributes();
        const reward = sessionAttributes['reward']
        
        delete sessionAttributes['finishTime'];
        delete sessionAttributes['subject'];
        delete sessionAttributes['reward'];
        delete sessionAttributes['mood'];
        delete sessionAttributes['learningDayMood'];
        delete sessionAttributes['learningTarget'];
        delete sessionAttributes['onboarded']; //muss auskommentiert werden

        let speechText = 'Super, das wars für heute viel Spaß mit ' + reward;
        
        return handlerInput.responseBuilder
            .speak(speechText)
            .getResponse();
    }
};

//Intent, um Lernziel zu sagen, wenn User Skill wieder öffnet
const SayLearningTargetIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'SayLearningTargetIntent';
    },
    handle(handlerInput) {
        const sessionAttributes = handlerInput.attributesManager.getSessionAttributes();

        const learningTarget = sessionAttributes['learningTarget'];
        const reward = sessionAttributes['reward']; 
        const finishTime = sessionAttributes['finishTime'];
        const name = sessionAttributes['name'] || '';
        let timezone = 'Europe/Berlin';

        let speechText = '';
        const learningTargetAvailable = learningTarget && reward && finishTime;
        if (learningTargetAvailable){
            speechText = handlerInput.t('LEARNING_GOAL_MSG', {name: name, learningTarget:learningTarget, reward:reward, finishTime:finishTime});
        } else {
            speechText += handlerInput.t('MISSING_MSG');
            handlerInput.responseBuilder.addDelegateDirective({
                name: 'StructLearningDayIntent',
                confirmationStatus: 'NONE',
                slots: {
                    "subject": {
                        "name": "subject",
                        "resolutions": {},
                        "confirmationStatus": "NONE"
                    }
                }
            });
        }

        return handlerInput.responseBuilder
            .speak(speechText)
            .reprompt(handlerInput.t('REPROMPT_MSG'))
            .getResponse();
    }
};

//Intent, um Lerntyp-Antworten auszuwerten
const StartLearnTypeIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'StartLearnTypeIntent';
    },
    handle(handlerInput) {
        const speechText = handlerInput.t('INFO_LEARNTYPE');

        return handlerInput.responseBuilder
                .speak(speechText)
                .addDelegateDirective({
                    name: 'FindLearnTypeIntent',
                    confirmationStatus: 'NONE',
                    slots: {
                        audio_one: {
                            "name": "audio_one",
                            "resolutions": {},
                            "confirmationStatus": "NONE"
                        },
                        audio_two: {
                            "name": "audio_two",
                            "resolutions": {},
                            "confirmationStatus": "NONE"
                        },
                        audio_three: {
                            "name": "audio_three",
                            "resolutions": {},
                            "confirmationStatus": "NONE"
                        },
                        visual_one: {
                            "name": "visual_one",
                            "resolutions": {},
                            "confirmationStatus": "NONE"
                        },
                        visual_two: {
                            "name": "visual_two",
                            "resolutions": {},
                            "confirmationStatus": "NONE"
                        },
                        visual_three: {
                            "name": "visual_three",
                            "resolutions": {},
                            "confirmationStatus": "NONE"
                        },
                        motoric_one: {
                            "name": "motoric_one",
                            "resolutions": {},
                            "confirmationStatus": "NONE"
                        },
                        motoric_two: {
                            "name": "motoric_two",
                            "resolutions": {},
                            "confirmationStatus": "NONE"
                        },
                        motoric_three: {
                            "name": "motoric_three",
                            "resolutions": {},
                            "confirmationStatus": "NONE"
                        },
                        comm_one: {
                            "name": "comm_one",
                            "resolutions": {},
                            "confirmationStatus": "NONE"
                        },
                        comm_two: {
                            "name": "comm_two",
                            "resolutions": {},
                            "confirmationStatus": "NONE"
                        },
                        comm_three: {
                            "name": "comm_three",
                            "resolutions": {},
                            "confirmationStatus": "NONE"
                        },
                    }
                })
                .reprompt(handlerInput.t('REPROMPT_MSG'))
                .getResponse();
    }
};

//Intent um über Lerntyp-Test aufzuklären 
const FindLearnTypeIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'FindLearnTypeIntent';
    },
    handle(handlerInput) {
        const {attributesManager, requestEnvelope} = handlerInput;
        const sessionAttributes = attributesManager.getSessionAttributes();
        const {intent} = requestEnvelope.request;
        const subject = sessionAttributes['subject'];
        let speechText = '';
        
       if (intent.confirmationStatus === 'CONFIRMED') {
        
            const audioOneSlot = Alexa.getSlot(requestEnvelope, 'audio_one');
            const audio_one = parseInt(audioOneSlot.resolutions.resolutionsPerAuthority[0].values[0].value.id);
            
            const audioTwoSlot = Alexa.getSlot(requestEnvelope, 'audio_two');
            const audio_two = parseInt(audioTwoSlot.resolutions.resolutionsPerAuthority[0].values[0].value.id);
            
            const audioThreeSlot = Alexa.getSlot(requestEnvelope, 'audio_three');
            const audio_three = parseInt(audioThreeSlot.resolutions.resolutionsPerAuthority[0].values[0].value.id);
            
            const visualOneSlot = Alexa.getSlot(requestEnvelope, 'visual_one');
            const visual_one = parseInt(visualOneSlot.resolutions.resolutionsPerAuthority[0].values[0].value.id);
            
            const visualTwoSlot = Alexa.getSlot(requestEnvelope, 'visual_two');
            const visual_two = parseInt(visualTwoSlot.resolutions.resolutionsPerAuthority[0].values[0].value.id);
            
            const visualThreeSlot = Alexa.getSlot(requestEnvelope, 'visual_three');
            const visual_three = parseInt(visualThreeSlot.resolutions.resolutionsPerAuthority[0].values[0].value.id);
            
            const motoricOneSlot = Alexa.getSlot(requestEnvelope, 'motoric_one');
            const motoric_one = parseInt(motoricOneSlot.resolutions.resolutionsPerAuthority[0].values[0].value.id);
            
            const motoricTwoSlot = Alexa.getSlot(requestEnvelope, 'motoric_two');
            const motoric_two = parseInt(motoricTwoSlot.resolutions.resolutionsPerAuthority[0].values[0].value.id);
            
            const motoricThreeSlot = Alexa.getSlot(requestEnvelope, 'motoric_three');
            const motoric_three = parseInt(motoricThreeSlot.resolutions.resolutionsPerAuthority[0].values[0].value.id);
            
            const commOneSlot = Alexa.getSlot(requestEnvelope, 'comm_one');
            const comm_one = parseInt(commOneSlot.resolutions.resolutionsPerAuthority[0].values[0].value.id);
            
            const commTwoSlot = Alexa.getSlot(requestEnvelope, 'comm_two');
            const comm_two = parseInt(commTwoSlot.resolutions.resolutionsPerAuthority[0].values[0].value.id);
            
            const commThreeSlot = Alexa.getSlot(requestEnvelope, 'comm_three');
            const comm_three = parseInt(commThreeSlot.resolutions.resolutionsPerAuthority[0].values[0].value.id);
            
            const sum_audio = audio_one + audio_two + audio_three;
            const sum_visual = visual_one + visual_two + visual_three;
            const sum_motoric = motoric_one + motoric_two + motoric_three;
            const sum_comm = comm_one + comm_two + comm_three;
            

            const sums = [ 
              {name: 'visual_type', value: sum_visual},
              {name: 'comm_type', value: sum_comm},
              {name: 'motoric_type', value: sum_motoric},
              {name: 'audio_type', value: sum_audio}
            ];
            
            let lerntype = (sums.reduce((max, type) => max.value > type.value ? max : type)).name;
            //let lerntype = (sums.reduce((max, type) => max.value > type.value ? type : max)).name;

            switch (lerntype) {
                case 'visual_type': 
                    speechText += handlerInput.t('VISUAL_TYPE')
                    sessionAttributes['learningType'] = 'visuell'
                    break;
                case 'comm_type':
                    speechText += handlerInput.t('COMM_TYPE')
                    sessionAttributes['learningType'] = 'kommunikation'
                    break;
                case 'motoric_type':
                    speechText += handlerInput.t('MOTORIC_TYPE')
                    sessionAttributes['learningType'] = 'motorisch'
                    break;
                case 'audio_type':
                    speechText += handlerInput.t('AUDIO_TYPE')
                    sessionAttributes['learningType'] = 'audio'
                    break;
            }
        }
        
        sessionAttributes['onboarded'] = true;
        speechText += ' Falls du möchtest, kannst du mir nun noch das Datum deiner Klausur in ' + subject + ' verraten. Wann findet die Klausur in ' + subject+ ' statt?'

        return handlerInput.responseBuilder
            .speak(speechText)
            .reprompt(handlerInput.t('REPROMPT_MSG'))
            .getResponse();
    }
};

const HelpIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'AMAZON.HelpIntent';
    },
    handle(handlerInput) {
        const speechText = handlerInput.t('HELP_MSG');

        return handlerInput.responseBuilder
            .speak(speechText)
            .reprompt(speechText)
            .getResponse();
    }
};


const CancelAndStopIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && (Alexa.getIntentName(handlerInput.requestEnvelope) === 'AMAZON.CancelIntent'
                || Alexa.getIntentName(handlerInput.requestEnvelope) === 'AMAZON.StopIntent');
    },
    handle(handlerInput) {
        const sessionAttributes = handlerInput.attributesManager.getSessionAttributes();
        const name = sessionAttributes['name'] || '';
        const speechText = handlerInput.t('GOODBYE_MSG', {name: name});

        return handlerInput.responseBuilder
            .speak(speechText)
            .getResponse();
    }
};
/* *
 * FallbackIntent triggers when a customer says something that doesn’t map to any intents in your skill
 * It must also be defined in the language model (if the locale supports it)
 * This handler can be safely added but will be ingnored in locales that do not support it yet 
 * */
const FallbackIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'AMAZON.FallbackIntent';
    },
    handle(handlerInput) {
        const speechText = handlerInput.t('FALLBACK_MSG');

        return handlerInput.responseBuilder
            .speak(speechText)
            .reprompt(handlerInput.t('REPROMPT_MSG'))
            .getResponse();
    }
};
/* *
 * SessionEndedRequest notifies that a session was ended. This handler will be triggered when a currently open 
 * session is closed for one of the following reasons: 1) The user says "exit" or "quit". 2) The user does not 
 * respond or says something that does not match an intent defined in your voice model. 3) An error occurs 
 * */
const SessionEndedRequestHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'SessionEndedRequest';
    },
    handle(handlerInput) {
        console.log(`~~~~ Session ended: ${JSON.stringify(handlerInput.requestEnvelope)}`);
        // Any cleanup logic goes here.
        return handlerInput.responseBuilder.getResponse(); // notice we send an empty response
    }
};
/* *
 * The intent reflector is used for interaction model testing and debugging.
 * It will simply repeat the intent the user said. You can create custom handlers for your intents 
 * by defining them above, then also adding them to the request handler chain below 
 * */
const IntentReflectorHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest';
    },
    handle(handlerInput) {
        const intentName = Alexa.getIntentName(handlerInput.requestEnvelope);
        const speechText = handlerInput.t('REFLECTOR_MSG', {intent: intentName});

        return handlerInput.responseBuilder
            .speak(speechText)
            //.reprompt('add a reprompt if you want to keep the session open for the user to respond')
            .getResponse();
    }
};
/**
 * Generic error handling to capture any syntax or routing errors. If you receive an error
 * stating the request handler chain is not found, you have not implemented a handler for
 * the intent being invoked or included it in the skill builder below 
 * */
const ErrorHandler = {
    canHandle() {
        return true;
    },
    handle(handlerInput, error) {
        const speechText = handlerInput.t('ERROR_MSG');
        console.log(`~~~~ Error handled: ${JSON.stringify(error)}`);

        return handlerInput.responseBuilder
            .speak(speechText)
            .reprompt(handlerInput.t('REPROMPT_MSG'))
            .getResponse();
    }
};
/**
 * This handler acts as the entry point for your skill, routing all request and response
 * payloads to the handlers above. Make sure any new handlers or interceptors you've
 * defined are included below. The order matters - they're processed top to bottom 
 * */
exports.handler = Alexa.SkillBuilders.custom()
    .addRequestHandlers(
        LaunchRequestHandler,
        BreakMoodGoodIntentHandler,
        BreakMoodBadIntentHandler,
        StructLearningDayIntentHandler,
        LearningTargetIntentHandler,
        FinishTimeIntentHandler,
        RewardIntentHandler,
        RemindFinishTimeHandler,
        RemindExamIntentHandler,
        BreakMoodIntentHandler,
        FinishMoodIntentHandler,
        FinishTodayIntentHandler,
        RegisterExamIntentHandler,
        RelaxIntentHandler,
        MeditationIntentHandler,
        ActivationIntentHandler,
        FoodIntentHandler,
        ConcentrationIntentHandler,
        LearningTipsIntentHandler,
        SayExamIntentHandler,
        RemindLearningBreakIntentHandler,
        RemindSixtyMinBreakIntentHandler,
        RemindThirtyMinBreakIntentHandler,
        FindLearnTypeIntentHandler,
        StartLearnTypeIntentHandler,
        SayLearningTargetIntentHandler,
        SayProgressIntentHandler,
        ProgressIntentHandler,
        HelpIntentHandler,
        CancelAndStopIntentHandler,
        FallbackIntentHandler,
        SessionEndedRequestHandler,
        IntentReflectorHandler)
    .addErrorHandlers(
        ErrorHandler)
    .addRequestInterceptors(
        interceptors.LoadAttributesRequestInterceptor,
        interceptors.LocalisationRequestInterceptor,
        interceptors.LoggingRequestInterceptor,
        interceptors.LoadNameRequestInterceptor,
        interceptors.LoadTimezoneRequestInterceptor)
    .addResponseInterceptors(
        interceptors.LoggingResponseInterceptor,
        interceptors.SaveAttributesResponseInterceptor)
    .withPersistenceAdapter(util.getPersistenceAdapter())
    .withApiClient(new Alexa.DefaultApiClient())
    .withCustomUserAgent('sample/smarter-lernpartner/mod6') 
    .lambda();