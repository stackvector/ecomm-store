// ─────────────────────────────────────────────
//  checkout.js
//  Builds a WhatsApp order message and opens wa.me link
// ─────────────────────────────────────────────

import { Cart } from './cart.js';

// ── Replace with your WhatsApp number (with country code, no + or spaces) ──
const WHATSAPP_NUMBER = "919999999999"; // PLACEHOLDER — replace with your number

export function initCheckout() {
  const form = document.getElementById("checkout-form");
  if (!form) return;

  const submitBtn = document.getElementById("checkout-submit");

  // Load order summary
  renderOrderSummary();

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    if (!validateForm(form)) return;

    const items = await Cart.getItems();
    if (items.length === 0) {
      alert("Your cart is empty.");
      return;
    }

    const name    = form.querySelector('[name="name"]').value.trim();
    const phone   = form.querySelector('[name="phone"]').value.trim();
    const address = form.querySelector('[name="address"]').value.trim();
    const pin     = form.querySelector('[name="pincode"]').value.trim();
    const note    = form.querySelector('[name="note"]').value.trim();

    const total = Cart.getTotal(items);
    const msg = buildMessage({ name, phone, address, pin, note, items, total });
    const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(msg)}`;

    // Save order to Firestore if user is logged in
    await saveOrder({ name, phone, address, pin, note, items, total });

    // Clear cart after successful order
    await Cart.clear();

    window.open(url, "_blank");
    window.location.href = "index.html?order=success";
  });
}

function buildMessage({ name, phone, address, pin, note, items, total }) {
  const lines = [
    "🛍️ *New Order — Avinya's Store*",
    "─────────────────",
    `👤 *Name:* ${name}`,
    `📞 *Phone:* ${phone}`,
    `📍 *Address:* ${address}${pin ? ", " + pin : ""}`,
    "",
    "*Items Ordered:*"
  ];
  items.forEach(item => {
    const variantStr = item.variant ? ` (${item.variant})` : "";
    lines.push(`  • ${item.name}${variantStr} × ${item.qty} — ₹${(item.price * item.qty).toLocaleString("en-IN")}`);
  });
  lines.push("");
  lines.push(`💰 *Total: ₹${total.toLocaleString("en-IN")}*`);
  if (note) { lines.push(""); lines.push(`📝 *Note:* ${note}`); }
  lines.push("─────────────────");
  lines.push("Thank you! Please confirm this order.");
  return lines.join("\n");
}

async function saveOrder(orderData) {
  try {
    const { db } = await import('./firebase-config.js');
    const { collection, addDoc, serverTimestamp } = await import("https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js");
    const { getCurrentUser } = await import('./auth.js');
    const user = getCurrentUser();
    await addDoc(collection(db, "orders"), {
      ...orderData,
      userId: user ? user.uid : null,
      status: "pending",
      createdAt: serverTimestamp()
    });
  } catch (e) { console.warn("Order not saved to DB:", e.message); }
}

async function renderOrderSummary() {
  const summaryEl = document.getElementById("order-summary-items");
  const totalEl   = document.getElementById("order-summary-total");
  if (!summaryEl) return;

  const items = await Cart.getItems();
  const total = Cart.getTotal(items);

  if (items.length === 0) {
    summaryEl.innerHTML = `<p style="color:var(--text-muted);font-size:13px;">Your cart is empty.</p>`;
    return;
  }

  summaryEl.innerHTML = "";
  items.forEach(item => {
    const row = document.createElement("div");
    row.className = "summary-item";
    row.innerHTML = `
      <img src="${item.image}" alt="${item.name}" />
      <div class="summary-item-info">
        <div class="summary-item-name">${item.name}${item.variant ? ` <span class="summary-variant">${item.variant}</span>` : ""}</div>
        <div class="summary-item-qty">Qty: ${item.qty}</div>
      </div>
      <div class="summary-item-price">₹${(item.price * item.qty).toLocaleString("en-IN")}</div>
    `;
    summaryEl.appendChild(row);
  });

  if (totalEl) totalEl.textContent = "₹" + total.toLocaleString("en-IN");
}

function validateForm(form) {
  let valid = true;
  form.querySelectorAll("[required]").forEach(el => {
    el.classList.remove("error");
    if (!el.value.trim()) { el.classList.add("error"); valid = false; }
  });
  const phone = form.querySelector('[name="phone"]');
  if (phone && !/^[6-9]\d{9}$/.test(phone.value.trim())) {
    phone.classList.add("error");
    valid = false;
    alert("Please enter a valid 10-digit Indian mobile number.");
  }
  return valid;
}
