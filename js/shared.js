// 여러 페이지(index.html, product.html)에서 공통으로 쓰는 함수들

// 1차 카테고리 목록 (2차/3차 카테고리는 추후 추가 예정)
const CATEGORY_ICONS = {
  "작업공구": "🛠️",
  "철물·원예·사무용품": "🧰",
  "절삭·금형·공작": "🔩",
  "측정·측량·계측": "📏",
  "전동·다몬·엔진·하역": "🔌",
  "에어·콤프레샤·유압": "💨",
  "용접기자재": "🔥",
  "안전용품": "🦺",
  "산업용품": "📦"
};

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
