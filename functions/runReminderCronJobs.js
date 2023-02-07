const functions = require("firebase-functions");
const admin = require("firebase-admin");
// admin.initializeApp();
if (admin.apps.length === 0) {
    admin.initializeApp();
}
const db = admin.firestore();

// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
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
                                    patientPhoneNumber:
                                        doc.data().patientCell,
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
