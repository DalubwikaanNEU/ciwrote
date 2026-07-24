// ===========================================
// CIWROTE
// Piece Viewer
// ===========================================

import { db } from "./firebase.js";

import {

    doc,
    getDoc

} from "https://www.gstatic.com/firebasejs/11.0.2/firebase-firestore.js";

// ===========================================
// ELEMENTS
// ===========================================

const titleElement = document.getElementById("title");

const dateElement = document.getElementById("date");

const categoryElement = document.getElementById("category");

const contentElement = document.getElementById("content");

// ===========================================
// GET DOCUMENT ID
// ===========================================

const params = new URLSearchParams(window.location.search);

const pieceId = params.get("id");

// ===========================================
// LOAD PIECE
// ===========================================

async function loadPiece() {

    if (!pieceId) {

        titleElement.textContent = "Piece not found";

        dateElement.textContent = "";

        categoryElement.textContent = "";

        contentElement.textContent = "No literary piece was selected.";

        return;

    }

    try {

        const docRef = doc(db, "pieces", pieceId);

        const snap = await getDoc(docRef);

        if (!snap.exists()) {

            titleElement.textContent = "Piece not found";

            dateElement.textContent = "";

            categoryElement.textContent = "";

            contentElement.textContent =
                "This literary piece does not exist or may have been deleted.";

            return;

        }

        const piece = snap.data();

        document.title = `${piece.title} | ciwrote`;

        titleElement.textContent = piece.title || "Untitled";

        dateElement.textContent = piece.date || "";

        categoryElement.textContent = piece.category || "";

        contentElement.textContent = piece.content || "";

    }

    catch (error) {

        console.error(error);

        titleElement.textContent = "Error";

        dateElement.textContent = "";

        categoryElement.textContent = "";

        contentElement.textContent =
            "Unable to load this literary piece.";

    }

}

// ===========================================
// START
// ===========================================

loadPiece();
