// ─────────────────────────────────────────────
//  layout.js
//  Injects shared navbar, cart sidebar, login modal, and footer into every page.
//  Import this at the top of each page's script.
// ─────────────────────────────────────────────

export function injectLayout() {
  // ── Announcement bar ──
  const bar = document.createElement("div");
  bar.className = "announcement-bar";
  bar.innerHTML = `Free shipping on orders above ₹2,000 &nbsp;|&nbsp; Handcrafted with love in Bihar &nbsp;|&nbsp; <a href="about.html">Our Story</a>`;
  document.body.prepend(bar);

  // ── Navbar ──
  const nav = document.createElement("nav");
  nav.className = "navbar";
  nav.innerHTML = `
    <div class="navbar-inner">
      <a href="index.html" class="nav-logo">ecomm-<span>site</span></a>

      <ul class="nav-links hide-mobile">
        <li class="nav-dropdown">
          <a href="shop.html?cat=sarees">Sarees</a>
          <div class="dropdown-menu">
            <a href="shop.html?cat=sarees&sub=tussar">Tussar Silk</a>
            <a href="shop.html?cat=sarees&sub=chanderi">Chanderi</a>
            <a href="shop.html?cat=sarees&sub=chiffon">Chiffon</a>
            <a href="shop.html?cat=sarees&sub=cotton">Cotton</a>
            <a href="shop.html?cat=sarees&sub=dupatta">Dupattas</a>
          </div>
        </li>
        <li class="nav-dropdown">
          <a href="shop.html?cat=clothing">Clothing</a>
          <div class="dropdown-menu">
            <a href="shop.html?cat=clothing&sub=kurta">Kurta Sets</a>
            <a href="shop.html?cat=clothing&sub=men">Men's Wear</a>
          </div>
        </li>
        <li><a href="shop.html?cat=paintings">Paintings</a></li>
        <li class="nav-dropdown">
          <a href="shop.html?cat=home-decor">Home Decor</a>
          <div class="dropdown-menu">
            <a href="shop.html?cat=home-decor&sub=wall">Wall Art</a>
            <a href="shop.html?cat=home-decor&sub=cushion">Cushion Covers</a>
          </div>
        </li>
        <li><a href="shop.html?cat=handicrafts">Handicrafts</a></li>
        <li><a href="about.html">About</a></li>
      </ul>

      <div class="nav-actions">
        <!-- Logged out: show Login link -->
        <button class="nav-icon-btn show-when-logged-out" data-open-login title="Login">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
          <span class="hide-mobile">Login</span>
        </button>

        <!-- Logged in: show user name + logout -->
        <div class="show-when-logged-in" style="display:flex;align-items:center;gap:10px;">
          <span class="nav-icon-btn user-display-name" style="cursor:default;"></span>
          <button class="nav-icon-btn" data-signout title="Sign out">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
          </button>
        </div>

        <!-- Cart -->
        <button class="nav-icon-btn" data-open-cart title="Cart">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 0 1-8 0"/></svg>
          <span class="cart-badge cart-count" style="display:none">0</span>
        </button>

        <!-- Hamburger -->
        <button class="hamburger hide-desktop" id="hamburger" aria-label="Menu">
          <span></span><span></span><span></span>
        </button>
      </div>
    </div>
  `;
  document.body.insertBefore(nav, document.body.children[1]);

  // ── Mobile menu ──
  const mobileMenu = document.createElement("div");
  mobileMenu.className = "mobile-menu";
  mobileMenu.id = "mobile-menu";
  mobileMenu.innerHTML = `
    <button class="mobile-menu-close" id="mobile-menu-close">✕</button>
    <a href="index.html">Home</a>
    <div class="mobile-menu-section">Shop</div>
    <a href="shop.html?cat=sarees">Sarees</a>
    <a href="shop.html?cat=clothing">Clothing</a>
    <a href="shop.html?cat=paintings">Paintings</a>
    <a href="shop.html?cat=home-decor">Home Decor</a>
    <a href="shop.html?cat=handicrafts">Handicrafts</a>
    <div class="mobile-menu-section">Account</div>
    <a href="#" class="show-when-logged-out" data-open-login>Login / Register</a>
    <a href="#" class="show-when-logged-in" data-signout>Sign Out</a>
    <a href="about.html">About Us</a>
  `;
  document.body.appendChild(mobileMenu);

  document.getElementById("hamburger")?.addEventListener("click", () => mobileMenu.classList.add("open"));
  document.getElementById("mobile-menu-close")?.addEventListener("click", () => mobileMenu.classList.remove("open"));

  // ── Cart sidebar ──
  const cartHtml = document.createElement("div");
  cartHtml.innerHTML = `
    <div id="cart-overlay"></div>
    <div id="cart-sidebar">
      <div class="cart-header">
        <h2>Your Cart</h2>
        <button class="cart-close" id="cart-close">✕</button>
      </div>
      <div class="cart-items" id="cart-items"></div>
      <div class="cart-footer">
        <div class="cart-subtotal">
          <span>Subtotal</span>
          <strong id="cart-total">₹0</strong>
        </div>
        <p class="cart-note">Shipping & taxes calculated at checkout. Orders placed via WhatsApp.</p>
        <a href="checkout.html" class="btn-primary" id="cart-checkout-btn" style="display:none">Proceed to Checkout</a>
        <button class="btn-outline" onclick="document.getElementById('cart-sidebar').classList.remove('open');document.getElementById('cart-overlay').classList.remove('open');document.body.style.overflow=''">Continue Shopping</button>
      </div>
    </div>
  `;
  document.body.appendChild(cartHtml);

  // ── Login modal ──
  const loginHtml = document.createElement("div");
  loginHtml.innerHTML = `
    <div id="login-modal-overlay">
      <div class="login-modal">
        <button class="login-modal-close">✕</button>
        <h2>Welcome back</h2>
        <p>Sign in to save your cart and track orders</p>

        <button class="btn-google" id="btn-google-signin">
          <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="Google" />
          Continue with Google
        </button>

        <div class="auth-divider">or</div>

        <!-- Login form -->
        <form id="login-form">
          <div class="form-group">
            <label>Email</label>
            <input type="email" name="email" required placeholder="you@email.com" />
          </div>
          <div class="form-group">
            <label>Password</label>
            <input type="password" name="password" required placeholder="••••••••" />
          </div>
          <div class="auth-error"></div>
          <button type="submit" class="btn-primary" style="width:100%;margin-top:8px;">Sign In</button>
          <div class="auth-switch">Don't have an account? <a id="to-register">Register</a></div>
        </form>

        <!-- Register form -->
        <form id="register-form" class="hidden" style="display:none">
          <div class="form-group">
            <label>Full Name</label>
            <input type="text" name="name" required placeholder="Your name" />
          </div>
          <div class="form-group">
            <label>Email</label>
            <input type="email" name="email" required placeholder="you@email.com" />
          </div>
          <div class="form-group">
            <label>Password</label>
            <input type="password" name="password" required placeholder="Min. 6 characters" />
          </div>
          <div class="auth-error"></div>
          <button type="submit" class="btn-primary" style="width:100%;margin-top:8px;">Create Account</button>
          <div class="auth-switch">Already have an account? <a id="to-login">Login</a></div>
        </form>
      </div>
    </div>
  `;
  // Fix hidden form visibility
  loginHtml.querySelector('#register-form').style.display = 'none';
  document.body.appendChild(loginHtml);

  // ── Footer ──
  const footer = document.createElement("footer");
  footer.className = "footer";
  footer.innerHTML = `
    <div class="container">
      <div class="footer-grid">
        <div class="footer-brand">
          <div class="nav-logo">ecomm-<span>site</span></div>
          <p>Handcrafted art and textiles from Bihar. Every piece tells a story of tradition, skill, and love.</p>
        </div>
        <div class="footer-col">
          <h4>Shop</h4>
          <a href="shop.html?cat=paintings">Paintings</a>
          <a href="shop.html?cat=sarees">Sarees</a>
          <a href="shop.html?cat=clothing">Clothing</a>
          <a href="shop.html?cat=home-decor">Home Decor</a>
          <a href="shop.html?cat=handicrafts">Handicrafts</a>
        </div>
        <div class="footer-col">
          <h4>Help</h4>
          <a href="about.html">About Us</a>
          <a href="about.html#contact">Contact</a>
          <a href="about.html#shipping">Shipping Info</a>
          <a href="about.html#returns">Returns</a>
        </div>
        <div class="footer-col">
          <h4>Connect</h4>
          <a href="#">Instagram</a>
          <a href="#">Facebook</a>
          <a href="#">WhatsApp</a>
        </div>
      </div>
      <div class="footer-bottom">
        <span>© 2025 ecomm-site. All rights reserved.</span>
        <div class="footer-social">
          <a href="#">IG</a>
          <a href="#">FB</a>
          <a href="#">WA</a>
        </div>
      </div>
    </div>
  `;
  document.body.appendChild(footer);

  // ── Toast ──
  const toast = document.createElement("div");
  toast.id = "toast";
  document.body.appendChild(toast);
}
