import firebase from 'firebase';
import 'firebase/auth' // If you need it
import 'firebase/firestore' // If you need it
import 'firebase/storage' // If you need it
import 'firebase/analytics' // If you need it
import 'firebase/performance' // If you need it

const clientCredentials = {
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
    authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
    databaseURL: process.env.NEXT_PUBLIC_FIREBASE_DATABASE_URL,
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
    measurementId: process.env.NEXT_PUBLIC_MEASURMENT_ID
}

if (!firebase.apps.length) {
    firebase.initializeApp(clientCredentials)
    // Check that `window` is in scope for the analytics module!
    if (typeof window !== 'undefined') {
        // Enable analytics. https://firebase.google.com/docs/analytics/get-started
        if ('measurementId' in clientCredentials) {
            firebase.analytics()
            firebase.performance()
        }
    }
}

const Firebase = firebase;
export default Firebase;