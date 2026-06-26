import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.2/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/11.0.2/firebase-analytics.js";
import {
    getAuth,
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signInWithPopup,
    GoogleAuthProvider,
    signOut,
    sendPasswordResetEmail,
    onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/11.0.2/firebase-auth.js";
import { getFirestore, setDoc, doc } from "https://www.gstatic.com/firebasejs/11.0.2/firebase-firestore.js";

const firebaseConfig = {
    apiKey: "AIzaSyCeIXLEB_w5fUYTSAuahLsDCaNeT7DDaEM",
    authDomain: "mindful-oasis-1b536.firebaseapp.com",
    projectId: "mindful-oasis-1b536",
    storageBucket: "mindful-oasis-1b536.firebasestorage.app",
    messagingSenderId: "260746362085",
    appId: "1:260746362085:web:18b7bc48d309ee1367a80c",
    measurementId: "G-G4XKV8C3MD"
};

const app = initializeApp(firebaseConfig);
getAnalytics(app);
const auth = getAuth();
const db = getFirestore();
const googleProvider = new GoogleAuthProvider();

function showAuthMessage(elementId, message, isError = true) {
    const el = document.getElementById(elementId);
    if (!el) return;
    el.textContent = message;
    el.classList.toggle("auth-message--error", isError);
    el.classList.toggle("auth-message--success", !isError);
    el.hidden = !message;
}

function clearAuthMessages() {
    showAuthMessage("loginAuthMessage", "", true);
    showAuthMessage("signupAuthMessage", "", true);
    document.getElementById("loginAuthMessage").hidden = true;
    document.getElementById("signupAuthMessage").hidden = true;
}

function closeAuthModals() {
    document.getElementById("loginModal")?.classList.remove("show");
    document.getElementById("signupModal")?.classList.remove("show");
    document.getElementById("loginModal")?.setAttribute("hidden", "");
    document.getElementById("signupModal")?.setAttribute("hidden", "");
}

function clearAuthFields() {
    document.getElementById("login_email").value = "";
    document.getElementById("login_password").value = "";
    document.getElementById("signup_fullName").value = "";
    document.getElementById("signup_email").value = "";
    document.getElementById("signup_password").value = "";
}

async function persistUserProfile(user, fullName) {
    await setDoc(doc(db, "users", user.uid), {
        fullName: fullName || user.displayName || "",
        email: user.email,
        updatedAt: new Date().toISOString()
    }, { merge: true });
}

function updateUIForLoggedInUser() {
    document.getElementById("loginTrigger").style.display = "none";
    document.getElementById("signupTrigger").style.display = "none";
    document.getElementById("logout-btn").style.display = "block";
}

function updateUIForLoggedOutUser() {
    document.getElementById("loginTrigger").style.display = "block";
    document.getElementById("signupTrigger").style.display = "block";
    document.getElementById("logout-btn").style.display = "none";
}

document.getElementById("signupForm")?.addEventListener("submit", async (event) => {
    event.preventDefault();
    clearAuthMessages();

    const fullName = document.getElementById("signup_fullName").value.trim();
    const email = document.getElementById("signup_email").value.trim();
    const password = document.getElementById("signup_password").value;

    try {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        await setDoc(doc(db, "users", userCredential.user.uid), {
            fullName,
            email,
            createdAt: new Date().toISOString()
        });
        clearAuthFields();
        showAuthMessage("signupAuthMessage", "Account created successfully. Welcome to Mindful Oasis!", false);
        closeAuthModals();
    } catch (error) {
        showAuthMessage("signupAuthMessage", error.message);
    }
});

document.getElementById("loginForm")?.addEventListener("submit", async (event) => {
    event.preventDefault();
    clearAuthMessages();

    const email = document.getElementById("login_email").value.trim();
    const password = document.getElementById("login_password").value;

    try {
        await signInWithEmailAndPassword(auth, email, password);
        clearAuthFields();
        showAuthMessage("loginAuthMessage", "Signed in successfully.", false);
        closeAuthModals();
    } catch (error) {
        showAuthMessage("loginAuthMessage", error.message);
    }
});

document.querySelectorAll(".oauth-btn--google").forEach((button) => {
    button.addEventListener("click", async () => {
        clearAuthMessages();

        try {
            const result = await signInWithPopup(auth, googleProvider);
            await persistUserProfile(result.user);
            clearAuthFields();
            closeAuthModals();
        } catch (error) {
            const messageTarget = document.getElementById("signupModal")?.classList.contains("show")
                ? "signupAuthMessage"
                : "loginAuthMessage";
            showAuthMessage(messageTarget, error.message);
        }
    });
});

document.getElementById("forgotPasswordBtn")?.addEventListener("click", async () => {
    clearAuthMessages();
    const email = document.getElementById("login_email").value.trim();

    if (!email) {
        showAuthMessage("loginAuthMessage", "Enter your Mindful Oasis email address above, then click Forgot password.");
        document.getElementById("login_email").focus();
        return;
    }

    try {
        await sendPasswordResetEmail(auth, email);
        showAuthMessage("loginAuthMessage", "Password reset email sent. Check your inbox.", false);
    } catch (error) {
        showAuthMessage("loginAuthMessage", error.message);
    }
});

document.getElementById("logout-btn")?.addEventListener("click", async () => {
    try {
        await signOut(auth);
        clearAuthFields();
        clearAuthMessages();
    } catch (error) {
        console.error("Sign out failed:", error.message);
    }
});

onAuthStateChanged(auth, (user) => {
    if (user) {
        updateUIForLoggedInUser();
    } else {
        updateUIForLoggedOutUser();
    }
});
