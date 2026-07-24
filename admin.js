// ===========================================
// CIWROTE ADMIN
// PART 1
// Firebase Setup + Authentication
// ===========================================

import { db, auth } from "./firebase.js";

import {

    collection,
    addDoc,
    getDocs,
    updateDoc,
    deleteDoc,
    doc,
    query,
    orderBy,
    serverTimestamp

} from "https://www.gstatic.com/firebasejs/11.0.2/firebase-firestore.js";

import {

    onAuthStateChanged,
    signOut

} from "https://www.gstatic.com/firebasejs/11.0.2/firebase-auth.js";

// ===========================================
// ELEMENTS
// ===========================================

const titleInput = document.getElementById("title");

const categoryInput = document.getElementById("category");

const contentInput = document.getElementById("content");

const publishBtn = document.getElementById("publishBtn");

const pieceList = document.getElementById("pieceList");

// ===========================================
// VARIABLES
// ===========================================

let editingId = null;

// ===========================================
// AUTH CHECK
// ===========================================

onAuthStateChanged(auth, (user) => {

    if (!user) {

        window.location.href = "login.html";

        return;

    }

    loadPieces();

});

// ===========================================
// UTILITIES
// ===========================================

function resetForm() {

    titleInput.value = "";

    categoryInput.value = "";

    contentInput.value = "";

    editingId = null;

    publishBtn.textContent = "Publish";

}

function formatDate() {

    return new Date().toLocaleDateString("en-US", {

        year: "numeric",

        month: "long",

        day: "numeric"

    });

}
// ===========================================
// PART 2
// PUBLISH / UPDATE PIECE
// ===========================================

publishBtn.addEventListener("click", async () => {

    const title = titleInput.value.trim();

    const category = categoryInput.value.trim();

    const content = contentInput.value.trim();

    if (!title || !content) {

        alert("Please enter a title and your literary piece.");

        return;

    }

    publishBtn.disabled = true;

    publishBtn.textContent = "Saving...";

    try {

        // ==========================
        // UPDATE
        // ==========================

        if (editingId) {

            await updateDoc(

                doc(db, "pieces", editingId),

                {

                    title,

                    category,

                    content,

                    date: formatDate(),

                    updatedAt: serverTimestamp()

                }

            );

            alert("Piece updated successfully.");

        }

        // ==========================
        // CREATE
        // ==========================

        else {

            await addDoc(

                collection(db, "pieces"),

                {

                    title,

                    category,

                    content,

                    date: formatDate(),

                    createdAt: serverTimestamp(),

                    updatedAt: serverTimestamp()

                }

            );

            alert("Piece published successfully.");

        }

        resetForm();

        loadPieces();

    }

    catch (error) {

        console.error(error);

        alert("Failed to save piece.");

    }

    finally {

        publishBtn.disabled = false;

        publishBtn.textContent = "Publish";

    }

});
// ===========================================
// PART 3
// LOAD ALL PIECES
// ===========================================

async function loadPieces() {

    pieceList.innerHTML = "Loading...";

    try {

        const q = query(

            collection(db, "pieces"),

            orderBy("createdAt", "desc")

        );

        const snapshot = await getDocs(q);

        pieceList.innerHTML = "";

        if (snapshot.empty) {

            pieceList.innerHTML = `

                <div class="piece-card">

                    <h3>No literary pieces yet.</h3>

                    <p>Your published works will appear here.</p>

                </div>

            `;

            return;

        }

        snapshot.forEach((document) => {

            const piece = document.data();

            const card = document.createElement("div");

            card.className = "piece-card";

            card.innerHTML = `

                <h3>${piece.title}</h3>

                <p>${piece.date || ""}</p>

                <p><strong>Category:</strong> ${piece.category || "Uncategorized"}</p>

                <div class="actions">

                    <button
                        class="edit-btn"
                        data-id="${document.id}"
                    >

                        Edit

                    </button>

                    <button
                        class="delete-btn"
                        data-id="${document.id}"
                    >

                        Delete

                    </button>

                </div>

            `;

            pieceList.appendChild(card);

        });

        attachEditEvents();

        attachDeleteEvents();

    }

    catch (error) {

        console.error(error);

        pieceList.innerHTML = `

            <div class="piece-card">

                <h3>Error</h3>

                <p>Unable to load your literary pieces.</p>

            </div>

        `;

    }

}
// ===========================================
// PART 4
// EDIT PIECE
// ===========================================

function attachEditEvents() {

    const editButtons = document.querySelectorAll(".edit-btn");

    editButtons.forEach((button) => {

        button.addEventListener("click", async () => {

            const id = button.dataset.id;

            try {

                const q = query(
                    collection(db, "pieces")
                );

                const snapshot = await getDocs(q);

                snapshot.forEach((document) => {

                    if (document.id === id) {

                        const piece = document.data();

                        titleInput.value = piece.title || "";

                        categoryInput.value = piece.category || "";

                        contentInput.value = piece.content || "";

                        editingId = id;

                        publishBtn.textContent = "Update Piece";

                        window.scrollTo({

                            top: 0,

                            behavior: "smooth"

                        });

                    }

                });

            }

            catch (error) {

                console.error(error);

                alert("Unable to load the selected piece.");

            }

        });

    });

}
// ===========================================
// PART 5
// DELETE PIECE
// ===========================================

function attachDeleteEvents() {

    const deleteButtons = document.querySelectorAll(".delete-btn");

    deleteButtons.forEach((button) => {

        button.addEventListener("click", async () => {

            const id = button.dataset.id;

            const confirmDelete = confirm(
                "Are you sure you want to permanently delete this literary piece?"
            );

            if (!confirmDelete) {

                return;

            }

            try {

                await deleteDoc(

                    doc(db, "pieces", id)

                );

                // If the deleted piece was being edited,
                // reset the editor.

                if (editingId === id) {

                    resetForm();

                }

                alert("Piece deleted successfully.");

                loadPieces();

            }

            catch (error) {

                console.error(error);

                alert("Unable to delete the selected piece.");

            }

        });

    });

}

// ===========================================
// END OF FILE
// ===========================================
