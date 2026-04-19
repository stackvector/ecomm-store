// ─────────────────────────────────────────────
//  products.js
//  Manages product catalog.
//  Tries Firestore first; falls back to local data if Firebase isn't set up yet.
// ─────────────────────────────────────────────

// ── LOCAL PRODUCT DATA (placeholder until Firebase is set up) ──
export const LOCAL_PRODUCTS = [
  {
    id: "p001",
    name: "Madhubani Radha",
    category: "paintings",
    price: 2800,
    originalPrice: null,
    description: "Hand-painted on handmade paper using natural colours. Traditional Mithila art depicting Radha and Krishna in a lush forest setting.",
    images: ["assets/images/xyz.jpg"],
    badge: null,
    inStock: true,
    variants: [],
    tags: ["madhubani", "religious", "traditional"]
  },
  {
    id: "p002",
    name: "Madhubani Peacock",
    category: "paintings",
    price: 1800,
    originalPrice: 2200,
    description: "Auspicious peacock motif painted in the classic Mithila style. Vibrant geometric patterns in natural earth pigments.",
    images: ["assets/images/hmm.jpg"],
    badge: "Sale",
    inStock: true,
    variants: [],
    tags: ["madhubani", "fish", "auspicious"]
  },
  {
    id: "p003",
    name: "Tussar Silk Saree — Nature",
    category: "sarees",
    price: 6500,
    originalPrice: null,
    description: "Pure tussar silk hand-painted with nature-inspired Madhubani motifs. Each saree is a one-of-a-kind artwork.",
    images: ["https://placehold.co/600x800/F0E9DC/3D2B1F?text=Tussar+Saree"],
    badge: "Handmade",
    inStock: true,
    variants: ["Rust & Cream", "Indigo & Gold", "Green & Red"],
    tags: ["saree", "silk", "nature"]
  },
  {
    id: "p004",
    name: "Chanderi Saree — Durga",
    category: "sarees",
    price: 4800,
    originalPrice: null,
    description: "Lightweight chanderi fabric adorned with intricate Durga motifs in the Madhubani tradition.",
    images: ["https://placehold.co/600x800/F0E9DC/3D2B1F?text=Chanderi+Saree"],
    badge: null,
    inStock: true,
    variants: ["Red & Gold", "Ochre & Black"],
    tags: ["saree", "chanderi", "durga"]
  },
  {
    id: "p005",
    name: "Cotton Kurta — Tree of Life",
    category: "clothing",
    price: 2400,
    originalPrice: null,
    description: "Soft cotton kurta hand-painted with the iconic Tree of Life motif. Perfect for festive and everyday wear.",
    images: ["https://placehold.co/600x800/F0E9DC/3D2B1F?text=Cotton+Kurta"],
    badge: null,
    inStock: true,
    variants: ["S", "M", "L", "XL", "XXL"],
    tags: ["kurta", "cotton", "tree"]
  },
  {
    id: "p006",
    name: "Men's Silk Kurta",
    category: "clothing",
    price: 3200,
    originalPrice: null,
    description: "Elegant tussar silk kurta for men with subtle Madhubani border work. Ideal for weddings and pujas.",
    images: ["https://placehold.co/600x800/F0E9DC/3D2B1F?text=Men+Kurta"],
    badge: null,
    inStock: true,
    variants: ["S", "M", "L", "XL"],
    tags: ["men", "kurta", "silk"]
  },
  {
    id: "p007",
    name: "Cushion Covers — Set of 2",
    category: "home-decor",
    price: 1200,
    originalPrice: 1500,
    description: "Pair of handpainted cushion covers featuring peacock motifs. Each cover is a miniature artwork.",
    images: ["https://placehold.co/600x800/F0E9DC/3D2B1F?text=Cushion+Covers"],
    badge: "Sale",
    inStock: true,
    variants: ["16×16 inch", "18×18 inch"],
    tags: ["home", "cushion", "peacock"]
  },
  {
    id: "p008",
    name: "Wall Painting — Ganesha",
    category: "home-decor",
    price: 3600,
    originalPrice: null,
    description: "Large format Ganesha painting on handmade paper. A statement piece for living rooms and puja spaces.",
    images: ["https://placehold.co/600x800/F0E9DC/3D2B1F?text=Ganesha+Wall+Art"],
    badge: "Popular",
    inStock: true,
    variants: ["A3 (30×42 cm)", "A2 (42×60 cm)"],
    tags: ["home", "ganesha", "wall-art"]
  },
  {
    id: "p009",
    name: "Madhubani Diary — Handbound",
    category: "handicrafts",
    price: 650,
    originalPrice: null,
    description: "Handbound diary with Madhubani painted cover. Recycled paper inside. A perfect gift.",
    images: ["https://placehold.co/600x800/F0E9DC/3D2B1F?text=Diary"],
    badge: "Gift",
    inStock: true,
    variants: [],
    tags: ["diary", "gift", "stationery"]
  },
  {
    id: "p010",
    name: "Jute Clutch — Peacock",
    category: "handicrafts",
    price: 850,
    originalPrice: null,
    description: "Hand-embroidered jute clutch with Madhubani peacock appliqué. Zip closure, satin lining.",
    images: ["https://placehold.co/600x800/F0E9DC/3D2B1F?text=Clutch"],
    badge: null,
    inStock: true,
    variants: ["Mustard", "Brick Red", "Indigo"],
    tags: ["accessory", "clutch", "peacock"]
  },
  {
    id: "p011",
    name: "Silk Dupatta — Lotus",
    category: "sarees",
    price: 1800,
    originalPrice: null,
    description: "Pure silk dupatta painted with lotus and bird motifs. Complements any kurta or saree.",
    images: ["https://placehold.co/600x800/F0E9DC/3D2B1F?text=Silk+Dupatta"],
    badge: null,
    inStock: true,
    variants: ["Pink & Gold", "Cream & Red", "Blue & Silver"],
    tags: ["dupatta", "silk", "lotus"]
  },
  {
    id: "p012",
    name: "Chiffon Saree — Nature",
    category: "sarees",
    price: 3800,
    originalPrice: null,
    description: "Lightweight chiffon saree with hand-painted nature motifs. Easy to drape, vibrant colours.",
    images: ["https://placehold.co/600x800/F0E9DC/3D2B1F?text=Chiffon+Saree"],
    badge: "New",
    inStock: true,
    variants: ["Peach", "Mint", "Lilac"],
    tags: ["saree", "chiffon", "nature"]
  }
];

