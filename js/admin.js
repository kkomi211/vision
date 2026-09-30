let editingId = null;
let existingImages = [];
let existingDescImages = [];

function formatPrice(n) {
  return n.toLocaleString("ko-KR") + "원";
}

function escapeAttr(str) {
  return String(str).replace(/&/g, "&amp;").replace(/"/g, "&quot;");
}

function addSpecRow(name = "", description = "") {
  const container = document.getElementById("spec-rows");
  const row = document.createElement("div");
  row.className = "spec-row";
  row.innerHTML = `
    <input type="text" class="spec-name" placeholder="이름 (예: 무게)" value="${escapeAttr(name)}">
    <input type="text" class="spec-desc" placeholder="설명 (예: 1.5kg)" value="${escapeAttr(description)}">
    <button type="button" class="spec-remove-btn" aria-label="항목 삭제">&times;</button>
  `;
  row.querySelector(".spec-remove-btn").addEventListener("click", () => row.remove());
  container.appendChild(row);
}

function getSpecsFromForm() {
  return Array.from(document.querySelectorAll("#spec-rows .spec-row"))
    .map(row => ({
      name: row.querySelector(".spec-name").value.trim(),
      description: row.querySelector(".spec-desc").value.trim()
    }))
    .filter(spec => spec.name || spec.description);
}

async function requireAuth() {
  if (!isSupabaseConfigured()) {
    document.querySelector(".admin-main").innerHTML =
      `<p class="empty-state">Supabase 연결이 설정되지 않았습니다.<br>js/supabase-client.js 를 먼저 설정해 주세요.</p>`;
    return null;
  }
  const { data: { session } } = await supabaseClient.auth.getSession();
  if (!session) {
    location.href = "admin-login.html";
    return null;
  }
  return session;
}

function adminRow(p) {
  const thumb = p.images && p.images[0]
    ? `<img src="${p.images[0]}" alt="${p.name}" class="admin-thumb">`
    : `<div class="admin-thumb admin-thumb-placeholder">📦</div>`;

  return `
    <tr data-id="${p.id}">
      <td>${thumb}</td>
      <td>${p.name}</td>
      <td>${p.category}</td>
      <td>${formatPrice(p.price)}</td>
      <td>${p.stock ? "판매중" : "품절"}</td>
      <td class="admin-row-actions">
        <button class="btn-secondary btn-edit">수정</button>
        <button class="btn-secondary btn-delete">삭제</button>
      </td>
    </tr>
  `;
}

async function loadAdminProducts() {
  const { products, error } = await fetchProducts();
  const list = document.getElementById("admin-list");

  if (error) {
    document.getElementById("admin-count").textContent = "0";
    list.innerHTML = `<tr><td colspan="6" class="empty-state">상품을 불러오지 못했습니다.<br>오류: ${error.message}</td></tr>`;
    return;
  }

  document.getElementById("admin-count").textContent = products.length;

  if (products.length === 0) {
    list.innerHTML = `<tr><td colspan="6" class="empty-state">등록된 상품이 없습니다.</td></tr>`;
    return;
  }

  list.innerHTML = products.map(adminRow).join("");

  list.querySelectorAll("tr").forEach(row => {
    const id = Number(row.dataset.id);
    const product = products.find(p => p.id === id);

    row.querySelector(".btn-edit").addEventListener("click", () => fillFormForEdit(product));
    row.querySelector(".btn-delete").addEventListener("click", () => handleDelete(id));
  });
}

function renderImagePreviewList(listId, fileInputId, images, onRerender) {
  const list = document.getElementById(listId);
  const fileInput = document.getElementById(fileInputId);

  const existingHtml = images.map((url, idx) => `
    <div class="image-preview-item">
      <img src="${url}">
      <button type="button" class="image-remove-btn" data-idx="${idx}" aria-label="이미지 삭제">&times;</button>
    </div>
  `).join("");

  const newHtml = Array.from(fileInput.files).map(file => `
    <div class="image-preview-item image-preview-new">
      <img src="${URL.createObjectURL(file)}">
    </div>
  `).join("");

  list.innerHTML = existingHtml + newHtml;

  list.querySelectorAll(".image-remove-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      images.splice(Number(btn.dataset.idx), 1);
      onRerender();
    });
  });
}

function renderImagePreviews() {
  renderImagePreviewList("image-preview-list", "f-image", existingImages, renderImagePreviews);
}

function renderDescImagePreviews() {
  renderImagePreviewList("desc-image-preview-list", "f-desc-image", existingDescImages, renderDescImagePreviews);
}

