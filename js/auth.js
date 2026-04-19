// ─────────────────────────────────────────────
//  auth.js
//  Firebase Auth: Google sign-in + email/password
//  Manages session state, updates UI, syncs with Cart
// ─────────────────────────────────────────────

import { Cart } from './cart.js';

let _auth = null;
let _currentUser = null;

async function getAuth() {
  if (_auth) return _auth;
  try {
    const { auth, isFirebaseConfigured } = await import('./firebase-config.js');
    if (!isFirebaseConfigured || !auth) return null;
    _auth = auth;
    return _auth;
  } catch { return null; }
}

// ── Session observer ──
export async function initAuth() {
  const auth = await getAuth();
  if (!auth) { console.warn("Firebase Auth not configured."); return; }

  const { onAuthStateChanged } = await import("https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js");

  onAuthStateChanged(auth, async (user) => {
    _currentUser = user;
    await Cart.onAuthChange(user ? user.uid : null);
    updateAuthUI(user);
    window.dispatchEvent(new CustomEvent("auth-state-changed", { detail: { user } }));
    if (user) {
      window.dispatchEvent(new CustomEvent("user-logged-in", { detail: { user } }));
    }
  });
}

function updateAuthUI(user) {
  if (user) {
    document.body.classList.add("user-logged-in");
    document.querySelectorAll(".user-display-name").forEach(el => el.textContent = user.displayName || user.email);
    document.querySelectorAll(".user-avatar").forEach(el => {
      if (user.photoURL) {
        el.src = user.photoURL;
        el.style.display = "block";
      }
    });
  } else {
    document.body.classList.remove("user-logged-in");
  }
}

// ── Google sign-in ──
export async function signInWithGoogle() {
  const auth = await getAuth();
  if (!auth) { alert("Firebase not configured yet."); return; }
  const { GoogleAuthProvider, signInWithPopup } = await import("https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js");
  const provider = new GoogleAuthProvider();
  try {
    await signInWithPopup(auth, provider);
    closeLoginModal();
  } catch (e) {
    showAuthError(e.message);
  }
}

// ── Email / password ──
export async function signInWithEmail(email, password) {
  const auth = await getAuth();
  if (!auth) { alert("Firebase not configured yet."); return; }
  const { signInWithEmailAndPassword } = await import("https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js");
  try {
    await signInWithEmailAndPassword(auth, email, password);
    closeLoginModal();
  } catch (e) {
    showAuthError(friendlyError(e.code));
  }
}

export async function registerWithEmail(email, password, displayName) {
  const auth = await getAuth();
  if (!auth) { alert("Firebase not configured yet."); return; }
  const { createUserWithEmailAndPassword, updateProfile } = await import("https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js");
  try {
    const cred = await createUserWithEmailAndPassword(auth, email, password);
    if (displayName) await updateProfile(cred.user, { displayName });
    await setUserRole(cred.user.uid, "customer");
    closeLoginModal();
  } catch (e) {
    showAuthError(friendlyError(e.code));
  }
}

// ── Role management (for future admin system) ──
async function setUserRole(uid, role) {
  try {
    const { db } = await import('./firebase-config.js');
    const { doc, setDoc, serverTimestamp } = await import("https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js");
    await setDoc(doc(db, "users", uid), { role, createdAt: serverTimestamp() }, { merge: true });
  } catch (e) { console.warn("Could not set user role:", e.message); }
}

export async function isAdmin() {
  if (!_currentUser) return false;
  try {
    const { db } = await import('./firebase-config.js');
    const { doc, getDoc } = await import("https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js");
    const snap = await getDoc(doc(db, "users", _currentUser.uid));
    return snap.exists() && snap.data().role === "admin";
  } catch { return false; }
}

// ── Sign out ──
export async function signOut() {
  const auth = await getAuth();
  if (!auth) return;
  const { signOut: fbSignOut } = await import("https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js");
  await fbSignOut(auth);
}

export function getCurrentUser() { return _currentUser; }

// ── Login Modal ──
export function initLoginModal() {
  const overlay = document.getElementById("login-modal-overlay");
  if (!overlay) return;

  const closeBtn   = overlay.querySelector(".login-modal-close");
  const googleBtn  = document.getElementById("btn-google-signin");
  const loginForm  = document.getElementById("login-form");
  const registerForm = document.getElementById("register-form");
  const toRegister = document.getElementById("to-register");
  const toLogin    = document.getElementById("to-login");

  closeBtn?.addEventListener("click", closeLoginModal);
  overlay.addEventListener("click", e => { if (e.target === overlay) closeLoginModal(); });

  googleBtn?.addEventListener("click", signInWithGoogle);

  loginForm?.addEventListener("submit", async e => {
    e.preventDefault();
    const email = loginForm.querySelector('[name="email"]').value;
    const pass  = loginForm.querySelector('[name="password"]').value;
    await signInWithEmail(email, pass);
  });

  registerForm?.addEventListener("submit", async e => {
    e.preventDefault();
    const name  = registerForm.querySelector('[name="name"]').value;
    const email = registerForm.querySelector('[name="email"]').value;
    const pass  = registerForm.querySelector('[name="password"]').value;
    await registerWithEmail(email, pass, name);
  });

  toRegister?.addEventListener("click", e => {
    e.preventDefault();
    loginForm?.classList.add("hidden");
    registerForm?.classList.remove("hidden");
  });
  toLogin?.addEventListener("click", e => {
    e.preventDefault();
    registerForm?.classList.add("hidden");
    loginForm?.classList.remove("hidden");
  });

  // Open modal triggers
  document.querySelectorAll("[data-open-login]").forEach(el => {
    el.addEventListener("click", () => openLoginModal());
  });

  // Sign-out triggers
  document.querySelectorAll("[data-signout]").forEach(el => {
    el.addEventListener("click", async () => { await signOut(); });
  });
}

export function openLoginModal() {
  document.getElementById("login-modal-overlay")?.classList.add("open");
  document.body.style.overflow = "hidden";
}
function closeLoginModal() {
  document.getElementById("login-modal-overlay")?.classList.remove("open");
  document.body.style.overflow = "";
  clearAuthError();
}

function showAuthError(msg) {
  document.querySelectorAll(".auth-error").forEach(el => {
    el.textContent = msg;
    el.style.display = "block";
  });
}
function clearAuthError() {
  document.querySelectorAll(".auth-error").forEach(el => el.style.display = "none");
}

function friendlyError(code) {
  const map = {
    "auth/wrong-password": "Incorrect password. Please try again.",
    "auth/user-not-found": "No account found with this email.",
    "auth/email-already-in-use": "This email is already registered. Please log in.",
    "auth/weak-password": "Password should be at least 6 characters.",
    "auth/invalid-email": "Please enter a valid email address.",
    "auth/popup-closed-by-user": "Sign-in cancelled.",
  };
  return map[code] || "Something went wrong. Please try again.";
}
