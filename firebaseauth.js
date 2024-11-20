// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.2/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/11.0.2/firebase-analytics.js";
import { 
    getAuth, 
    createUserWithEmailAndPassword, 
    signInWithEmailAndPassword, 
    signInWithPopup,
    GoogleAuthProvider,
    signOut
} from "https://www.gstatic.com/firebasejs/11.0.2/firebase-auth.js";
import { getFirestore, setDoc, doc } from "https://www.gstatic.com/firebasejs/11.0.2/firebase-firestore.js";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCeIXLEB_w5fUYTSAuahLsDCaNeT7DDaEM",
  authDomain: "mindful-oasis-1b536.firebaseapp.com",
  projectId: "mindful-oasis-1b536",
  storageBucket: "mindful-oasis-1b536.firebasestorage.app",
  messagingSenderId: "260746362085",
  appId: "1:260746362085:web:18b7bc48d309ee1367a80c",
  measurementId: "G-G4XKV8C3MD"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth();
const db = getFirestore();
const googleProvider = new GoogleAuthProvider();

// Sign Up with Email/Password
document.getElementById("signup_btn").addEventListener('click', async (event) => {
    event.preventDefault();
    const fullName = document.getElementById("signup_fullName").value;
    const email = document.getElementById("signup_email").value;
    const password = document.getElementById("signup_password").value;

    try {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;
        
        await setDoc(doc(db, "users", user.uid), {
            fullName: fullName,
            email: email,
            createdAt: new Date().toISOString()
        });

        // Clear input fields
        document.getElementById("signup_fullName").value = '';
        document.getElementById("signup_email").value = '';
        document.getElementById("signup_password").value = '';

        alert("Sign up successful!");
        document.getElementById("signupModal").classList.remove('show');
        updateUIForLoggedInUser(user);
    } catch (error) {
        alert("Error: " + error.message);
    }
});

// Login with Email/Password
document.getElementById("login_btn").addEventListener('click', async (event) => {
    event.preventDefault();
    const email = document.getElementById("login_email").value;
    const password = document.getElementById("login_password").value;

    try {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        
        // Clear input fields
        document.getElementById("login_email").value = '';
        document.getElementById("login_password").value = '';

        alert("Login successful!");
        document.getElementById("loginModal").classList.remove('show');
        updateUIForLoggedInUser(userCredential.user);
    } catch (error) {
        alert("Error: " + error.message);
    }
});

// Google Sign In
document.querySelectorAll('.google').forEach(button => {
    button.addEventListener('click', async () => {
        try {
            const result = await signInWithPopup(auth, googleProvider);
            const user = result.user;
            
            // Store user data in Firestore
            await setDoc(doc(db, "users", user.uid), {
                fullName: user.displayName,
                email: user.email,
                createdAt: new Date().toISOString()
            }, { merge: true });

            alert("Google sign in successful!");
            document.getElementById("loginModal").classList.remove('show');
            document.getElementById("signupModal").classList.remove('show');
            updateUIForLoggedInUser(user);
        } catch (error) {
            alert("Error: " + error.message);
        }
    });
});

// Logout
document.getElementById("logout-btn").addEventListener('click', async () => {
    try {
        await signOut(auth);
        
        // Clear all input fields
        document.getElementById("login_email").value = '';
        document.getElementById("login_password").value = '';
        document.getElementById("signup_fullName").value = '';
        document.getElementById("signup_email").value = '';
        document.getElementById("signup_password").value = '';

        updateUIForLoggedOutUser();
        alert("Logged out successfully!");
    } catch (error) {
        alert("Error logging out: " + error.message);
    }
});

// Update UI based on auth state
function updateUIForLoggedInUser(user) {
    document.getElementById("loginTrigger").style.display = "none";
    document.getElementById("signupTrigger").style.display = "none";
    document.getElementById("logout-btn").style.display = "block";
}

function updateUIForLoggedOutUser() {
    document.getElementById("loginTrigger").style.display = "block";
    document.getElementById("signupTrigger").style.display = "block";
    document.getElementById("logout-btn").style.display = "none";
}

// Listen for auth state changes
auth.onAuthStateChanged((user) => {
    if (user) {
        updateUIForLoggedInUser(user);
    } else {
        updateUIForLoggedOutUser();
    }
});