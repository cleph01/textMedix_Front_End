const { MessagingResponse } = require("twilio").twiml;

const functions = require("firebase-functions");

// The Firebase Admin SDK to access Firestore.
const admin = require("firebase-admin");
admin.initializeApp();

const express = require("express");
const app = express();

// Parse JSON bodies for this app.
app.use(express.json());

// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
// exports.helloWorld = functions.https.onRequest((request, response) => {
//   functions.logger.info("Hello logs!", {structuredData: true});
//   response.send("Hello from Firebase!");
// });

app.post("/", async (request, response) => {
    const { To, From, Body, AccountSid, MessageSid, SmsSid } = request.body;

    // Create a TWIML response object to send back as SMS to sender
    const twiml = new MessagingResponse();

    switch (Body.toLowerCase()) {
        // Resubscribe Cases Here
        case "start":
            twiml.message(
                "Welcome back. Let us know how we can thank you. Message us here."
            );
            break;
        case "yes":
            twiml.message(
                "Welcome back. Let us know how we can thank you. Message us here."
            );
            break;
        case "unstop":
            twiml.message(
                "Welcome back. Let us know how we can thank you. Message us here."
            );
            break;
        // Unsubscribe Cases Here
        case "stop":
            // Locate patient using cell phone number
            try {
                const doc = await admin
                    .firestore()
                    .collection("unsubscribed")
                    .doc(`${To.slice(2)}-${From.slice(2)}`)
                    .get();

                // Add Record if Record doesn't exist
                if (!doc.exists) {
                    let recordData = {
                        practiceTwilioNumber: To,
                        patientPhoneNumber: From,
                        created: admin.firestore.Timestamp.fromDate(new Date()),
                    };

                    await admin
                        .firestore()
                        .collection("unsubscribed")
                        .doc(`${To.slice(2)}-${From.slice(2)}`)
                        .set(recordData);

                    console.log("UnSubscribed Record Successfully Created");
                } else {
                    // OptOut Record Already Exists
                    console.log("OptOut Record Already Exists");
                }
            } catch (error) {
                // Handle Error
                console.log("Error: " + error);
            }

            break;
        case "stopall":
            // Locate Patient using cell phone number
            try {
                const doc = await admin
                    .firestore()
                    .collection("unsubscribed")
                    .doc(`${To.slice(2)}-${From.slice(2)}`)
                    .get();

                // Add Record if Record doesn't exist
                if (!doc.exists) {
                    let recordData = {
                        practiceTwilioNumber: To,
                        patientPhoneNumber: From,
                        created: admin.firestore.Timestamp.fromDate(new Date()),
                    };

                    await admin
                        .firestore()
                        .collection("unsubscribed")
                        .doc(`${To.slice(2)}-${From.slice(2)}`)
                        .set(recordData);

                    console.log("UnSubscribed Record Successfully Created");
                } else {
                    // OptOut Record Already Exists
                    console.log("OptOut Record Already Exists");
                }
            } catch (error) {
                // Handle Error
                console.log("Error: " + error);
            }

            break;
        case "unsubscribe":
            break;
        case "cancel":
            // Locate Patient using cell phone number
            try {
                const doc = await admin
                    .firestore()
                    .collection("unsubscribed")
                    .doc(`${To.slice(2)}-${From.slice(2)}`)
                    .get();

                // Add Record if Record doesn't exist
                if (!doc.exists) {
                    let recordData = {
                        practiceTwilioNumber: To,
                        patientPhoneNumber: From,
                        created: admin.firestore.Timestamp.fromDate(new Date()),
                    };

                    await admin
                        .firestore()
                        .collection("unsubscribed")
                        .doc(`${To.slice(2)}-${From.slice(2)}`)
                        .set(recordData);

                    console.log("UnSubscribed Record Successfully Created");
                } else {
                    // OptOut Record Already Exists
                    console.log("OptOut Record Already Exists");
                }
            } catch (error) {
                // Handle Error
                console.log("Error: " + error);
            }

            break;
        case "end":
            // Locate Patient using cell phone number
            try {
                const doc = await admin
                    .firestore()
                    .collection("unsubscribed")
                    .doc(`${To.slice(2)}-${From.slice(2)}`)
                    .get();

                // Add Record if Record doesn't exist
                if (!doc.exists) {
                    let recordData = {
                        practiceTwilioNumber: To,
                        patientPhoneNumber: From,
                        created: admin.firestore.Timestamp.fromDate(new Date()),
                    };

                    await admin
                        .firestore()
                        .collection("unsubscribed")
                        .doc(`${To.slice(2)}-${From.slice(2)}`)
                        .set(recordData);

                    console.log("UnSubscribed Record Successfully Created");
                } else {
                    // OptOut Record Already Exists
                    console.log("OptOut Record Already Exists");
                }
            } catch (error) {
                // Handle Error
                console.log("Error: " + error);
            }
            break;

        case "quit":
            // Locate patient using cell phone number
            try {
                const doc = await admin
                    .firestore()
                    .collection("unsubscribed")
                    .doc(`${To.slice(2)}-${From.slice(2)}`)
                    .get();

                // Add Record if Record doesn't exist
                if (!doc.exists) {
                    let recordData = {
                        practiceTwilioNumber: To,
                        patientPhoneNumber: From,
                        created: admin.firestore.Timestamp.fromDate(new Date()),
                    };

                    await admin
                        .firestore()
                        .collection("unsubscribed")
                        .doc(`${To.slice(2)}-${From.slice(2)}`)
                        .set(recordData);

                    console.log("UnSubscribed Record Successfully Created");
                } else {
                    // OptOut Record Already Exists
                    console.log("OptOut Record Already Exists");
                    twiml.message("OptOut Record Already Exists");
                }
            } catch (error) {
                // Handle Error
                console.log("Error: " + error);
            }
            break;

        case "hello":
            twiml.message("Hi!" + `${To}, ${From}`);
            break;

        case "bye":
            twiml.message("Goodbye");
            break;

        default:
            try {
                // Get practice
                const practiceQuerySnapshot = await admin
                    .firestore()
                    .collection("practice")
                    .where("twilioNumber", "==", To)
                    .get();

                console.log("PracticeQuerySnapshot: ", practiceQuerySnapshot);

                let practiceId;

                if (practiceQuerySnapshot.docs.length !== 0) {
                    practiceQuerySnapshot.forEach(
                        (doc) => (practiceId = doc.id)
                    );
                }

                // Check if number is in patient collection
                const patientQuerySnapshot = await admin
                    .firestore()
                    .collection("patients")
                    .where("cellPhone", "==", From)
                    .get();

                console.log("patientQuerySnapshot: ", patientQuerySnapshot);

                let patientRef;
                let patientId = null;

                if (patientQuerySnapshot.docs.length !== 0) {
                    patientQuerySnapshot.forEach((doc) => {
                        patientRef = admin
                            .firestore()
                            .doc(`patients/${doc.id}`);

                        patientId = doc.id;

                        response.set(
                            "Set-Cookie",
                            `__session=${{
                                patientId: patientId,
                            }};`
                        );
                    });
                }

                let convoData = {
                    practiceTwilioNumber: To,
                    patientPhoneNumber: From,
                    messageSid: MessageSid,
                    user: patientRef || "anonymous",
                    patientId: patientId,
                    text: Body,
                    direction: "in",
                    createdOn: admin.firestore.Timestamp.fromDate(new Date()),
                };

                console.log("businesId: ", practiceId);

                let batch = admin.firestore().batch();

                const chatRef = admin
                    .firestore()
                    .collection("chats")
                    .doc(practiceId);

                batch.set(chatRef, { practiceId: practiceId });

                const channelRef = chatRef
                    .collection("channels")
                    .doc(From.slice(2));

                batch.set(channelRef, { patientId: patientId });

                const messageRef = channelRef.collection("messages").doc();

                batch.set(messageRef, convoData);

                batch.commit();

                // twiml.message("Message Saved");
                console.log("message Saved");
            } catch (error) {
                twiml.message("Error Creating Conversation Record: " + error);
            }
    }

    // Send back a message that we've successfully written the message
    response.type("text/xml").send(twiml.toString());
});

