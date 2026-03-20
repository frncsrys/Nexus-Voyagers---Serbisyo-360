export async function logout() {
  try {
    await fetch("/api/auth/logout", { method: "POST" });
  } catch { /* ignore */ }
  window.location.href = "/login";
}
