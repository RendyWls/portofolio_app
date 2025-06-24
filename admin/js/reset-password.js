document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("resetForm");
  const msg = document.getElementById("msg");

  // Ambil token dari URL
  const token = window.location.pathname.split("/").pop();

  if (!token) {
    msg.textContent = "Token tidak ditemukan di URL.";
    msg.style.display = "block";
    form.style.display = "none";
    return;
  }

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const password = document.getElementById("password").value;
    const confirmPassword = document.getElementById("confirmPassword").value;

    if (password !== confirmPassword) {
      msg.textContent = "Konfirmasi password tidak cocok.";
      msg.style.display = "block";
      return;
    }

    const passwordRegex = /^(?=.*[a-zA-Z])(?=.*\d).{6,}$/;
    if (!passwordRegex.test(password)) {
      msg.textContent = "Password harus minimal 6 karakter dan kombinasi huruf + angka.";
      msg.style.display = "block";
      return;
    }

    try {
      const response = await fetch(`http://127.0.0.1:5000/api/auth/reset-password/${token}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });

      const result = await response.json();

      if (response.ok) {
        alert("Password berhasil direset. Silakan login.");
        window.location.href = "login.html";
      } else {
        msg.textContent = result.message || "Gagal mereset password.";
        msg.style.display = "block";
      }
    } catch (error) {
      msg.textContent = "Gagal terhubung ke server.";
      msg.style.display = "block";
      console.error(error);
    }
  });
});