exports.handleIncomingSMS = functions.https.onRequest(app);

// exports.updateOptoutStatus = functions.https.onRequest(
//     async (request, response) => {
//         const { To, From, Body, AccountSid, MessageSid, SmsSid } = request.body;

//         // Create a TWIML response object to send back as SMS to sender
//         const twiml = new MessagingResponse();

//         switch (Body.toLowerCase()) {
//             // Resubscribe Cases Here
//             case "start":
//                 twiml.message(
//                     "Welcome back. Let us know how we can thank you. Message us here."
//                 );
//                 break;
//             case "yes":
//                 twiml.message(
//                     "Welcome back. Let us know how we can thank you. Message us here."
//                 );
//                 break;
//             case "unstop":
//                 twiml.message(
//                     "Welcome back. Let us know how we can thank you. Message us here."
//                 );
//                 break;
//             // Unsubscribe Cases Here
//             case "stop":
//                 // Locate patient using cell phone number
//                 try {
//                     const doc = await admin
//                         .firestore()
//                         .collection("unsubscribed")
//                         .doc(`${To.slice(2)}-${From.slice(2)}`)
//                         .get();

//                     // Add Record if Record doesn't exist
//                     if (!doc.exists) {
//                         let recordData = {
//                             practiceTwilioNumber: To,
//                             patientPhoneNumber: From,
//                             created: admin.firestore.Timestamp.fromDate(
//                                 new Date()
//                             ),
//                         };

//                         await admin
//                             .firestore()
//                             .collection("unsubscribed")
//                             .doc(`${To}-${From}`)
//                             .set(recordData);

//                         console.log("UnSubscribed Record Successfully Created");
//                     } else {
//                         // OptOut Record Already Exists
//                         console.log("OptOut Record Already Exists");
//                     }
//                 } catch (error) {
//                     // Handle Error
//                     console.log("Error: " + error);
//                 }

