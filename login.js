// ===========================================
// CIWROTE LOGIN
// Firebase Authentication
// ===========================================

import { auth } from "./firebase.js";

import {

    signInWithEmailAndPassword,
    onAuthStateChanged

} from "https://www.gstatic.com/firebasejs/11.0.2/firebase-auth.js";

// ===========================================
// ELEMENTS
// ===========================================

const emailInput = document.getElementById("email");

const passwordInput = document.getElementById("password");

const loginBtn = document.getElementById("loginBtn");

const message = document.getElementById("message");

// ===========================================
// AUTO LOGIN CHECK
// ===========================================

onAuthStateChanged(auth, (user) => {

    if (user) {

        window.location.href = "admin.html";

    }

});

// ===========================================
// LOGIN
// ===========================================

loginBtn.addEventListener("click", login);

passwordInput.addEventListener("keydown", (event) => {

    if (event.key === "Enter") {

        login();

    }

});

async function login() {

    const email = emailInput.value.trim();

    const password = passwordInput.value;

    if (!email || !password) {

        message.textContent = "Please enter your email and password.";

        return;

    }

    loginBtn.disabled = true;

    loginBtn.textContent = "Signing In...";

    message.textContent = "";

    try {

        await signInWithEmailAndPassword(

            auth,
            email,
            password

        );

        window.location.href = "admin.html";

    }

    catch (error) {

        console.error(error);

        switch (error.code) {

            case "auth/invalid-credential":

                message.textContent = "Invalid email or password.";
                break;

            case "auth/user-not-found":

                message.textContent = "Account not found.";
                break;

            case "auth/wrong-password":

                message.textContent = "Incorrect password.";
                break;

            case "auth/invalid-email":

                message.textContent = "Invalid email address.";
                break;

            case "auth/too-many-requests":

                message.textContent = "Too many attempts. Try again later.";
                break;

            default:

                message.textContent = "Unable to sign in.";

        }

    }

    finally {

        loginBtn.disabled = false;

        loginBtn.textContent = "Sign In";

    }

}
