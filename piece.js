// ==========================================
// CIWROTE
// Single Piece Reader
// ==========================================


import { db } from "./firebase.js";


import {

    doc,

    getDoc

} from "https://www.gstatic.com/firebasejs/11.0.2/firebase-firestore.js";



// ==========================================
// ELEMENT
// ==========================================

const pieceContainer = document.getElementById("piece");



// ==========================================
// GET PIECE ID
// ==========================================

const params = new URLSearchParams(
    window.location.search
);


const pieceId = params.get("id");



// ==========================================
// LOAD PIECE
// ==========================================

async function loadPiece(){


    if(!pieceId){


        showError(
            "No piece selected."
        );


        return;


    }



    try{


        const pieceRef = doc(

            db,

            "pieces",

            pieceId

        );



        const snapshot = await getDoc(pieceRef);



        if(!snapshot.exists()){


            showError(
                "This piece does not exist."
            );


            return;


        }



        const piece = snapshot.data();



        displayPiece(piece);



    }



    catch(error){


        console.error(error);



        showError(

            "Unable to load this piece."

        );


    }


}



// ==========================================
// DISPLAY
// ==========================================

function displayPiece(piece){



    pieceContainer.innerHTML = `


        <p class="date">

            ${piece.date || ""}

        </p>



        <h1>

            ${piece.title || "Untitled"}

        </h1>



        <p class="category">

            ${piece.category || ""}

        </p>



        <div class="full-content">

            ${piece.content || ""}

        </div>


    `;


}



// ==========================================
// ERROR
// ==========================================

function showError(message){



    pieceContainer.innerHTML = `


        <h1>

            Oops.

        </h1>


        <p>

            ${message}

        </p>


    `;


}



// ==========================================
// START
// ==========================================

loadPiece();