export const CATEGORIES = [
  { id: "all",         label: "All" },
  { id: "paintings",   label: "Paintings" },
  { id: "sarees",      label: "Sarees" },
  { id: "clothing",    label: "Clothing" },
  { id: "home-decor",  label: "Home Decor" },
  { id: "handicrafts", label: "Handicrafts" },
];

// ── Try to load from Firestore; fall back to local data ──
export async function getProducts() {
  try {
    const { db, isFirebaseConfigured } = await import('./firebase-config.js');
    if (!isFirebaseConfigured || !db) return LOCAL_PRODUCTS;
    const { collection, getDocs } = await import("https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js");
    const snap = await getDocs(collection(db, "products"));
    if (snap.empty) return LOCAL_PRODUCTS;
    return snap.docs.map(d => ({ id: d.id, ...d.data() }));
  } catch (e) {
    console.warn("Firestore unavailable, using local product data.", e.message);
    return LOCAL_PRODUCTS;
  }
}

export async function getProductById(id) {
  const products = await getProducts();
  return products.find(p => p.id === id) || null;
}

export function formatPrice(amount) {
  return "₹" + Number(amount).toLocaleString("en-IN");
}

export function renderProductCard(product, addToCartFn) {
  const card = document.createElement("div");
  card.className = "product-card";
  card.innerHTML = `
    <div class="product-card-image">
      <img src="${product.images[0]}" alt="${product.name}" loading="lazy" />
      ${product.badge ? `<span class="product-card-badge">${product.badge}</span>` : ""}
      <div class="product-card-quick">Quick Add</div>
    </div>
    <div class="product-card-info">
      <div class="product-card-category">${CATEGORIES.find(c => c.id === product.category)?.label || product.category}</div>
      <div class="product-card-name">${product.name}</div>
      <div class="product-card-price">
        ${formatPrice(product.price)}
        ${product.originalPrice ? `<span class="original">${formatPrice(product.originalPrice)}</span>` : ""}
      </div>
    </div>
  `;
  card.addEventListener("click", (e) => {
    if (e.target.closest(".product-card-quick")) {
      e.stopPropagation();
      addToCartFn(product);
    } else {
      window.location.href = `product.html?id=${product.id}`;
    }
  });
  return card;
}
