let currentProduct = null;

function renderProductDetail(p) {
  const container = document.getElementById("product-detail");
  const rate = discountRate(p.price, p.originalPrice);
  const thumb = p.image
    ? `<img src="${p.image}" alt="${p.name}" class="detail-thumb-img">`
    : `<div class="detail-thumb-placeholder">${CATEGORY_ICONS[p.category] || "🔩"}</div>`;

  container.innerHTML = `
    <div class="detail-thumb">
      ${thumb}
      ${rate > 0 ? `<span class="badge badge-discount">${rate}% ↓</span>` : ""}
      ${!p.stock ? `<span class="badge badge-soldout">품절</span>` : ""}
    </div>
    <div class="detail-body">
      <span class="product-category">${p.category}</span>
      <h1 class="detail-name">${p.name}</h1>
      <p class="product-condition">${p.condition || ""}</p>
      <div class="product-price-row">
        ${rate > 0 ? `<span class="price-original">${formatPrice(p.originalPrice)}</span>` : ""}
        <span class="price-current">${formatPrice(p.price)}</span>
      </div>
      <p class="detail-description">${p.description || ""}</p>
      <button class="btn-primary btn-contact-detail" id="detail-contact-btn" ${p.stock ? "" : "disabled"}>
        ${p.stock ? "카카오톡으로 문의하기" : "재입고 문의하기"}
      </button>
    </div>
  `;

  document.getElementById("detail-contact-btn").addEventListener("click", () => {
    openContactModal(p);
  });
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
