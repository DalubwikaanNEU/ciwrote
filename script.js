// ==========================================
// CIWROTE
// Homepage
// ==========================================

import { db } from "./firebase.js";

import {

    collection,
    getDocs,
    query,
    orderBy

} from "https://www.gstatic.com/firebasejs/11.0.2/firebase-firestore.js";

// ==========================================
// ELEMENTS
// ==========================================

const pieces = document.getElementById("pieces");

// ==========================================
// LOAD PIECES
// ==========================================

async function loadPieces() {

    pieces.innerHTML = `
        <div class="loading">
            Loading literary pieces...
        </div>
    `;

    try {

        const q = query(
            collection(db, "pieces"),
            orderBy("createdAt", "desc")
        );

        const snapshot = await getDocs(q);

        pieces.innerHTML = "";

        if (snapshot.empty) {

            pieces.innerHTML = `

                <article class="piece">

                    <p class="date">

                        Today

                    </p>

                    <h2>

                        Welcome to ciwrote.

                    </h2>

                    <p class="preview">

                        There are no published literary pieces yet.

                        Come back soon.

                    </p>

                </article>

            `;

            return;

        }

        snapshot.forEach((document) => {

            const piece = document.data();

            const article = document.createElement("article");

            article.className = "piece";

            article.onclick = () => {

                window.location.href =
                    `piece.html?id=${document.id}`;

            };

            article.innerHTML = `

                <p class="date">

                    ${piece.date || ""}

                </p>

                <h2>

                    ${piece.title || "Untitled"}

                </h2>

                <p class="preview">

                    ${createPreview(piece.content)}

                </p>

            `;

            pieces.appendChild(article);

        });

    }

    catch (error) {

        console.error(error);

        pieces.innerHTML = `

            <article class="piece">

                <h2>

                    Unable to load your writings.

                </h2>

                <p class="preview">

                    ${error.message}

                </p>

            </article>

        `;

    }

}

// ==========================================
// PREVIEW
// ==========================================

function createPreview(text = "") {

    const cleaned = text.trim();

    if (cleaned.length <= 220) {

        return cleaned;

    }

    return cleaned.substring(0,220) + "...";

}

// ==========================================
// START
// ==========================================

loadPieces();
