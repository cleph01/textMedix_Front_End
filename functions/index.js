const { MessagingResponse } = require("twilio").twiml;

const functions = require("firebase-functions");

// The Firebase Admin SDK to access Firestore.
const admin = require("firebase-admin");
admin.initializeApp();

const db = admin.firestore();

const express = require("express");
const app = express();

// Parse JSON bodies for this app.
app.use(express.json());

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
        case "unsubscribe":
            break;
        case "cancel":
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
        case "end":
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
            twiml.message("Hi!");
            break;

        case "bye":
            twiml.message("Goodbye");
            break;

        default:
            try {
                // Get practiceId
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
                    .collection(`practice/${practiceId}/chats`)
                    .doc(From.slice(2));

                batch.set(chatRef, { practiceId: practiceId });

                const messageRef = chatRef.collection("messages").doc();

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

exports.runReminderCronJobs = functions.pubsub
    .schedule("* * * * *")
    .onRun((context) => {
        // toDate() is a firebase prototype function to convert Firebase timestamp
        // to a date object
        const serverDateTimeObj = admin.firestore.Timestamp.fromDate(
            new Date()
        ).toDate();

        console.log("serverDateTimeObj: ", serverDateTimeObj);

        const serverDateTimeStr = admin.firestore.Timestamp.fromDate(new Date())
            .toDate()
            .toLocaleString("en-US", {
                timeZone: "America/New_York",
            });

        console.log("serverDateTimeStr: ", serverDateTimeStr);

        // Date Object pulling out date only as string
        const serverDateStr = serverDateTimeObj.toLocaleDateString("en-US", {
            timeZone: "America/New_York",
        });

        console.log("serverDateStr: ", serverDateStr);

        // Date Object pulling out time as 24-hour and only hours and minuts
        const serverTimeStr = serverDateTimeObj.toLocaleTimeString("en-US", {
            timeZone: "America/New_York",
            hour12: false,
            hour: "2-digit",
            minute: "2-digit",
        });

        console.log("serverTimeStr: ", serverTimeStr);

        const [serverHours, serverMinutes] = serverTimeStr.split(":");

        // Retrieve ALL notifications that are schedule to be sent today
        db.collection("notifications")
            .where("sendOnDate", "==", serverDateStr)
            .get()
            .then((snapshot) => {
                snapshot.forEach(async (doc) => {
                    //  If notification request time matches current time, write to
                    // Outgoing messages table and trigger Twilio message

                    console.log("Notification Doc Id: ", doc.id);

                    console.log("SendOnTimeStr: ", doc.data().sendOnTime);

                    console.log("ServerTimeStr: ", serverTimeStr);

                    console.log(
                        "Is sendOnTime = serverTimeStr: ",
                        doc.data().sendOnTime === serverTimeStr
                    );

                    if (doc.data().sendOnTime === serverTimeStr) {
                        const docRef = await db
                            .collection("outgoingTextMessages")
                            .add({
                                to: doc.data().patientCell,
                                from: doc.data().practiceTwilioNumber,
                                body: doc.data().message,
                            });

                        console.log(" docRef Id: ", docRef.id);

                        if (docRef.id) {
                            // Once SMS is sent, add doc to patients notification subcollection

                            const convoRef = db
                                .collection("practice")
                                .doc(doc.data().practiceId)
                                .collection("sentNotifications")
                                .doc(docRef.id)
                                .set({
                                    practiceTwilioNumber:
                                        doc.data().practiceTwilioNumber,
                                    patientPhoneNumber: doc.data().patientCell,
                                    body: doc.data().message,
                                    direction: "out",
                                    outgoingTextMessagesId: docRef.id,
                                    created: admin.firestore.Timestamp.fromDate(
                                        new Date(serverDateTimeStr)
                                    ),
                                });
                        }
                    }
                });
            })
            .catch((error) => {
                console.log("Error getting Shops: ", error);
            });

        return null;
    });
