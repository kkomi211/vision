let PRODUCTS = [];
let activeCategory = "전체";
let searchTerm = "";

function buildCategoryTabs() {
  const categories = ["전체", ...Object.keys(CATEGORY_ICONS)];
  const nav = document.getElementById("category-tabs");
  nav.innerHTML = categories.map(cat => `
    <button class="tab-btn${cat === activeCategory ? " active" : ""}" data-category="${cat}" title="${cat}">
      ${cat}
    </button>
  `).join("");

  nav.querySelectorAll(".tab-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      activeCategory = btn.dataset.category;
      buildCategoryTabs();
      renderProducts();
    });
  });

  fitCategoryTabs();
}

// 화면 너비에 맞게 카테고리 글자 크기를 줄여서 잘림 없이 한 줄에 표시 (모바일에서는 줄바꿈이라 건너뜀)
function fitCategoryTabs() {
  const nav = document.getElementById("category-tabs");
  if (!nav) return;

  const buttons = nav.querySelectorAll(".tab-btn");
  buttons.forEach(btn => {
    btn.style.fontSize = "";
    btn.style.padding = "";
  });

  if (window.innerWidth <= 640) return;

  let fontSize = 0.85;
  let paddingX = 10;
  const minFontSize = 0.5;

  while (nav.scrollWidth > nav.clientWidth && fontSize > minFontSize) {
    fontSize -= 0.02;
    paddingX = Math.max(4, paddingX - 0.15);
    buttons.forEach(btn => {
      btn.style.fontSize = fontSize.toFixed(2) + "rem";
      btn.style.padding = `7px ${paddingX.toFixed(1)}px`;
    });
  }
}

function productCard(p) {
  const thumb = p.images && p.images[0]
    ? `<img src="${p.images[0]}" alt="${p.name}" class="product-thumb-img">`
    : `<div class="product-thumb-placeholder">${CATEGORY_ICONS[p.category] || "🔩"}</div>`;

  return `
    <article class="product-card${p.stock ? "" : " sold-out"}" data-id="${p.id}">
      <div class="product-thumb">
        ${thumb}
        ${!p.stock ? `<span class="badge badge-soldout">품절</span>` : ""}
      </div>
      <div class="product-body">
        <span class="product-category">${p.category}</span>
        <h3 class="product-name">${p.name}</h3>
        <div class="product-price-row">
          <span class="price-current">${formatPrice(p.price)}</span>
        </div>
        <button class="btn-contact" ${p.stock ? "" : "disabled"}>
          ${p.stock ? "구매 문의하기" : "재입고 문의하기"}
        </button>
      </div>
    </article>
  `;
}

function renderSearchChip() {
  const chip = document.getElementById("search-active-chip");
  if (!searchTerm) {
    chip.style.display = "none";
    chip.innerHTML = "";
    return;
  }
  chip.style.display = "inline-flex";
  chip.innerHTML = `검색: "${searchTerm}" <button type="button" id="search-clear-btn" aria-label="검색어 지우기">&times;</button>`;
  document.getElementById("search-clear-btn").addEventListener("click", () => {
    searchTerm = "";
    renderSearchChip();
    renderProducts();
  });
}

function openSearchModal() {
  const modal = document.getElementById("search-modal");
  const input = document.getElementById("search-modal-input");
  input.value = searchTerm;
  modal.classList.add("open");
  input.focus();
}

function closeSearchModal() {
  document.getElementById("search-modal").classList.remove("open");
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
    const id = Number(card.dataset.id);

    card.addEventListener("click", () => {
      location.href = `product.html?id=${id}`;
    });

    card.querySelector(".btn-contact").addEventListener("click", (e) => {
      e.stopPropagation();
      const product = PRODUCTS.find(p => p.id === id);
      openContactModal(product);
    });
  });
}

document.addEventListener("DOMContentLoaded", async () => {
  const grid = document.getElementById("product-grid");
  grid.innerHTML = `<p class="empty-state">상품을 불러오는 중입니다...</p>`;

  if (!isSupabaseConfigured()) {
    grid.innerHTML = `<p class="empty-state">아직 Supabase 연결이 설정되지 않았습니다.<br>js/supabase-client.js 를 설정해 주세요.</p>`;
    return;
  }

  const { products, error } = await fetchProducts();

  if (error) {
    grid.innerHTML = `<p class="empty-state">상품을 불러오지 못했습니다.<br>오류: ${error.message}<br>테이블 이름과 RLS(보안 정책) 설정을 확인해 주세요.</p>`;
    return;
  }

  PRODUCTS = products;
  buildCategoryTabs();
  renderProducts();

  document.getElementById("search-open-btn").addEventListener("click", openSearchModal);
  document.getElementById("search-modal-close").addEventListener("click", closeSearchModal);
  document.getElementById("search-modal").addEventListener("click", (e) => {
    if (e.target.id === "search-modal") closeSearchModal();
  });
  let resizeTimer;
  window.addEventListener("resize", () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(fitCategoryTabs, 150);
  });

  document.getElementById("search-form").addEventListener("submit", (e) => {
    e.preventDefault();
    searchTerm = document.getElementById("search-modal-input").value.trim();
    closeSearchModal();
    renderSearchChip();
    renderProducts();
  });
});
