let currentProduct = null;
let currentImageIndex = 0;

function renderProductDetail(p) {
  const container = document.getElementById("product-detail");
  const images = p.images || [];
  currentImageIndex = 0;

  container.innerHTML = `
    <div class="detail-gallery">
      <div class="detail-thumb" id="detail-thumb"></div>
      ${images.length > 1 ? `<div class="detail-thumb-strip" id="detail-thumb-strip"></div>` : ""}
    </div>
    <div class="detail-body">
      <span class="product-category">${p.category}</span>
      <h1 class="detail-name">${p.name}</h1>
      <div class="product-price-row">
        <span class="price-current">${formatPrice(p.price)}</span>
      </div>
      <p class="detail-description">${p.description || ""}</p>
      <button class="btn-primary btn-contact-detail" id="detail-contact-btn" ${p.stock ? "" : "disabled"}>
        ${p.stock ? "구매 문의하기" : "재입고 문의하기"}
      </button>
    </div>
  `;

  renderGalleryMain(p);
  if (images.length > 1) renderGalleryStrip(p);

  document.getElementById("detail-contact-btn").addEventListener("click", () => {
    openContactModal(p);
  });

  renderSpecTable(p);
}

function changeImage(p, delta) {
  const images = p.images || [];
  currentImageIndex = (currentImageIndex + delta + images.length) % images.length;
  renderGalleryMain(p);
  renderGalleryStrip(p);
}

function renderGalleryMain(p) {
  const images = p.images || [];
  const thumb = document.getElementById("detail-thumb");
  const current = images[currentImageIndex];

  thumb.innerHTML = `
    ${current
      ? `<img src="${current}" alt="${p.name}" class="detail-thumb-img">`
      : `<div class="detail-thumb-placeholder">${CATEGORY_ICONS[p.category] || "🔩"}</div>`}
    ${images.length > 1 ? `
      <button type="button" class="gallery-nav gallery-prev" aria-label="이전 사진">&lsaquo;</button>
      <button type="button" class="gallery-nav gallery-next" aria-label="다음 사진">&rsaquo;</button>
      <span class="gallery-counter">${currentImageIndex + 1} / ${images.length}</span>
    ` : ""}
    ${!p.stock ? `<span class="badge badge-soldout">품절</span>` : ""}
  `;

  if (images.length > 1) {
    thumb.querySelector(".gallery-prev").addEventListener("click", () => changeImage(p, -1));
    thumb.querySelector(".gallery-next").addEventListener("click", () => changeImage(p, 1));

    let touchStartX = null;
    thumb.addEventListener("touchstart", (e) => {
      touchStartX = e.touches[0].clientX;
    });
    thumb.addEventListener("touchend", (e) => {
      if (touchStartX === null) return;
      const dx = e.changedTouches[0].clientX - touchStartX;
      if (Math.abs(dx) > 40) changeImage(p, dx > 0 ? -1 : 1);
      touchStartX = null;
    });
  }
}

function renderGalleryStrip(p) {
  const images = p.images || [];
  const strip = document.getElementById("detail-thumb-strip");
  if (!strip) return;

  strip.innerHTML = images.map((url, idx) => `
    <button type="button" class="gallery-thumb-btn${idx === currentImageIndex ? " active" : ""}" data-idx="${idx}">
      <img src="${url}" alt="사진 ${idx + 1}">
    </button>
  `).join("");

  strip.querySelectorAll(".gallery-thumb-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      currentImageIndex = Number(btn.dataset.idx);
      renderGalleryMain(p);
      renderGalleryStrip(p);
    });
  });
}

function renderSpecTable(p) {
  const section = document.getElementById("product-specs");
  if (!p.specs || p.specs.length === 0) {
    section.innerHTML = "";
    return;
  }

  section.innerHTML = `
    <h2 class="spec-title">추가 정보</h2>
    <table class="spec-table">
      <tbody>
        ${p.specs.map(s => `<tr><th>${s.name}</th><td>${s.description}</td></tr>`).join("")}
      </tbody>
    </table>
  `;
}

document.addEventListener("DOMContentLoaded", async () => {
  const container = document.getElementById("product-detail");
  const params = new URLSearchParams(location.search);
  const id = params.get("id");

  if (!id) {
    container.innerHTML = `<p class="empty-state">잘못된 접근입니다. <a href="index.html">목록으로 돌아가기</a></p>`;
    return;
  }

  currentProduct = await fetchProductById(id);

  if (!currentProduct) {
    container.innerHTML = `<p class="empty-state">상품을 찾을 수 없습니다. <a href="index.html">목록으로 돌아가기</a></p>`;
    return;
  }

  renderProductDetail(currentProduct);
});
