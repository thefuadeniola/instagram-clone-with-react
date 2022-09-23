import { initializeApp } from "firebase/app";
import { getFirestore } from 'firebase/firestore'
import { getStorage } from 'firebase/storage'
import { getAuth } from 'firebase/auth'

const firebaseConfig = {
    apiKey: "AIzaSyDMey6IBZVt_THcxQbClNaWc_wAlddHOo4",
    authDomain: "instagram-clone-5b4f3.firebaseapp.com",
    projectId: "instagram-clone-5b4f3",
    storageBucket: "instagram-clone-5b4f3.appspot.com",
    messagingSenderId: "445791643708",
    appId: "1:445791643708:web:3a8007066a240103c43b39"
};

const app = initializeApp(firebaseConfig);
const storage = getStorage(app)
const db = getFirestore(app)
const auth = getAuth(app)

export { storage, db, auth }


