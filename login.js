// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.13.1/firebase-app.js";
import { getAuth, signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.13.1/firebase-auth.js";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyB4WlwB5TI8Nar1cXOCGmiL7mSKwsN3F30",
  authDomain: "list-vocabulary.firebaseapp.com",
  projectId: "list-vocabulary",
  storageBucket: "list-vocabulary.appspot.com",
  messagingSenderId: "1087901987862",
  appId: "1:1087901987862:web:55660d3473cc60e2157137"
};

// Initialize Firebase

const app = initializeApp(firebaseConfig);
const auth = getAuth();

// check-register
const form_register = document.querySelector('#form-register');
const rePassword = document.querySelector('#re_password');
const button = document.querySelector('#button-register');

button.addEventListener('click', function (e) {
    const fullName = document.querySelector('#fullname').value;
    const email = document.querySelector('#email').value;
    const password = document.querySelector('#password').value;
    e.preventDefault();
    signInWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
            // Signed in 
            const user = userCredential.user;
            alert('Sign in successfully');
            window.location.href = 'vocabulary.html';
            // ...
        })
        .catch((error) => {
            const errorCode = error.code;
            const errorMessage = error.message;
            alert(errorMessage);
        });
});

