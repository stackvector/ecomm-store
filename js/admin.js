// ─────────────────────────────────────────────
//  admin.js — STUB (not used yet)
//  Foundation for the admin panel.
//  Uncomment and build out when ready.
// ─────────────────────────────────────────────

// To make a user admin:
// In Firebase Console → Firestore → users → {uid} → set role: "admin"

/*
import { db } from './firebase-config.js';
import { collection, addDoc, updateDoc, deleteDoc, doc } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";
import { isAdmin } from './auth.js';

export async function adminAddProduct(productData) {
  if (!await isAdmin()) throw new Error("Unauthorised");
  return addDoc(collection(db, "products"), { ...productData, createdAt: Date.now() });
}

export async function adminUpdateProduct(id, updates) {
  if (!await isAdmin()) throw new Error("Unauthorised");
  return updateDoc(doc(db, "products", id), updates);
}

export async function adminDeleteProduct(id) {
  if (!await isAdmin()) throw new Error("Unauthorised");
  return deleteDoc(doc(db, "products", id));
}

export async function adminGetOrders() {
  if (!await isAdmin()) throw new Error("Unauthorised");
  const { getDocs, query, orderBy } = await import("...");
  const snap = await getDocs(query(collection(db, "orders"), orderBy("createdAt", "desc")));
  return snap.docs.map(d => ({ id: d.id, ...d.data() }));
}
*/

export const ADMIN_STUB = true; // placeholder export so file is importable
