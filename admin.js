// ==========================================
// CIWROTE
// Admin Writing Desk
// ==========================================

import { db, auth } from "./firebase.js";

import {

    collection,
    addDoc,
    getDocs,
    doc,
    getDoc,
    updateDoc,
    deleteDoc,
    query,
    orderBy,
    serverTimestamp

} from "https://www.gstatic.com/firebasejs/11.0.2/firebase-firestore.js";


import {

    onAuthStateChanged,
    signOut

} from "https://www.gstatic.com/firebasejs/11.0.2/firebase-auth.js";



// ==========================================
// ELEMENTS
// ==========================================

const titleInput = document.getElementById("title");

const categoryInput = document.getElementById("category");

const contentInput = document.getElementById("content");

const saveBtn = document.getElementById("saveBtn");

const pieceList = document.getElementById("pieceList");

const status = document.getElementById("status");

const logoutBtn = document.getElementById("logoutBtn");



// ==========================================
// VARIABLES
// ==========================================

let editingId = null;



// ==========================================
// AUTH CHECK
// ==========================================

onAuthStateChanged(auth, (user)=>{


    if(!user){

        window.location.href="login.html";

        return;

    }


    loadPieces();


});



// ==========================================
// LOGOUT
// ==========================================

logoutBtn.addEventListener("click", async()=>{


    await signOut(auth);


    window.location.href="login.html";


});



// ==========================================
// SAVE PIECE
// ==========================================

saveBtn.addEventListener("click", async()=>{


    const title = titleInput.value.trim();

    const category = categoryInput.value;

    const content = contentInput.value.trim();



    if(!title || !content){


        status.textContent =
        "Please complete your piece.";


        return;

    }



    saveBtn.disabled=true;

    saveBtn.textContent="Saving...";



    try{


        if(editingId){


            await updateDoc(

                doc(db,"pieces",editingId),

                {

                    title,

                    category,

                    content,

                    updatedAt:serverTimestamp()

                }

            );


            status.textContent =
            "Piece updated.";


        }


        else{


            await addDoc(

                collection(db,"pieces"),

                {


                    title,

                    category,

                    content,

                    date:new Date().toLocaleDateString(
                        "en-US",
                        {
                            year:"numeric",
                            month:"long",
                            day:"numeric"
                        }
                    ),


                    createdAt:serverTimestamp(),

                    updatedAt:serverTimestamp()


                }

            );


            status.textContent =
            "Piece published.";


        }



        clearForm();

        loadPieces();



    }


    catch(error){


        console.error(error);


        status.textContent =
        "Something went wrong.";


    }



    finally{


        saveBtn.disabled=false;

        saveBtn.textContent="Publish";


    }



});



// ==========================================
// LOAD PIECES
// ==========================================

async function loadPieces(){


    pieceList.innerHTML="Loading...";



    try{


        const q=query(

            collection(db,"pieces"),

            orderBy("createdAt","desc")

        );



        const snapshot=await getDocs(q);



        pieceList.innerHTML="";



        if(snapshot.empty){


            pieceList.innerHTML=

            "<p>No pieces yet.</p>";


            return;


        }



        snapshot.forEach((document)=>{


            const piece=document.data();



            pieceList.innerHTML += `

                <article class="admin-piece">


                    <h3>

                        ${piece.title}

                    </h3>


                    <small>

                        ${piece.category || ""}

                    </small>


                    <div class="actions">


                        <button
                        class="edit-btn"
                        data-id="${document.id}">

                            Edit

                        </button>



                        <button
                        class="delete-btn"
                        data-id="${document.id}">

                            Delete

                        </button>


                    </div>


                </article>

            `;


        });



        attachButtons();



    }


    catch(error){


        console.error(error);


        pieceList.innerHTML =
        "Unable to load pieces.";


    }


}



// ==========================================
// BUTTON EVENTS
// ==========================================

function attachButtons(){


    document.querySelectorAll(".edit-btn")
    .forEach(button=>{


        button.addEventListener("click",()=>{

            editPiece(button.dataset.id);

        });


    });



    document.querySelectorAll(".delete-btn")
    .forEach(button=>{


        button.addEventListener("click",()=>{

            deletePiece(button.dataset.id);

        });


    });


}



// ==========================================
// EDIT
// ==========================================

async function editPiece(id){


    const snap = await getDoc(

        doc(db,"pieces",id)

    );



    if(snap.exists()){


        const piece=snap.data();



        titleInput.value=piece.title;

        categoryInput.value=piece.category;

        contentInput.value=piece.content;



        editingId=id;


        saveBtn.textContent="Update";


        window.scrollTo({

            top:0,

            behavior:"smooth"

        });


    }


}



// ==========================================
// DELETE
// ==========================================

async function deletePiece(id){


    const confirmDelete =
    confirm(
        "Delete this piece permanently?"
    );


    if(!confirmDelete){

        return;

    }



    await deleteDoc(

        doc(db,"pieces",id)

    );



    loadPieces();


}



// ==========================================
// CLEAR FORM
// ==========================================

function clearForm(){


    titleInput.value="";

    categoryInput.value="";

    contentInput.value="";


    editingId=null;


}
