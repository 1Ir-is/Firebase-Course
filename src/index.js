import { initializeApp } from "firebase/app";
import { getFirestore, collection, getDocs } from "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyAqKoTwK4qLUy34m-48cDcN8n-16VE3xQI",
    authDomain: "fir-course-cff74.firebaseapp.com",
    projectId: "fir-course-cff74",
    storageBucket: "fir-course-cff74.appspot.com",
    messagingSenderId: "596377563084",
    appId: "1:596377563084:web:4a321f7a36c148c7f23769"
};

const app = initializeApp(firebaseConfig);

const db = getFirestore(app);

const collectionRef = collection(db, 'movies');

getDocs(collectionRef)
    .then(data => {
        let movies = [];
        data.docs.forEach(document => {
            movies.push({
                ...document.data(),
                id: document.id
            });
        });
        console.log(movies);
    })
    .catch(error => {
        console.log(error);
    });

