const Alexa = require('ask-sdk-core');

const LaunchRequestHandler = {
    canHandle(handlerInput) {
        return handlerInput.requestEnvelope.request.type === 'LaunchRequest';
    },
    handle(handlerInput) {
        return GetFactIntentHandler.handle(handlerInput);
    }
};
const GetFactIntentHandler = {
    canHandle(handlerInput) {
        return handlerInput.requestEnvelope.request.type === 'IntentRequest'
            && (handlerInput.requestEnvelope.request.intent.name === 'GetFactIntent'
            || handlerInput.requestEnvelope.request.intent.name === 'AMAZON.YesIntent'   // <-- necessary so the user gets another fact when it says 'yes' when asked if they want another one
            || handlerInput.requestEnvelope.request.intent.name === 'AMAZON.NextIntent');// <-- necessary so the gets another fact when it says 'next' (you might want to extend the utterances of this intent with e.g. 'next fact' and similar)
    },
    handle(handlerInput) {
        
        const speechText = getRandomItem(CURIOSIDADES);
        return handlerInput.responseBuilder
            .speak(speechText + getRandomItem(PREGUNTAS))
            .reprompt(getRandomItem(PREGUNTAS)) // <-- necessary to keep the session open so users can request another fact
            .getResponse();
    }
};
const HelpIntentHandler = {
    canHandle(handlerInput) {
        return handlerInput.requestEnvelope.request.type === 'IntentRequest'
            && handlerInput.requestEnvelope.request.intent.name === 'AMAZON.HelpIntent';
    },
    handle(handlerInput) {
        const speechText = 'Puedes perdirme una curiosidad. Cómo te puedo ayudar?';

        return handlerInput.responseBuilder
            .speak(speechText)
            .reprompt(speechText)
            .getResponse();
    }
};
const CancelAndStopIntentHandler = {
    canHandle(handlerInput) {
        return handlerInput.requestEnvelope.request.type === 'IntentRequest'
            && (handlerInput.requestEnvelope.request.intent.name === 'AMAZON.CancelIntent'
                || handlerInput.requestEnvelope.request.intent.name === 'AMAZON.StopIntent'
                || handlerInput.requestEnvelope.request.intent.name === 'AMAZON.NoIntent'); // <-- necessary so the session is closed when the user doesn't want more facts
    },
    handle(handlerInput) {
        const speechText = 'Adiós!';
        return handlerInput.responseBuilder
            .speak(speechText)
            .getResponse();
    }
};
const SessionEndedRequestHandler = {
    canHandle(handlerInput) {
        return handlerInput.requestEnvelope.request.type === 'SessionEndedRequest';
    },
    handle(handlerInput) {
        // Any cleanup logic goes here.
        return handlerInput.responseBuilder.getResponse();
    }
};

const ErrorHandler = {
    canHandle() {
        return true;
    },
    handle(handlerInput, error) {
        console.log(`~~~~ Error handled: ${error.message}`);
        const speechText = 'Perdona, hubo un error. Por favor inténtalo otra vez';

        return handlerInput.responseBuilder
            .speak(speechText)
            .reprompt(speechText)
            .getResponse();
    }
};

function getRandomItem(array) { // <--- necessary to obtain a random element of an array
    return array[Math.floor(Math.random()*array.length)]
}

const CURIOSIDADES = [ // replace with your own facts
  'Un año en Mercurio solo dura 88 días. ', 
  'A pesar de estar más lejos del Sol, la temperatura en Venus es más alta que en Mercurio. ',
  'El sentido de la rotación de Venus es contra-reloj, posiblemente a causa de una colisión de un asteroide. ',
  'Desde Marte la apariencia del Sol es aproximadamente de la mitad del tamaño que visto desde la Tierra. ',
  'La Tierra es el único planeta que no fue nombrado como un Dios. ',
  'Júpiter tiene el día mas corto de todos los planetas. ',
  'La Vía Láctea hará colisión con la galaxia Andromeda en alrededor de 5 mil millones de años. ',
  'El 99.86% de la masa del sistema solar esta contenida en el Sol. ',
  'El Sol es una esfera casi perfecta. ',
  'Los eclipses solares totales pueden suceder una vez cada 1 o 2 años. Son eventos poco comunes. ',
  'Saturno irradia al espacio 2.5 veces más energía de la que recibe del Sol. ',
  'La temperatura en el interior del Sol puede alcanzar 15 millones de grados centigrados. ',
  'La Luna se está alejando de la Tierra 3.8 cm al año. '
];

const PREGUNTAS = [ // <-- necessary to provide variations on how to ask if the user wants another fact (and not be repetitive)
  'Quiéres otra?',
  'Quiéres otra curosidad?',
  'Te gustaría saber más?',
  'Quiéres saber la siguiente?',
  'Quiéres la siguiente curiosidad?',
  'Te digo otra?',
  'Te digo la siguiente',
  'Te digo otra curiosidad?',
  'Te digo la siguiente curiosidad?'
];

exports.handler = Alexa.SkillBuilders.custom()
    .addRequestHandlers(
        LaunchRequestHandler,
        GetFactIntentHandler,
        HelpIntentHandler,
        CancelAndStopIntentHandler,
        SessionEndedRequestHandler)
    .addErrorHandlers(
        ErrorHandler)
    .lambda();
