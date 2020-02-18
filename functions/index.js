// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
const functions = require('firebase-functions');
const cors = require ('cors'); 
const app = require('express')();
app.use(cors);

const FBAuth = require("./utils/fbAuth");

const {db} = require('./utils/admin');

const { getAllStreams, postOneStream,
    getStream,
    commentOnStream,
    likeStream,
    unlikeStream,
    deleteStream
} = require("./handlers/streams");

const { signup,
    login,
    uploadImage,
    addUserDetails,
    getAuthenticatedUser,
    getUserDetails,
    markNoficationsRead
} = require("./handlers/users");


//streams handlers

app.get('/screams', getAllStreams);
app.post('/scream', FBAuth, postOneStream);
app.get('/scream/:screamId', getStream);

app.delete('/scream/:screamId', FBAuth, deleteStream)
app.get('/scream/:screamId/like', FBAuth, likeStream);
app.get('/scream/:screamId/unlike', FBAuth, unlikeStream);
app.post('/screams/:screamId/comment', FBAuth, commentOnStream)

//user route
app.post('/signup', signup);
app.post('/login', login);
app.post('/user/image', FBAuth, uploadImage);
app.post('/user', FBAuth, addUserDetails);
app.get('/user', FBAuth, getAuthenticatedUser);
app.get('/user/:handle', getUserDetails);
app.post('/notifications', FBAuth, markNoficationsRead);




exports.api = functions.region('us-central1').https.onRequest(app);


exports.createNotificationOnLike = functions
    .region('us-central1')
    .firestore.document('likes/{id}')
    .onCreate((snapshot) => {
        return db.doc(`/screams/${snapshot.data().screamId}`)
            .get()
            .then(doc => {
                if (doc.exists && doc.data().userHandle !== snapshot.data().userHandle) {
                    db.doc(`/notifications/${snapshot.id}`).set({
                        createdAt: new Date().toISOString(),
                        recipient: doc.data().userHandle,
                        sender: snapshot.data().userHandle,
                        type: 'like',
                        read: false,
                        screamId: doc.id
                    });
                }
            })
    .catch((err) => 
        console.error(err))
        

    });


    exports.deleteNotificationOnUnLike = functions.region('us-central1')
    .firestore.document('likes/{id}')
    .onDelete((snapshot) => {
         db.doc(`/notifications/${snapshot.id}`)
            .delete()
            .catch((err) => {
                console.error(err)
                return;
            });
    });


exports.createNotificationOnComment = functions.region('us-central1').firestore.document('comments/{id}')
    .onCreate((snapshot) => {
      return  db.doc(`/streams/${snapshot.data().screamId}`)
            .get()
            .then((doc) => {
                if (doc.exists && doc.data().userHandle !== snapshot.data().userHandle) {
                    return db.doc(`/notifications/${snapshot.id}`)
                        .set({
                            createdAt: new Date().toISOString(),
                            recipient: doc.data().userHandle,
                            sender: snapshot.data().userHandle,
                            type: 'comment',
                            read: false,
                            screamId: doc.id
                        });
                }
            })
        
            .catch((err) => {
                console.error(err);
                return;
            });
    });

    exports.onUserImageChange = functions.region('us-central1')
    .firestore.document('/users/{userId}')
    .onUpdate((change)=>{
        console.log(change.before.data())
        console.log(change.after.data());
        if(change.before.data().imageUrl !== change.afeter.data().imageUrl){
            console.log('image has change');

        const batch =  db.batch();

        return db.collection('streams').where('userHandle', '==', change.before.data().handle).get()
        .then((data)=>{
            data.forEach(doc =>{
                const scream = db.doc(`/screams/${doc.id}`);
                batch.update(scream, {userImage: change.after.data().imageUrl});
            })
            return batch.commit();
        })

    }else{
        return true;
    }

    });


exports.onStreamDelete = functions.region('us-central1')
    .firestore.document('/screams/{screamId}')
    .onDelete((snapshot, context)=>{
        const screamId = context.params.screamId;
        const batch = db.batch();
        return db.collection('comments').where('screamId', '==', screamId).get()
        .then(data =>{
            data.forEach(doc =>{
                batch.delete(db.doc(`/comments/${doc.id}`));
            })
            return db.collection('likes').where('screamId', '==', screamId),get()
        })
        .then(data =>{
            data.forEach(doc =>{
                batch.delete(db.doc(`/likes/${doc.id}`));
            });
            return db.collection('notifications').where('screamId', '==', screamId).get()
        })
        .then(data =>{
            data.forEach(doc =>{
                batch.delete(db.doc(`/notifications/${doc.id}`));
            })
            return batch.commit();
        })
        .catch(err => console.error(err))

    })
