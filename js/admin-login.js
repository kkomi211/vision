async function handleLogin(e) {
  e.preventDefault();
  const errorEl = document.getElementById("login-error");
  errorEl.textContent = "";

  if (!isSupabaseConfigured()) {
    errorEl.textContent = "Supabase 연결이 설정되지 않았습니다. js/supabase-client.js 를 먼저 설정해 주세요.";
    return;
  }

  const email = document.getElementById("login-email").value.trim();
  const password = document.getElementById("login-password").value;

  const { error } = await supabaseClient.auth.signInWithPassword({ email, password });

  if (error) {
    errorEl.textContent = "로그인 실패: 이메일 또는 비밀번호를 확인해 주세요.";
    return;
  }

  location.href = "admin.html";
}

document.addEventListener("DOMContentLoaded", async () => {
  if (isSupabaseConfigured()) {
    const { data: { session } } = await supabaseClient.auth.getSession();
    if (session) {
      location.href = "admin.html";
      return;
    }
  }
  document.getElementById("login-form").addEventListener("submit", handleLogin);
});
