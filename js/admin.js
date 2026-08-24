let editingId = null;

function formatPrice(n) {
  return n.toLocaleString("ko-KR") + "원";
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
  const thumb = p.image
    ? `<img src="${p.image}" alt="${p.name}" class="admin-thumb">`
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

  const preview = document.getElementById("image-preview");
  if (product.image) {
    preview.src = product.image;
    preview.style.display = "block";
  } else {
    preview.style.display = "none";
  }

  document.getElementById("form-title").textContent = "상품 수정";
  document.getElementById("cancel-edit-btn").style.display = "inline-block";
  window.scrollTo({ top: 0, behavior: "smooth" });
}

function resetForm() {
  editingId = null;
  document.getElementById("product-form").reset();
  document.getElementById("image-preview").style.display = "none";
  document.getElementById("form-title").textContent = "새 상품 등록";
  document.getElementById("cancel-edit-btn").style.display = "none";
}

async function uploadImageIfNeeded() {
  const fileInput = document.getElementById("f-image");
  const file = fileInput.files[0];
  if (!file) return null;

  const fileExt = file.name.split(".").pop();
  const fileName = `${Date.now()}_${Math.random().toString(36).slice(2)}.${fileExt}`;

  const { error } = await supabaseClient.storage.from("product-images").upload(fileName, file);
  if (error) {
    alert("이미지 업로드 실패: " + error.message);
    return null;
  }

  const { data } = supabaseClient.storage.from("product-images").getPublicUrl(fileName);
  return data.publicUrl;
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
    description: document.getElementById("f-description").value.trim()
  };

  const imageUrl = await uploadImageIfNeeded();
  if (imageUrl) payload.image_url = imageUrl;

  let error;
  if (editingId) {
    ({ error } = await supabaseClient.from("products").update(payload).eq("id", editingId));
  } else {
    if (!imageUrl) payload.image_url = "";
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
  document.getElementById("logout-btn").addEventListener("click", async () => {
    await supabaseClient.auth.signOut();
    location.href = "admin-login.html";
  });
});
