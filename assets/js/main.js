const themeToggle = document.querySelector("[data-theme-toggle]");
const menuToggle = document.querySelector("[data-menu-toggle]");
const mobileNav = document.querySelector("[data-mobile-nav]");
const currentYear = document.querySelector("[data-year]");
const themeStorageKey = "ggk-theme";

function applyTheme(theme) {
  document.documentElement.setAttribute("data-theme", theme);
  if (themeToggle) {
    themeToggle.textContent = theme === "light" ? "\uD83C\uDF19" : "\u2600";
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
  currentYear.textContent = String(new Date().getFullYear());
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
  { name: "Copo Termico Raid", category: "canecas", price: "R$ 69,90", badge: "Novo" },
  { name: "Chaveiro Goat Pixel", category: "chaveiros", price: "R$ 24,90", badge: "Colecionavel" },
  { name: "Chaveiro SIB Bot", category: "chaveiros", price: "R$ 21,90", badge: "SIB" },
  { name: "Mousepad Arena GGK", category: "acessorios", price: "R$ 79,90", badge: "Gamer" },
  { name: "Sticker Pack GGK", category: "acessorios", price: "R$ 19,90", badge: "Pack" }
];

function productSymbol(category) {
  if (category === "camisetas") return "GGK";
  if (category === "canecas") return "\u2615";
  if (category === "chaveiros") return "\uD83D\uDD11";
  return "\u26A1";
}

function renderProducts(list) {
  if (!productGrid) return;
  if (list.length === 0) {
    productGrid.innerHTML = `
      <article class="shop-card">
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

const discordSection = document.querySelector("[data-discord-section]");
const discordMembers = document.querySelector("[data-discord-members]");
const discordOnline = document.querySelector("[data-discord-online]");
const discordChannels = document.querySelector("[data-discord-channels]");
const discordVoice = document.querySelector("[data-discord-voice]");
const discordNote = document.querySelector("[data-discord-note]");
const serverIconImage = document.querySelector("[data-server-icon]");
const serverIconDefault = serverIconImage ? serverIconImage.getAttribute("src") : "";

function numberBR(value) {
  return new Intl.NumberFormat("pt-BR").format(value);
}

function setDiscordNote(message, isError = false) {
  if (!discordNote) return;
  discordNote.textContent = message;
  discordNote.classList.toggle("is-error", isError);
}

function setStatValue(element, value, options = {}) {
  if (!element) return;
  const suffix = options.suffix || "";
  element.textContent = typeof value === "number" ? `${numberBR(value)}${suffix}` : "--";
}

function normalizeInviteCode(rawValue) {
  if (!rawValue) return "";
  const value = rawValue.trim();
  if (!value) return "";

  if (value.startsWith("http://") || value.startsWith("https://")) {
    try {
      const url = new URL(value);
      const parts = url.pathname.split("/").filter(Boolean);
      return parts[parts.length - 1] || "";
    } catch {
      return "";
    }
  }

  return value
    .replace(/^discord\.gg\//i, "")
    .replace(/^discord\.com\/invite\//i, "")
    .replace(/^invite\//i, "");
}

async function fetchInviteStats(inviteCode) {
  const response = await fetch(
    `https://discord.com/api/v10/invites/${encodeURIComponent(inviteCode)}?with_counts=true&with_expiration=true`,
    { cache: "no-store" }
  );

  if (!response.ok) {
    throw new Error(`invite_${response.status}`);
  }

  const data = await response.json();
  return {
    guildId: data?.guild?.id || null,
    guildIconHash: data?.guild?.icon || null,
    memberCount: typeof data?.approximate_member_count === "number" ? data.approximate_member_count : null,
    onlineCount: typeof data?.approximate_presence_count === "number" ? data.approximate_presence_count : null
  };
}

function buildDiscordIconUrl(guildId, iconHash, size = 512) {
  if (!guildId || !iconHash) return "";
  const extension = iconHash.startsWith("a_") ? "gif" : "png";
  return `https://cdn.discordapp.com/icons/${guildId}/${iconHash}.${extension}?size=${size}`;
}

function setServerIcon(url) {
  if (!serverIconImage) return;
  if (url) {
    serverIconImage.src = url;
    return;
  }

  if (serverIconDefault) {
    serverIconImage.src = serverIconDefault;
  }
}

async function fetchWidgetStats(guildId) {
  const response = await fetch(`https://discord.com/api/guilds/${encodeURIComponent(guildId)}/widget.json`, {
    cache: "no-store"
  });

  if (!response.ok) {
    throw new Error(`widget_${response.status}`);
  }

  const data = await response.json();
  const channels = Array.isArray(data?.channels) ? data.channels : [];
  const voiceCount = channels.reduce((total, channel) => {
    if (Array.isArray(channel?.members)) {
      return total + channel.members.length;
    }
    return total;
  }, 0);

  return {
    channelCount: channels.length,
    voiceCount,
    presenceCount: typeof data?.presence_count === "number" ? data.presence_count : null
  };
}

async function loadDiscordStats() {
  if (!discordSection) return;

  const initialGuildId = (discordSection.dataset.guildId || "").trim();
  const initialInviteCode = normalizeInviteCode(discordSection.dataset.inviteCode || "");

  if (!initialGuildId && !initialInviteCode) {
    setDiscordNote("Defina data-guild-id e data-invite-code no index.html para ativar os dados.", true);
    return;
  }

  setDiscordNote("Atualizando dados do Discord...");

  let inviteStats = null;
  let widgetStats = null;
  let guildId = initialGuildId;

  if (initialInviteCode) {
    try {
      inviteStats = await fetchInviteStats(initialInviteCode);
      if (!guildId && inviteStats?.guildId) {
        guildId = inviteStats.guildId;
      }
      const iconUrl = buildDiscordIconUrl(guildId, inviteStats?.guildIconHash);
      setServerIcon(iconUrl);
    } catch {
      setDiscordNote("Nao foi possivel ler o convite. Verifique o invite code informado.", true);
      setServerIcon("");
    }
  }

  if (guildId) {
    try {
      widgetStats = await fetchWidgetStats(guildId);
    } catch {
      const message = "Widget bloqueado. Ative o Server Widget no Discord para exibir canais e voz.";
      setDiscordNote(message, true);
    }
  }

  const memberCount = inviteStats?.memberCount ?? null;
  const onlineCount = inviteStats?.onlineCount ?? widgetStats?.presenceCount ?? null;
  const channelCount = widgetStats?.channelCount ?? null;
  const voiceCount = widgetStats?.voiceCount ?? null;

  setStatValue(discordMembers, memberCount);
  setStatValue(discordOnline, onlineCount);
  setStatValue(discordChannels, channelCount, { suffix: typeof channelCount === "number" && channelCount > 0 ? "+" : "" });
  setStatValue(discordVoice, voiceCount);

  if ([memberCount, onlineCount, channelCount, voiceCount].some((value) => typeof value === "number")) {
    setDiscordNote("Status atualizado automaticamente a cada 2 minutos. Canais aparecem como minimo estimado (N+).");
  } else {
    setDiscordNote("Nao foi possivel carregar os dados. Confira o guild id, invite code e o widget.", true);
  }
}

if (discordSection) {
  loadDiscordStats();
  window.setInterval(loadDiscordStats, 120000);
}

initTheme();
