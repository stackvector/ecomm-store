# Kala Bazaar — Setup Guide

A handcrafted art & textiles store with WhatsApp checkout, Firebase login, and cart sync.

---

## Project Structure

```
kala-bazaar/
├── index.html          Home page
├── shop.html           Product gallery with category filters
├── product.html        Individual product detail
├── checkout.html       Order form → WhatsApp
├── login.html          Standalone login page
├── about.html          Brand story, contact, shipping
├── css/
│   ├── main.css        Base styles, typography, variables
│   └── components.css  Navbar, cards, cart, modals, footer
├── js/
│   ├── firebase-config.js  ← YOUR KEYS GO HERE
│   ├── auth.js             Login, register, Google OAuth
│   ├── cart.js             Cart logic (localStorage + Firestore)
│   ├── products.js         Product data + render helpers
│   ├── checkout.js         WhatsApp order builder
│   ├── layout.js           Shared navbar, cart, footer injection
│   └── admin.js            Stub for future admin panel
└── assets/
    └── images/             Your product photos go here
```

---

## Step 1 — Firebase Setup (~20 min)

1. Go to https://console.firebase.google.com
2. Click **Add project** → name it (e.g. kala-bazaar) → create
3. In the left sidebar:
   - Click **Authentication** → Get started → Enable **Google** and **Email/Password**
   - Click **Firestore Database** → Create database → Start in **test mode** (lock it down later)
4. Click the ⚙️ gear icon → **Project settings** → scroll to **Your apps**
5. Click the **</>** (Web) icon → register app → copy the config object

6. Open `js/firebase-config.js` and paste your values:

```js
const firebaseConfig = {
  apiKey: "AIza...",
  authDomain: "your-project.firebaseapp.com",
  projectId: "your-project",
  storageBucket: "your-project.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123:web:abc"
};
```

---

## Step 2 — Add Your WhatsApp Number

Open `js/checkout.js` and replace the placeholder on line 8:

```js
const WHATSAPP_NUMBER = "919810XXXXXX"; // your number with country code, no + or spaces
```

---

## Step 3 — Add Your Products

**Option A — Quick (edit the JS file):**
Open `js/products.js` and edit the `LOCAL_PRODUCTS` array.
Each product looks like this:

```js
{
  id: "p001",                    // unique ID (any string)
  name: "Madhubani Painting",
  category: "paintings",         // paintings | sarees | clothing | home-decor | handicrafts
  price: 2800,                   // in rupees
  originalPrice: null,           // set a number to show strikethrough price, or null
  description: "Hand-painted...",
  images: ["path/to/image.jpg"], // can be a URL or local path like assets/images/p001.jpg
  badge: null,                   // "Sale" | "New" | "Popular" | null
  inStock: true,
  variants: ["S", "M", "L"],    // size/colour options, or [] for none
  tags: ["madhubani", "gift"]
}
```

**Option B — Firebase (recommended once you grow):**
1. Go to Firebase Console → Firestore
2. Create a collection called `products`
3. Add documents — each document = one product (same fields as above)
4. The site automatically reads from Firestore and falls back to local data if unavailable

---

## Step 4 — Add Your Product Images

- Put photos in `assets/images/`
- Name them clearly: `p001-madhubani-radha.jpg`
- Reference them in products.js: `images: ["assets/images/p001-madhubani-radha.jpg"]`
- Recommended size: 800×1067px (3:4 ratio), under 200KB each
- Use https://squoosh.app to compress images for free

---

## Step 5 — Customise the Brand

- **Name**: Find and replace "Kala Bazaar" across all files with your shop name
- **Tagline**: Edit the announcement bar text in `js/layout.js` (line ~7)
- **Colours**: All colours are CSS variables in `css/main.css` — change `--terracotta`, `--brown`, `--cream` etc.
- **WhatsApp contact link**: Update in `about.html`
- **Social links**: Update in `js/layout.js` footer section

---

## Step 6 — Deploy on Vercel (free)

1. Go to https://vercel.com → sign up (free)
2. Click **Add New → Project**
3. Drag your `kala-bazaar/` folder into the deploy area
   (or connect GitHub if you push the code there)
4. Click **Deploy** — done! You get a free `.vercel.app` URL

**Custom domain** (optional):
- Buy a domain (GoDaddy, Namecheap, etc.)
- In Vercel → your project → Settings → Domains → add your domain
- Follow their DNS instructions (takes ~24hrs)

---

## Step 7 — Make Someone an Admin (for future)

1. Go to Firebase Console → Firestore → `users` collection
2. Find the user's document (their UID is the document ID)
3. Add a field: `role` → `"admin"`

The admin UI doesn't exist yet but the data layer is ready. When you're ready to build it, everything in `js/admin.js` is scaffolded out.

---

## Firestore Security Rules (lock down before going live)

In Firebase Console → Firestore → Rules, paste this:

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Products: anyone can read, only admin can write
    match /products/{id} {
      allow read: if true;
      allow write: if request.auth != null && 
        get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == "admin";
    }
    // Users: can only read/write their own data
    match /users/{uid} {
      allow read, write: if request.auth != null && request.auth.uid == uid;
    }
    match /users/{uid}/cart/{doc} {
      allow read, write: if request.auth != null && request.auth.uid == uid;
    }
    // Orders: logged-in users can create, only admin can read all
    match /orders/{id} {
      allow create: if request.auth != null || true; // allow guest orders
      allow read: if request.auth != null && 
        get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == "admin";
    }
  }
}
```

---

## FAQ

**Q: Will this work without Firebase set up?**
A: Yes! The site falls back to local product data and localStorage for the cart. Firebase is optional until you need login or Firestore products.

**Q: How do customers pay?**
A: Via WhatsApp — you confirm the order and share your UPI QR code or bank details manually. No payment gateway needed to start.

**Q: Can I add more categories?**
A: Yes — in `js/products.js` add to the `CATEGORIES` array, then add matching items with the new category ID.

**Q: How do I update prices?**
A: Edit the `price` field in `js/products.js` (or in Firestore if you're using it).
