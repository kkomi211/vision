let currentProduct = null;

function renderProductDetail(p) {
  const container = document.getElementById("product-detail");
  const thumb = p.image
    ? `<img src="${p.image}" alt="${p.name}" class="detail-thumb-img">`
    : `<div class="detail-thumb-placeholder">${CATEGORY_ICONS[p.category] || "🔩"}</div>`;

  container.innerHTML = `
    <div class="detail-thumb">
      ${thumb}
      ${!p.stock ? `<span class="badge badge-soldout">품절</span>` : ""}
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

  document.getElementById("detail-contact-btn").addEventListener("click", () => {
    openContactModal(p);
  });

  renderSpecTable(p);
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