async function handleDelete(id) {
  if (!confirm("정말 삭제하시겠습니까?")) return;
  const { error } = await supabaseClient.from("products").delete().eq("id", id);
  if (error) {
    alert("삭제 실패: " + error.message);
    return;
  }
  loadAdminProducts();
}

function fillFormForEdit(product) {
  editingId = product.id;
  document.getElementById("f-name").value = product.name;
  document.getElementById("f-category").value = product.category;
  document.getElementById("f-price").value = product.price;
  document.getElementById("f-original-price").value = product.originalPrice || "";
  document.getElementById("f-stock").checked = product.stock;
  document.getElementById("f-condition").value = product.condition || "";
  document.getElementById("f-description").value = product.description || "";

  document.getElementById("spec-rows").innerHTML = "";
  (product.specs || []).forEach(spec => addSpecRow(spec.name, spec.description));

  existingImages = (product.images || []).slice();
  document.getElementById("f-image").value = "";
  renderImagePreviews();

  existingDescImages = (product.descriptionImages || []).slice();
  document.getElementById("f-desc-image").value = "";
  renderDescImagePreviews();

  document.getElementById("form-title").textContent = "상품 수정";
  document.getElementById("cancel-edit-btn").style.display = "inline-block";
  window.scrollTo({ top: 0, behavior: "smooth" });
}

function resetForm() {
  editingId = null;
  existingImages = [];
  existingDescImages = [];
  document.getElementById("product-form").reset();
  document.getElementById("spec-rows").innerHTML = "";
  document.getElementById("image-preview-list").innerHTML = "";
  document.getElementById("desc-image-preview-list").innerHTML = "";
  document.getElementById("form-title").textContent = "새 상품 등록";
  document.getElementById("cancel-edit-btn").style.display = "none";
}

async function uploadNewImages(fileInputId) {
  const fileInput = document.getElementById(fileInputId);
  const urls = [];

  for (const file of Array.from(fileInput.files)) {
    const fileExt = file.name.split(".").pop();
    const fileName = `${Date.now()}_${Math.random().toString(36).slice(2)}.${fileExt}`;

    const { error } = await supabaseClient.storage.from("product-images").upload(fileName, file);
    if (error) {
      alert(`"${file.name}" 업로드 실패: ${error.message}`);
      continue;
    }

    const { data } = supabaseClient.storage.from("product-images").getPublicUrl(fileName);
    urls.push(data.publicUrl);
  }

  return urls;
}

async function handleSubmit(e) {
  e.preventDefault();
  const submitBtn = document.getElementById("submit-btn");
  submitBtn.disabled = true;
  submitBtn.textContent = "저장 중...";

  const originalPriceVal = document.getElementById("f-original-price").value;

  const payload = {
    name: document.getElementById("f-name").value.trim(),
    category: document.getElementById("f-category").value,
    price: Number(document.getElementById("f-price").value),
    original_price: originalPriceVal ? Number(originalPriceVal) : null,
    stock: document.getElementById("f-stock").checked,
    condition: document.getElementById("f-condition").value.trim(),
    description: document.getElementById("f-description").value.trim(),
    specs: getSpecsFromForm()
  };

  const newUrls = await uploadNewImages("f-image");
  payload.images = [...existingImages, ...newUrls];

  const newDescUrls = await uploadNewImages("f-desc-image");
  payload.description_images = [...existingDescImages, ...newDescUrls];

  let error;
  if (editingId) {
    ({ error } = await supabaseClient.from("products").update(payload).eq("id", editingId));
  } else {
    ({ error } = await supabaseClient.from("products").insert(payload));
  }

  submitBtn.disabled = false;
  submitBtn.textContent = "저장하기";

  if (error) {
    alert("저장 실패: " + error.message);
    return;
  }

  resetForm();
  loadAdminProducts();
}

document.addEventListener("DOMContentLoaded", async () => {
  const session = await requireAuth();
  if (!session) return;

  loadAdminProducts();

  document.getElementById("product-form").addEventListener("submit", handleSubmit);
  document.getElementById("cancel-edit-btn").addEventListener("click", resetForm);
  document.getElementById("add-spec-btn").addEventListener("click", () => addSpecRow());
  document.getElementById("f-image").addEventListener("change", renderImagePreviews);
  document.getElementById("f-desc-image").addEventListener("change", renderDescImagePreviews);
  document.getElementById("logout-btn").addEventListener("click", async () => {
    await supabaseClient.auth.signOut();
    location.href = "admin-login.html";
  });
});
