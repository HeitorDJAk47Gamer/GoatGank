const themeToggle = document.querySelector("[data-theme-toggle]");
const menuToggle = document.querySelector("[data-menu-toggle]");
const mobileNav = document.querySelector("[data-mobile-nav]");
const currentYear = document.querySelector("[data-year]");
const themeStorageKey = "ggk-theme";

function applyTheme(theme) {
  document.documentElement.setAttribute("data-theme", theme);
  if (themeToggle) {
    themeToggle.textContent = theme === "light" ? "🌙" : "☀️";
    themeToggle.setAttribute("aria-label", theme === "light" ? "Ativar modo escuro" : "Ativar modo claro");
  }
}

function initTheme() {
  const storedTheme = localStorage.getItem(themeStorageKey);
  const initialTheme = storedTheme || "dark";
  applyTheme(initialTheme);
}

if (themeToggle) {
  themeToggle.addEventListener("click", () => {
    const currentTheme = document.documentElement.getAttribute("data-theme") || "dark";
    const nextTheme = currentTheme === "dark" ? "light" : "dark";
    applyTheme(nextTheme);
    localStorage.setItem(themeStorageKey, nextTheme);
  });
}

if (menuToggle && mobileNav) {
  menuToggle.addEventListener("click", () => {
    const expanded = menuToggle.getAttribute("aria-expanded") === "true";
    menuToggle.setAttribute("aria-expanded", String(!expanded));
    mobileNav.classList.toggle("show", !expanded);
  });
}

if (currentYear) {
  currentYear.textContent = new Date().getFullYear();
}

const navLinks = document.querySelectorAll("[data-nav]");
if (navLinks.length > 0) {
  const currentPath = window.location.pathname.split("/").pop() || "index.html";
  navLinks.forEach((link) => {
    const href = link.getAttribute("href");
    if (href === currentPath) {
      link.classList.add("current");
    }
  });
}

const revealItems = document.querySelectorAll("[data-reveal]");
if (revealItems.length > 0) {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.14 }
  );

  revealItems.forEach((item) => observer.observe(item));
}

const productGrid = document.querySelector("[data-product-grid]");
const searchInput = document.querySelector("[data-shop-search]");
const filterButtons = document.querySelectorAll("[data-filter]");

const products = [
  { name: "Camiseta GGK Core", category: "camisetas", price: "R$ 89,90", badge: "Drop 01" },
  { name: "Moletom Goat Gank", category: "camisetas", price: "R$ 149,90", badge: "Premium" },
  { name: "Caneca Neon GGK", category: "canecas", price: "R$ 49,90", badge: "Favorita" },
  { name: "Copo Térmico Raid", category: "canecas", price: "R$ 69,90", badge: "Novo" },
  { name: "Chaveiro Goat Pixel", category: "chaveiros", price: "R$ 24,90", badge: "Colecionável" },
  { name: "Chaveiro SIB Bot", category: "chaveiros", price: "R$ 21,90", badge: "SIB" },
  { name: "Mousepad Arena GGK", category: "acessorios", price: "R$ 79,90", badge: "Gamer" },
  { name: "Sticker Pack GGK", category: "acessorios", price: "R$ 19,90", badge: "Pack" }
];

function productSymbol(category) {
  if (category === "camisetas") return "GGK";
  if (category === "canecas") return "☕";
  if (category === "chaveiros") return "🔑";
  return "⚡";
}

function renderProducts(list) {
  if (!productGrid) return;
  if (list.length === 0) {
    productGrid.innerHTML = `
      <article class="shop-card" data-reveal>
        <h3>Nenhum item encontrado</h3>
        <p>Tente ajustar os filtros ou pesquisar outro termo.</p>
      </article>
    `;
    return;
  }

  productGrid.innerHTML = list
    .map(
      (product) => `
      <article class="shop-card">
        <div class="shop-preview">${productSymbol(product.category)}</div>
        <div class="pill">${product.badge}</div>
        <h3>${product.name}</h3>
        <div class="shop-meta">
          <span class="shop-price">${product.price}</span>
          <button class="ghost-link" type="button">Em breve</button>
        </div>
      </article>
    `
    )
    .join("");
}

function applyProductFilters() {
  if (!productGrid) return;
  const activeFilter = document.querySelector(".filter-btn.active")?.getAttribute("data-filter") || "todos";
  const searchTerm = (searchInput?.value || "").trim().toLowerCase();

  const filtered = products.filter((product) => {
    const matchCategory = activeFilter === "todos" || product.category === activeFilter;
    const matchSearch = product.name.toLowerCase().includes(searchTerm);
    return matchCategory && matchSearch;
  });

  renderProducts(filtered);
}

if (productGrid) {
  renderProducts(products);
  filterButtons.forEach((button) => {
    button.addEventListener("click", () => {
      filterButtons.forEach((btn) => btn.classList.remove("active"));
      button.classList.add("active");
      applyProductFilters();
    });
  });

  if (searchInput) {
    searchInput.addEventListener("input", applyProductFilters);
  }
}

const tabButtons = document.querySelectorAll("[data-tab]");
const tabPanels = document.querySelectorAll("[data-panel]");

if (tabButtons.length > 0 && tabPanels.length > 0) {
  tabButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const target = button.getAttribute("data-tab");
      tabButtons.forEach((btn) => btn.classList.remove("active"));
      tabPanels.forEach((panel) => panel.classList.remove("active"));

      button.classList.add("active");
      const panel = document.querySelector(`[data-panel="${target}"]`);
      if (panel) panel.classList.add("active");
    });
  });
}

initTheme();