//                 break;
//             case "stopall":
//                 // Locate patient using cell phone number
//                 try {
//                     const doc = await admin
//                         .firestore()
//                         .collection("unsubscribed")
//                         .doc(`${To}-${From}`)
//                         .get();

//                     // Add Record if Record doesn't exist
//                     if (!doc.exists) {
//                         let recordData = {
//                             practiceTwilioNumber: To,
//                             patientPhoneNumber: From,
//                             created: admin.firestore.Timestamp.fromDate(
//                                 new Date()
//                             ),
//                         };

//                         await admin
//                             .firestore()
//                             .collection("unsubscribed")
//                             .doc(`${To}-${From}`)
//                             .set(recordData);

//                         console.log("UnSubscribed Record Successfully Created");
//                     } else {
//                         // OptOut Record Already Exists
//                         console.log("OptOut Record Already Exists");
//                     }
//                 } catch (error) {
//                     // Handle Error
//                     console.log("Error: " + error);
//                 }

//                 break;
//             case "unsubscribe":
//                 break;
//             case "cancel":
//                 // Locate patient using cell phone number
//                 try {
//                     const doc = await admin
//                         .firestore()
//                         .collection("unsubscribed")
//                         .doc(`${To}-${From}`)
//                         .get();

//                     // Add Record if Record doesn't exist
//                     if (!doc.exists) {
//                         let recordData = {
//                             practiceTwilioNumber: To,
//                             patientPhoneNumber: From,
//                             created: admin.firestore.Timestamp.fromDate(
//                                 new Date()
//                             ),
//                         };

//                         await admin
//                             .firestore()
//                             .collection("unsubscribed")
//                             .doc(`${To}-${From}`)
//                             .set(recordData);

//                         console.log("UnSubscribed Record Successfully Created");
//                     } else {
//                         // OptOut Record Already Exists
//                         console.log("OptOut Record Already Exists");
//                     }
//                 } catch (error) {
//                     // Handle Error
//                     console.log("Error: " + error);
//                 }

//                 break;
//             case "end":
//                 // Locate patient using cell phone number
//                 try {
//                     const doc = await admin
//                         .firestore()
//                         .collection("unsubscribed")
//                         .doc(`${To}-${From}`)
//                         .get();

//                     // Add Record if Record doesn't exist
//                     if (!doc.exists) {
//                         let recordData = {
//                             practiceTwilioNumber: To,
//                             patientPhoneNumber: From,
//                             created: admin.firestore.Timestamp.fromDate(
//                                 new Date()
//                             ),
//                         };

//                         await admin
//                             .firestore()
//                             .collection("unsubscribed")
//                             .doc(`${To}-${From}`)
//                             .set(recordData);

//                         console.log("UnSubscribed Record Successfully Created");
//                     } else {
//                         // OptOut Record Already Exists
//                         console.log("OptOut Record Already Exists");
//                     }
//                 } catch (error) {
//                     // Handle Error
//                     console.log("Error: " + error);
//                 }
//                 break;

//             case "quit":
//                 // Locate patient using cell phone number
//                 try {
//                     const doc = await admin
//                         .firestore()
//                         .collection("unsubscribed")
//                         .doc(`${To}-${From}`)
//                         .get();

//                     // Add Record if Record doesn't exist
//                     if (!doc.exists) {
//                         let recordData = {
//                             practiceTwilioNumber: To,
//                             patientPhoneNumber: From,
//                             created: admin.firestore.Timestamp.fromDate(
//                                 new Date()
//                             ),
//                         };

//                         await admin
//                             .firestore()
//                             .collection("unsubscribed")
//                             .doc(`${To}-${From}`)
//                             .set(recordData);

//                         console.log("UnSubscribed Record Successfully Created");
//                     } else {
//                         // OptOut Record Already Exists
//                         console.log("OptOut Record Already Exists");
//                         twiml.message("OptOut Record Already Exists");
//                     }
//                 } catch (error) {
//                     // Handle Error
//                     console.log("Error: " + error);
//                 }
//                 break;

//             case "hello":
//                 twiml.message("Hi!" + `${To}, ${From}`);
//                 break;

//             case "bye":
//                 twiml.message("Goodbye");
//                 break;

//             default:
//                 try {
//                     let convoData = {
//                         practiceTwilioNumber: To,
//                         patientPhoneNumber: From,
//                         messageSid: MessageSid,
//                         body: Body,
//                         direction: "in",
//                         created: admin.firestore.Timestamp.fromDate(new Date()),
//                     };

//                     const { id } = await admin
//                         .firestore()
//                         .collection("conversation")
//                         .add(convoData);
//                 } catch (error) {
//                     twiml.message(
//                         "Error Creating Conversation Record: " + error
//                     );
//                 }
//         }

//         // Send back a message that we've successfully written the message
//         response.type("text/xml").send(twiml.toString());
//     }
// );
