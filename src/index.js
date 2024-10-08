import { initializeApp } from "firebase/app";
import { getFirestore, collection, getDocs, addDoc, deleteDoc, doc, query, where, orderBy, serverTimestamp, updateDoc } from "firebase/firestore";

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

// Function to format timestamp
const formatTimestamp = (timestamp) => {
    if (!timestamp) return "";
    const date = timestamp.toDate(); // Convert Firestore Timestamp to Date
    return date.toLocaleString(); // Format date as a readable string
};

// Function to display movies in the table
const displayMovies = async (category = '', sortBy = 'name:asc') => {
    try {
        let qRef = collectionRef;

        if (category) {
            qRef = query(collectionRef, where("category", "==", category));
        }

        // Apply sorting
        const [field, direction] = sortBy.split(':');
        qRef = query(qRef, orderBy(field, direction));

        const data = await getDocs(qRef);
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
                <td>${movie.category}</td>
                <td>${formatTimestamp(movie.createAt)}</td>
                <td>${formatTimestamp(movie.updatedAt)}</td>
                <td>
                    <button class="edit-btn btn btn-link" data-id="${movie.id}" data-name="${movie.name}" data-description="${movie.description}" data-category="${movie.category}">
                        <i class="bi bi-pencil"></i>
                    </button>
                    <button class="delete-btn btn btn-link" data-id="${movie.id}">
                        <i class="bi bi-trash"></i>
                    </button>
                </td>
            `;
            tableBody.appendChild(row);
        });

        // Add event listeners for delete and edit buttons
        document.querySelectorAll(".delete-btn").forEach(button => {
            button.addEventListener("click", async () => {
                const id = button.getAttribute("data-id");
                const documentReference = doc(db, "movies", id);
                try {
                    await deleteDoc(documentReference);
                    displayMovies(document.querySelector("#category-filter").value, document.querySelector("#sort-by").value); // Refresh the table
                    alert("Movie deleted successfully!"); // Success alert
                } catch (error) {
                    console.error("Error deleting document:", error);
                }
            });
        });

        document.querySelectorAll(".edit-btn").forEach(button => {
            button.addEventListener("click", () => {
                const id = button.getAttribute("data-id");
                const name = button.getAttribute("data-name");
                const description = button.getAttribute("data-description");
                const category = button.getAttribute("data-category");

                const editForm = document.querySelector("#edit-form");
                editForm.id.value = id;
                editForm.name.value = name;
                editForm.description.value = description;
                editForm.category.value = category;

                const modal = document.querySelector("#edit-modal");
                modal.style.display = "block";
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
            description: addForm.description.value,
            category: addForm.category.value,
            createAt: serverTimestamp(),
            updatedAt: serverTimestamp()
        });
        addForm.reset();
        displayMovies(document.querySelector("#category-filter").value, document.querySelector("#sort-by").value); // Refresh the table
        alert("Movie added successfully!"); // Success alert
    } catch (error) {
        console.error("Error adding document:", error);
    }
});

// Handle category filter change
document.querySelector("#category-filter").addEventListener("change", e => {
    const selectedCategory = e.target.value;
    displayMovies(selectedCategory, document.querySelector("#sort-by").value); // Refresh the table based on selected category
});

// Handle sort change
document.querySelector("#sort-by").addEventListener("change", e => {
    const selectedSort = e.target.value;
    displayMovies(document.querySelector("#category-filter").value, selectedSort); // Refresh the table based on selected sort option
});

// Handle edit form submission
const editForm = document.querySelector("#edit-form");
editForm.addEventListener("submit", async e => {
    e.preventDefault();
    try {
        const id = editForm.id.value;
        const documentReference = doc(db, "movies", id);
        await updateDoc(documentReference, {
            name: editForm.name.value,
            description: editForm.description.value,
            category: editForm.category.value,
            updatedAt: serverTimestamp()
        });
        document.querySelector("#edit-modal").style.display = "none";
        displayMovies(document.querySelector("#category-filter").value, document.querySelector("#sort-by").value); // Refresh the table
        alert("Movie updated successfully!"); // Success alert
    } catch (error) {
        console.error("Error updating document:", error);
    }
});

// Handle modal close
document.querySelector(".close").addEventListener("click", () => {
    document.querySelector("#edit-modal").style.display = "none";
});

// Close modal when clicking outside of it
window.addEventListener("click", (event) => {
    if (event.target === document.querySelector("#edit-modal")) {
        document.querySelector("#edit-modal").style.display = "none";
    }
});
