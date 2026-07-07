const CATEGORY_ICONS = {
  "전동공구": "🔌",
  "수공구": "🔧",
  "용접기기": "🔥",
  "안전용품": "🦺",
  "측정공구": "📏",
  "기타": "📦"
};

let activeCategory = "전체";
let searchTerm = "";

function formatPrice(n) {
  return n.toLocaleString("ko-KR") + "원";
}

function discountRate(price, originalPrice) {
  if (!originalPrice || originalPrice <= price) return 0;
  return Math.round((1 - price / originalPrice) * 100);
}

function applySiteConfig() {
  document.title = `${SITE_CONFIG.siteName} - ${SITE_CONFIG.tagline}`;
  document.getElementById("site-name").textContent = SITE_CONFIG.siteName;
  document.getElementById("hero-title").textContent = SITE_CONFIG.heroTitle;
  document.getElementById("hero-subtitle").textContent = SITE_CONFIG.heroSubtitle;
  document.getElementById("kakao-id-display").textContent = SITE_CONFIG.kakaoId;
  document.getElementById("business-hours").textContent = SITE_CONFIG.businessHours;
  document.getElementById("contact-guide").textContent = SITE_CONFIG.contactGuide;

  const bizLine = document.getElementById("business-info-line");
  const parts = [SITE_CONFIG.businessName, SITE_CONFIG.location].filter(Boolean);
  if (parts.length) {
    bizLine.textContent = parts.join(" · ");
    bizLine.style.display = "block";
  } else {
    bizLine.style.display = "none";
  }
}

function buildCategoryTabs() {
  const categories = ["전체", ...new Set(PRODUCTS.map(p => p.category))];
  const nav = document.getElementById("category-tabs");
  nav.innerHTML = categories.map(cat => `
    <button class="tab-btn${cat === activeCategory ? " active" : ""}" data-category="${cat}">
      ${cat === "전체" ? "전체" : `${CATEGORY_ICONS[cat] || "🔩"} ${cat}`}
    </button>
  `).join("");

  nav.querySelectorAll(".tab-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      activeCategory = btn.dataset.category;
      buildCategoryTabs();
      renderProducts();
    });
  });
}

function productCard(p) {
  const rate = discountRate(p.price, p.originalPrice);
  const thumb = p.image
    ? `<img src="${p.image}" alt="${p.name}" class="product-thumb-img">`
    : `<div class="product-thumb-placeholder">${CATEGORY_ICONS[p.category] || "🔩"}</div>`;

  return `
    <article class="product-card${p.stock ? "" : " sold-out"}" data-id="${p.id}">
      <div class="product-thumb">
        ${thumb}
        ${rate > 0 ? `<span class="badge badge-discount">${rate}% ↓</span>` : ""}
        ${!p.stock ? `<span class="badge badge-soldout">품절</span>` : ""}
      </div>
      <div class="product-body">
        <span class="product-category">${p.category}</span>
        <h3 class="product-name">${p.name}</h3>
        <p class="product-condition">${p.condition}</p>
        <div class="product-price-row">
          ${rate > 0 ? `<span class="price-original">${formatPrice(p.originalPrice)}</span>` : ""}
          <span class="price-current">${formatPrice(p.price)}</span>
        </div>
        <button class="btn-contact" ${p.stock ? "" : "disabled"}>
          ${p.stock ? "카카오톡으로 문의하기" : "재입고 문의하기"}
        </button>
      </div>
    </article>
  `;
}

function renderProducts() {
  const grid = document.getElementById("product-grid");
  const filtered = PRODUCTS.filter(p => {
    const matchesCategory = activeCategory === "전체" || p.category === activeCategory;
    const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  document.getElementById("result-count").textContent = `${filtered.length}개 상품`;

  if (filtered.length === 0) {
    grid.innerHTML = `<p class="empty-state">조건에 맞는 상품이 없습니다.</p>`;
    return;
  }

  grid.innerHTML = filtered.map(productCard).join("");

  grid.querySelectorAll(".product-card").forEach(card => {
    card.querySelector(".btn-contact").addEventListener("click", (e) => {
      e.stopPropagation();
      const id = Number(card.dataset.id);
      const product = PRODUCTS.find(p => p.id === id);
      openContactModal(product);
    });
  });
}

function openContactModal(product) {
  const modal = document.getElementById("contact-modal");
  document.getElementById("modal-product-name").textContent = product ? product.name : "일반 문의";
  document.getElementById("modal-kakao-id").textContent = SITE_CONFIG.kakaoId;
  modal.classList.add("open");
}

function closeContactModal() {
  document.getElementById("contact-modal").classList.remove("open");
}

function copyKakaoId(text, btn) {
  navigator.clipboard.writeText(text).then(() => {
    const original = btn.textContent;
    btn.textContent = "복사됨!";
    setTimeout(() => (btn.textContent = original), 1500);
  }).catch(() => {
    alert(`카카오톡 ID: ${text}`);
  });
}

document.addEventListener("DOMContentLoaded", () => {
  applySiteConfig();
  buildCategoryTabs();
  renderProducts();

  document.getElementById("search-input").addEventListener("input", (e) => {
    searchTerm = e.target.value;
    renderProducts();
  });

  document.getElementById("hero-contact-btn").addEventListener("click", () => openContactModal(null));
  document.getElementById("footer-contact-btn").addEventListener("click", () => openContactModal(null));
  document.getElementById("footer-contact-btn-nav").addEventListener("click", () => openContactModal(null));
  document.getElementById("modal-close").addEventListener("click", closeContactModal);
  document.getElementById("contact-modal").addEventListener("click", (e) => {
    if (e.target.id === "contact-modal") closeContactModal();
  });
  document.getElementById("copy-kakao-btn").addEventListener("click", (e) => {
    copyKakaoId(SITE_CONFIG.kakaoId, e.target);
  });
});
