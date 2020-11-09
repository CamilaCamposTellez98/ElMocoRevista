const functions = require('firebase-functions');

const admin = require ('firebase-admin');
admin.initializeApp(functions.config().firebase);

const SENDGRID_API_KEY = functions.config().sendgrid.key 

const sgMail = require ('@sendgrid/mail');
const { user } = require('firebase-functions/lib/providers/auth');
sgMail.setApiKey(SENDGRID_API_KEY);

exports.firestoreEmail = functions.firestore
    .document('arte/{lectorId}')
    .onCreate(event => {
        const lectorId = context.params.lectorId;
        const db = admin.firestore()
        return db.collection('arte').doc(lectorId)
        .get()
        .then(doc => {
            const lector = doc.data()
            const msg = {
                to: lector.email,
                from: 'el.moco.revista@gmail.com',
                subject: '¡Un lector desea contactarlos!',

                templateId: 'd-a75853addcd249efbfa5a6a6865d2e92',
                substitutionWrappers: ['{{', '}}'],
                dynamic_template_data: {
                    lectormail: lector.displayName,
                    mensaje: lector.displayMensaje,
                }
            };
            return sgMail.send(msg)
        })
        .then(() => console.log('Mensaje enviado'))
        .catch(err => console.log(err))
    });


// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
// exports.helloWorld = functions.https.onRequest((request, response) => {
//  response.send("Hello from Firebase!");
// });
