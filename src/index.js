import { initializeApp } from "firebase/app";
import { getFirestore, collection, getDocs, addDoc, deleteDoc, doc } from "firebase/firestore";

// Initialize Firebase
const firebaseConfig = {
    apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
    authDomain: "fir-course-cff74.firebaseapp.com",
    projectId: "fir-course-cff74",
    storageBucket: "fir-course-cff74.appspot.com",
    messagingSenderId: "596377563084",
    appId: "1:596377563084:web:4a321f7a36c148c7f23769"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const collectionRef = collection(db, 'movies');

// Function to display movies in the table
const displayMovies = async () => {
    try {
        const data = await getDocs(collectionRef);
        const movies = data.docs.map(document => ({
            ...document.data(),
            id: document.id
        }));

        const tableBody = document.querySelector("#movies-table tbody");
        tableBody.innerHTML = ""; // Clear existing rows

        movies.forEach(movie => {
            const row = document.createElement("tr");
            row.innerHTML = `
                <td>${movie.name}</td>
                <td>${movie.description}</td>
                <td><button class="delete-btn btn btn-link" data-id="${movie.id}"><i class="bi bi-trash"></i></button></td>
            `;
            tableBody.appendChild(row);
        });

        // Add event listeners for delete buttons
        document.querySelectorAll(".delete-btn").forEach(button => {
            button.addEventListener("click", async () => {
                const id = button.getAttribute("data-id");
                const documentReference = doc(db, "movies", id);
                try {
                    await deleteDoc(documentReference);
                    displayMovies(); // Refresh the table
                    alert("Movie deleted successfully!"); // Success alert
                } catch (error) {
                    console.error("Error deleting document:", error);
                }
            });
        });

    } catch (error) {
        console.error("Error fetching documents:", error);
    }
};

// Initial load
displayMovies();

// Add movie form submission
const addForm = document.querySelector(".add");
addForm.addEventListener("submit", async e => {
    e.preventDefault();
    try {
        await addDoc(collectionRef, {
            name: addForm.name.value,
            description: addForm.description.value
        });
        addForm.reset();
        displayMovies(); // Refresh the table
        alert("Movie added successfully!"); // Success alert
    } catch (error) {
        console.error("Error adding document:", error);
    }
});
