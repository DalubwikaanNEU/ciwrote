// ===========================================
// CIWROTE
// Homepage Loader
// Firebase Firestore
// ===========================================

import { db } from "./firebase.js";

import {

    collection,
    getDocs,
    query,
    orderBy

} from "https://www.gstatic.com/firebasejs/11.0.2/firebase-firestore.js";

// ===========================================
// ELEMENT
// ===========================================

const piecesContainer = document.getElementById("pieces");

// ===========================================
// LOAD PIECES
// ===========================================

async function loadPieces() {

    piecesContainer.innerHTML = `
        <div class="loading">
            Loading pieces...
        </div>
    `;

    try {

        const q = query(

            collection(db, "pieces"),

            orderBy("createdAt", "desc")

        );

        const snapshot = await getDocs(q);

        piecesContainer.innerHTML = "";

        if (snapshot.empty) {

            piecesContainer.innerHTML = `

                <article class="piece">

                    <h2>No pieces yet.</h2>

                    <p class="preview">

                        The first poem will arrive soon.

                    </p>

                </article>

            `;

            return;

        }

        snapshot.forEach(doc => {

            const piece = doc.data();

            const article = document.createElement("article");

            article.className = "piece";

            article.innerHTML = `

                <p class="date">

                    ${piece.date || ""}

                </p>

                <h2>

                    ${piece.title}

                </h2>

                <p class="preview">

                    ${(piece.content || "").substring(0,180)}...

                </p>

                <a
                    href="piece.html?id=${doc.id}"
                    class="read-more"
                >

                    Read →

                </a>

            `;

            piecesContainer.appendChild(article);

        });

    }

    catch (error) {

        console.error(error);

        piecesContainer.innerHTML = `

            <article class="piece">

                <h2>Something went wrong.</h2>

                <p>

                    Unable to load literary pieces.

                </p>

            </article>

        `;

    }

}

// ===========================================
// START
// ===========================================

loadPieces();
