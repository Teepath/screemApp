
const admin = require('firebase-admin');
const serviceAccount = require("../config.json");


admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://my-project-1502471900890.firebaseio.com",
    storageBucket: "my-project-1502471900890.appspot.com"  
});

//admin.initializeApp();

const db= admin.firestore();

module.exports = {admin, db};