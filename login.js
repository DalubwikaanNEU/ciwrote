// ==========================================
// CIWROTE
// Login Authentication
// ==========================================

import { auth } from "./firebase.js";

import {

    signInWithEmailAndPassword,
    onAuthStateChanged

} from "https://www.gstatic.com/firebasejs/11.0.2/firebase-auth.js";


// ==========================================
// ELEMENTS
// ==========================================

const loginForm = document.getElementById("loginForm");

const emailInput = document.getElementById("email");

const passwordInput = document.getElementById("password");

const loginBtn = document.getElementById("loginBtn");

const message = document.getElementById("message");


// ==========================================
// CHECK IF ALREADY LOGGED IN
// ==========================================

onAuthStateChanged(auth, (user) => {

    if (user) {

        window.location.href = "admin.html";

    }

});


// ==========================================
// LOGIN
// ==========================================

loginForm.addEventListener("submit", async (event) => {

    event.preventDefault();


    const email = emailInput.value.trim();

    const password = passwordInput.value;


    if (!email || !password) {

        message.textContent =
            "Please enter your email and password.";

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


    catch(error){


        console.error(error);


        switch(error.code){


            case "auth/invalid-email":

                message.textContent =
                    "Invalid email address.";

                break;


            case "auth/invalid-credential":

                message.textContent =
                    "Incorrect email or password.";

                break;


            case "auth/too-many-requests":

                message.textContent =
                    "Too many attempts. Try again later.";

                break;


            default:

                message.textContent =
                    "Login failed. Please try again.";

        }


    }


    finally{


        loginBtn.disabled = false;

        loginBtn.textContent = "Sign In";


    }


});
