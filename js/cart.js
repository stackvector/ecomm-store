// ─────────────────────────────────────────────
//  cart.js
//  Cart stored in localStorage for guests.
//  When user logs in → cart is merged into Firestore and synced.
// ─────────────────────────────────────────────

const CART_KEY = "kala_bazaar_cart";

// ── Read / write localStorage ──
function readLocal() {
  try { return JSON.parse(localStorage.getItem(CART_KEY)) || []; }
  catch { return []; }
}
function writeLocal(items) {
  localStorage.setItem(CART_KEY, JSON.stringify(items));
}

// ── Firestore helpers (only called when user is logged in) ──
async function getFirestoreCart(uid) {
  try {
    const { db } = await import('./firebase-config.js');
    const { doc, getDoc } = await import("https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js");
    const ref = doc(db, "users", uid, "cart", "items");
    const snap = await getDoc(ref);
    return snap.exists() ? (snap.data().items || []) : [];
  } catch { return []; }
}

async function saveFirestoreCart(uid, items) {
  try {
    const { db } = await import('./firebase-config.js');
    const { doc, setDoc } = await import("https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js");
    await setDoc(doc(db, "users", uid, "cart", "items"), { items, updatedAt: Date.now() });
  } catch (e) { console.warn("Cart sync error:", e.message); }
}

// ── Merge two cart arrays (local wins on qty) ──
function mergeCarts(local, remote) {
  const map = {};
  remote.forEach(item => { map[item.id + (item.variant || "")] = { ...item }; });
  local.forEach(item => {
    const key = item.id + (item.variant || "");
    if (map[key]) map[key].qty = Math.max(map[key].qty, item.qty);
    else map[key] = { ...item };
  });
  return Object.values(map);
}

// ── Public API ──
export const Cart = {
  _uid: null,
  _listeners: [],

  // Call from auth.js when login state changes
  async onAuthChange(uid) {
    this._uid = uid || null;
    if (uid) {
      const local = readLocal();
      const remote = await getFirestoreCart(uid);
      const merged = local.length ? mergeCarts(local, remote) : remote;
      writeLocal(merged);
      await saveFirestoreCart(uid, merged);
    }
    this._notify();
  },

  async getItems() {
    if (this._uid) {
      const remote = await getFirestoreCart(this._uid);
      writeLocal(remote);
      return remote;
    }
    return readLocal();
  },

  async addItem(product, variant = null, qty = 1) {
    const items = readLocal();
    const key = product.id + (variant || "");
    const existing = items.find(i => i.id + (i.variant || "") === key);
    if (existing) {
      existing.qty += qty;
    } else {
      items.push({
        id: product.id,
        name: product.name,
        price: product.price,
        image: product.images[0],
        variant: variant,
        qty
      });
    }
    writeLocal(items);
    if (this._uid) await saveFirestoreCart(this._uid, items);
    this._notify();
    showToast(`${product.name} added to cart`);
  },

  async removeItem(productId, variant = null) {
    let items = readLocal();
    items = items.filter(i => !(i.id === productId && (i.variant || null) === variant));
    writeLocal(items);
    if (this._uid) await saveFirestoreCart(this._uid, items);
    this._notify();
  },

  async updateQty(productId, variant, newQty) {
    let items = readLocal();
    if (newQty < 1) { return this.removeItem(productId, variant); }
    items = items.map(i =>
      i.id === productId && (i.variant || null) === (variant || null) ? { ...i, qty: newQty } : i
    );
    writeLocal(items);
    if (this._uid) await saveFirestoreCart(this._uid, items);
    this._notify();
  },

  async clear() {
    writeLocal([]);
    if (this._uid) await saveFirestoreCart(this._uid, []);
    this._notify();
  },

  getTotal(items) {
    return items.reduce((sum, i) => sum + i.price * i.qty, 0);
  },

  getCount(items) {
    return items.reduce((sum, i) => sum + i.qty, 0);
  },

  onChange(fn) { this._listeners.push(fn); },
  _notify() { this._listeners.forEach(fn => fn()); }
};

// ── Toast helper ──
function showToast(msg) {
  let el = document.getElementById("toast");
  if (!el) {
    el = document.createElement("div");
    el.id = "toast";
    document.body.appendChild(el);
  }
  el.textContent = msg;
  el.classList.add("show");
  clearTimeout(el._t);
  el._t = setTimeout(() => el.classList.remove("show"), 2800);
}

// ── Cart Sidebar renderer ──
export function initCartSidebar() {
  const sidebar  = document.getElementById("cart-sidebar");
  const overlay  = document.getElementById("cart-overlay");
  const itemsEl  = document.getElementById("cart-items");
  const totalEl  = document.getElementById("cart-total");
  const countEls = document.querySelectorAll(".cart-count");
  const checkoutBtn = document.getElementById("cart-checkout-btn");

  function openCart() {
    sidebar?.classList.add("open");
    overlay?.classList.add("open");
    document.body.style.overflow = "hidden";
    renderCart();
  }
  function closeCart() {
    sidebar?.classList.remove("open");
    overlay?.classList.remove("open");
    document.body.style.overflow = "";
  }

  document.querySelectorAll("[data-open-cart]").forEach(el => el.addEventListener("click", openCart));
  overlay?.addEventListener("click", closeCart);
  document.getElementById("cart-close")?.addEventListener("click", closeCart);

  async function renderCart() {
    const items = await Cart.getItems();
    const count = Cart.getCount(items);
    const total = Cart.getTotal(items);

    countEls.forEach(el => {
      el.textContent = count;
      el.style.display = count > 0 ? "flex" : "none";
    });

    if (!itemsEl) return;

    if (items.length === 0) {
      itemsEl.innerHTML = `<div class="cart-empty">Your cart is empty<small>Browse our collection and add something beautiful</small></div>`;
      if (totalEl) totalEl.textContent = "₹0";
      if (checkoutBtn) checkoutBtn.style.display = "none";
      return;
    }

    if (checkoutBtn) checkoutBtn.style.display = "block";
    if (totalEl) totalEl.textContent = "₹" + total.toLocaleString("en-IN");

    itemsEl.innerHTML = "";
    items.forEach(item => {
      const div = document.createElement("div");
      div.className = "cart-item";
      div.innerHTML = `
        <img class="cart-item-img" src="${item.image}" alt="${item.name}" />
        <div class="cart-item-details">
          <div class="cart-item-name">${item.name}</div>
          ${item.variant ? `<div class="cart-item-variant">${item.variant}</div>` : ""}
          <div class="cart-item-price">₹${(item.price * item.qty).toLocaleString("en-IN")}</div>
          <div class="cart-item-controls">
            <button class="qty-btn" data-action="dec">−</button>
            <span class="qty-display">${item.qty}</span>
            <button class="qty-btn" data-action="inc">+</button>
            <button class="cart-item-remove" data-action="remove">Remove</button>
          </div>
        </div>
      `;
      div.querySelector('[data-action="inc"]').addEventListener("click", () => Cart.updateQty(item.id, item.variant, item.qty + 1));
      div.querySelector('[data-action="dec"]').addEventListener("click", () => Cart.updateQty(item.id, item.variant, item.qty - 1));
      div.querySelector('[data-action="remove"]').addEventListener("click", () => Cart.removeItem(item.id, item.variant));
      itemsEl.appendChild(div);
    });
  }

  Cart.onChange(renderCart);
  renderCart();
  return { openCart, closeCart };
}
