// Supabase 연결 설정 — 아래 두 값을 실제 Supabase 프로젝트 값으로 바꿔주세요.
// 확인 위치: Supabase 대시보드 > 프로젝트 선택 > Project Settings > API
//   - Project URL      → SUPABASE_URL
//   - anon public key  → SUPABASE_ANON_KEY
// 이 값들은 공개되어도 안전하도록 설계된 값입니다 (실제 데이터 보호는 DB의 RLS 정책이 담당합니다).
// 자세한 설정 방법은 README.md 의 "Supabase 설정하기" 부분을 참고하세요.

const SUPABASE_URL = "https://beumjahaiodeptqdytny.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJldW1qYWhhaW9kZXB0cWR5dG55Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODM0Mjc5NDMsImV4cCI6MjA5OTAwMzk0M30.0E-Ik7pggkrOaPFMqnyH8MWe_-ikonBT1W1d9o1CHTI";

const supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

function isSupabaseConfigured() {
  return !SUPABASE_URL.includes("YOUR_PROJECT_REF") && !SUPABASE_ANON_KEY.includes("YOUR_ANON_PUBLIC_KEY");
}

function mapProductRow(row) {
  return {
    id: row.id,
    name: row.name,
    category: row.category,
    price: row.price,
    originalPrice: row.original_price,
    stock: row.stock,
    condition: row.condition,
    description: row.description,
    image: row.image_url || ""
  };
}

async function fetchProducts() {
  if (!isSupabaseConfigured()) return { products: [], error: null };

  const { data, error } = await supabaseClient
    .from("products")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("상품 목록을 불러오지 못했습니다:", error);
    return { products: [], error };
  }
  return { products: data.map(mapProductRow), error: null };
}

async function fetchProductById(id) {
  if (!isSupabaseConfigured()) return null;

  const { data, error } = await supabaseClient
    .from("products")
    .select("*")
    .eq("id", id)
    .single();

  if (error) {
    console.error("상품 정보를 불러오지 못했습니다:", error);
    return null;
  }
  return mapProductRow(data);
}
