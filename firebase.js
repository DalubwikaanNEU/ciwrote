// ==========================================
// CIWROTE
// Firebase Configuration
// ==========================================

import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.2/firebase-app.js";

import { getFirestore } from "https://www.gstatic.com/firebasejs/11.0.2/firebase-firestore.js";

import { getAuth } from "https://www.gstatic.com/firebasejs/11.0.2/firebase-auth.js";

import { getStorage } from "https://www.gstatic.com/firebasejs/11.0.2/firebase-storage.js";

// ==========================================
// YOUR FIREBASE CONFIG
// Replace with YOUR OWN values
// ==========================================

const firebaseConfig = {

    apiKey: "AIzaSyA2hvP1a8aDUrOOyqhhR_nfTPx8xi3V5Aw",

    authDomain: "ciwrote.firebaseapp.com",

    projectId: "ciwrote",

    storageBucket: "ciwrote.firebasestorage.app",

    messagingSenderId: "90926982911",

    appId: "1:90926982911:web:d2e39140bbaa8066d24eca"

};

// ==========================================
// INITIALIZE
// ==========================================

const app = initializeApp(firebaseConfig);

const db = getFirestore(app);

const auth = getAuth(app);

const storage = getStorage(app);

// ==========================================
// EXPORT
// ==========================================

export {

    db,

    auth,

    storage

};
